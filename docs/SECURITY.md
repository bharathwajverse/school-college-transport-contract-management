# Security Controls & Policy

This document describes the security controls and policies implemented in the School & College Transport Contract Management System.

---

## 🛡️ Implemented Security Controls

### 1. HTTP Security Headers (Helmet.js)
The backend uses **Helmet** to secure Express apps by setting various HTTP headers. This helps protect the app from web vulnerabilities like Cross-Site Scripting (XSS), Clickjacking, and packet sniffing.

### 2. Rate Limiting (express-rate-limit)
To prevent brute-force attacks on sensitive endpoints (e.g., authentication, registration) and basic Denial-of-Service (DDoS) attempts, a rate limiter is configured:
- Limit: 100 requests per 15 minutes per IP address.
- Applied globally on all `/api/` paths.

### 3. Input Sanitization
A custom sanitization middleware is active on all input request bodies (`req.body`):
- Recursively strips out HTML/XML tags.
- Removes malicious `javascript:` schemes to prevent XSS payloads from being stored in the PostgreSQL database.

### 4. Database Security & Injection Prevention
- **Parameterized SQL Queries**: All queries built via the `pg` client use parametrization (e.g., `$1, $2`). Raw input is never concatenated directly into SQL statements, neutralizing SQL Injection (SQLi).
- **SSL Connections**: The database connection string configures secure sockets (SSL) with rejectUnauthorized parameters in production environments.

### 5. Authentication & Token Management
- **Password Hashing**: User passwords are encrypted on register using **bcrypt** with a salt round factor of 10. Cleartext passwords are never stored.
- **JWT Authentication**: Secured endpoints are guarded by a JWT validation middleware. The JWT secret is loaded from environment variables and must be complex.

---

## 🔒 Security Best Practices for Development

1. **Never commit secrets**: Check that `.env` files are added to `.gitignore`. Keep `.env.example` templates clean of actual credentials.
2. **Minimize dependencies**: Frequently audit packages using `npm audit` to verify and resolve dependency security issues.
3. **Role-Based Access Control (RBAC)**: Ensure endpoints checking user permissions explicitly validate user roles (`ADMIN`, `STAFF`, `VIEWER`) in middleware layers before querying database entities.
