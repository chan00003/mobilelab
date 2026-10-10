# MobileLab Vercel Deployment Plan

Status: implemented on `feature/vercel-node-runtime`; protected-preview verification remains pending. No Vercel settings, merge, push, or manual deployment was performed.

## Implemented architecture

MobileLab now uses Vercel's Node.js Express deployment shape and a Node-native streaming ZIP implementation.

The existing Express routes, security middleware, contact behavior, and browser pages are preserved. Deployment-facing pages and assets are copied into `public/`, while source, tests, package metadata, and agent configuration remain outside that directory.

`public/` is the deployment source of truth for served pages and assets. The root page copies are retained temporarily for archive compatibility and rollback safety; until the project adopts a real build/synchronization step, page edits must be mirrored in both locations and verified with a parity check. `vercel.json` explicitly includes the safe archive inputs in the Express Function bundle using one brace-expanded glob because Vercel's static `public/` deployment and Node Function filesystem are separate packaging surfaces.

The ZIP routes use `archiver` to stream fixed allowlisted entries directly to the response. No Python runtime is required by the application. A separately hosted backend remains an alternative only if Python fidelity or long-lived backend behavior becomes a product requirement.

## Evidence from the current repository

- `server.js` is a root-level Express 4 application and already exports `app` as a named export. It also calls `app.listen()` when run directly.
- `package.json` is an ES-module package with `dev` and `start` scripts running `node server.js`; `vercel.json` includes the ZIP's safe non-secret inputs in the `server.js` Function bundle.
- Pages are stored at the repository root. Assets are under `assets/`. The server uses `res.sendFile()` for pages and `express.static()` for `/assets` and optional `/public`.
- `/download`, `/download-zip`, and `/api/download` create an isolated `archiver` stream from fixed source paths and abort it on client disconnect or failure.
- `/api/contact` validates input and intentionally returns `503` because no delivery provider is configured.
- PR #1 is open and currently reports `CLEAN` / `MERGEABLE`; CI and the Vercel status check are passing.
- The Vercel preview deployment completed, but anonymous requests receive Vercel's `Login – Vercel` protection page. The MobileLab application has not yet been verified through that deployment.

## How Vercel currently detects the project

Vercel's current Express guidance recognizes a root `server.js` entrypoint and permits either a default-exported Express app or a port listener. MobileLab matches the filename and has a direct listener, so Vercel can detect it as an Express application without a custom `vercel.json`.

That detection is not proof that every route works. Vercel documents that an Express application becomes a single Vercel Function, and that `express.static()` does not serve static assets there; static assets should be placed under `public/`. The current deployment protection page also prevents anonymous verification of the actual application response.

Official references:

- [Express on Vercel](https://vercel.com/docs/frameworks/backend/express)
- [Configuring Vercel Function runtimes](https://vercel.com/docs/functions/configuring-functions/runtime)
- [Vercel Function runtimes](https://vercel.com/docs/functions/runtimes)

## Recommended target architecture

### Phase 1: Vercel-compatible Express packaging — implemented

1. Keep `server.js` as the single Node.js Express entrypoint.
2. Preserve the current route paths and response behavior.
3. Make the app export unambiguous for Vercel with a reviewed default export, while retaining direct `npm start` behavior locally.
4. The five HTML pages, `mobilelab-ogimage.png`, and `/assets` content are copied into `public/`; existing route URLs are unchanged.
5. Retain security headers, bounded body parsing, rate limits, allowlisted routes, and the intentional `503` contact response.
6. `vercel.json` includes exactly `public/**`, `package.json`, `.env.example`, `.gitignore`, and `README.md` for the `server.js` Function through a single brace-expanded `includeFiles` glob. It excludes secrets, tests, screenshots, Graphify output, and unrelated repository files.

### Phase 2: Node-native ZIP generation — implemented

The Python subprocess was replaced with the maintained MIT-licensed `archiver` package and the archive is streamed to the response. The implementation:

- use a fixed allowlist of archive members;
- read only deployment-bundled files;
- avoid user-controlled archive paths;
- streams without temporary archive files;
- clean up on success, client disconnect, and error;
- preserve all three download aliases and `mobilelab-github.zip` response naming;
- return a clear 500 response when an explicitly allowlisted bundle input is unavailable;
- preserve the existing download rate limit;
- test concurrent requests and archive integrity.

Direct streaming removes shared mutable files and temporary cleanup risk. If a future change requires temporary storage, it must stay within Vercel's writable `/tmp` boundary.

Vercel documents a 4.5 MB request/response payload limit for Functions. The current local archive is approximately 1.2 MB, but the test must assert the generated archive remains below the deployment limit or fail with an explicit operational warning.

## Python ZIP option assessment

### Supported Python Function

Vercel has an official Python runtime for HTTP handlers. A future `/api/download.py` could use Python's standard-library `zipfile`, but this is not the smallest change:

- it creates a second runtime and handler contract;
- security headers and rate limiting must be duplicated or shared explicitly;
- the existing Express route must be rewritten or proxied;
- the current JS Python discovery logic becomes irrelevant to that route;
- cross-runtime tests and deployment packaging become more complex.

No Python package is required by the current ZIP script, but the current design invokes an executable from inside Node. Vercel's supported Python runtime does not guarantee that an arbitrary `python` executable is available to a Node Function, so the existing `execFileSync(python, ...)` approach is not a reliable Vercel contract.

### Node-native ZIP

This is the recommended option. It keeps all public routes and policy in the existing Express application, removes interpreter discovery, avoids a second runtime, and is compatible with Vercel's Node.js Function model. The archive library and its transitive dependencies must be reviewed for size and license before installation.

### Separate backend hosting

Keep the current Python-capable Express server on a conventional Node host and deploy only the static site to Vercel. This preserves the current ZIP behavior, but adds an API origin, CORS and cookie decisions, operational monitoring, and a second deployment. Use this only if Python fidelity or long-running backend behavior becomes a product requirement.

## Deployment Protection and preview access

Do not disable protection globally or place a bypass secret in a URL, repository, screenshot, issue, or test log.

The safest review options are:

1. A project administrator creates a Vercel Shareable Link for this specific preview and revokes it after review.
2. The reviewer is granted appropriate Vercel project access and signs in through Vercel Authentication.
3. For automated testing only, a project administrator creates a dedicated Protection Bypass for Automation secret, stores it as a CI secret, and supplies it through the `x-vercel-protection-bypass` header. It must never be committed or printed.

Vercel documents Shareable Links and the automation header as scoped alternatives to disabling Deployment Protection:

- [Deployment Protection access methods](https://vercel.com/docs/deployment-protection/methods-to-bypass-deployment-protection)
- [Protection Bypass for Automation](https://vercel.com/docs/deployment-protection/methods-to-bypass-deployment-protection/protection-bypass-automation)
- [Shareable Links](https://vercel.com/docs/deployment-protection/methods-to-bypass-deployment-protection/sharable-links)

## Required verification checklist

Before merging a deployment implementation:

- `vercel dev` serves `/`, `/about`, `/services`, `/how-we-work`, and `/contact`.
- The preview URL returns MobileLab HTML, not the Vercel protection page.
- All five routes retain security headers and no repository files are exposed.
- `/assets/*` and the Open Graph image load successfully.
- All three download aliases return `application/zip` with a valid archive.
- Concurrent downloads are isolated and cleaned up.
- Invalid contact input returns `400`.
- Valid contact input returns the intentional `503` until a provider is configured; the browser never shows success.
- Mobile navigation, focus, reduced motion, method steps, and responsive layouts pass the existing Playwright suite.
- The generated archive stays below the Vercel response limit.
- `npm ci --ignore-scripts`, `npm run lint`, `npm test`, `npm run test:e2e`, and `npm run build` pass.
- A protected preview is tested with a Shareable Link or a secret injected only through CI headers.

## Expected affected files for implementation

The future change should be limited to the smallest set needed:

- `server.js` — deployment-safe static paths and Node ZIP generation;
- `public/` — deployed HTML and browser assets, if required by Vercel;
- `package.json` and `package-lock.json` — one reviewed runtime ZIP dependency, if selected;
- `vercel.json` — only if verified routing or function configuration requires it;
- `test/server.test.js` and `test/e2e.test.js` — route, ZIP, concurrency, and preview checks;
- `README.md` and `AGENTS.md` — verified deployment and preview-access instructions.

Do not modify the existing visual design or business content as part of deployment work.

## Rollback

Keep the current Express/Python implementation intact until the Node/Vercel implementation passes local and protected-preview verification. If deployment fails, revert the deployment-only commit or select the previous successful Vercel deployment. Do not change the existing download behavior in place without a passing archive-integrity and concurrency test.

## Exact next verification task

After approval, verify this branch through `vercel dev` and a protected preview using a scoped Shareable Link or CI-only bypass header. Confirm the five page routes, security headers, static assets, all three ZIP aliases, archive integrity, concurrency, disconnect cleanup, contact `503` behavior, and Playwright interactions. Do not merge until those checks reach the actual MobileLab application rather than the Vercel login page.
