# API Specification

# School & College Transport Contract Management System

# API Specification

Version: 1.0

Base URL (Development)

http://localhost:5000/api

Base URL (Production)

https://your-render-app.onrender.com/api

---

# Authentication

Authentication Method:

Bearer JWT Token

Example:

Authorization: Bearer <JWT_TOKEN>

---

# Standard Response Format

## Success

```json
{
  "success": true,
  "data": {}
}
```

## Error

```json
{
  "success": false,
  "message": "Error message"
}
```

---

# AUTH MODULE

## Register User

### POST

```http
/api/auth/register
```

### Request

```json
{
  "full_name": "Admin User",
  "email": "admin@example.com",
  "password": "Password123",
  "role": "ADMIN"
}
```

### Success Response

```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "full_name": "Admin User",
    "email": "admin@example.com",
    "role": "ADMIN"
  }
}
```

### Status Codes

| Code | Description |
|--------|--------|
| 201 | Created |
| 400 | Validation Error |
| 500 | Server Error |

---

## Login

### POST

```http
/api/auth/login
```

### Request

```json
{
  "email": "admin@example.com",
  "password": "Password123"
}
```

### Success Response

```json
{
  "success": true,
  "token": "JWT_TOKEN",
  "user": {
    "id": "uuid",
    "full_name": "Admin User",
    "role": "ADMIN"
  }
}
```

### Status Codes

| Code | Description |
|--------|--------|
| 200 | Success |
| 401 | Invalid Credentials |

---

# INSTITUTIONS MODULE

## Create Institution

### POST

```http
/api/institutions
```

### Authentication

Required

### Request

```json
{
  "institution_name": "ABC School",
  "institution_type": "SCHOOL",
  "contact_person": "John Doe",
  "phone": "9876543210",
  "email": "abc@school.com",
  "address": "Main Road",
  "city": "Hyderabad",
  "state": "Telangana"
}
```

### Response

```json
{
  "success": true,
  "data": {
    "id": "uuid"
  }
}
```

---

## Get Institutions

### GET

```http
/api/institutions
```

### Query Parameters

```text
?page=1
&limit=10
&search=school
```

### Response

```json
{
  "success": true,
  "data": []
}
```

---

## Get Institution By ID

### GET

```http
/api/institutions/:id
```

---

## Update Institution

### PUT

```http
/api/institutions/:id
```

### Request

```json
{
  "institution_name": "Updated School"
}
```

---

## Delete Institution

### DELETE

```http
/api/institutions/:id
```

---

# CONTRACTS MODULE

## Create Contract

### POST

```http
/api/contracts
```

### Request

```json
{
  "institution_id": "uuid",
  "contract_number": "CNT-001",
  "start_date": "2026-01-01",
  "end_date": "2027-01-01",
  "renewal_date": "2026-12-01",
  "billing_cycle": "MONTHLY",
  "contract_value": 250000,
  "status": "ACTIVE",
  "notes": "Annual Contract"
}
```

### Response

```json
{
  "success": true,
  "data": {
    "id": "uuid"
  }
}
```

---

## Get Contracts

### GET

```http
/api/contracts
```

### Query Parameters

```text
?page=1
&limit=10
&status=ACTIVE
&search=CNT
```

---

## Get Contract By ID

### GET

```http
/api/contracts/:id
```

---

## Update Contract

### PUT

```http
/api/contracts/:id
```

---

## Delete Contract

### DELETE

```http
/api/contracts/:id
```

---

# ROUTES MODULE

## Create Route

### POST

```http
/api/routes
```

### Request

```json
{
  "contract_id": "uuid",
  "route_name": "Route A",
  "pickup_points": [
    "Point A",
    "Point B"
  ],
  "drop_points": [
    "School Campus"
  ],
  "distance_km": 12.5
}
```

---

## Get Routes

### GET

```http
/api/routes
```

---

## Get Route

### GET

```http
/api/routes/:id
```

---

## Update Route

### PUT

```http
/api/routes/:id
```

---

## Delete Route

### DELETE

```http
/api/routes/:id
```

---

# VEHICLES MODULE

## Create Vehicle

### POST

```http
/api/vehicles
```

### Request

```json
{
  "contract_id": "uuid",
  "vehicle_number": "TS09AB1234",
  "vehicle_type": "BUS",
  "capacity": 45,
  "insurance_expiry": "2027-01-01",
  "fitness_expiry": "2027-01-01"
}
```

---

## Get Vehicles

### GET

```http
/api/vehicles
```

---

## Get Vehicle

### GET

```http
/api/vehicles/:id
```

---

## Update Vehicle

### PUT

```http
/api/vehicles/:id
```

---

## Delete Vehicle

### DELETE

```http
/api/vehicles/:id
```

---

# PAYMENTS MODULE

## Create Payment

### POST

```http
/api/payments
```

### Request

```json
{
  "contract_id": "uuid",
  "invoice_number": "INV-1001",
  "billing_period_start": "2026-01-01",
  "billing_period_end": "2026-01-31",
  "amount": 25000,
  "due_date": "2026-02-05"
}
```

---

## Get Payments

### GET

```http
/api/payments
```

---

## Get Payment

### GET

```http
/api/payments/:id
```

---

## Update Payment

### PUT

```http
/api/payments/:id
```

---

## Delete Payment

### DELETE

```http
/api/payments/:id
```

---

## Mark Payment Paid

### PATCH

```http
/api/payments/:id/status
```

### Request

```json
{
  "payment_status": "PAID"
}
```

### Response

```json
{
  "success": true
}
```

---

# ALERTS MODULE

## Get Alerts

### GET

```http
/api/alerts
```

### Query Parameters

```text
?status=pending
```

---

## Get Upcoming Alerts

### GET

```http
/api/alerts/upcoming
```

---

## Create Manual Alert

### POST

```http
/api/alerts/manual
```

### Request

```json
{
  "contract_id": "uuid",
  "alert_type": "RENEWAL",
  "message": "Renewal Reminder"
}
```

---

## Mark Alert Sent

### PATCH

```http
/api/alerts/:id/sent
```

### Response

```json
{
  "success": true
}
```

---

# DASHBOARD MODULE

## Dashboard Summary

### GET

```http
/api/dashboard/summary
```

### Response

```json
{
  "active_contracts": 50,
  "pending_renewals": 12,
  "overdue_payments": 5,
  "upcoming_alerts": 9,
  "total_revenue": 4500000
}
```

---

## Dashboard Revenue Chart

### GET

```http
/api/dashboard/revenue-chart
```

### Response

```json
[
  {
    "month": "Jan",
    "revenue": 50000
  },
  {
    "month": "Feb",
    "revenue": 75000
  }
]
```

---

# REPORTS MODULE

## Revenue Trend Report

### GET

```http
/api/reports/revenue-trend
```

### Response

```json
[
  {
    "month": "2026-01",
    "revenue": 500000
  }
]
```

---

## Contract Status Report

### GET

```http
/api/reports/contract-status
```

### Response

```json
[
  {
    "status": "ACTIVE",
    "count": 25
  },
  {
    "status": "EXPIRED",
    "count": 5
  }
]
```

---

## Export Report CSV

### GET

```http
/api/reports/export?type=csv
```

### Response

```text
CSV FILE
```

---

## Export Report PDF

### GET

```http
/api/reports/export?type=pdf
```

### Response

```text
PDF FILE
```

---

# AUDIT LOGS MODULE

## Get Audit Logs

### GET

```http
/api/audit-logs
```

### Authentication

ADMIN ONLY

### Response

```json
[
  {
    "id": "uuid",
    "entity_type": "CONTRACT",
    "action": "UPDATE",
    "user_id": "uuid",
    "created_at": "timestamp"
  }
]
```

---

# ALERT ENGINE INTERNAL ENDPOINTS

## Trigger Alert Scan

### POST

```http
/api/system/run-alert-engine
```

### ADMIN ONLY

### Purpose

Manual execution of alert scheduler.

---

# Error Codes

| Code | Meaning |
|--------|--------|
| 200 | Success |
| 201 | Created |
| 400 | Validation Error |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict |
| 422 | Business Rule Violation |
| 500 | Internal Server Error |

---

# Business Rule Validation

## Contracts

```text
End Date > Start Date
Renewal Date <= End Date
Contract Value > 0
```

## Payments

```text
UNPAID
PAID
OVERDUE
```

## Roles

```text
ADMIN
STAFF
VIEWER
```

## Contract Status

```text
ACTIVE
PENDING_RENEWAL
EXPIRED
TERMINATED
```

---

# API Versioning Strategy

Current Version:

```text
v1
```

Future Format:

```http
/api/v1/contracts
/api/v2/contracts
```

---

# Security Requirements

All endpoints except:

```text
POST /auth/register
POST /auth/login
```

require:

```http
Authorization: Bearer JWT_TOKEN
```