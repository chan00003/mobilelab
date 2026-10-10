# Mobile Lab | AI Systems & Automation

Mobile Lab designs and builds lean, high-leverage AI platforms and business automation workflows that eliminate operational bottlenecks and drive enterprise revenue.

## 🚀 Features

- **Responsive Design**: Fluid and fully responsive across mobile, tablet, laptop, and ultra-wide desktop screens.
- **Animated Metrics**: Dynamic count-up animations for business impact metrics (Years in Business, Clients Served, Projects) utilizing ease-out cubic animation and tabular numbers.
- **Interactive Workflows**: Diagnostic 4-step method switcher and multi-device service accordion.
- **Mobile Navigation**: Collapsible slide-down navigation drawer with active state indicators.
- **Dedicated Pages**: About, services, how-we-work, and contact routes with optimized asset delivery.
- **Safe Project Download**: Per-request ZIP generation with Windows Python detection and cleanup.
- **Node.js Express Server**: Ready for local development or deployment to Cloud platforms (Google Cloud Run, Vercel, Railway, Render, Heroku).

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

Tests use only Node's built-in test runner and cover page routes, sensitive static paths, security headers, verified Python resolution, valid ZIP generation, download failure and concurrent cleanup behavior, contact validation, and request-size handling. Contact submissions are validated server-side but return a clear `503` until an approved delivery provider is configured; no credentials or provider have been added.

The download route requires Python 3.10 or newer. On Windows, the server checks `PYTHON_EXECUTABLE`, the `py` launcher, valid PATH interpreters, and common installed `python.exe` locations. Set `PYTHON_EXECUTABLE` to an absolute verified interpreter path when Python is not discoverable automatically.

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
├── index.html        # Main landing page markup, Tailwind styling, and interactive scripts
├── about.html        # About page
├── services.html     # Services page
├── how-we-work.html  # Process page
├── contact.html      # Dedicated contact page matching bottleneck diagnostic form
├── assets/           # Optimized static image assets
├── server.js         # Express server (port 3000)
├── package.json      # Dependencies and npm scripts
├── test/              # Node built-in route tests
├── docs/              # Project audit and engineering documentation
├── .github/workflows/ # Pull request and main-branch CI
├── .env.example      # Environment variables template
├── .gitignore        # Git ignore rules
└── README.md         # Project documentation
```
