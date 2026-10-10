# MobileLab Project Audit

Audit date: 2026-10-10

Scope: the repository application, Express routes, HTML/CSS/inline JavaScript, dependency/configuration files, tests, and project tooling. Assumed load is a small marketing site serving ordinary browser traffic, not a high-volume API.

## What the application does

- Serves a single-page marketing site at `/` with service sections, metrics, method steps, testimonials, navigation, contact CTA, and project ZIP download links.
- Serves a dedicated contact page at `/contact` with a client-side bottleneck form.
- Serves static files from the repository root and falls back to `index.html` for unknown paths.
- Generates and downloads `mobilelab-github.zip` through `/download`, `/download-zip`, and `/api/download`.
- Provides mobile navigation, animated counters, a method-step switcher, a horizontal carousel, hover/cursor effects, and client-side success messages.
- Uses Express 4 at runtime. The frontend is inline HTML/CSS/JavaScript with Tailwind loaded from `cdn.tailwindcss.com`, Google Fonts, Material Symbols, and remote image URLs.

## Architecture

`server.js` creates the Express app, exposes the explicit `/contact` route, registers the download aliases, serves the repository root with `express.static`, and falls back to `index.html`. `index.html` and `contact.html` contain their own markup, styles, and scripts; there is no frontend build step. `test/server.test.js` uses Node's built-in test runner and starts the exported app on an ephemeral localhost port.

Graphify confirmed the main dependency path: `package.json` -> Express -> `server.js` -> static pages/download generation, with tests connected to the exported app and native Node test modules. Graphify output is generated local tooling data and is ignored by Git.

## Security and reliability findings

### Must fix

1. **The download endpoint writes a shared archive during requests** (`server.js:15-35`)
   - **What this is:** Every download request runs Python and rewrites the same `mobilelab-github.zip` path.
   - **Problem:** Concurrent requests can race with each other or with `res.download`; a partial or stale archive can be served. Python failure is logged but the request only discovers failure through file existence.
   - **Fix:** Generate outside the request path, or write to a unique temporary file and atomically rename it before serving. Add a success-path test and a bounded failure response.
   - **If skipped:** Download reliability will degrade under concurrent traffic or missing/slow Python.

2. **The form reports success without sending data** (`index.html:440-484`, `contact.html:138-224`)
   - **What this is:** Both forms prevent submission, reset fields, and display a success message in the browser.
   - **Problem:** No lead reaches MobileLab, while users are told the request was received. This is a correctness and trust issue, not merely a missing backend.
   - **Fix:** Connect the form to an approved backend/service with server-side validation, or change the copy to clearly describe the local/demo behavior.
   - **If skipped:** Prospects and their bottleneck details are silently lost.

3. **The whole repository root is exposed as static content** (`server.js:43-48`)
   - **What this is:** `express.static(__dirname)` serves every non-hidden file in the project directory.
   - **Problem:** Source, tests, package metadata, documentation, and generated non-hidden artifacts can be downloaded by anyone who knows the path.
   - **Fix:** Serve an explicit public directory, or allowlist the intended HTML/assets and download routes.
   - **If skipped:** Internal implementation and operational files remain unnecessarily public.

### Should fix

4. **No response security headers or traffic controls** (`server.js:10-57`)
   - **What this is:** The server sets no CSP, frame, MIME-sniffing, referrer, or transport policy and has no rate limiting.
   - **Problem:** The site relies on multiple third-party scripts/assets and exposes a CPU/file-writing route without abuse controls.
   - **Fix:** Add a restrictive CSP compatible with the chosen assets, baseline security headers, and rate/size controls around download and future form endpoints.
   - **If skipped:** Third-party compromise and request abuse have a larger blast radius.

5. **Runtime dependencies are pulled from third-party CDNs** (`index.html:9-16`, `contact.html:12-20`)
   - **What this is:** Tailwind, fonts, icons, and imagery load from external origins at page time.
   - **Problem:** Availability, privacy, render performance, and supply-chain behavior depend on those origins; the Tailwind CDN is a runtime script rather than a built asset.
   - **Fix:** Pin and self-host production-critical assets, or document and enforce the exact CSP/SRI policy for approved origins.
   - **If skipped:** The page can change or fail when a CDN is unavailable or altered.

## UI/UX and accessibility findings

1. **Reduced-motion support is missing** (`index.html:155`, `index.html:205`, `index.html:516-656`)
   - The page has rotating borders, long-running collage animation, cursor effects, counter animation, and transitions without a `prefers-reduced-motion` alternative.
   - Recommendation: disable or simplify continuous motion and counter transitions for reduced-motion users.

2. **Focus indicators are explicitly removed on key controls** (`index.html:180`, `contact.html:93`, form controls around `index.html:448-466`)
   - `focus:outline-none` appears without a guaranteed replacement ring on the menu buttons and fields.
   - Recommendation: use a consistent visible `:focus-visible` ring and test the full keyboard path.

3. **Form feedback is visually optimistic and not announced** (`index.html:477`, `contact.html:216`)
   - The success blocks do not expose a clear `role="status"`/live-region pattern, and there is no error summary or server error state.
   - Recommendation: add status semantics, preserve values on failure, and move focus to a linked error/success summary.

4. **The landing page is a very large inline document with eager remote visuals** (`index.html`, 123 KB)
   - The page embeds large markup, styles, scripts, a moving image collage, and many remote URLs; images do not use explicit lazy-loading or responsive source selection.
   - Recommendation: reduce initial markup, lazy-load below-fold visuals, use responsive image sizes, and measure mobile Largest Contentful Paint.

5. **Placeholder links and incomplete navigation semantics remain** (`index.html:168`, `index.html:511`, `contact.html:270`)
   - Logo, privacy, and social links use `#`; mobile menu buttons do not expose expanded/controlled state.
   - Recommendation: replace placeholders with real destinations or remove them, and add `aria-expanded`/`aria-controls` synchronized with menu state.

These recommendations follow the local UI/UX Pro Max checks for reduced motion, visible focus, form status/error feedback, breakpoint testing, contrast, lazy loading, and limiting continuous decorative animation.

## Technical debt

- `npm run lint` is a placeholder command, not a real linter.
- No typecheck or browser-level accessibility/performance test exists.
- Page markup and navigation are duplicated between `index.html` and `contact.html`.
- Inline event handlers and scripts make CSP hardening and targeted testing harder.
- The build is a placeholder because the site is served directly from source.
- `.agents/`, `.codex/`, and the lock files are intentional project tooling/configuration; `graphify-out/`, Python caches, virtual environments, and archive files are local/generated artifacts and are ignored.

## Prioritized roadmap

1. Make the form truthful and functional with a reviewed server-side submission path, validation, abuse controls, and privacy handling.
2. Isolate public assets and harden the server with explicit routes, security headers, and safe archive generation.
3. Add reduced-motion, focus-visible, menu semantics, and accessible form status/error behavior.
4. Optimize the landing page asset strategy and verify 320/375/414/768/1024/1440px layouts with performance measurements.
5. Replace placeholder lint/build validation with a real HTML/CSS/JavaScript validation gate and browser smoke tests.

## Not checked

No production deployment configuration, DNS, analytics, backend integrations, browser automation, visual regression run, or real-user load test was available in this repository. No application refactor was performed as part of this audit.
