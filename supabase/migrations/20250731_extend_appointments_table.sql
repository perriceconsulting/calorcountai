-- 20250731_extend_appointments_table.sql
-- Extend appointments table with comprehensive health appointment management fields
ALTER TABLE appointments
  ADD COLUMN IF NOT EXISTS specialty TEXT,
  ADD COLUMN IF NOT EXISTS practice_name TEXT,
  ADD COLUMN IF NOT EXISTS contact_email TEXT,
  ADD COLUMN IF NOT EXISTS location_type TEXT DEFAULT 'in_person',
  ADD COLUMN IF NOT EXISTS visit_reason TEXT,
  ADD COLUMN IF NOT EXISTS duration INTERVAL,
  ADD COLUMN IF NOT EXISTS previous_appointment_id UUID REFERENCES appointments(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS next_appointment_id UUID REFERENCES appointments(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS insurance_provider TEXT,
  ADD COLUMN IF NOT EXISTS insurance_policy_number TEXT,
  ADD COLUMN IF NOT EXISTS coverage_details JSONB,
  ADD COLUMN IF NOT EXISTS copay DECIMAL(8,2),
  ADD COLUMN IF NOT EXISTS deductible DECIMAL(8,2),
  ADD COLUMN IF NOT EXISTS claim_status TEXT,
  ADD COLUMN IF NOT EXISTS invoice_url TEXT,
  ADD COLUMN IF NOT EXISTS reminder_settings JSONB;
