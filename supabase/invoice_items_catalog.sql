-- Invoice catalog items table - predefined items/services that can be selected when creating invoices
CREATE TABLE invoice_catalog_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,

  -- Item Details
  name TEXT NOT NULL,
  description TEXT,
  unit_price DECIMAL(10, 2) NOT NULL,
  unit TEXT DEFAULT 'unit', -- unit, hour, day, piece, etc.
  
  -- Optional categorization
  category TEXT, -- service, product, consultation, etc.
  
  -- Settings
  is_active BOOLEAN DEFAULT true,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT unique_item_per_business UNIQUE(business_id, name)
);

CREATE INDEX idx_invoice_catalog_items_business_id ON invoice_catalog_items(business_id);
CREATE INDEX idx_invoice_catalog_items_user_id ON invoice_catalog_items(user_id);
CREATE INDEX idx_invoice_catalog_items_is_active ON invoice_catalog_items(is_active);

-- Enable RLS
ALTER TABLE invoice_catalog_items ENABLE ROW LEVEL SECURITY;

-- Policies for invoice_catalog_items
CREATE POLICY "Users can view their business catalog items"
  ON invoice_catalog_items FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create catalog items for their business"
  ON invoice_catalog_items FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their business catalog items"
  ON invoice_catalog_items FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their business catalog items"
  ON invoice_catalog_items FOR DELETE 
  USING (auth.uid() = user_id);

-- Update trigger
CREATE OR REPLACE FUNCTION update_invoice_catalog_items_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_invoice_catalog_items_updated_at
  BEFORE UPDATE ON invoice_catalog_items
  FOR EACH ROW
  EXECUTE FUNCTION update_invoice_catalog_items_updated_at();
