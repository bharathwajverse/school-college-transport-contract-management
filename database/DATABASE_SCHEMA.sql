-- =====================================================
-- School & College Transport Contract Management System
-- PostgreSQL 14+
-- Database Schema
-- =====================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('ADMIN', 'STAFF', 'VIEWER')),
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

CREATE TABLE IF NOT EXISTS institutions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_name VARCHAR(255) NOT NULL,
    institution_type VARCHAR(50) NOT NULL CHECK (institution_type IN ('SCHOOL', 'COLLEGE')),
    contact_person VARCHAR(150) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    status VARCHAR(20) DEFAULT 'ACTIVE',
    created_by UUID,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_institution_name ON institutions(institution_name);
CREATE INDEX IF NOT EXISTS idx_institution_status ON institutions(status);

CREATE TABLE IF NOT EXISTS contracts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id UUID,
    contract_number VARCHAR(100) NOT NULL UNIQUE,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    renewal_date DATE NOT NULL,
    billing_cycle VARCHAR(20) NOT NULL CHECK (billing_cycle IN ('MONTHLY', 'QUARTERLY', 'HALF_YEARLY', 'YEARLY')),
    contract_value NUMERIC(12,2) NOT NULL,
    status VARCHAR(30) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'PENDING_RENEWAL', 'EXPIRED', 'TERMINATED')),
    notes TEXT,
    created_by UUID,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CHECK (end_date > start_date),
    CHECK (renewal_date <= end_date),
    CHECK (contract_value > 0)
);

CREATE INDEX IF NOT EXISTS idx_contract_institution ON contracts(institution_id);
CREATE INDEX IF NOT EXISTS idx_contract_status ON contracts(status);
CREATE INDEX IF NOT EXISTS idx_contract_end_date ON contracts(end_date);
CREATE INDEX IF NOT EXISTS idx_contract_renewal_date ON contracts(renewal_date);

CREATE TABLE IF NOT EXISTS routes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contract_id UUID NOT NULL,
    route_name VARCHAR(255) NOT NULL,
    pickup_points JSONB NOT NULL,
    drop_points JSONB NOT NULL,
    distance_km NUMERIC(8,2) NOT NULL,
    route_status VARCHAR(20) DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_route_contract ON routes(contract_id);
CREATE INDEX IF NOT EXISTS idx_route_name ON routes(route_name);

CREATE TABLE IF NOT EXISTS vehicles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contract_id UUID NOT NULL,
    vehicle_number VARCHAR(50) UNIQUE NOT NULL,
    vehicle_type VARCHAR(50) NOT NULL,
    capacity INTEGER NOT NULL CHECK (capacity > 0),
    insurance_expiry DATE NOT NULL,
    fitness_expiry DATE,
    status VARCHAR(20) DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_vehicle_contract ON vehicles(contract_id);
CREATE INDEX IF NOT EXISTS idx_vehicle_insurance ON vehicles(insurance_expiry);

CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contract_id UUID NOT NULL,
    invoice_number VARCHAR(100) UNIQUE NOT NULL,
    billing_period_start DATE NOT NULL,
    billing_period_end DATE NOT NULL,
    amount NUMERIC(12,2) NOT NULL CHECK (amount > 0),
    due_date DATE NOT NULL,
    payment_date DATE,
    payment_status VARCHAR(20) DEFAULT 'UNPAID' CHECK (payment_status IN ('UNPAID', 'PAID', 'OVERDUE')),
    remarks TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_payment_contract ON payments(contract_id);
CREATE INDEX IF NOT EXISTS idx_payment_status ON payments(payment_status);
CREATE INDEX IF NOT EXISTS idx_payment_due_date ON payments(due_date);

CREATE TABLE IF NOT EXISTS alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contract_id UUID NOT NULL,
    alert_type VARCHAR(50) NOT NULL CHECK (alert_type IN ('RENEWAL', 'EXPIRY', 'PAYMENT_DUE', 'INSURANCE_EXPIRY')),
    alert_date DATE NOT NULL,
    message TEXT NOT NULL,
    is_sent BOOLEAN DEFAULT FALSE,
    sent_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_alert_contract ON alerts(contract_id);
CREATE INDEX IF NOT EXISTS idx_alert_date ON alerts(alert_date);
CREATE INDEX IF NOT EXISTS idx_alert_sent ON alerts(is_sent);
CREATE UNIQUE INDEX IF NOT EXISTS idx_alert_dedupe ON alerts(contract_id, alert_type, alert_date, message);

CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID NOT NULL,
    action VARCHAR(50) NOT NULL,
    old_value JSONB,
    new_value JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_audit_user ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_entity ON audit_logs(entity_type, entity_id);

ALTER TABLE institutions
ADD CONSTRAINT fk_institution_created_by
FOREIGN KEY (created_by)
REFERENCES users(id);

ALTER TABLE contracts
ADD CONSTRAINT fk_contract_institution
FOREIGN KEY (institution_id)
REFERENCES institutions(id)
ON DELETE CASCADE;

ALTER TABLE contracts
ADD CONSTRAINT fk_contract_created_by
FOREIGN KEY (created_by)
REFERENCES users(id);

ALTER TABLE routes
ADD CONSTRAINT fk_route_contract
FOREIGN KEY (contract_id)
REFERENCES contracts(id)
ON DELETE CASCADE;

ALTER TABLE vehicles
ADD CONSTRAINT fk_vehicle_contract
FOREIGN KEY (contract_id)
REFERENCES contracts(id)
ON DELETE CASCADE;

ALTER TABLE payments
ADD CONSTRAINT fk_payment_contract
FOREIGN KEY (contract_id)
REFERENCES contracts(id)
ON DELETE CASCADE;

ALTER TABLE alerts
ADD CONSTRAINT fk_alert_contract
FOREIGN KEY (contract_id)
REFERENCES contracts(id)
ON DELETE CASCADE;

ALTER TABLE audit_logs
ADD CONSTRAINT fk_audit_user
FOREIGN KEY (user_id)
REFERENCES users(id);

CREATE OR REPLACE VIEW active_contracts AS
SELECT *
FROM contracts
WHERE status = 'ACTIVE';

CREATE OR REPLACE VIEW overdue_payments AS
SELECT *
FROM payments
WHERE payment_status = 'OVERDUE';

CREATE OR REPLACE VIEW upcoming_renewals AS
SELECT *
FROM contracts
WHERE renewal_date <= CURRENT_DATE + INTERVAL '30 days';

