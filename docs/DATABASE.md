# Database Schema & Strategy

## Overview
This document outlines the PostgreSQL database schema for the School & College Transport Contract Management System. It is designed to run on **Supabase** (PostgreSQL 14+).

## Tables
1. **users**: System users with role-based access (`ADMIN`, `STAFF`, `VIEWER`).
2. **institutions**: Information about schools and colleges.
3. **contracts**: Core contract details linked to an institution.
4. **routes**: Transport routes associated with a specific contract. Includes JSONB columns for dynamic pickup/drop points.
5. **vehicles**: Fleet information linked to contracts, including insurance/fitness expiry.
6. **payments**: Billing and invoice records for each contract.
7. **alerts**: System-generated alerts for renewals, expiries, or payments.
8. **audit_logs**: Records critical actions performed on entities by users.

## Indexes & Performance
- Indexes are applied on all foreign keys (`institution_id`, `contract_id`, `user_id`).
- Specialized indexes on frequently searched columns (e.g., `email`, `role`, `status`, `insurance_expiry`, `due_date`, `alert_date`).
- A unique partial index handles deduplication of alerts.

## Constraints
- **Foreign Keys**: Configured with `ON DELETE CASCADE` where applicable to maintain referential integrity.
- **Check Constraints**: Data validation at the database level (e.g., `end_date > start_date`, `amount > 0`).

## Security
- While hosted on Supabase, the application primarily uses the Express backend (`pg` client) connected via `DATABASE_URL` instead of direct frontend Supabase JS client interactions.
- Access control is managed in the Node.js middleware layer, meaning Supabase Row-Level Security (RLS) is not required for standard operations, but can be enabled for defense-in-depth if necessary.

## Migrations
Initial schema is located in `database/DATABASE_SCHEMA.sql`. Future changes should be applied via numbered migration scripts in `database/migrations/`.
