# Implementation Plan

# School & College Transport Contract Management System

# Implementation Plan

Version: 1.0

This document provides the complete implementation roadmap from project setup to production deployment.

---

# PHASE 0 – PROJECT SETUP

## Repository Setup

- [ ] Create project root directory
- [ ] Initialize Git repository
- [ ] Create GitHub repository
- [ ] Create README.md
- [ ] Create docs directory
- [ ] Add PRD.md
- [ ] Add ARCHITECTURE.md
- [ ] Add API_SPECIFICATION.md
- [ ] Add DATABASE_SCHEMA.sql
- [ ] Add WIREFRAMES.md

---

## Frontend Setup

- [ ] Create React application using Vite
- [ ] Install dependencies
- [ ] Install Tailwind CSS
- [ ] Configure Tailwind
- [ ] Install Axios
- [ ] Install React Router
- [ ] Install Recharts
- [ ] Create frontend folder structure

```bash
npm create vite@latest frontend -- --template react
```

---

## Backend Setup

- [ ] Create Express application
- [ ] Install Express
- [ ] Install PostgreSQL driver
- [ ] Install JWT
- [ ] Install bcrypt
- [ ] Install dotenv
- [ ] Install cors
- [ ] Install nodemon
- [ ] Create backend folder structure

```bash
npm install express pg bcrypt jsonwebtoken cors dotenv
npm install -D nodemon
```

---

# PHASE 1 – DATABASE

## Supabase Setup

- [ ] Create Supabase project
- [ ] Obtain DATABASE_URL
- [ ] Configure environment variables

---

## Database Creation

- [ ] Enable pgcrypto extension
- [ ] Create users table
- [ ] Create institutions table
- [ ] Create contracts table
- [ ] Create routes table
- [ ] Create vehicles table
- [ ] Create payments table
- [ ] Create alerts table
- [ ] Create audit_logs table

---

## Constraints

- [ ] Add foreign keys
- [ ] Add indexes
- [ ] Add check constraints
- [ ] Verify schema integrity

---

# PHASE 2 – AUTHENTICATION

## User Model

- [ ] Create user model
- [ ] Create createUser()
- [ ] Create findByEmail()

---

## Authentication APIs

- [ ] Register endpoint
- [ ] Login endpoint
- [ ] Password hashing
- [ ] JWT generation
- [ ] JWT validation

---

## Middleware

- [ ] Create auth middleware
- [ ] Protect routes
- [ ] Create role middleware

---

## Testing

- [ ] Register test user
- [ ] Login test user
- [ ] Verify JWT token
- [ ] Verify route protection

---

# PHASE 3 – INSTITUTIONS MODULE

## Model

- [ ] Create institution model
- [ ] Create CRUD methods

---

## Controller

- [ ] Create institution controller
- [ ] Create validation

---

## Routes

- [ ] POST /institutions
- [ ] GET /institutions
- [ ] GET /institutions/:id
- [ ] PUT /institutions/:id
- [ ] DELETE /institutions/:id

---

## Testing

- [ ] Create institution
- [ ] Update institution
- [ ] Delete institution
- [ ] Verify database records

---

# PHASE 4 – CONTRACTS MODULE

## Model

- [ ] Create contract model
- [ ] Create CRUD methods

---

## Controller

- [ ] Create contract controller
- [ ] Add business validations

---

## Routes

- [ ] POST /contracts
- [ ] GET /contracts
- [ ] GET /contracts/:id
- [ ] PUT /contracts/:id
- [ ] DELETE /contracts/:id

---

## Business Rules

- [ ] Validate start date
- [ ] Validate end date
- [ ] Validate renewal date
- [ ] Validate contract value

---

## Testing

- [ ] Create contract
- [ ] Update contract
- [ ] Delete contract
- [ ] Verify contract search

---

# PHASE 5 – ROUTES MODULE

## Database

- [ ] Verify routes table

---

## Backend

- [ ] Create route model
- [ ] Create route controller
- [ ] Create route routes

---

## APIs

- [ ] Create Route
- [ ] Get Routes
- [ ] Get Route
- [ ] Update Route
- [ ] Delete Route

---

## Testing

- [ ] Create route
- [ ] Verify contract relationship

---

# PHASE 6 – VEHICLES MODULE

## Backend

- [ ] Create vehicle model
- [ ] Create vehicle controller
- [ ] Create vehicle routes

---

## APIs

- [ ] Create Vehicle
- [ ] Get Vehicles
- [ ] Update Vehicle
- [ ] Delete Vehicle

---

## Testing

- [ ] Create vehicle
- [ ] Verify assignment to contract

---

# PHASE 7 – PAYMENTS MODULE

## Backend

- [ ] Create payment model
- [ ] Create payment controller
- [ ] Create payment routes

---

## APIs

- [ ] Create Payment
- [ ] Get Payments
- [ ] Update Payment
- [ ] Delete Payment
- [ ] Mark Paid

---

## Business Rules

- [ ] UNPAID status
- [ ] PAID status
- [ ] OVERDUE status

---

## Testing

- [ ] Create invoice
- [ ] Mark payment paid
- [ ] Verify overdue detection

---

# PHASE 8 – ALERT ENGINE

## Database

- [ ] Verify alerts table

---

## Service Layer

- [ ] Create alert service
- [ ] Create alert generation logic

---

## Scheduler

- [ ] Install node-cron
- [ ] Create cron scheduler

```bash
npm install node-cron
```

---

## Expiry Rules

- [ ] 90 day alert
- [ ] 60 day alert
- [ ] 30 day alert
- [ ] 15 day alert
- [ ] 7 day alert

---

## Payment Rules

- [ ] Detect overdue invoices
- [ ] Generate payment alerts

---

## APIs

- [ ] Get Alerts
- [ ] Upcoming Alerts
- [ ] Manual Alert
- [ ] Mark Alert Sent

---

## Testing

- [ ] Verify alert generation
- [ ] Verify scheduler execution
- [ ] Verify overdue alerts

---

# PHASE 9 – DASHBOARD

## Summary APIs

- [ ] Active contracts count
- [ ] Pending renewals count
- [ ] Overdue payments count
- [ ] Upcoming alerts count

---

## Revenue Analytics

- [ ] Revenue aggregation query
- [ ] Revenue chart API

---

## Testing

- [ ] Verify counts
- [ ] Verify chart data

---

# PHASE 10 – REPORTS

## Revenue Report

- [ ] Monthly revenue report
- [ ] Revenue trend API

---

## Contract Report

- [ ] Status distribution report

---

## Export

- [ ] CSV export
- [ ] PDF export

---

## Testing

- [ ] Verify exported files

---

# PHASE 11 – AUDIT LOGS

## Database

- [ ] Verify audit_logs table

---

## Middleware

- [ ] Create audit middleware
- [ ] Capture CREATE actions
- [ ] Capture UPDATE actions
- [ ] Capture DELETE actions

---

## APIs

- [ ] Get Audit Logs

---

## Testing

- [ ] Verify audit entries

---

# PHASE 12 – FRONTEND FOUNDATION

## Routing

- [ ] Configure React Router
- [ ] Create protected routes

---

## Authentication

- [ ] Create AuthContext
- [ ] Store JWT
- [ ] Axios interceptor

---

## Layout

- [ ] Sidebar
- [ ] Navbar
- [ ] Page Layout

---

# PHASE 13 – LOGIN PAGE

## Components

- [ ] Email field
- [ ] Password field
- [ ] Login button

---

## API Integration

- [ ] Connect login API
- [ ] Store token
- [ ] Redirect to dashboard

---

# PHASE 14 – DASHBOARD PAGE

## Components

- [ ] KPI cards
- [ ] Revenue chart
- [ ] Alert list

---

## API Integration

- [ ] Dashboard summary
- [ ] Revenue chart
- [ ] Upcoming alerts

---

# PHASE 15 – INSTITUTIONS PAGE

## Components

- [ ] Institution table
- [ ] Search
- [ ] Create form
- [ ] Edit form

---

## API Integration

- [ ] Full CRUD

---

# PHASE 16 – CONTRACTS PAGE

## Components

- [ ] Contract table
- [ ] Search
- [ ] Filters
- [ ] Pagination

---

## Forms

- [ ] Create contract
- [ ] Update contract

---

## API Integration

- [ ] Full CRUD

---

# PHASE 17 – PAYMENTS PAGE

## Components

- [ ] Payments table
- [ ] Status badges
- [ ] Mark paid button

---

## API Integration

- [ ] Get payments
- [ ] Update payment status

---

# PHASE 18 – ALERTS PAGE

## Components

- [ ] Alerts table
- [ ] Alert status badges
- [ ] Manual alert form

---

## API Integration

- [ ] Get alerts
- [ ] Create alert
- [ ] Mark sent

---

# PHASE 19 – TESTING

## Backend

- [ ] Test all APIs
- [ ] Test validations
- [ ] Test JWT security

---

## Frontend

- [ ] Test login
- [ ] Test dashboard
- [ ] Test contracts
- [ ] Test payments
- [ ] Test alerts

---

## Integration

- [ ] Verify end-to-end workflow

---

# PHASE 20 – DEPLOYMENT

## Database

- [ ] Deploy PostgreSQL on Supabase

---

## Backend

- [ ] Create Render service
- [ ] Connect GitHub
- [ ] Configure environment variables

```env
DATABASE_URL=
JWT_SECRET=
```

- [ ] Deploy backend

---

## Frontend

- [ ] Create Vercel project
- [ ] Connect GitHub

```env
VITE_API_URL=
```

- [ ] Deploy frontend

---

# PHASE 21 – FINAL REVIEW

## Functional Verification

- [ ] Authentication works
- [ ] Institution CRUD works
- [ ] Contract CRUD works
- [ ] Payment CRUD works
- [ ] Alert Engine works
- [ ] Dashboard works
- [ ] Reports work

---

## Documentation

- [ ] Update README
- [ ] Update API docs
- [ ] Verify architecture docs

---

## Internship Submission

- [ ] Push final code to GitHub
- [ ] Record demo video
- [ ] Prepare presentation
- [ ] Submit GitHub URL
- [ ] Submit deployed application URL

---

# Completion Criteria

The project is considered complete when:

- All modules are implemented
- Alert Engine generates alerts correctly
- Frontend and backend are deployed
- Documentation is complete
- Application is review-ready
