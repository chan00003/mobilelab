# Mobile Lab | AI Systems & Automation

Mobile Lab designs and builds lean, high-leverage AI platforms and business automation workflows that eliminate operational bottlenecks and drive enterprise revenue.

## 🚀 Features

- **Responsive Design**: Fluid and fully responsive across mobile, tablet, laptop, and ultra-wide desktop screens.
- **Animated Metrics**: Dynamic count-up animations for business impact metrics (Years in Business, Clients Served, Projects) utilizing ease-out cubic animation and tabular numbers.
- **Interactive Workflows**: Diagnostic 4-step method switcher and multi-device service accordion.
- **Mobile Navigation**: Collapsible slide-down navigation drawer with active state indicators.
- **Dedicated Pages**: About, services, how-we-work, and contact routes with optimized asset delivery.
- **Safe Project Download**: Per-request Node.js ZIP streaming with a fixed archive allowlist and cleanup on failure.
- **Node.js Express Server**: Ready for local development and Vercel's Node.js Express runtime.

---

## 🛠️ Getting Started

### 1. Install Dependencies
```bash
npm ci
```

### 2. Run the Development Server
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Production Start
```bash
npm start
```

### Testing

Run the built-in Node test suite:

```bash
npm test
```

Tests use only Node's built-in test runner and cover page routes, sensitive static paths, security headers, extracted ZIP entries and content, missing resources, concurrent streams, client disconnect cleanup, contact validation, and request-size handling. Contact submissions are validated server-side but return a clear `503` until an approved delivery provider is configured; no credentials or provider have been added.

Run browser smoke tests separately:

```bash
npm run test:e2e
```

The Playwright suite starts a dedicated local server, checks all five pages at 390px, 768px, and 1440px, captures ignored screenshots and reports, verifies responsive layout and accessibility interactions, checks the unconfigured contact error, and validates download/privacy responses. The ZIP route uses the Node.js `archiver` package and does not require Python at runtime.

For authorized Vercel preview QA, configure `VERCEL_AUTOMATION_BYPASS_SECRET` in the same terminal process and run `npm run test:remote`. The value is sent only as the `x-vercel-protection-bypass` header; the remote runner fails before making requests when the variable is missing and never logs or stores it.

For clean dependency validation without enabling lifecycle scripts, use `npm ci --ignore-scripts`.

### Vercel deployment

The Express app is detected from root `server.js` and exports the app for the Node.js runtime. Deployment-served pages and browser assets are copied under `public/`; sensitive application files remain outside that directory. The three download routes stream an allowlisted ZIP from Node.js without invoking Python.

Before relying on a preview, verify the protected deployment with an authorized Vercel Shareable Link or a CI-only `x-vercel-protection-bypass` header. Do not commit or expose bypass secrets. See [docs/VERCEL_DEPLOYMENT_PLAN.md](docs/VERCEL_DEPLOYMENT_PLAN.md) for the compatibility checklist and rollback plan.

GitHub Actions runs the same `npm ci`, lint, test, and build checks for pull requests and pushes to `main`. See [docs/PROJECT_AUDIT.md](docs/PROJECT_AUDIT.md) for the current application audit and prioritized follow-up work.

### Agent tooling

Agent skills are project-scoped under `.agents/skills/`. Caveman, Ponytail, and UI/UX Pro Max are installed for Codex without being application dependencies. Graphify is installed separately with Python 3.12 and uv:

```powershell
uv tool install graphifyy
graphify install --project --platform codex
```

Verified on Windows with Python 3.12.10, uv 0.13.0, and graphify 0.9.84. After setup, use `graphify update .` after code changes to refresh the local knowledge graph. Lifecycle hooks must be reviewed and explicitly trusted before use.

---

## 📦 Git workflow

Create a focused branch and pull request. CI runs automatically; do not force-push or deploy without explicit approval.

---

## 📁 Project Structure

```
├── index.html        # Source landing page markup, styling, and interactive scripts
├── about.html        # Source About page
├── services.html     # Source Services page
├── how-we-work.html  # Source Process page
├── contact.html      # Source contact page
├── assets/           # Source optimized image assets
├── public/           # Vercel-served copies of pages and assets
├── server.js         # Express server (port 3000)
├── package.json      # Dependencies and npm scripts
├── test/              # Node route tests and Playwright smoke tests
├── docs/              # Project audit and engineering documentation
├── .github/workflows/ # Pull request and main-branch CI
├── .env.example      # Environment variables template
├── .gitignore        # Git ignore rules
└── README.md         # Project documentation
```
