# Give Away — Web Frontend

React + Vite web app for the Give Away platform. Auth is connected to the real IAM API via the backend gateway.

## Prerequisites

- **Node.js 18+** (includes npm)
- **Backend running** on port 8000 (see `give-away-backend/README.md`)

## Install dependencies

```powershell
cd Give_away_fe
npm install
```

## Configure environment (optional)

Default dev setup works out of the box — Vite proxies API calls to the gateway.

```powershell
copy .env.example .env
```

`.env` / `.env.development`:

```
VITE_IAM_API_URL=/api/v1
```

The Vite dev server proxies `/api/v1` → `http://localhost:8000` (see `vite.config.js`).

## Start the frontend

**Terminal 1 — Backend:**

```powershell
cd give-away-backend
python run.py
```

**Terminal 2 — Frontend:**

```powershell
cd Give_away_fe
npm run dev
```

Open **http://localhost:5173**

## Scripts

| Command | Description |
|---------|-------------|
| `npm install` | Install dependencies (first time) |
| `npm run dev` | Dev server with hot reload (:5173) |
| `npm run build` | Production build → `dist/` |
| `npm run preview` | Preview production build locally |

## Login / register

- **Register** at `/register/*` — role is chosen on register (Donor / Receiver / NGO).
- **Login** at `/login` — role comes from the server after login (no role tabs on login).
- Dashboards are mostly empty until Core/Communication APIs are wired in the UI.

### Test accounts (after backend seed/register)

| Email | Password |
|-------|----------|
| `donor@test.com` | `Test@1234` |
| `receiver@test.com` | `Test@1234` |
| `ngo@test.com` | `Test@1234` |

Or register a new account via the UI or Swagger: http://127.0.0.1:8000/docs

## How API calls work

```
Browser  →  http://localhost:5173/api/v1/auth/login
         →  Vite proxy
         →  http://localhost:8000/api/v1/auth/login  (gateway)
         →  IAM service
```

Tokens are stored in `sessionStorage` and sent as `Authorization: Bearer <token>` on protected requests.

## Project structure

```
src/
  api/iamClient.js       # IAM API client (login, register, refresh)
  context/AppContext.jsx # Auth state + app context
  pages/                 # Landing, login, register, dashboards
  components/            # Shared UI
  utils/roleMap.js       # Role → dashboard route mapping
```

## Troubleshooting

| Problem | Fix |
|---------|-----|
| Login fails / network error | Ensure backend is running: `python run.py` |
| CORS errors | Check gateway `CORS_ORIGINS` includes `http://localhost:5173` |
| 401 on dashboard | Log out and log in again; token may have expired |
