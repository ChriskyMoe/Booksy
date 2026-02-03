-- =====================================================
-- Demo Seed Data for Booksy (2026)
-- =====================================================
-- Comprehensive sample data for demonstration and testing purposes.
--
-- IMPORTANT: Replace these placeholders with your actual values:
-- 'test_user_id' → Your test user's UUID from auth.users
-- '550e8400-e29b-41d4-a716-446655440000' → Test business ID
--
-- =====================================================

-- =====================================================
-- STEP 1: INSERT BUSINESS
-- =====================================================
INSERT INTO businesses (
  id,
  user_id,
  name,
  business_type,
  base_currency,
  fiscal_year_start_month,
  fiscal_year_start_day
) VALUES (
  '3e3837f1-fadf-4c2d-bd02-195c9ed521ca'::uuid,
  '985db959-9506-4ff9-841a-b63130fb13ba'::uuid,
  'Tech Startup Inc',
  'Service-Based',
  'USD',
  1,
  1
);

-- =====================================================
-- STEP 2: INSERT CATEGORIES
-- =====================================================
-- Income Categories
INSERT INTO categories (business_id, name, type, is_default) VALUES
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca'::uuid, 'Sales', 'income', true),
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca'::uuid, 'Consulting Services', 'income', false),
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca'::uuid, 'Software Licenses', 'income', false);

-- Expense Categories
INSERT INTO categories (business_id, name, type, is_default) VALUES
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca'::uuid, 'Cost of Goods Sold', 'expense', true),
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca'::uuid, 'Rent', 'expense', true),
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca'::uuid, 'Utilities', 'expense', true),
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca'::uuid, 'Marketing', 'expense', false),
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca'::uuid, 'Transportation', 'expense', false),
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca'::uuid, 'Office Supplies', 'expense', false),
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca'::uuid, 'Software & Subscriptions', 'expense', false),
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca'::uuid, 'Professional Services', 'expense', false),
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca'::uuid, 'Equipment & Maintenance', 'expense', false);

-- =====================================================
-- STEP 3: INSERT EXCHANGE RATES
-- =====================================================
INSERT INTO exchange_rates (from_currency, to_currency, rate, date) VALUES
('USD', 'EUR', 0.92, '2026-02-01'),
('USD', 'GBP', 0.79, '2026-02-01'),
('USD', 'CAD', 1.37, '2026-02-01'),
('EUR', 'USD', 1.09, '2026-02-01'),
('GBP', 'USD', 1.27, '2026-02-01');

-- =====================================================
-- STEP 4: INSERT TRANSACTIONS (2025-2026)
-- =====================================================
-- Income Transactions
INSERT INTO transactions (
  business_id,
  category_id,
  amount,
  currency,
  base_amount,
  transaction_date,
  payment_method,
  client_vendor,
  notes
) VALUES
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca'::uuid, (SELECT id FROM categories WHERE business_id = '3e3837f1-fadf-4c2d-bd02-195c9ed521ca'::uuid AND name = 'Sales' LIMIT 1), 5000.00, 'USD', 5000.00, '2025-01-15', 'transfer', 'TechCorp LLC', 'Monthly software license'),
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca'::uuid, (SELECT id FROM categories WHERE business_id = '3e3837f1-fadf-4c2d-bd02-195c9ed521ca'::uuid AND name = 'Consulting Services' LIMIT 1), 3500.00, 'USD', 3500.00, '2025-01-20', 'transfer', 'Acme Industries', 'Q1 consulting retainer'),
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca'::uuid, (SELECT id FROM categories WHERE business_id = '3e3837f1-fadf-4c2d-bd02-195c9ed521ca'::uuid AND name = 'Sales' LIMIT 1), 6200.00, 'USD', 6200.00, '2025-02-14', 'card', 'StartupX', 'Software subscription'),
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca'::uuid, (SELECT id FROM categories WHERE business_id = '3e3837f1-fadf-4c2d-bd02-195c9ed521ca'::uuid AND name = 'Software Licenses' LIMIT 1), 2800.00, 'USD', 2800.00, '2025-02-28', 'transfer', 'CloudServices Co', 'API license fees'),
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca'::uuid, (SELECT id FROM categories WHERE business_id = '3e3837f1-fadf-4c2d-bd02-195c9ed521ca'::uuid AND name = 'Sales' LIMIT 1), 7500.00, 'USD', 7500.00, '2025-03-10', 'transfer', 'TechCorp LLC', 'Quarterly payment'),
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca'::uuid, (SELECT id FROM categories WHERE business_id = '3e3837f1-fadf-4c2d-bd02-195c9ed521ca'::uuid AND name = 'Consulting Services' LIMIT 1), 4200.00, 'USD', 4200.00, '2025-03-25', 'transfer', 'DataSys Inc', 'Implementation services'),
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca'::uuid, (SELECT id FROM categories WHERE business_id = '3e3837f1-fadf-4c2d-bd02-195c9ed521ca'::uuid AND name = 'Sales' LIMIT 1), 5500.00, 'USD', 5500.00, '2025-04-08', 'card', 'Acme Industries', 'Renewal payment'),
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca'::uuid, (SELECT id FROM categories WHERE business_id = '3e3837f1-fadf-4c2d-bd02-195c9ed521ca'::uuid AND name = 'Software Licenses' LIMIT 1), 3100.00, 'USD', 3100.00, '2025-04-20', 'transfer', 'NewClient Ltd', 'Enterprise license'),
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca'::uuid, (SELECT id FROM categories WHERE business_id = '3e3837f1-fadf-4c2d-bd02-195c9ed521ca'::uuid AND name = 'Consulting Services' LIMIT 1), 8000.00, 'USD', 8000.00, '2025-05-12', 'transfer', 'GlobalTech', 'Custom development'),
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca'::uuid, (SELECT id FROM categories WHERE business_id = '3e3837f1-fadf-4c2d-bd02-195c9ed521ca'::uuid AND name = 'Sales' LIMIT 1), 6800.00, 'USD', 6800.00, '2025-06-15', 'transfer', 'TechCorp LLC', 'Mid-year payment'),
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca'::uuid, (SELECT id FROM categories WHERE business_id = '3e3837f1-fadf-4c2d-bd02-195c9ed521ca'::uuid AND name = 'Consulting Services' LIMIT 1), 5500.00, 'USD', 5500.00, '2025-06-30', 'card', 'DataSys Inc', 'Support & maintenance'),
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca'::uuid, (SELECT id FROM categories WHERE business_id = '3e3837f1-fadf-4c2d-bd02-195c9ed521ca'::uuid AND name = 'Sales' LIMIT 1), 7200.00, 'USD', 7200.00, '2025-07-14', 'transfer', 'StartupX', 'Quarterly payment'),
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca'::uuid, (SELECT id FROM categories WHERE business_id = '3e3837f1-fadf-4c2d-bd02-195c9ed521ca'::uuid AND name = 'Software Licenses' LIMIT 1), 4000.00, 'USD', 4000.00, '2025-08-10', 'transfer', 'CloudServices Co', 'Extended license'),
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca'::uuid, (SELECT id FROM categories WHERE business_id = '3e3837f1-fadf-4c2d-bd02-195c9ed521ca'::uuid AND name = 'Consulting Services' LIMIT 1), 6500.00, 'USD', 6500.00, '2025-08-28', 'transfer', 'GlobalTech', 'Q3 consulting'),
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca'::uuid, (SELECT id FROM categories WHERE business_id = '3e3837f1-fadf-4c2d-bd02-195c9ed521ca'::uuid AND name = 'Sales' LIMIT 1), 8500.00, 'USD', 8500.00, '2025-09-05', 'transfer', 'Acme Industries', 'Premium tier'),
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca'::uuid, (SELECT id FROM categories WHERE business_id = '3e3837f1-fadf-4c2d-bd02-195c9ed521ca'::uuid AND name = 'Consulting Services' LIMIT 1), 7000.00, 'USD', 7000.00, '2025-10-12', 'transfer', 'DataSys Inc', 'Advanced training'),
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca'::uuid, (SELECT id FROM categories WHERE business_id = '3e3837f1-fadf-4c2d-bd02-195c9ed521ca'::uuid AND name = 'Sales' LIMIT 1), 6300.00, 'USD', 6300.00, '2025-10-25', 'card', 'NewClient Ltd', 'Annual renewal'),
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca'::uuid, (SELECT id FROM categories WHERE business_id = '3e3837f1-fadf-4c2d-bd02-195c9ed521ca'::uuid AND name = 'Software Licenses' LIMIT 1), 5200.00, 'USD', 5200.00, '2025-11-08', 'transfer', 'CloudServices Co', 'Premium licenses'),
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca'::uuid, (SELECT id FROM categories WHERE business_id = '3e3837f1-fadf-4c2d-bd02-195c9ed521ca'::uuid AND name = 'Sales' LIMIT 1), 9800.00, 'USD', 9800.00, '2025-12-15', 'transfer', 'TechCorp LLC', 'Year-end bonus'),
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca'::uuid, (SELECT id FROM categories WHERE business_id = '3e3837f1-fadf-4c2d-bd02-195c9ed521ca'::uuid AND name = 'Consulting Services' LIMIT 1), 8500.00, 'USD', 8500.00, '2025-12-20', 'transfer', 'GlobalTech', 'Holiday project'),
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca'::uuid, (SELECT id FROM categories WHERE business_id = '3e3837f1-fadf-4c2d-bd02-195c9ed521ca'::uuid AND name = 'Sales' LIMIT 1), 6500.00, 'USD', 6500.00, '2026-01-10', 'transfer', 'Acme Industries', 'January 2026'),
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca'::uuid, (SELECT id FROM categories WHERE business_id = '3e3837f1-fadf-4c2d-bd02-195c9ed521ca'::uuid AND name = 'Consulting Services' LIMIT 1), 4800.00, 'USD', 4800.00, '2026-01-25', 'transfer', 'DataSys Inc', 'Q1 2026 start'),
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca'::uuid, (SELECT id FROM categories WHERE business_id = '3e3837f1-fadf-4c2d-bd02-195c9ed521ca'::uuid AND name = 'Sales' LIMIT 1), 7100.00, 'USD', 7100.00, '2026-02-03', 'card', 'StartupX', 'February payment');

-- Expense Transactions
INSERT INTO transactions (
  business_id,
  category_id,
  amount,
  currency,
  base_amount,
  transaction_date,
  payment_method,
  client_vendor,
  notes
) VALUES
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca'::uuid, (SELECT id FROM categories WHERE business_id = '3e3837f1-fadf-4c2d-bd02-195c9ed521ca'::uuid AND name = 'Rent' LIMIT 1), 2000.00, 'USD', 2000.00, '2025-01-05', 'transfer', 'Downtown Properties', 'January rent'),
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca'::uuid, (SELECT id FROM categories WHERE business_id = '3e3837f1-fadf-4c2d-bd02-195c9ed521ca'::uuid AND name = 'Utilities' LIMIT 1), 350.00, 'USD', 350.00, '2025-01-10', 'card', 'City Utilities', 'Electricity & water'),
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca'::uuid, (SELECT id FROM categories WHERE business_id = '3e3837f1-fadf-4c2d-bd02-195c9ed521ca'::uuid AND name = 'Software & Subscriptions' LIMIT 1), 450.00, 'USD', 450.00, '2025-01-15', 'card', 'SaaS Provider', 'Monthly subscriptions'),
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca'::uuid, (SELECT id FROM categories WHERE business_id = '3e3837f1-fadf-4c2d-bd02-195c9ed521ca'::uuid AND name = 'Office Supplies' LIMIT 1), 180.00, 'USD', 180.00, '2025-01-20', 'card', 'Office Depot', 'Supplies & paper'),
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca'::uuid, (SELECT id FROM categories WHERE business_id = '3e3837f1-fadf-4c2d-bd02-195c9ed521ca'::uuid AND name = 'Rent' LIMIT 1), 2000.00, 'USD', 2000.00, '2025-02-05', 'transfer', 'Downtown Properties', 'February rent'),
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca'::uuid, (SELECT id FROM categories WHERE business_id = '3e3837f1-fadf-4c2d-bd02-195c9ed521ca'::uuid AND name = 'Marketing' LIMIT 1), 600.00, 'USD', 600.00, '2025-02-12', 'card', 'Digital Marketing Co', 'Social media ads'),
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca'::uuid, (SELECT id FROM categories WHERE business_id = '3e3837f1-fadf-4c2d-bd02-195c9ed521ca'::uuid AND name = 'Professional Services' LIMIT 1), 800.00, 'USD', 800.00, '2025-02-18', 'transfer', 'Accounting Firm', 'Bookkeeping services'),
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca'::uuid, (SELECT id FROM categories WHERE business_id = '3e3837f1-fadf-4c2d-bd02-195c9ed521ca'::uuid AND name = 'Rent' LIMIT 1), 2000.00, 'USD', 2000.00, '2025-03-05', 'transfer', 'Downtown Properties', 'March rent'),
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca'::uuid, (SELECT id FROM categories WHERE business_id = '3e3837f1-fadf-4c2d-bd02-195c9ed521ca'::uuid AND name = 'Equipment & Maintenance' LIMIT 1), 550.00, 'USD', 550.00, '2025-03-10', 'card', 'IT Services Co', 'Equipment maintenance'),
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca'::uuid, (SELECT id FROM categories WHERE business_id = '3e3837f1-fadf-4c2d-bd02-195c9ed521ca'::uuid AND name = 'Utilities' LIMIT 1), 380.00, 'USD', 380.00, '2025-03-15', 'card', 'City Utilities', 'Electricity & water'),
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca'::uuid, (SELECT id FROM categories WHERE business_id = '3e3837f1-fadf-4c2d-bd02-195c9ed521ca'::uuid AND name = 'Rent' LIMIT 1), 2000.00, 'USD', 2000.00, '2025-04-05', 'transfer', 'Downtown Properties', 'April rent'),
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca'::uuid, (SELECT id FROM categories WHERE business_id = '3e3837f1-fadf-4c2d-bd02-195c9ed521ca'::uuid AND name = 'Transportation' LIMIT 1), 250.00, 'USD', 250.00, '2025-04-08', 'card', 'Uber', 'Business travel'),
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca'::uuid, (SELECT id FROM categories WHERE business_id = '3e3837f1-fadf-4c2d-bd02-195c9ed521ca'::uuid AND name = 'Software & Subscriptions' LIMIT 1), 450.00, 'USD', 450.00, '2025-04-15', 'card', 'SaaS Provider', 'Monthly subscriptions'),
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca'::uuid, (SELECT id FROM categories WHERE business_id = '3e3837f1-fadf-4c2d-bd02-195c9ed521ca'::uuid AND name = 'Rent' LIMIT 1), 2000.00, 'USD', 2000.00, '2025-05-05', 'transfer', 'Downtown Properties', 'May rent'),
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca'::uuid, (SELECT id FROM categories WHERE business_id = '3e3837f1-fadf-4c2d-bd02-195c9ed521ca'::uuid AND name = 'Cost of Goods Sold' LIMIT 1), 1200.00, 'USD', 1200.00, '2025-05-12', 'transfer', 'Supplier Corp', 'Product inventory'),
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca'::uuid, (SELECT id FROM categories WHERE business_id = '3e3837f1-fadf-4c2d-bd02-195c9ed521ca'::uuid AND name = 'Rent' LIMIT 1), 2000.00, 'USD', 2000.00, '2025-06-05', 'transfer', 'Downtown Properties', 'June rent'),
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca'::uuid, (SELECT id FROM categories WHERE business_id = '3e3837f1-fadf-4c2d-bd02-195c9ed521ca'::uuid AND name = 'Marketing' LIMIT 1), 1000.00, 'USD', 1000.00, '2025-06-20', 'card', 'Digital Marketing Co', 'Campaign boost'),
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca'::uuid, (SELECT id FROM categories WHERE business_id = '3e3837f1-fadf-4c2d-bd02-195c9ed521ca'::uuid AND name = 'Utilities' LIMIT 1), 390.00, 'USD', 390.00, '2025-06-25', 'card', 'City Utilities', 'Electricity & water'),
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca'::uuid, (SELECT id FROM categories WHERE business_id = '3e3837f1-fadf-4c2d-bd02-195c9ed521ca'::uuid AND name = 'Rent' LIMIT 1), 2000.00, 'USD', 2000.00, '2025-07-05', 'transfer', 'Downtown Properties', 'July rent'),
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca'::uuid, (SELECT id FROM categories WHERE business_id = '3e3837f1-fadf-4c2d-bd02-195c9ed521ca'::uuid AND name = 'Office Supplies' LIMIT 1), 220.00, 'USD', 220.00, '2025-07-15', 'card', 'Office Depot', 'Paper & equipment'),
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca'::uuid, (SELECT id FROM categories WHERE business_id = '3e3837f1-fadf-4c2d-bd02-195c9ed521ca'::uuid AND name = 'Rent' LIMIT 1), 2000.00, 'USD', 2000.00, '2025-08-05', 'transfer', 'Downtown Properties', 'August rent'),
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca'::uuid, (SELECT id FROM categories WHERE business_id = '3e3837f1-fadf-4c2d-bd02-195c9ed521ca'::uuid AND name = 'Professional Services' LIMIT 1), 950.00, 'USD', 950.00, '2025-08-12', 'transfer', 'Legal Services LLC', 'Compliance review'),
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca'::uuid, (SELECT id FROM categories WHERE business_id = '3e3837f1-fadf-4c2d-bd02-195c9ed521ca'::uuid AND name = 'Rent' LIMIT 1), 2000.00, 'USD', 2000.00, '2025-09-05', 'transfer', 'Downtown Properties', 'September rent'),
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca'::uuid, (SELECT id FROM categories WHERE business_id = '3e3837f1-fadf-4c2d-bd02-195c9ed521ca'::uuid AND name = 'Equipment & Maintenance' LIMIT 1), 680.00, 'USD', 680.00, '2025-09-18', 'card', 'IT Services Co', 'Server upgrade'),
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca'::uuid, (SELECT id FROM categories WHERE business_id = '3e3837f1-fadf-4c2d-bd02-195c9ed521ca'::uuid AND name = 'Software & Subscriptions' LIMIT 1), 450.00, 'USD', 450.00, '2025-09-20', 'card', 'SaaS Provider', 'Monthly subscriptions'),
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca'::uuid, (SELECT id FROM categories WHERE business_id = '3e3837f1-fadf-4c2d-bd02-195c9ed521ca'::uuid AND name = 'Rent' LIMIT 1), 2000.00, 'USD', 2000.00, '2025-10-05', 'transfer', 'Downtown Properties', 'October rent'),
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca'::uuid, (SELECT id FROM categories WHERE business_id = '3e3837f1-fadf-4c2d-bd02-195c9ed521ca'::uuid AND name = 'Marketing' LIMIT 1), 750.00, 'USD', 750.00, '2025-10-14', 'card', 'Digital Marketing Co', 'Seasonal campaign'),
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca'::uuid, (SELECT id FROM categories WHERE business_id = '3e3837f1-fadf-4c2d-bd02-195c9ed521ca'::uuid AND name = 'Utilities' LIMIT 1), 370.00, 'USD', 370.00, '2025-10-20', 'card', 'City Utilities', 'Electricity & water'),
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca'::uuid, (SELECT id FROM categories WHERE business_id = '3e3837f1-fadf-4c2d-bd02-195c9ed521ca'::uuid AND name = 'Rent' LIMIT 1), 2000.00, 'USD', 2000.00, '2025-11-05', 'transfer', 'Downtown Properties', 'November rent'),
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca'::uuid, (SELECT id FROM categories WHERE business_id = '3e3837f1-fadf-4c2d-bd02-195c9ed521ca'::uuid AND name = 'Cost of Goods Sold' LIMIT 1), 1500.00, 'USD', 1500.00, '2025-11-10', 'transfer', 'Supplier Corp', 'Holiday inventory'),
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca'::uuid, (SELECT id FROM categories WHERE business_id = '3e3837f1-fadf-4c2d-bd02-195c9ed521ca'::uuid AND name = 'Office Supplies' LIMIT 1), 320.00, 'USD', 320.00, '2025-11-15', 'card', 'Office Depot', 'Year-end supplies'),
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca'::uuid, (SELECT id FROM categories WHERE business_id = '3e3837f1-fadf-4c2d-bd02-195c9ed521ca'::uuid AND name = 'Rent' LIMIT 1), 2000.00, 'USD', 2000.00, '2025-12-05', 'transfer', 'Downtown Properties', 'December rent'),
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca'::uuid, (SELECT id FROM categories WHERE business_id = '3e3837f1-fadf-4c2d-bd02-195c9ed521ca'::uuid AND name = 'Professional Services' LIMIT 1), 1200.00, 'USD', 1200.00, '2025-12-10', 'transfer', 'Accounting Firm', 'Year-end audit'),
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca'::uuid, (SELECT id FROM categories WHERE business_id = '3e3837f1-fadf-4c2d-bd02-195c9ed521ca'::uuid AND name = 'Rent' LIMIT 1), 2000.00, 'USD', 2000.00, '2026-01-05', 'transfer', 'Downtown Properties', 'January 2026 rent'),
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca'::uuid, (SELECT id FROM categories WHERE business_id = '3e3837f1-fadf-4c2d-bd02-195c9ed521ca'::uuid AND name = 'Utilities' LIMIT 1), 360.00, 'USD', 360.00, '2026-01-15', 'card', 'City Utilities', 'Electricity & water'),
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca'::uuid, (SELECT id FROM categories WHERE business_id = '3e3837f1-fadf-4c2d-bd02-195c9ed521ca'::uuid AND name = 'Software & Subscriptions' LIMIT 1), 450.00, 'USD', 450.00, '2026-01-20', 'card', 'SaaS Provider', 'Monthly subscriptions'),
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca'::uuid, (SELECT id FROM categories WHERE business_id = '3e3837f1-fadf-4c2d-bd02-195c9ed521ca'::uuid AND name = 'Rent' LIMIT 1), 2000.00, 'USD', 2000.00, '2026-02-05', 'transfer', 'Downtown Properties', 'February 2026 rent'),
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca'::uuid, (SELECT id FROM categories WHERE business_id = '3e3837f1-fadf-4c2d-bd02-195c9ed521ca'::uuid AND name = 'Marketing' LIMIT 1), 500.00, 'USD', 500.00, '2026-02-03', 'card', 'Digital Marketing Co', 'Monthly campaign');

-- =====================================================
-- STEP 5: INSERT INVOICE CATALOG ITEMS
-- =====================================================
INSERT INTO invoice_catalog_items (
  business_id,
  user_id,
  name,
  description,
  unit_price,
  unit,
  category,
  is_active
) VALUES
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca'::uuid, '985db959-9506-4ff9-841a-b63130fb13ba'::uuid, 'Software Development', 'Custom software development services', 5000.00, 'project', 'service', true),
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca'::uuid, '985db959-9506-4ff9-841a-b63130fb13ba'::uuid, 'Technical Consulting', 'Expert technical consultation and advisory', 150.00, 'hour', 'service', true),
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca'::uuid, '985db959-9506-4ff9-841a-b63130fb13ba'::uuid, 'Maintenance & Support', 'Monthly software maintenance and support', 800.00, 'month', 'service', true),
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca'::uuid, '985db959-9506-4ff9-841a-b63130fb13ba'::uuid, 'API License', 'Monthly API access license', 500.00, 'month', 'license', true),
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca'::uuid, '985db959-9506-4ff9-841a-b63130fb13ba'::uuid, 'Cloud Infrastructure', 'Cloud server and infrastructure setup', 1200.00, 'month', 'service', true),
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca'::uuid, '985db959-9506-4ff9-841a-b63130fb13ba'::uuid, 'Training Session', 'Client staff training and onboarding', 100.00, 'hour', 'service', true);

-- =====================================================
-- STEP 6: INSERT INVOICES
-- =====================================================
INSERT INTO invoices (
  user_id,
  business_id,
  invoice_number,
  title,
  description,
  issue_date,
  due_date,
  client_name,
  client_email,
  client_phone,
  client_address,
  subtotal,
  tax_amount,
  tax_rate,
  total_amount,
  currency,
  status,
  payment_status,
  notes,
  terms
) VALUES
('985db959-9506-4ff9-841a-b63130fb13ba'::uuid, '3e3837f1-fadf-4c2d-bd02-195c9ed521ca'::uuid, 'INV-2026-001', 'Invoice', 'Development Services Invoice', '2026-01-15'::date, '2026-02-15'::date, 'TechCorp LLC', 'contact@techcorp.com', '(555) 123-4567', '123 Tech Avenue, San Francisco, CA 94105', 5000.00, 500.00, 10.00, 5500.00, 'USD', 'sent', 'unpaid', 'Q1 2026 custom development project', 'Net 30 days'),
('985db959-9506-4ff9-841a-b63130fb13ba'::uuid, '3e3837f1-fadf-4c2d-bd02-195c9ed521ca'::uuid, 'INV-2026-002', 'Invoice', 'Consulting Services', '2026-02-01'::date, '2026-03-01'::date, 'DataSys Inc', 'billing@datasys.com', '(555) 987-6543', '456 Data Street, Boston, MA 02101', 4800.00, 480.00, 10.00, 5280.00, 'USD', 'draft', 'unpaid', 'February consulting services', 'Net 30 days'),
('985db959-9506-4ff9-841a-b63130fb13ba'::uuid, '3e3837f1-fadf-4c2d-bd02-195c9ed521ca'::uuid, 'INV-2025-048', 'Invoice', 'December Services Invoice', '2025-12-15'::date, '2026-01-15'::date, 'GlobalTech Partners', 'ap@globaltech.com', '(555) 246-8135', '789 Global Way, New York, NY 10001', 8000.00, 800.00, 10.00, 8800.00, 'USD', 'paid', 'paid', 'Year-end project completion bonus', 'Net 30 days'),
('985db959-9506-4ff9-841a-b63130fb13ba'::uuid, '3e3837f1-fadf-4c2d-bd02-195c9ed521ca'::uuid, 'INV-2025-045', 'Invoice', 'November Services', '2025-11-20'::date, '2025-12-20'::date, 'Acme Industries', 'accounts@acme.com', '(555) 111-2222', '321 Main Street, Chicago, IL 60601', 6300.00, 630.00, 10.00, 6930.00, 'USD', 'overdue', 'unpaid', 'November consulting and support', 'Net 30 days');

-- =====================================================
-- STEP 7: INSERT INVOICE PAYMENTS
-- =====================================================
INSERT INTO invoice_payments (
  invoice_id,
  amount,
  payment_date,
  payment_method,
  notes
) VALUES
((SELECT id FROM invoices WHERE invoice_number = 'INV-2025-048' LIMIT 1), 8800.00, '2026-01-10'::date, 'bank_transfer', 'Full payment received from GlobalTech Partners');

-- =====================================================
-- STEP 8: INSERT AI ANALYSIS HISTORY (Optional)
-- =====================================================
INSERT INTO ai_analysis_history (
  business_id,
  period_start,
  period_end,
  analysis_text,
  financial_snapshot
) VALUES
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca'::uuid, '2026-01-01'::date, '2026-01-31'::date, 
  'January 2026 showed strong income growth with $18,400 in total revenue across three income streams. Operating expenses remained stable at $6,180 for the month. The business maintained healthy profit margins with consistent consulting revenue.',
  '{"total_income": 18400, "total_expenses": 6180, "net_profit": 12220, "largest_expense_category": "Rent", "largest_income_category": "Sales"}'::jsonb
),
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca'::uuid, '2025-12-01'::date, '2025-12-31'::date,
  'December 2025 was the strongest month of the year with record revenue of $18,300. Year-end bonuses from major clients contributed significantly. Operating expenses were slightly elevated at $4,200 due to professional services. The business finished the year with strong momentum.',
  '{"total_income": 18300, "total_expenses": 4200, "net_profit": 14100, "largest_expense_category": "Professional Services", "largest_income_category": "Sales"}'::jsonb
);

-- =====================================================
-- SETUP NOTES AND USAGE INSTRUCTIONS
-- =====================================================
--
-- BEFORE RUNNING THIS SCRIPT:
-- 1. Replace 'test_user_id' with your actual test user UUID
--    You can get this from auth.users table
-- 2. The business ID is: 550e8400-e29b-41d4-a716-446655440000
--    Keep this for reference when testing
--
-- DATA SUMMARY:
-- - 1 Business: Tech Startup Inc
-- - 9 Categories (3 income, 6 expense)
-- - 5 Exchange rates for multi-currency support
-- - 37 Transactions spanning 2025-2026
-- - 6 Invoice catalog items (reusable line items)
-- - 4 Sample invoices with various statuses:
--   * INV-2026-001: SENT (unpaid)
--   * INV-2026-002: DRAFT (unpaid)
--   * INV-2025-048: PAID
--   * INV-2025-045: OVERDUE (unpaid)
-- - 1 Invoice payment record
-- - 2 AI analysis history records
--
-- The data represents realistic financial activity for a
-- small tech services business across 14 months (2025-2026).
