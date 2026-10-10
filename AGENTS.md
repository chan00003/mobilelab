# MobileLab Agent Guide

## Project overview

MobileLab is a small static marketing site for AI systems and automation services. It is served by a Node.js ES-module application using Express. The browser-facing application is primarily `index.html` and `contact.html`, with page styling and interaction code kept in those documents. `server.js` serves the site, exposes `/contact`, provides a fallback to `index.html`, and generates the optional downloadable archive at `/download`, `/download-zip`, and `/api/download`.

## Architecture and development requirements

- Runtime: Node.js 24-compatible JavaScript, ES modules (`"type": "module"`).
- Package manager: npm. Keep `package-lock.json` committed and use `npm ci` for clean installs.
- Runtime dependency: Express 4.x. Do not add frontend frameworks or build tools unless the architecture is intentionally migrated.
- Local development: `npm run dev`, then open `http://localhost:3000`.
- Production-style start: `npm start`; `PORT` may be supplied through the environment.
- Build: `npm run build` is currently a validation placeholder because the site is served directly from source files.

## Coding standards and conventions

- Preserve the existing simple static-site architecture and existing visual behavior.
- Use clear, modern JavaScript and existing browser/platform APIs before adding dependencies.
- Keep server routes explicit, small, and fail safely. Validate all user-controlled input at trust boundaries.
- Use semantic HTML, accessible labels, keyboard support, visible focus states, and responsive layouts.
- Keep changes narrowly scoped. Reuse existing styles, scripts, and page patterns before introducing abstractions.
- Use comments only for non-obvious reasons or documented shortcuts; do not add boilerplate comments.

## Frontend and backend guidelines

- Frontend changes must work across mobile, tablet, desktop, and ultra-wide layouts.
- Preserve or improve reduced-motion behavior, contrast, focus visibility, and touch-target sizing.
- Do not expose secrets in HTML, client-side JavaScript, metadata, or committed environment files.
- Server code must not trust request paths, archive member names, or environment values without validation. Keep public routes allowlisted; do not reintroduce repository-root static serving.
- Keep generated artifacts such as `mobilelab-github.zip` out of version control unless explicitly requested.

## UI/UX design standards

- Use the project-scoped UI/UX Pro Max skill for new UI work and follow its generated design guidance.
- Maintain a coherent visual system: deliberate typography, spacing, color tokens, hierarchy, and responsive states.
- Prefer purposeful motion over decorative animation; honor `prefers-reduced-motion`.
- Design empty, loading, error, hover, focus, and keyboard states where applicable.
- Avoid inventing new patterns when an existing component or interaction already solves the need.

## Security and environment variables

- Copy `.env.example` to a local environment file; never commit secrets or real credentials.
- Only `PORT` is currently documented. Add new variables to `.env.example` with safe placeholder values and document whether they are server-only.
- Do not log credentials, tokens, personal data, or full request headers.
- Review any third-party installer, hook, or script before execution. Do not trust agent lifecycle hooks automatically.
- The optional download route invokes Python; treat it as an operational dependency and verify it before relying on that route.

## Testing and validation

Run the checks available in `package.json`:

```bash
npm ci
npm run lint
npm test
npm run build
npm start
```

The automated tests use Node's built-in test runner and cover `/`, `/contact`, the fallback route, sensitive static paths, security headers, download failure and concurrent cleanup behavior, contact validation, and request-size handling. There is currently no typecheck script. Contact delivery intentionally returns `503` until an approved provider is configured. For manual server changes, smoke-test the same routes, then stop the local server.

## Dependency management

- Use npm and the existing lockfile. Prefer `npm ci` in CI and `npm install` only when intentionally changing dependencies.
- Keep agent skills and developer tools out of application dependencies unless the product runtime actually requires them.
- Review transitive changes and run `npm ls --depth=0` after dependency work.
- The repository currently has project-scoped Codex skills from Caveman, Ponytail, and UI/UX Pro Max under `.agents/skills/`; update them through their official installers rather than hand-editing vendor files.
- Graphify is installed separately from the application runtime as `graphifyy`/`graphify` 0.9.84 through `uv` 0.13.0, with Python 3.12.10 available on Windows. The project Codex skill is under `.codex/skills/graphify/`; refresh it with the official `graphify install --project --platform codex` command. Do not add Graphify to `package.json`.

## Git and commit conventions

- Do not reset, force-push, deploy, or delete user work without explicit approval.
- Inspect `git status` before editing and preserve unrelated changes.
- Use Conventional Commits (`feat:`, `fix:`, `docs:`, `chore:`, `test:`) with concise, imperative messages.
- Keep commits focused and include validation results in the handoff.

## Definition of done

A change is done when the requested behavior is implemented with the smallest complete diff, existing behavior is preserved, relevant checks pass, security and accessibility concerns are considered, documentation/configuration is updated when needed, and outstanding limitations are explicitly reported.

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

When the user types `/graphify`, use the installed graphify skill or instructions before doing anything else.

Rules:
- For codebase questions, first run `graphify query "<question>"` when graphify-out/graph.json exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- Dirty graphify-out/ files are expected after hooks or incremental updates; dirty graph files are not a reason to skip graphify. Only skip graphify if the task is about stale or incorrect graph output, or the user explicitly says not to use it.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).
