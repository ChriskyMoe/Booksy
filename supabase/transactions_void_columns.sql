-- Run this migration to support void (reverse) instead of delete.
-- Adds: journal_entry_id (link to ledger), status (posted | void).
--
-- From project root: psql $DATABASE_URL -f supabase/transactions_void_columns.sql
-- Or run in Supabase SQL Editor.

ALTER TABLE transactions
  ADD COLUMN IF NOT EXISTS journal_entry_id UUID REFERENCES journal_entries(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS status VARCHAR(20) NOT NULL DEFAULT 'posted';

CREATE INDEX IF NOT EXISTS idx_transactions_journal_entry_id ON transactions(journal_entry_id);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);

COMMENT ON COLUMN transactions.journal_entry_id IS 'Links to ledger (journal_entries) so voiding updates both.';
COMMENT ON COLUMN transactions.status IS 'posted = active, void = reversed (shows as voided in list and ledger).';
