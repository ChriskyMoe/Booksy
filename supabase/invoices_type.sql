-- Add invoice type (income/expense)
-- Run in Supabase SQL editor or via psql

ALTER TABLE invoices
  ADD COLUMN IF NOT EXISTS type TEXT NOT NULL DEFAULT 'income';

ALTER TABLE invoices
  ADD CONSTRAINT IF NOT EXISTS valid_invoice_type CHECK (type IN ('income', 'expense'));

CREATE INDEX IF NOT EXISTS idx_invoices_type ON invoices(type);
