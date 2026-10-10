# MobileLab Project Audit

Audit date: 2026-10-10

Scope: the repository application, Express routes, HTML/CSS/inline JavaScript, dependency/configuration files, tests, and project tooling. Assumed load is a small marketing site serving ordinary browser traffic, not a high-volume API.

## What the application does

- Serves a single-page marketing site at `/` with service sections, metrics, method steps, testimonials, navigation, contact CTA, and project ZIP download links.
- Serves a dedicated contact page at `/contact` with a client-side bottleneck form.
- Serves the two intended HTML pages through explicit routes and falls back to `index.html` only for extensionless paths; repository files are not exposed as static content.
- Generates an isolated temporary ZIP per request and downloads it through `/download`, `/download-zip`, and `/api/download`, cleaning the temporary directory after completion or failure.
- Provides mobile navigation, animated counters, a method-step switcher, a horizontal carousel, hover/cursor effects, and client-side success messages.
- Uses Express 4 at runtime. The frontend is inline HTML/CSS/JavaScript with Tailwind loaded from `cdn.tailwindcss.com`, Google Fonts, Material Symbols, and remote image URLs.

## Architecture

`server.js` creates the Express app, applies baseline security headers and bounded body parsing, exposes explicit page and contact API routes, registers the download aliases, and falls back to `index.html` only for extensionless paths. `index.html` and `contact.html` contain their own markup, styles, and scripts; there is no frontend build step. `test/server.test.js` uses Node's built-in test runner and starts the exported app on an ephemeral localhost port.

Graphify confirmed the main dependency path: `package.json` -> Express -> `server.js` -> static pages/download generation, with tests connected to the exported app and native Node test modules. Graphify output is generated local tooling data and is ignored by Git.

## Security and reliability findings

### Resolved in current hardening change

1. **The download endpoint wrote a shared archive during requests**
   - **What this is:** Every download request runs Python and rewrites the same `mobilelab-github.zip` path.
   - **Problem:** Concurrent requests can race with each other or with `res.download`; a partial or stale archive can be served. Python failure is logged but the request only discovers failure through file existence.
   - **Resolution:** Each request now receives a unique temporary directory, fixed archive member names, bounded failure response, and cleanup callback. Tests cover concurrent requests and cleanup.

2. **The form reported success without sending data** (`index.html`, `contact.html`)
   - **What this was:** Both forms previously prevented submission, reset fields, and displayed a success message in the browser.
   - **Problem:** No lead reached MobileLab, while users were told the request was received. This was a correctness and trust issue, not merely a missing backend.
   - **Resolution:** Both forms now call `/api/contact`; the server validates input and returns `503 Contact delivery is not configured` until an approved provider is configured. The browser only resets or reports success after a successful response.

3. **The whole repository root was exposed as static content**
   - **What this is:** `express.static(__dirname)` serves every non-hidden file in the project directory.
   - **Problem:** Source, tests, package metadata, documentation, and generated non-hidden artifacts can be downloaded by anyone who knows the path.
   - **Resolution:** Static serving was removed in favor of explicit page routes and an extension check on the fallback. Sensitive path tests cover source, package, and Git metadata paths.

### Remaining security and reliability concerns

4. **Residual operational risk around in-memory rate limiting** (`server.js`)
   - **What this is:** Download and contact limits are process-local memory.
   - **Problem:** Limits reset on restart and do not coordinate across multiple instances.
   - **Recommendation:** Use an approved shared limiter or edge control if the app becomes multi-instance or public at scale.

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

3. **Form error styling and focus management remain incomplete** (`index.html:477`, `contact.html:216`)
   - Status semantics now exist and values are preserved on failure, but errors reuse the success container styling and focus is not moved to the feedback.
   - Recommendation: add a distinct error state and move focus to a linked error/success summary.

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

1. Choose and configure an approved contact delivery provider, including privacy/retention handling and operational secrets.
2. Self-host or pin production-critical CDN assets and tighten CSP when inline handlers and runtime Tailwind are removed.
3. Add reduced-motion, focus-visible, menu semantics, and accessible form status/error behavior.
4. Optimize the landing page asset strategy and verify 320/375/414/768/1024/1440px layouts with performance measurements.
5. Replace placeholder lint/build validation with a real HTML/CSS/JavaScript validation gate and browser smoke tests.

## Not checked

No production deployment configuration, DNS, analytics, approved contact provider, browser automation, visual regression run, or real-user load test was available in this repository. No visual redesign or framework refactor was performed as part of this audit.
