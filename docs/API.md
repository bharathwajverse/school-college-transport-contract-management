# API Documentation

## Base URL
All API requests should be prefixed with `/api` (e.g., `http://localhost:5000/api/auth/login`).

## Standard Response Structure

To ensure consistency across frontend consumption, all endpoints adhere to the following JSON structure:

### Success Response (2xx)
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {
    "id": "123",
    "name": "Example"
  }
}
```

### Error Response (4xx, 5xx)
```json
{
  "success": false,
  "message": "Invalid input provided",
  "error": {
    "details": "..."
  }
}
```

## Endpoints Summary

- **Auth** (`/api/auth`): Login, Register, Verify Session.
- **Institutions** (`/api/institutions`): CRUD operations for Schools and Colleges.
- **Contracts** (`/api/contracts`): Manage transport contracts and billing cycles.
- **Routes** (`/api/routes`): Define pickup and drop points linked to contracts.
- **Vehicles** (`/api/vehicles`): Manage fleet, capacities, and expiry dates.
- **Payments** (`/api/payments`): Invoices, dues, and payment statuses.
- **Alerts** (`/api/alerts`): Fetch notifications for renewals or expiries.
- **Dashboard** (`/api/dashboard`): Aggregate statistics for the main view.
- **Reports** (`/api/reports`): Exportable analytical data.

> [!NOTE]
> All endpoints requiring authentication must include the `Authorization` header: `Bearer <token>`.
