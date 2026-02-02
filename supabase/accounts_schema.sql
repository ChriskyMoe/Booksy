-- Create accounts table for double-entry bookkeeping
CREATE TABLE accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(20) NOT NULL CHECK (type IN ('asset', 'liability', 'equity', 'revenue', 'expense')),
  subtype VARCHAR(100),
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(business_id, name)
);

-- Journal entries table
CREATE TABLE journal_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  transaction_date DATE NOT NULL,
  description TEXT,
  reference_number VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Journal lines table
CREATE TABLE journal_lines (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  journal_entry_id UUID NOT NULL REFERENCES journal_entries(id) ON DELETE CASCADE,
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE RESTRICT,
  amount DECIMAL(18, 2) NOT NULL,
  type VARCHAR(10) NOT NULL CHECK (type IN ('debit', 'credit')),
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_accounts_business_id ON accounts(business_id);
CREATE INDEX idx_journal_entries_business_id ON journal_entries(business_id);
CREATE INDEX idx_journal_entries_date ON journal_entries(transaction_date);
CREATE INDEX idx_journal_lines_entry_id ON journal_lines(journal_entry_id);
CREATE INDEX idx_journal_lines_account_id ON journal_lines(account_id);

-- Triggers for updated_at
CREATE TRIGGER update_accounts_updated_at BEFORE UPDATE ON accounts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_journal_entries_updated_at BEFORE UPDATE ON journal_entries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RLS Policies
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE journal_lines ENABLE ROW LEVEL SECURITY;

-- Accounts policies
CREATE POLICY "Users can view own accounts" ON accounts
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM businesses
      WHERE businesses.id = accounts.business_id
      AND businesses.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own accounts" ON accounts
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM businesses
      WHERE businesses.id = accounts.business_id
      AND businesses.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own accounts" ON accounts
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM businesses
      WHERE businesses.id = accounts.business_id
      AND businesses.user_id = auth.uid()
    )
  );

-- Journal entries policies
CREATE POLICY "Users can view own journal_entries" ON journal_entries
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM businesses
      WHERE businesses.id = journal_entries.business_id
      AND businesses.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own journal_entries" ON journal_entries
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM businesses
      WHERE businesses.id = journal_entries.business_id
      AND businesses.user_id = auth.uid()
    )
  );

-- Journal lines policies
CREATE POLICY "Users can view own journal_lines" ON journal_lines
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM businesses b
      JOIN journal_entries je ON je.business_id = b.id
      WHERE je.id = journal_lines.journal_entry_id
      AND b.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own journal_lines" ON journal_lines
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM businesses b
      JOIN journal_entries je ON je.business_id = b.id
      WHERE je.id = journal_lines.journal_entry_id
      AND b.user_id = auth.uid()
    )
  );

-- Function to create default accounts
CREATE OR REPLACE FUNCTION create_default_accounts(business_uuid UUID)
RETURNS void AS $$
BEGIN
  INSERT INTO accounts (business_id, name, type, subtype) VALUES
    -- Assets
    (business_uuid, 'Cash', 'asset', 'current'),
    (business_uuid, 'Accounts Receivable', 'asset', 'current'),
    (business_uuid, 'Inventory', 'asset', 'current'),
    (business_uuid, 'Prepaid Expenses', 'asset', 'current'),
    (business_uuid, 'Equipment', 'asset', 'fixed'),
    (business_uuid, 'Accumulated Depreciation', 'asset', 'contra'),
    
    -- Liabilities
    (business_uuid, 'Accounts Payable', 'liability', 'current'),
    (business_uuid, 'Accrued Expenses', 'liability', 'current'),
    (business_uuid, 'Deferred Revenue', 'liability', 'current'),
    (business_uuid, 'Loans Payable', 'liability', 'long-term'),
    
    -- Equity
    (business_uuid, 'Owner''s Equity', 'equity', 'capital'),
    (business_uuid, 'Retained Earnings', 'equity', 'retained'),
    (business_uuid, 'Common Stock', 'equity', 'capital'),
    
    -- Revenue
    (business_uuid, 'Sales', 'revenue', 'operating'),
    (business_uuid, 'Service Revenue', 'revenue', 'operating'),
    (business_uuid, 'Interest Income', 'revenue', 'non-operating'),
    
    -- Expenses
    (business_uuid, 'Cost of Goods Sold', 'expense', 'cost'),
    (business_uuid, 'Rent Expense', 'expense', 'operating'),
    (business_uuid, 'Utilities Expense', 'expense', 'operating'),
    (business_uuid, 'Marketing Expense', 'expense', 'operating'),
    (business_uuid, 'Transportation Expense', 'expense', 'operating'),
    (business_uuid, 'Salaries Expense', 'expense', 'operating'),
    (business_uuid, 'Depreciation Expense', 'expense', 'operating')
  ON CONFLICT (business_id, name) DO NOTHING;
END;
$$ LANGUAGE plpgsql;
