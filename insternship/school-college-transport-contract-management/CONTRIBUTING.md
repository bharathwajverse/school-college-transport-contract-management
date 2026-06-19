# Contributing

# CONTRIBUTING.md

# Contributing Guidelines

Thank you for contributing to the School & College Transport Contract Management System.

---

# Development Workflow

## Step 1

Create a feature branch.

```bash
git checkout -b feature/module-name
```

Examples:

```bash
git checkout -b feature/authentication

git checkout -b feature/contracts

git checkout -b feature/alert-engine
```

---

# Branch Strategy

```text
main

develop

feature/*
```

### Main

Production-ready code.

### Develop

Integration branch.

### Feature

Module-specific development.

---

# Commit Message Format

Use clear commit messages.

Examples:

```text
feat: add authentication module

feat: implement contracts CRUD

feat: add alert engine

fix: resolve payment status bug

docs: update API documentation
```

---

# Coding Standards

## Backend

* Use Express Router
* Use async/await
* Separate controllers and models
* Handle errors consistently

Example:

```javascript
try {
  // logic
} catch (error) {
  return res.status(500).json({
    success: false,
    message: "Server Error"
  });
}
```

---

## Frontend

* Functional components only
* Use hooks
* Reusable components
* Consistent naming

Example:

```jsx
function Dashboard() {
  return (
    <div>
      Dashboard
    </div>
  );
}
```

---

# Folder Naming

Use:

```text
camelCase
```

Examples:

```text
authController.js

contractModel.js

alertService.js
```

---

# Code Formatting

Recommended tools:

### ESLint

```bash
npm install eslint --save-dev
```

### Prettier

```bash
npm install prettier --save-dev
```

---

# Pull Request Guidelines

Before creating a PR:

* Ensure code builds successfully
* Ensure linting passes
* Ensure tests pass
* Update documentation if needed

PR checklist:

* [ ] Code reviewed
* [ ] Documentation updated
* [ ] No console errors
* [ ] API tested

---

# Bug Reports

When reporting bugs, include:

```text
Environment

Steps to Reproduce

Expected Result

Actual Result

Screenshots

Logs
```

---

# Feature Requests

Provide:

```text
Business Need

Expected Behavior

Affected Module

Acceptance Criteria
```

---

# Security

Never commit:

```text
.env

.env.local

database credentials

JWT secrets
```

Commit only:

```text
.env.example
```

---

# Testing Requirements

Minimum testing before merge:

* Authentication
* CRUD operations
* Alert generation
* Dashboard metrics
* Reports

---

# Documentation Updates

Any change affecting:

* Database schema
* APIs
* Business rules

must also update:

```text
PRD.md

API_SPECIFICATION.md

SYSTEM_DESIGN.md
```

---

# Definition of Done

A task is complete when:

* Code is implemented
* API is functional
* Tests pass
* Documentation updated
* Code merged into develop branch
