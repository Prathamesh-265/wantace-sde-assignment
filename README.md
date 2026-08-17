# Northline Roofing & Exteriors — Estimator & Owner Panel

A config-driven roof cost estimator built for Northline Roofing & Exteriors (Columbus, OH). Homeowners complete a short multi-step form and get an instant cost estimate; the business owner manages all pricing, questions, and leads through a protected admin panel — with zero code changes or redeployments required.

## What This Is

The project has two connected surfaces sharing one backend and one database:

- **Public Estimator** — a mobile-friendly, multi-step form for homeowners. Every question, label, option, and rate is fetched from the database at runtime; nothing is hardcoded in the frontend. The homeowner enters roof details and contact info, and the server calculates a price range using the current active configuration.
- **Owner Panel** — a login-protected dashboard where the business owner (or a non-technical staff member) can edit rates and multipliers, update question labels, toggle questions on/off, and view captured leads with the answers that produced each estimate. Changes take effect immediately on the live estimator — no redeploy.

All pricing logic runs server-side. The frontend never sees or calculates the formula; it only renders whatever configuration the API returns.

**Live estimator:** [\[add your Vercel URL\]](https://wantace-sde-assignment.vercel.app)

**Owner panel:** [\[add your Vercel URL\]/admin/login](https://wantace-sde-assignment.vercel.app/admin/login)

**Test login:** username `admin`, password `admin123`

## Stack

- **Frontend:** React (Vite) + Tailwind CSS
- **Backend:** Node.js + Express
- **Database:** PostgreSQL (Neon) via Prisma ORM
- **Auth:** JWT in an httpOnly cookie

## Running Locally

### 1. Clone and install

```bash
git clone <your-repo-url>
cd <repo-folder>
```

### 2. Backend setup

```bash
cd server
npm install
cp .env.example .env
```

Fill in `.env` with your own `DATABASE_URL` and `JWT_SECRET`, then generate the admin password hash:

```bash
node scripts/hash-password.js "yourpassword"
```

Paste the printed hash into `ADMIN_PASSWORD_HASH` in `.env`. Then run migrations and seed:

```bash
npx prisma migrate dev --name init
npm run seed
npm run dev
```

Backend runs at `http://localhost:4000`. Confirm it's healthy at `http://localhost:4000/health` — should return `{"status":"ok"}`.

### 3. Frontend setup

```bash
cd client
npm install
cp .env.example .env
```

Set `VITE_API_URL` in `.env` to your backend URL (`http://localhost:4000` for local dev), then:

```bash
npm run dev
```

Frontend runs at `http://localhost:5173`.

### 4. Try it out

- Open `http://localhost:5173` and complete the estimator to generate a lead.
- Open `http://localhost:5173/admin/login`, sign in with the test credentials above, edit a rate, and confirm the change reflects on the public estimator without restarting the server.

## Environment Variables

**server/.env**

| Variable              | Description                                                                  |
| --------------------- | ---------------------------------------------------------------------------- |
| `DATABASE_URL`        | PostgreSQL connection string (Neon)                                          |
| `PORT`                | API port (default `4000`)                                                    |
| `CLIENT_ORIGIN`       | Frontend URL, used for CORS                                                  |
| `ADMIN_USERNAME`      | Owner panel login username                                                   |
| `ADMIN_PASSWORD_HASH` | bcrypt hash of the owner password (generate with `scripts/hash-password.js`) |
| `JWT_SECRET`          | Random string used to sign session tokens                                    |
| `NODE_ENV`            | `development` or `production`                                                |

**client/.env**

| Variable       | Description                 |
| -------------- | --------------------------- |
| `VITE_API_URL` | Base URL of the backend API |

## Project Structure

```
├── client/ # Frontend App (React/Vite)
│ ├── src/
│ │ ├── components/
│ │ │ ├── dynamic/ # Form field renderers (NumberInput, SelectInput)
│ │ │ ├── estimator/ # Estimator multi-step wizard
│ │ │ └── owner/ # Owner config editor & lead table
│ │ ├── pages/ # Public estimator & owner panel pages
│ │ ├── services/ # API fetch helpers
│ │ └── App.jsx
│ ├── package.json
│ └── tailwind.config.js
├── server/ # Backend API (Express.js)
│ ├── prisma/
│ │ └── schema.prisma # Database schema & models
│ ├── src/
│ │ ├── config/ # DB connection & seed loading
│ │ ├── controllers/ # Lead, config & auth controllers
│ │ ├── middleware/ # Auth verification middleware
│ │ ├── routes/ # Express route definitions
│ │ ├── services/ # Pricing calculation engine
│ │ ├── utils/ # Shared helper functions
│ │ └── index.js
│ ├── package.json
│ └── .env.example
├── DECISIONS.md # Architectural decisions & assumptions
├── AI_LOG.md # AI usage log
└── README.md
```
