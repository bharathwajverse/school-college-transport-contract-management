# Testing Infrastructure & Strategy

## Overview
This document describes the testing configuration, runner options, and instructions for the School & College Transport Contract Management System.

## Architecture

### Backend Tests
- **Framework**: [Jest](https://jestjs.io/)
- **Integration library**: [Supertest](https://github.com/ladjs/supertest)
- **Path**: `backend/tests/`
- **Setup**: Environment variable injection occurs in `backend/tests/setup.js` to ensure configurations fail-safe using test values. The database client pool is mocked in unit/integration tests that do not require full database isolation.

### Frontend Tests
- **Framework**: [Vitest](https://vitest.dev/)
- **Component helper**: [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- **Environment**: `jsdom`
- **Path**: `frontend/src/**/*.test.jsx`
- **Setup**: Setup configuration is set in `frontend/src/test/setup.js` (including setup for matchers like `jest-dom`).

---

## Commands

### Backend Commands

Run all tests:
```bash
npm run test --prefix backend
```

Run tests with coverage:
```bash
npm run test:coverage --prefix backend
```

### Frontend Commands

Run all tests:
```bash
npm run test --prefix frontend
```

Run tests with coverage:
```bash
npm run test:coverage --prefix frontend
```
