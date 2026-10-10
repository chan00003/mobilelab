# MobileLab UI/UX Roadmap

Audit date: 2026-10-10

Scope: `index.html`, `about.html`, `services.html`, `how-we-work.html`, `contact.html`, the shared route/asset behavior in `server.js`, and the existing image assets. This is an assessment only; no visual redesign was performed.

## Current experience

MobileLab is a five-page marketing site:

- `/` — primary landing page with the value proposition, metrics, services, four-step method, proof, and contact CTA.
- `/about` — company story, principles, team imagery, and CTA.
- `/services` — service categories and supporting explanations.
- `/how-we-work` — interactive four-step method presentation.
- `/contact` — bottleneck diagnostic form.

The Express server also provides `/assets`, `/mobilelab-ogimage.png`, three download aliases, and the validated `/api/contact` endpoint. The pages use inline HTML/CSS/JavaScript, Tailwind’s runtime CDN, Google Fonts/Material Symbols, and optimized WebP imagery.

Current brand signals are strong and should remain: deep navy surfaces, electric lime primary actions, cyan accents, rounded cards, engineering language, large editorial headings, and restrained technical grid motifs.

## Assessment basis

This review combines source inspection, route/asset dependency context from Graphify, and UI/UX Pro Max searches for responsive HTML/Tailwind marketing sites, focus/error behavior, reduced motion, image scaling, and conversion structure.

No browser automation or screenshot capture was available. The findings below are therefore code-verified, not pixel-verified. Before implementation, capture each page at 320, 375, 414, 768, 1024, and 1440 CSS pixels in portrait and landscape where relevant.

## Prioritized improvements

### P0 — Make every interaction accessible and truthful

#### 1. Navigation state and keyboard focus

Problem: the mobile menu buttons have accessible names but no `aria-expanded` or `aria-controls`; several controls use `focus:outline-none` without a consistently guaranteed replacement. The four-step method buttons also use click handlers without exposing selected state or a stable relationship to the changing content.

Acceptance criteria:

- Every mobile menu button exposes `aria-expanded` and `aria-controls="mobile-nav"`, synchronized on open/close.
- Every interactive control has a visible `:focus-visible` treatment with sufficient contrast.
- Method steps expose `aria-selected` or an equivalent button state and connect to the active content region.
- Keyboard-only traversal follows the visual order and does not trap focus.

Affected files: all five HTML pages, especially their shared header/footer patterns; the method controller in `index.html`.

#### 2. Form loading, error, and success states

Problem: forms now avoid false success, but the error response reuses success styling, does not focus an error summary, and does not provide field-linked errors. Contact delivery intentionally remains unavailable until a provider is approved.

Acceptance criteria:

- Submit buttons enter a disabled/loading state while the request is pending.
- A failed request shows an error-styled `role="alert"` summary, receives focus, and links to invalid fields where applicable.
- Field values remain intact on failure.
- Success is shown only for a real `2xx` delivery response; the current `503` configuration state is clear and non-successful.
- The form works with keyboard and screen reader flows without relying on color alone.

Affected files: `index.html`, `contact.html`, and the existing `/api/contact` contract in `server.js`.

#### 3. Remove non-functional destinations

Problem: social icons and some footer/logo links still use `href="#"`, which creates confusing jumps and weakens trust.

Acceptance criteria:

- Every link has a real destination, an intentional non-link treatment, or is removed.
- Social links use approved URLs and safe external-link behavior when configured.
- The active page remains clearly indicated in desktop and mobile navigation.

Affected files: all five HTML pages.

### P1 — Reduce motion and improve perceived performance

#### 4. Respect reduced motion and control animation density

Problem: the site contains rotating borders, pulse effects, hover scaling, gradient movement, cursor/header glow, counters, and method transitions. No `prefers-reduced-motion` fallback was found.

Acceptance criteria:

- `prefers-reduced-motion: reduce` disables continuous decorative animation and shortens or removes non-essential transitions.
- Counter and method content remains immediately readable without animation.
- No view depends on animation to communicate state.
- Normal motion is limited to one or two purposeful focal interactions per view.

Affected files: page-level `<style>` blocks and inline scripts across the five HTML pages.

#### 5. Make imagery responsive and predictable

Problem: many images have useful `width`, `height`, `decoding`, and lazy-loading attributes, but the full image strategy has not been visually verified across breakpoints. The landing page remains a large inline document and contains many visual elements.

Acceptance criteria:

- Above-the-fold images have explicit dimensions and an intentional eager/priority policy.
- Below-the-fold images use lazy loading and do not cause layout shift.
- Images scale within their containers at 320–1440px without horizontal overflow or unreadable crops.
- The largest visual assets are measured for mobile LCP and compressed without visible brand degradation.

Affected files: all page HTML and `assets/images`; existing asset scripts may be used but must not rewrite pages without review.

#### 6. Reduce runtime dependency risk

Problem: every page loads Tailwind and fonts/icons at runtime from third parties, and inline handlers require a permissive CSP.

Acceptance criteria:

- The current visual output is captured as a baseline before any asset migration.
- Production-critical CSS/font/icon assets are pinned or self-hosted in a separate change.
- CSP can remove unnecessary `unsafe-inline` allowances after handlers/scripts are externalized.
- No new frontend framework is introduced.

Affected files: page heads, `server.js` CSP, asset pipeline/scripts, and potentially `public/` if introduced deliberately.

### P2 — Establish a consistent design system without changing the brand

#### 7. Consolidate typography and tokens

Problem: pages load Montserrat, Plus Jakarta Sans, Space Grotesk, and Material Symbols, while broad selectors force Montserrat across many elements. Colors and spacing are frequently repeated as inline Tailwind values.

Acceptance criteria:

- Define a documented type hierarchy: display, heading, body, label, and code/technical metadata.
- Choose the current brand’s primary family and use the others only for deliberate roles.
- Centralize semantic color and spacing tokens while preserving navy/lime/cyan values.
- Normal text meets 4.5:1 contrast and non-text controls meet 3:1 contrast.

Affected files: page head/config/style blocks; a future shared stylesheet or generated CSS asset if introduced.

#### 8. Normalize responsive layout rules

Problem: the pages share breakpoint conventions but also contain page-specific widths, fixed-height visual panels, and repeated header/footer markup. Tablet and landscape behavior is not screenshot-verified.

Acceptance criteria:

- Shared gutters, content max-widths, section spacing, and button sizing follow a documented 4/8px rhythm.
- No horizontal scrolling at 320px or 375px.
- Hero copy, cards, forms, and interactive method content maintain readable measure at tablet and desktop widths.
- Touch targets are at least 44px where practical, with larger primary CTA targets.

Affected files: all five HTML pages.

### P3 — Measurement and maintainability

#### 9. Add a repeatable visual/accessibility verification gate

Acceptance criteria:

- A reviewed browser test captures the five routes at the target breakpoints.
- Keyboard traversal, reduced-motion, form failure, and image-loading states are checked.
- Performance observations include LCP, CLS, and third-party request inventory.
- The test does not require an external contact provider.

Affected files: test tooling/configuration and documentation; keep runtime dependencies unchanged unless explicitly approved.

#### 10. Reduce page duplication carefully

Acceptance criteria:

- Shared navigation/footer changes have one source of truth or a documented synchronization process.
- Generated output is deterministic and reviewable.
- No content or visual behavior changes during the extraction.

Affected files: all page HTML, existing scripts, and any approved generation tooling.

## Implementation sequence

1. Capture browser baselines and confirm the current visual output at target breakpoints.
2. Fix P0 semantics and focus states without changing colors, copy, or layout structure.
3. Add truthful form loading/error styling and provider-configuration messaging.
4. Add reduced-motion fallbacks and tune animation density.
5. Verify image sizing/loading and measure mobile performance.
6. Consolidate typography/tokens and evaluate CDN self-hosting as a separate reviewed change.
7. Add repeatable browser accessibility/performance checks.
8. Only then consider shared-page extraction, guarded by visual regression comparisons.

## Decisions requiring approval

- Which approved contact delivery provider, if any, should replace the current intentional `503` configuration state?
- Are social destinations available, or should placeholder social controls be removed until they are?
- Should production-critical Tailwind/fonts/icons be self-hosted, accepting the asset maintenance cost?
- Which browser automation tool is approved for visual regression and accessibility checks?
