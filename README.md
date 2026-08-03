# Give Away — React App

Modern charity platform for **Aja Abayahastham**. Built with **React + Vite + React Router**.

## Quick Start

```bash
npm install
npm run dev
```

Open **http://localhost:5173** — the dev server starts automatically.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server (hot reload) |
| `npm run build` | Production build → `dist/` |
| `npm run preview` | Preview production build locally |

## Demo Logins

| Role | Email | Password | MFA |
|------|-------|----------|-----|
| Donor | `donor@gmail.com` | `password123` | — |
| Receiver | `receiver@outlook.com` | `password123` | — |
| NGO | `ngo@ashakiran.org` | `password123` | `123456` |
| Admin | `admin@abhayahastam.org` | `password123` | `123456` |

## Project Structure

```
src/
  App.jsx              # Routes
  context/AppContext.jsx  # Global state (mock data)
  pages/               # Landing, auth, role dashboards
  components/          # Layout, shared UI
  data/                # Mock data & constants
  styles/index.css     # Imports legacy theme CSS
legacy/                # Original vanilla HTML/CSS/JS (reference)
```

## Features

- **Donor** — donate items/money, browse NGOs, track impact
- **Receiver** — apply for assistance, track applications
- **NGO** — verification flow, programs, locked features until verified
- **Admin** — verification queue, ledger, fund usage updates

## Legacy Code

The original wireframe app is preserved in `legacy/` for reference.
