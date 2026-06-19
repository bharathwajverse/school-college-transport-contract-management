# Contributing Guidelines

Thank you for contributing to the School & College Transport Contract Management System. Please follow these guidelines to keep code quality consistent across the repository.

---

## 🛠️ Development Workflow

### 1. Branch Strategy
- `main`: Production-ready, stable releases.
- `develop`: Integration branch where features are combined.
- `feature/*`: Specific module features (e.g. `feature/alerts`, `feature/payments`).

### 2. Steps to Submit a Feature
1. Create a feature branch off `develop`:
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/amazing-feature
   ```
2. Implement your changes.
3. Validate code locally:
   - Run tests: `npm test` inside both `frontend/` and `backend/`.
   - Run linter: `npm run lint`.
4. Push to GitHub and create a Pull Request against `develop`.

---

## 📝 Coding Standards

### Backend
- Use Express Router files for modular path groupings.
- Use `asyncHandler` wrappers to trap middleware errors cleanly.
- Enforce Joi/Joi schemas for environment and parameter schema checks.
- Log errors using `logger.error` rather than raw console dumps.

### Frontend
- Create functional React components.
- Use hooks (`useState`, `useEffect`, custom contexts) for reactivity.
- Wrap pages in the lazy loading routing layout.
- Ensure elements are responsive and test status transitions.

---

## 📋 Definition of Done
A contribution is considered complete when:
- Features pass local and pipeline checks (Vercel builds and local tests).
- Written documentation (API/DATABASE/README) is updated to reflect additions.
- The branch merges into `develop` cleanly.
