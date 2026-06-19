# School & College Transport Contract Management System

An enterprise-grade, full-stack transport management system designed to track, schedule, audit, and manage high-volume long-term transportation contracts for educational institutions. Originally designed for Manivtha Tours & Travels, this system provides automatic alert workflows, visual analytical dashboards, and structured multi-role operations.

---

## 🚀 Overview

The system centralizes contract lifecycle management, institution profiles, routes, vehicles, payments, renewal tracking, and reporting while providing an automated Expiry Tracking & Alert Trigger Engine. It is built using modern full-stack JavaScript (Vite + React frontend and Node.js + Express backend), backed by PostgreSQL hosted on Supabase, and is ready for cloud deployment.

---

## ✨ Features

- **JWT-Based Authentication**: Custom JWT authentication with role-based access control (RBAC) supporting `ADMIN`, `STAFF`, and `VIEWER` roles.
- **Institution Management**: Profile records for schools and colleges, tracking contacts, status, and active connections.
- **Contract Lifecycle Tracking**: Automatic states for contracts (`ACTIVE`, `PENDING_RENEWAL`, `EXPIRED`, `TERMINATED`) with validation checks on value, end date, and renewal date.
- **Dynamic Route Management**: Interactive pickup/drop tracking via structured JSONB.
- **Vehicle Fleet Auditing**: Fleet registry checking capacity, status, and tracking insurance & fitness certificate expiration dates.
- **Billing & Invoice Tracking**: Centralized payment records monitoring invoices, dues, and payment statuses (`UNPAID`, `PAID`, `OVERDUE`).
- **Expiry Tracking & Alert Trigger Engine**: Node-cron worker running a scheduled task daily at 9:00 AM to automatically scan expiries, generate contract renewal/expiry notifications, flag overdue payments, and insert records into database alerts.
- **Analytics & Reporting**: Interactive data visualization (charts, contract values, active vehicles, payment statuses) with CSV/PDF data exports.
- **Comprehensive Audit Logs**: Every critical state change (insert, update, delete) is automatically logged to `audit_logs` tracking changes (`old_value` and `new_value` JSONB snapshots) for security.

---

## 🛠️ Tech Stack

- **Frontend**: React (v19), React Router (v7), Vite (v8), Tailwind CSS (v3), Axios, Recharts (v3).
- **Backend**: Node.js, Express.js (v4), pg (PostgreSQL Client), Winston (Structured Logging), Joi (Environment/Input validation), Morgan (HTTP Request Logger).
- **Database**: PostgreSQL 14+ hosted on Supabase.
- **Security**: Helmet, express-rate-limit, input sanitization middleware, parameterized queries for SQL injection protection.
- **Testing**: Jest & Supertest (Backend), Vitest & React Testing Library with jsdom (Frontend).
- **CI/CD**: GitHub Actions (linting, tests, static analysis, build confirmation).
- **Deployment**: Vercel (Frontend), Render (Backend), Supabase (Database).

---

## 📐 Architecture

The codebase follows a Clean Architecture design pattern with clear separation of concerns:

- **Frontend**: Component-driven SPA architecture. Features are separated into page components (`frontend/src/pages/`) and shared, stateless UI components (`frontend/src/components/`). Custom context providers (`frontend/src/context/`) handle global state.
- **Backend**: Controller-Service-Model architecture.
  - **Controllers**: Express route handlers validating inputs and calling services.
  - **Services**: Business logic container.
  - **Models**: Low-level database SQL queries.
  - **Cron**: Daily cron-job orchestrators.
  - **Middleware**: Security (helmet, rate limiting), error handling, session validation, and request sanitization.

---

## 📷 Screenshots Section

*Frontend UI mockups showing the analytical dashboard, contract listings, and warning alerts:*

| Dashboard & Charts | Contract Creation Form | Expiry Alerts |
| :---: | :---: | :---: |
| ![Dashboard Analytics](https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=400&h=250&q=80) | ![Form Creation](https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=400&h=250&q=80) | ![Warning Alerts](https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?auto=format&fit=crop&w=400&h=250&q=80) |

---

## 📁 Folder Structure

```text
school-college-transport-contract-management/
├── .github/
│   └── workflows/
│       └── ci.yml                     # CI/CD validation pipeline
├── docs/                              # Architecture and developer docs
│   ├── ARCHITECTURE.md
│   ├── API.md
│   ├── DATABASE.md
│   ├── DEPLOYMENT.md
│   ├── LOGGING.md
│   └── TESTING.md
├── database/
│   ├── DATABASE_SCHEMA.sql            # Main database layout and constraints
│   └── migrations/                    # Database version control files
├── backend/
│   ├── src/
│   │   ├── config/                    # DB connections & environment validation
│   │   ├── controllers/               # API endpoint route handlers
│   │   ├── cron/                      # Scheduled workers (alert engines)
│   │   ├── middleware/                # Security headers, sanitizers & errors
│   │   ├── models/                    # SQL query bindings
│   │   ├── routes/                    # API paths mapping to controllers
│   │   ├── services/                  # Pure business logic core
│   │   ├── utils/                     # Response utilities, custom errors, loggers
│   │   └── server.js                  # Entry point
│   ├── tests/                         # Backend integration & unit tests
│   ├── .env.example
│   ├── package.json
│   └── render.yaml                    # Infrastructure-as-code backend definition
└── frontend/
    ├── src/
    │   ├── api/                       # Axios client & request interceptors
    │   ├── components/                # Reusable UI & Layout shells
    │   ├── context/                   # React session providers
    │   ├── pages/                     # Routed views (Dashboard, Contracts, etc.)
    │   ├── test/                      # Vitest setup configurations
    │   ├── App.jsx                    # Lazy-loaded router shell
    │   ├── main.jsx                   # DOM entry point
    │   └── index.css                  # Tailwind styles
    ├── .env.example
    ├── package.json
    └── vercel.json                    # Single page app router rewrite rule
```

---

## 🔧 Installation & Environment Setup

Clone the repository and copy the environment template files:

```bash
git clone https://github.com/bharathwajverse/school-college-transport-contract-management.git
cd school-college-transport-contract-management
```

### Environment Config

1. Create a `backend/.env` file from the example:
   ```bash
   cp backend/.env.example backend/.env
   ```
   Modify the variables:
   - `PORT`: Set your preferred port (default is `5000`).
   - `DATABASE_URL`: Your Supabase connection string.
   - `JWT_SECRET`: Secure long string.
   - `CORS_ORIGIN`: `http://localhost:5173`.
   - `ENABLE_CRON`: Set to `true` to run daily expiry alerts.

2. Create a `frontend/.env` file from the example:
   ```bash
   cp frontend/.env.example frontend/.env
   ```
   Modify:
   - `VITE_API_URL`: Backend endpoint (`http://localhost:5000/api`).

---

## 🖥️ Local Development

### 1. Database Setup (Supabase)
1. Sign up on [Supabase](https://supabase.com/).
2. Create a new PostgreSQL database.
3. Open the **SQL Editor** in your Supabase dashboard.
4. Open the SQL file [DATABASE_SCHEMA.sql](file:///g:/Projects/insternship/school-college-transport-contract-management/database/DATABASE_SCHEMA.sql), copy its content, and execute it in the SQL Editor.
5. In the database settings, locate the Connection String (transaction pooler) and use it as `DATABASE_URL` in your `.env`.

### 2. Backend Setup
```bash
cd backend
npm install
npm run dev
```
The server will boot up and validate configuration parameters. If any variable is missing, startup fails immediately for protection.

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🧪 Testing

Both layers have full testing configurations integrated:

### Backend Testing (Jest & Supertest)
```bash
cd backend
npm test                # Runs all test suites
npm run test:coverage   # Generates test coverage report
```

### Frontend Testing (Vitest & JSDOM)
```bash
cd frontend
npm test                # Runs Vitest suites
npm run test:coverage   # Generates frontend test coverage
```

---

## 🏗️ Build Process

To compile assets for production distribution:

```bash
# Frontend Compilation (Outputs to frontend/dist)
cd frontend
npm run build

# Backend (Express server compiles and runs directly from node src/server.js)
cd backend
npm start
```

---

## ☁️ Deployment Guide

### Database (Supabase)
Ensure that you have run the schema script in the Supabase SQL editor. No special configuration is needed as the application links securely using pooled PostgreSQL connection URIs.

### Backend (Render)
1. Connect your repository to [Render](https://render.com/).
2. Create a new **Web Service** using the root repository.
3. Choose the build configuration using Infrastructure-as-code: Render will automatically parse the `render.yaml` configuration.
4. Input env variables (`DATABASE_URL`, `JWT_SECRET`, `CORS_ORIGIN`) inside the Render Dashboard dashboard.

### Frontend (Vercel)
1. Connect your repository to [Vercel](https://vercel.com/).
2. Create a new project pointing to the `frontend/` directory.
3. Configure the build command as `npm run build` and output directory as `dist`.
4. Set the environment variable `VITE_API_URL` to point to your backend url on Render.
5. The `vercel.json` ensures that deep routing falling under HTML5 React Router automatically rewrites to `index.html`.

---

## 🛡️ Security

- **Helmet.js** sets secure HTTP headers including content-security-policies to safeguard against script injection.
- **Express-Rate-Limit** prevents brute-force / DDoS attacks on the `/api/` endpoints (100 requests per 15 minutes per IP).
- **Input Sanitization** strips markup and unsafe JavaScript strings from request bodies before controllers parse inputs.
- **SQL Parametrization** prevents injection vulnerabilities across raw PostgreSQL calls.
- **JWT Expiry & Storage**: Access tokens are verified on request, and context hooks purge local memory when sessions expire.

---

## 🚨 Troubleshooting

- **Database Connection Terminations**: Ensure that transaction pooling parameters (usually port `6543` or `5432` with connection pool options) are added correctly.
- **CORS Errors**: Check that `CORS_ORIGIN` matches the exact deployed URL of your Vercel frontend.
- **API Environment Failures**: If the backend immediately crashes upon start, review the startup error. It indicates which Joi config key is missing or malformed inside `.env`.

---

## 🔮 Future Improvements

- Add Multi-tenant isolation for larger travel agencies.
- Real-time location tracking for active vehicles using WebSockets.
- Fully automated Stripe billing integration.

---

## 🤝 Contributing

We welcome contributions to optimize the system:
1. Fork the Project.
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`).
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the Branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

---

## 📄 License

Developed for educational evaluation and review purposes. See [CONTRIBUTING.md](file:///g:/Projects/insternship/school-college-transport-contract-management/CONTRIBUTING.md) for guidelines.
