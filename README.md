# Mobile Lab | AI Systems & Automation

Mobile Lab designs and builds lean, high-leverage AI platforms and business automation workflows that eliminate operational bottlenecks and drive enterprise revenue.

## 🚀 Features

- **Responsive Design**: Fluid and fully responsive across mobile, tablet, laptop, and ultra-wide desktop screens.
- **Animated Metrics**: Dynamic count-up animations for business impact metrics (Years in Business, Clients Served, Projects) utilizing ease-out cubic animation and tabular numbers.
- **Interactive Workflows**: Diagnostic 4-step method switcher and multi-device service accordion.
- **Mobile Navigation**: Collapsible slide-down navigation drawer with active state indicators.
- **Node.js Express Server**: Ready for local development or deployment to Cloud platforms (Google Cloud Run, Vercel, Railway, Render, Heroku).

---

## 🛠️ Getting Started

### 1. Install Dependencies
```bash
npm install
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

---

## 📦 Pushing to GitHub

If you are updating your GitHub repository (`chan00003/mobilelab2.0`):

```bash
git init
git add .
git commit -m "feat: responsive design, animated metrics, and server setup"
git branch -M main
git remote add origin https://github.com/chan00003/mobilelab2.0.git
git push -u origin main --force
```

---

## 📁 Project Structure

```
├── index.html        # Main landing page markup, Tailwind styling, and interactive scripts
├── contact.html      # Dedicated contact page matching bottleneck diagnostic form
├── server.js         # Express static file server (port 3000)
├── package.json      # Dependencies and npm scripts
├── .env.example      # Environment variables template
├── .gitignore        # Git ignore rules
└── README.md         # Project documentation
```
