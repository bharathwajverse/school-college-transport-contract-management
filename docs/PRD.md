# Product Requirements Document

# PRD.md

# School & College Transport Contract Management System

## Product Requirements Document (PRD)

**Project Name:** School & College Transport Contract Management System
**Client:** Manivtha Tours & Travels
**Version:** 1.0
**Prepared By:** Development Team
**Technology Stack:** React + Node.js + PostgreSQL
**Deployment:** Vercel + Render + Supabase

---

# 1. Executive Summary

Manivtha Tours & Travels manages long-term transportation contracts with schools and colleges. Currently, contract information, billing cycles, renewal schedules, payments, and operational records are managed manually through spreadsheets, phone calls, emails, and informal communication channels.

This project aims to provide a centralized digital platform that enables efficient management of transport contracts, institutions, routes, vehicles, payments, renewals, and alerts.

The system's primary business value is proactive contract management through automated expiry tracking and renewal alert generation.

---

# 2. Problem Statement

The organization currently faces several operational challenges:

* Contract information is scattered across multiple sources.
* Renewal dates may be missed.
* Payment tracking is manual.
* There is no centralized reporting system.
* Contract status visibility is limited.
* Revenue forecasting is difficult.
* Expiry alerts are not automated.

These challenges increase operational risk and can lead to revenue loss.

---

# 3. Product Vision

Create a secure, centralized, web-based contract management platform that allows Manivtha Tours & Travels to manage all institutional transport contracts while proactively monitoring renewals, payments, and operational activities.

---

# 4. Project Objectives

## Primary Objectives

1. Digitize transport contract management.
2. Centralize institution and contract records.
3. Automate renewal tracking.
4. Automate expiry alerts.
5. Improve payment visibility.
6. Provide actionable management reports.
7. Enable role-based access control.

---

# 5. Success Criteria

| Objective           | Success Criteria                          |
| ------------------- | ----------------------------------------- |
| Contract Management | All contracts stored digitally            |
| Renewal Monitoring  | 100% expiry alerts generated              |
| Payment Tracking    | Overdue payments automatically identified |
| Reporting           | Reports generated on demand               |
| Security            | JWT authentication implemented            |
| Deployment          | System accessible online                  |

---

# 6. User Personas

## Admin

### Responsibilities

* System administration
* User management
* Contract management
* Payment management
* Reporting

### Permissions

* Full access to all modules

---

## Staff

### Responsibilities

* Daily operations
* Contract updates
* Payment tracking
* Institution management

### Permissions

* Create
* Update
* View

### Restrictions

* No user management
* No audit log administration

---

## Viewer

### Responsibilities

* Monitoring

### Permissions

* Read-only access

---

# 7. Functional Requirements

---

## Module A – Authentication

### FR-A1

The system shall allow users to log in using email and password.

### FR-A2

The system shall validate credentials before granting access.

### FR-A3

The system shall issue JWT tokens after successful login.

### FR-A4

The system shall support role-based access control.

### FR-A5

The system shall protect all secured endpoints.

---

## Module B – Institution Management

### FR-B1

The system shall allow authorized users to create institutions.

### FR-B2

The system shall store:

* Institution Name
* Institution Type
* Contact Person
* Phone
* Email
* Address
* City
* State

### FR-B3

The system shall allow institution updates.

### FR-B4

The system shall allow institution deletion.

### FR-B5

The system shall allow institution search and filtering.

---

## Module C – Contract Management

### FR-C1

The system shall allow creation of transport contracts.

### FR-C2

The system shall associate contracts with institutions.

### FR-C3

The system shall store:

* Contract Number
* Start Date
* End Date
* Renewal Date
* Billing Cycle
* Contract Value
* Status
* Notes

### FR-C4

The system shall allow contract modification.

### FR-C5

The system shall allow contract search and filtering.

### FR-C6

The system shall allow contract deletion.

---

## Module D – Route Management

### FR-D1

The system shall allow routes to be assigned to contracts.

### FR-D2

The system shall store:

* Route Name
* Pickup Points
* Drop Points
* Distance

### FR-D3

The system shall support route CRUD operations.

---

## Module E – Vehicle Management

### FR-E1

The system shall allow vehicles to be assigned to contracts.

### FR-E2

The system shall store:

* Vehicle Number
* Vehicle Type
* Capacity
* Insurance Expiry
* Fitness Expiry

### FR-E3

The system shall support vehicle CRUD operations.

---

## Module F – Payment Management

### FR-F1

The system shall allow creation of payment records.

### FR-F2

The system shall store:

* Invoice Number
* Amount
* Due Date
* Payment Date
* Status

### FR-F3

The system shall allow payments to be marked as paid.

### FR-F4

The system shall automatically identify overdue payments.

### FR-F5

The system shall support payment search and filtering.

---

## Module G – Alert Engine

### FR-G1

The system shall generate renewal alerts automatically.

### FR-G2

The system shall generate contract expiry alerts automatically.

### FR-G3

The system shall generate overdue payment alerts automatically.

### FR-G4

The system shall allow manual alert creation.

### FR-G5

The system shall maintain alert history.

### FR-G6

The system shall display upcoming alerts on the dashboard.

---

## Module H – Dashboard

### FR-H1

The dashboard shall display active contract count.

### FR-H2

The dashboard shall display pending renewals.

### FR-H3

The dashboard shall display overdue payments.

### FR-H4

The dashboard shall display upcoming alerts.

### FR-H5

The dashboard shall display revenue analytics.

---

## Module I – Reports

### FR-I1

The system shall generate revenue reports.

### FR-I2

The system shall generate contract status reports.

### FR-I3

The system shall support CSV export.

### FR-I4

The system shall support PDF export.

---

## Module J – Audit Logs

### FR-J1

The system shall record create operations.

### FR-J2

The system shall record update operations.

### FR-J3

The system shall record delete operations.

### FR-J4

The system shall store user activity history.

---

# 8. Non-Functional Requirements

## Performance

* Dashboard response < 3 seconds
* CRUD operations < 2 seconds
* API response time < 1 second for standard queries

---

## Security

* JWT authentication
* Password hashing using bcrypt
* Environment variable management
* Protected API endpoints

---

## Reliability

* Daily alert scheduler execution
* Data consistency through foreign keys
* Automatic error logging

---

## Scalability

* PostgreSQL-based relational architecture
* Modular REST API design
* Component-based React architecture

---

## Usability

* Responsive web interface
* Consistent navigation
* Minimal learning curve

---

# 9. Business Rules

## Contract Rules

1. End Date > Start Date
2. Renewal Date <= End Date
3. Contract Value > 0

---

## Payment Rules

1. Default Status = UNPAID
2. Paid payments become PAID
3. Expired unpaid invoices become OVERDUE

---

## Alert Rules

Generate alerts:

* 90 days before expiry
* 60 days before expiry
* 30 days before expiry
* 15 days before expiry
* 7 days before expiry

---

## Scheduler Rules

* Alert Engine runs every day at 09:00 AM

---

# 10. Success Metrics (KPIs)

| KPI                        | Target |
| -------------------------- | ------ |
| Contracts Digitized        | 100%   |
| Renewal Alert Accuracy     | 100%   |
| Dashboard Availability     | 99%    |
| Login Success Rate         | >99%   |
| Payment Detection Accuracy | 100%   |
| Report Generation Success  | 100%   |

---

# 11. Assumptions

* Internet access is available.
* Contract information is accurate.
* Institution data is maintained by staff.
* Users have appropriate permissions.

---

# 12. Out of Scope

The following features are excluded:

* GPS vehicle tracking
* Driver management
* Student attendance management
* Mobile applications
* Payment gateway integration
* SMS integration
* Route optimization algorithms
* AI forecasting systems

---

# 13. Risks & Mitigations

| Risk                | Mitigation                 |
| ------------------- | -------------------------- |
| Missed renewals     | Automated alerts           |
| Unauthorized access | JWT + RBAC                 |
| Data corruption     | Constraints + Foreign Keys |
| Deployment issues   | Staging testing            |
| Human error         | Validation rules           |

---

# 14. Release Scope (MVP)

The MVP includes:

* Authentication
* Institution Management
* Contract Management
* Route Management
* Vehicle Management
* Payment Tracking
* Alert Engine
* Dashboard
* Reports
* Audit Logs

---

# 15. Future Enhancements

Potential future improvements:

* Mobile application
* SMS notifications
* Email notifications
* Driver management
* GPS integration
* Predictive analytics
* Advanced reporting
* Multi-company support

---

# 16. Traceability Matrix

| Business Need          | Module     |
| ---------------------- | ---------- |
| Contract Tracking      | Contracts  |
| Renewal Management     | Alerts     |
| Payment Visibility     | Payments   |
| Revenue Reporting      | Reports    |
| Operational Monitoring | Dashboard  |
| Accountability         | Audit Logs |

---

# 17. Development Phases

Phase 1 – Project Setup

Phase 2 – Authentication

Phase 3 – Institution Management

Phase 4 – Contract Management

Phase 5 – Routes & Vehicles

Phase 6 – Payments

Phase 7 – Alert Engine

Phase 8 – Dashboard & Reports

Phase 9 – Audit Logs

Phase 10 – Testing

Phase 11 – Deployment

---

# 18. Core Differentiator

The system's primary differentiator is the **Expiry Tracking & Alert Trigger Engine**, which proactively identifies:

* Upcoming renewals
* Contract expirations
* Overdue payments

This feature directly addresses the business problem and provides the highest operational value to Manivtha Tours & Travels.
