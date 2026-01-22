-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Businesses table
CREATE TABLE businesses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  business_type VARCHAR(100),
  base_currency VARCHAR(3) NOT NULL DEFAULT 'USD',
  fiscal_year_start_month INTEGER NOT NULL DEFAULT 1,
  fiscal_year_start_day INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Transaction categories table
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(20) NOT NULL CHECK (type IN ('income', 'expense')),
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(business_id, name, type)
);

-- Exchange rates table (for multi-currency support)
CREATE TABLE exchange_rates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  from_currency VARCHAR(3) NOT NULL,
  to_currency VARCHAR(3) NOT NULL,
  rate DECIMAL(18, 6) NOT NULL,
  date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(from_currency, to_currency, date)
);

-- Transactions table
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  amount DECIMAL(18, 2) NOT NULL,
  currency VARCHAR(3) NOT NULL,
  base_amount DECIMAL(18, 2) NOT NULL, -- Amount converted to base currency
  transaction_date DATE NOT NULL,
  payment_method VARCHAR(50) NOT NULL CHECK (payment_method IN ('cash', 'card', 'transfer', 'other')),
  client_vendor VARCHAR(255),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_transactions_business_id ON transactions(business_id);
CREATE INDEX idx_transactions_category_id ON transactions(category_id);
CREATE INDEX idx_transactions_date ON transactions(transaction_date);
CREATE INDEX idx_transactions_business_date ON transactions(business_id, transaction_date);
CREATE INDEX idx_categories_business_id ON categories(business_id);
CREATE INDEX idx_exchange_rates_currencies ON exchange_rates(from_currency, to_currency, date);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_businesses_updated_at BEFORE UPDATE ON businesses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Businesses: Users can only see their own business
CREATE POLICY "Users can view own business" ON businesses
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own business" ON businesses
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own business" ON businesses
  FOR UPDATE USING (auth.uid() = user_id);

-- Categories: Users can only see categories for their business
CREATE POLICY "Users can view own categories" ON categories
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM businesses
      WHERE businesses.id = categories.business_id
      AND businesses.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own categories" ON categories
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM businesses
      WHERE businesses.id = categories.business_id
      AND businesses.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own categories" ON categories
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM businesses
      WHERE businesses.id = categories.business_id
      AND businesses.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own categories" ON categories
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM businesses
      WHERE businesses.id = categories.business_id
      AND businesses.user_id = auth.uid()
    )
  );

-- Transactions: Users can only see transactions for their business
CREATE POLICY "Users can view own transactions" ON transactions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM businesses
      WHERE businesses.id = transactions.business_id
      AND businesses.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own transactions" ON transactions
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM businesses
      WHERE businesses.id = transactions.business_id
      AND businesses.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own transactions" ON transactions
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM businesses
      WHERE businesses.id = transactions.business_id
      AND businesses.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own transactions" ON transactions
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM businesses
      WHERE businesses.id = transactions.business_id
      AND businesses.user_id = auth.uid()
    )
  );

-- Insert default categories function
CREATE OR REPLACE FUNCTION create_default_categories(business_uuid UUID)
RETURNS void AS $$
BEGIN
  INSERT INTO categories (business_id, name, type, is_default) VALUES
    (business_uuid, 'Sales', 'income', true),
    (business_uuid, 'Cost of Goods Sold', 'expense', true),
    (business_uuid, 'Rent', 'expense', true),
    (business_uuid, 'Utilities', 'expense', true),
    (business_uuid, 'Marketing', 'expense', true),
    (business_uuid, 'Transportation', 'expense', true)
  ON CONFLICT (business_id, name, type) DO NOTHING;
END;
$$ LANGUAGE plpgsql;
