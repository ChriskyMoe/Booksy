-- Demo Seed Data for Transactions and Invoices (2023-2026)
-- This file contains sample data for demonstration purposes

-- IMPORTANT: Before running this script, replace the following placeholders with your actual values:
-- 'user_id' → Your test user's ID
-- '3e3837f1-fadf-4c2d-bd02-195c9ed521ca' → Your test business's ID

-- STEP 1: INSERT CATEGORIES FIRST
-- Insert Income Categories
INSERT INTO categories (business_id, name, type, is_default) VALUES
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca', 'Services Revenue', 'income', true);

-- Insert Expense Categories
INSERT INTO categories (business_id, name, type, is_default) VALUES
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca', 'Rent & Facilities', 'expense', true),
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca', 'Cloud Services', 'expense', false),
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca', 'Software & Subscriptions', 'expense', false),
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca', 'Office Supplies', 'expense', false),
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca', 'Utilities & Internet', 'expense', false),
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca', 'Maintenance & Repairs', 'expense', false),
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca', 'Professional Services', 'expense', false),
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca', 'Marketing & Advertising', 'expense', false),
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca', 'Training & Development', 'expense', false);

-- After inserting categories, get their IDs and replace the placeholders below:
-- Income: '90446c73-0119-42ab-a8a5-ffb7a259a16c'
-- Expense: '44cd538b-aa0c-496c-9f4a-8fb80f68d6d1', '4f007757-440d-4b86-9273-aeeb960e293e', '72269dc3-5fb9-4490-918c-78bb8375ca16', '35104290-2153-49c5-b9c4-96a49330cd5b', '4f2cc6ea-e5f1-4cbf-ad81-192bafff0b91', 'e73810c2-e04c-4fdc-9529-5b20ced9d271', '716594a5-e630-46b7-8ce8-78df06ad2514', 'c61dee1d-27c5-469c-b545-a8fb217984ac', 'a040132b-fde9-4f25-bdc6-d57cccc6e017'

-- STEP 2: TRANSACTIONS DATA (2023-2026, Monthly entries)
-- Replace category placeholders with actual category IDs from step 1

-- Sample Income Transactions - January 2023 to December 2026
INSERT INTO transactions (business_id, category_id, amount, currency, base_amount, transaction_date, payment_method, client_vendor, notes) VALUES
-- 2023 Income (use Services Revenue category)
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca', '90446c73-0119-42ab-a8a5-ffb7a259a16c', 5000.00, 'USD', 5000.00, '2023-01-15', 'transfer', 'Client A', 'Monthly service payment'),
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca', '90446c73-0119-42ab-a8a5-ffb7a259a16c', 5500.00, 'USD', 5500.00, '2023-02-15', 'transfer', 'Client B', 'Consulting services'),
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca', '90446c73-0119-42ab-a8a5-ffb7a259a16c', 6000.00, 'USD', 6000.00, '2023-03-15', 'card', 'Client A', 'Project completion'),
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca', '90446c73-0119-42ab-a8a5-ffb7a259a16c', 5200.00, 'USD', 5200.00, '2023-04-20', 'transfer', 'Client C', 'Monthly retainer'),
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca', '90446c73-0119-42ab-a8a5-ffb7a259a16c', 7500.00, 'USD', 7500.00, '2023-05-10', 'transfer', 'Client D', 'Large project payment'),
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca', '90446c73-0119-42ab-a8a5-ffb7a259a16c', 5800.00, 'USD', 5800.00, '2023-06-15', 'card', 'Client A', 'Services rendered'),
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca', '90446c73-0119-42ab-a8a5-ffb7a259a16c', 6200.00, 'USD', 6200.00, '2023-07-12', 'transfer', 'Client B', 'Quarterly payment'),
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca', '90446c73-0119-42ab-a8a5-ffb7a259a16c', 5900.00, 'USD', 5900.00, '2023-08-15', 'transfer', 'Client C', 'Support services'),
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca', '90446c73-0119-42ab-a8a5-ffb7a259a16c', 8000.00, 'USD', 8000.00, '2023-09-18', 'transfer', 'Client E', 'Major contract'),
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca', '90446c73-0119-42ab-a8a5-ffb7a259a16c', 6100.00, 'USD', 6100.00, '2023-10-14', 'card', 'Client A', 'October invoice'),
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca', '90446c73-0119-42ab-a8a5-ffb7a259a16c', 5500.00, 'USD', 5500.00, '2023-11-20', 'transfer', 'Client B', 'Year-end payment'),
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca', '90446c73-0119-42ab-a8a5-ffb7a259a16c', 7200.00, 'USD', 7200.00, '2023-12-15', 'transfer', 'Client D', 'Holiday bonus'),

-- 2024 Income
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca', '90446c73-0119-42ab-a8a5-ffb7a259a16c', 5800.00, 'USD', 5800.00, '2024-01-15', 'transfer', 'Client A', 'Q1 2024 payment'),
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca', '90446c73-0119-42ab-a8a5-ffb7a259a16c', 6200.00, 'USD', 6200.00, '2024-02-14', 'transfer', 'Client B', 'February income'),
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca', '90446c73-0119-42ab-a8a5-ffb7a259a16c', 5900.00, 'USD', 5900.00, '2024-03-18', 'card', 'Client C', 'Spring revenue'),
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca', '90446c73-0119-42ab-a8a5-ffb7a259a16c', 7000.00, 'USD', 7000.00, '2024-04-12', 'transfer', 'Client F', 'New client contract'),
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca', '90446c73-0119-42ab-a8a5-ffb7a259a16c', 6500.00, 'USD', 6500.00, '2024-05-20', 'transfer', 'Client A', 'May income'),
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca', '90446c73-0119-42ab-a8a5-ffb7a259a16c', 6800.00, 'USD', 6800.00, '2024-06-15', 'transfer', 'Client B', 'H1 2024 total'),
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca', '90446c73-0119-42ab-a8a5-ffb7a259a16c', 5900.00, 'USD', 5900.00, '2024-07-16', 'card', 'Client D', 'Summer project'),
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca', '90446c73-0119-42ab-a8a5-ffb7a259a16c', 6300.00, 'USD', 6300.00, '2024-08-19', 'transfer', 'Client E', 'August payment'),
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca', '90446c73-0119-42ab-a8a5-ffb7a259a16c', 8500.00, 'USD', 8500.00, '2024-09-10', 'transfer', 'Client C', 'Q3 bonus'),
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca', '90446c73-0119-42ab-a8a5-ffb7a259a16c', 6200.00, 'USD', 6200.00, '2024-10-22', 'transfer', 'Client A', 'October revenue'),
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca', '90446c73-0119-42ab-a8a5-ffb7a259a16c', 7100.00, 'USD', 7100.00, '2024-11-14', 'card', 'Client B', 'November income'),
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca', '90446c73-0119-42ab-a8a5-ffb7a259a16c', 8900.00, 'USD', 8900.00, '2024-12-20', 'transfer', 'Client F', 'Year-end bonus'),

-- 2025 Income
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca', '90446c73-0119-42ab-a8a5-ffb7a259a16c', 6500.00, 'USD', 6500.00, '2025-01-16', 'transfer', 'Client A', 'January 2025'),
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca', '90446c73-0119-42ab-a8a5-ffb7a259a16c', 6800.00, 'USD', 6800.00, '2025-02-15', 'transfer', 'Client B', 'February 2025'),
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca', '90446c73-0119-42ab-a8a5-ffb7a259a16c', 7200.00, 'USD', 7200.00, '2025-03-18', 'card', 'Client C', 'March income'),
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca', '90446c73-0119-42ab-a8a5-ffb7a259a16c', 6900.00, 'USD', 6900.00, '2025-04-20', 'transfer', 'Client D', 'Q2 2025 start'),
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca', '90446c73-0119-42ab-a8a5-ffb7a259a16c', 7500.00, 'USD', 7500.00, '2025-05-14', 'transfer', 'Client A', 'May 2025'),
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca', '90446c73-0119-42ab-a8a5-ffb7a259a16c', 7100.00, 'USD', 7100.00, '2025-06-19', 'transfer', 'Client E', 'H1 completion'),
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca', '90446c73-0119-42ab-a8a5-ffb7a259a16c', 6800.00, 'USD', 6800.00, '2025-07-15', 'card', 'Client B', 'July 2025'),
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca', '90446c73-0119-42ab-a8a5-ffb7a259a16c', 7400.00, 'USD', 7400.00, '2025-08-18', 'transfer', 'Client C', 'August 2025'),
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca', '90446c73-0119-42ab-a8a5-ffb7a259a16c', 9000.00, 'USD', 9000.00, '2025-09-12', 'transfer', 'Client F', 'Q3 peak'),
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca', '90446c73-0119-42ab-a8a5-ffb7a259a16c', 7200.00, 'USD', 7200.00, '2025-10-16', 'transfer', 'Client A', 'October 2025'),
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca', '90446c73-0119-42ab-a8a5-ffb7a259a16c', 7600.00, 'USD', 7600.00, '2025-11-20', 'card', 'Client D', 'November 2025'),
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca', '90446c73-0119-42ab-a8a5-ffb7a259a16c', 9500.00, 'USD', 9500.00, '2025-12-18', 'transfer', 'Client E', 'Year-end 2025'),

-- 2026 Income (Jan-Dec as per current date Feb 2026)
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca', '90446c73-0119-42ab-a8a5-ffb7a259a16c', 7000.00, 'USD', 7000.00, '2026-01-15', 'transfer', 'Client A', 'January 2026');

-- Sample Expense Transactions - January 2023 to December 2026
INSERT INTO transactions (business_id, category_id, amount, currency, base_amount, transaction_date, payment_method, client_vendor, notes) VALUES
-- 2023 Expenses
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca', '35104290-2153-49c5-b9c4-96a49330cd5b', 500.00, 'USD', 500.00, '2023-01-05', 'card', 'Office Supplies Co', 'Supplies'),
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca', '4f007757-440d-4b86-9273-aeeb960e293e', 1200.00, 'USD', 1200.00, '2023-01-10', 'transfer', 'Cloud Provider', 'Monthly subscription'),
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca', '72269dc3-5fb9-4490-918c-78bb8375ca16', 800.00, 'USD', 800.00, '2023-02-08', 'card', 'Software Tools', 'License renewal'),
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca', '44cd538b-aa0c-496c-9f4a-8fb80f68d6d1', 1500.00, 'USD', 1500.00, '2023-02-15', 'transfer', 'Office Rent', 'February rent'),
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca', '4f2cc6ea-e5f1-4cbf-ad81-192bafff0b91', 600.00, 'USD', 600.00, '2023-03-12', 'card', 'Utilities', 'Electric bill'),
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca', '44cd538b-aa0c-496c-9f4a-8fb80f68d6d1', 1500.00, 'USD', 1500.00, '2023-03-15', 'transfer', 'Office Rent', 'March rent'),
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca', '35104290-2153-49c5-b9c4-96a49330cd5b', 450.00, 'USD', 450.00, '2023-04-05', 'card', 'Office Supplies Co', 'Stationery'),
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca', '44cd538b-aa0c-496c-9f4a-8fb80f68d6d1', 1500.00, 'USD', 1500.00, '2023-04-15', 'transfer', 'Office Rent', 'April rent'),
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca', '4f007757-440d-4b86-9273-aeeb960e293e', 1200.00, 'USD', 1200.00, '2023-04-20', 'transfer', 'Cloud Provider', 'Subscription'),
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca', '4f2cc6ea-e5f1-4cbf-ad81-192bafff0b91', 800.00, 'USD', 800.00, '2023-05-10', 'card', 'Internet Provider', 'Monthly internet'),
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca', '44cd538b-aa0c-496c-9f4a-8fb80f68d6d1', 1500.00, 'USD', 1500.00, '2023-05-15', 'transfer', 'Office Rent', 'May rent'),
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca', 'e73810c2-e04c-4fdc-9529-5b20ced9d271', 700.00, 'USD', 700.00, '2023-06-08', 'card', 'Office Maintenance', 'Cleaning service'),
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca', '44cd538b-aa0c-496c-9f4a-8fb80f68d6d1', 1500.00, 'USD', 1500.00, '2023-06-15', 'transfer', 'Office Rent', 'June rent'),
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca', '4f007757-440d-4b86-9273-aeeb960e293e', 1200.00, 'USD', 1200.00, '2023-06-20', 'transfer', 'Cloud Provider', 'Subscription'),
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca', '35104290-2153-49c5-b9c4-96a49330cd5b', 550.00, 'USD', 550.00, '2023-07-12', 'card', 'Office Supplies Co', 'Equipment'),
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca', '44cd538b-aa0c-496c-9f4a-8fb80f68d6d1', 1500.00, 'USD', 1500.00, '2023-07-15', 'transfer', 'Office Rent', 'July rent'),
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca', '716594a5-e630-46b7-8ce8-78df06ad2514', 900.00, 'USD', 900.00, '2023-08-06', 'card', 'Professional Services', 'Consulting'),
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca', '44cd538b-aa0c-496c-9f4a-8fb80f68d6d1', 1500.00, 'USD', 1500.00, '2023-08-15', 'transfer', 'Office Rent', 'August rent'),
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca', '4f007757-440d-4b86-9273-aeeb960e293e', 1200.00, 'USD', 1200.00, '2023-08-20', 'transfer', 'Cloud Provider', 'Subscription'),
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca', 'c61dee1d-27c5-469c-b545-a8fb217984ac', 1200.00, 'USD', 1200.00, '2023-09-05', 'card', 'Marketing Services', 'Advertising'),
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca', '44cd538b-aa0c-496c-9f4a-8fb80f68d6d1', 1500.00, 'USD', 1500.00, '2023-09-15', 'transfer', 'Office Rent', 'September rent'),
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca', '35104290-2153-49c5-b9c4-96a49330cd5b', 650.00, 'USD', 650.00, '2023-10-08', 'card', 'Office Supplies Co', 'Supplies'),
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca', '44cd538b-aa0c-496c-9f4a-8fb80f68d6d1', 1500.00, 'USD', 1500.00, '2023-10-15', 'transfer', 'Office Rent', 'October rent'),
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca', '4f007757-440d-4b86-9273-aeeb960e293e', 1200.00, 'USD', 1200.00, '2023-10-20', 'transfer', 'Cloud Provider', 'Subscription'),
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca', 'a040132b-fde9-4f25-bdc6-d57cccc6e017', 750.00, 'USD', 750.00, '2023-11-10', 'card', 'Training Services', 'Staff training'),
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca', '44cd538b-aa0c-496c-9f4a-8fb80f68d6d1', 1500.00, 'USD', 1500.00, '2023-11-15', 'transfer', 'Office Rent', 'November rent'),
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca', '44cd538b-aa0c-496c-9f4a-8fb80f68d6d1', 1500.00, 'USD', 1500.00, '2023-12-15', 'transfer', 'Office Rent', 'December rent'),
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca', '4f007757-440d-4b86-9273-aeeb960e293e', 1200.00, 'USD', 1200.00, '2023-12-20', 'transfer', 'Cloud Provider', 'Annual subscription'),

-- 2024 Expenses
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca', '35104290-2153-49c5-b9c4-96a49330cd5b', 600.00, 'USD', 600.00, '2024-01-08', 'card', 'Office Supplies Co', 'Q1 supplies'),
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca', '44cd538b-aa0c-496c-9f4a-8fb80f68d6d1', 1500.00, 'USD', 1500.00, '2024-01-15', 'transfer', 'Office Rent', 'January 2024'),
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca', '4f007757-440d-4b86-9273-aeeb960e293e', 1200.00, 'USD', 1200.00, '2024-01-20', 'transfer', 'Cloud Provider', 'Subscription'),
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca', '4f2cc6ea-e5f1-4cbf-ad81-192bafff0b91', 900.00, 'USD', 900.00, '2024-02-10', 'card', 'Internet Provider', 'February internet'),
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca', '44cd538b-aa0c-496c-9f4a-8fb80f68d6d1', 1500.00, 'USD', 1500.00, '2024-02-15', 'transfer', 'Office Rent', 'February rent'),
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca', '716594a5-e630-46b7-8ce8-78df06ad2514', 1100.00, 'USD', 1100.00, '2024-03-05', 'card', 'Professional Services', 'Audit'),
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca', '44cd538b-aa0c-496c-9f4a-8fb80f68d6d1', 1500.00, 'USD', 1500.00, '2024-03-15', 'transfer', 'Office Rent', 'March rent'),
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca', '4f007757-440d-4b86-9273-aeeb960e293e', 1200.00, 'USD', 1200.00, '2024-03-20', 'transfer', 'Cloud Provider', 'Subscription'),
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca', 'e73810c2-e04c-4fdc-9529-5b20ced9d271', 700.00, 'USD', 700.00, '2024-04-08', 'card', 'Office Maintenance', 'Repairs'),
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca', '44cd538b-aa0c-496c-9f4a-8fb80f68d6d1', 1500.00, 'USD', 1500.00, '2024-04-15', 'transfer', 'Office Rent', 'April rent'),
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca', 'c61dee1d-27c5-469c-b545-a8fb217984ac', 850.00, 'USD', 850.00, '2024-05-12', 'card', 'Marketing Services', 'Campaign'),
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca', '44cd538b-aa0c-496c-9f4a-8fb80f68d6d1', 1500.00, 'USD', 1500.00, '2024-05-15', 'transfer', 'Office Rent', 'May rent'),
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca', '4f007757-440d-4b86-9273-aeeb960e293e', 1200.00, 'USD', 1200.00, '2024-05-20', 'transfer', 'Cloud Provider', 'Subscription'),
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca', '35104290-2153-49c5-b9c4-96a49330cd5b', 600.00, 'USD', 600.00, '2024-06-09', 'card', 'Office Supplies Co', 'Equipment'),
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca', '44cd538b-aa0c-496c-9f4a-8fb80f68d6d1', 1500.00, 'USD', 1500.00, '2024-06-15', 'transfer', 'Office Rent', 'June rent'),
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca', '72269dc3-5fb9-4490-918c-78bb8375ca16', 950.00, 'USD', 950.00, '2024-07-14', 'card', 'Software Tools', 'License'),
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca', '44cd538b-aa0c-496c-9f4a-8fb80f68d6d1', 1500.00, 'USD', 1500.00, '2024-07-15', 'transfer', 'Office Rent', 'July rent'),
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca', '4f007757-440d-4b86-9273-aeeb960e293e', 1200.00, 'USD', 1200.00, '2024-07-20', 'transfer', 'Cloud Provider', 'Subscription'),
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca', 'a040132b-fde9-4f25-bdc6-d57cccc6e017', 1300.00, 'USD', 1300.00, '2024-08-10', 'card', 'Training Services', 'Staff development'),
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca', '44cd538b-aa0c-496c-9f4a-8fb80f68d6d1', 1500.00, 'USD', 1500.00, '2024-08-15', 'transfer', 'Office Rent', 'August rent'),
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca', 'e73810c2-e04c-4fdc-9529-5b20ced9d271', 700.00, 'USD', 700.00, '2024-09-08', 'card', 'Office Maintenance', 'Cleaning'),
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca', '44cd538b-aa0c-496c-9f4a-8fb80f68d6d1', 1500.00, 'USD', 1500.00, '2024-09-15', 'transfer', 'Office Rent', 'September rent'),
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca', '4f007757-440d-4b86-9273-aeeb960e293e', 1200.00, 'USD', 1200.00, '2024-09-20', 'transfer', 'Cloud Provider', 'Subscription'),
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca', '35104290-2153-49c5-b9c4-96a49330cd5b', 550.00, 'USD', 550.00, '2024-10-11', 'card', 'Office Supplies Co', 'Supplies'),
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca', '44cd538b-aa0c-496c-9f4a-8fb80f68d6d1', 1500.00, 'USD', 1500.00, '2024-10-15', 'transfer', 'Office Rent', 'October rent'),
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca', '716594a5-e630-46b7-8ce8-78df06ad2514', 1150.00, 'USD', 1150.00, '2024-11-09', 'card', 'Professional Services', 'Consulting'),
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca', '44cd538b-aa0c-496c-9f4a-8fb80f68d6d1', 1500.00, 'USD', 1500.00, '2024-11-15', 'transfer', 'Office Rent', 'November rent'),
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca', '44cd538b-aa0c-496c-9f4a-8fb80f68d6d1', 1500.00, 'USD', 1500.00, '2024-12-15', 'transfer', 'Office Rent', 'December rent'),
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca', '4f007757-440d-4b86-9273-aeeb960e293e', 1200.00, 'USD', 1200.00, '2024-12-20', 'transfer', 'Cloud Provider', 'Annual renewal'),

-- 2025 Expenses
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca', '35104290-2153-49c5-b9c4-96a49330cd5b', 650.00, 'USD', 650.00, '2025-01-10', 'card', 'Office Supplies Co', 'Q1 supplies'),
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca', '44cd538b-aa0c-496c-9f4a-8fb80f68d6d1', 1500.00, 'USD', 1500.00, '2025-01-15', 'transfer', 'Office Rent', 'January 2025'),
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca', '4f007757-440d-4b86-9273-aeeb960e293e', 1200.00, 'USD', 1200.00, '2025-01-20', 'transfer', 'Cloud Provider', 'Subscription'),
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca', '4f2cc6ea-e5f1-4cbf-ad81-192bafff0b91', 900.00, 'USD', 900.00, '2025-02-08', 'card', 'Internet Provider', 'Internet'),
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca', '44cd538b-aa0c-496c-9f4a-8fb80f68d6d1', 1500.00, 'USD', 1500.00, '2025-02-15', 'transfer', 'Office Rent', 'February rent'),
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca', '716594a5-e630-46b7-8ce8-78df06ad2514', 1100.00, 'USD', 1100.00, '2025-03-10', 'card', 'Professional Services', 'Services'),
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca', '44cd538b-aa0c-496c-9f4a-8fb80f68d6d1', 1500.00, 'USD', 1500.00, '2025-03-15', 'transfer', 'Office Rent', 'March rent'),
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca', '4f007757-440d-4b86-9273-aeeb960e293e', 1200.00, 'USD', 1200.00, '2025-03-20', 'transfer', 'Cloud Provider', 'Subscription'),
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca', 'e73810c2-e04c-4fdc-9529-5b20ced9d271', 700.00, 'USD', 700.00, '2025-04-12', 'card', 'Office Maintenance', 'Maintenance'),
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca', '44cd538b-aa0c-496c-9f4a-8fb80f68d6d1', 1500.00, 'USD', 1500.00, '2025-04-15', 'transfer', 'Office Rent', 'April rent'),
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca', 'c61dee1d-27c5-469c-b545-a8fb217984ac', 850.00, 'USD', 850.00, '2025-05-14', 'card', 'Marketing Services', 'Marketing'),
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca', '44cd538b-aa0c-496c-9f4a-8fb80f68d6d1', 1500.00, 'USD', 1500.00, '2025-05-15', 'transfer', 'Office Rent', 'May rent'),
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca', '4f007757-440d-4b86-9273-aeeb960e293e', 1200.00, 'USD', 1200.00, '2025-05-20', 'transfer', 'Cloud Provider', 'Subscription'),
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca', '35104290-2153-49c5-b9c4-96a49330cd5b', 600.00, 'USD', 600.00, '2025-06-09', 'card', 'Office Supplies Co', 'Supplies'),
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca', '44cd538b-aa0c-496c-9f4a-8fb80f68d6d1', 1500.00, 'USD', 1500.00, '2025-06-15', 'transfer', 'Office Rent', 'June rent'),
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca', '72269dc3-5fb9-4490-918c-78bb8375ca16', 950.00, 'USD', 950.00, '2025-07-11', 'card', 'Software Tools', 'Tools'),
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca', '44cd538b-aa0c-496c-9f4a-8fb80f68d6d1', 1500.00, 'USD', 1500.00, '2025-07-15', 'transfer', 'Office Rent', 'July rent'),
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca', '4f007757-440d-4b86-9273-aeeb960e293e', 1200.00, 'USD', 1200.00, '2025-07-20', 'transfer', 'Cloud Provider', 'Subscription'),
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca', 'a040132b-fde9-4f25-bdc6-d57cccc6e017', 1300.00, 'USD', 1300.00, '2025-08-13', 'card', 'Training Services', 'Training'),
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca', '44cd538b-aa0c-496c-9f4a-8fb80f68d6d1', 1500.00, 'USD', 1500.00, '2025-08-15', 'transfer', 'Office Rent', 'August rent'),
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca', 'e73810c2-e04c-4fdc-9529-5b20ced9d271', 700.00, 'USD', 700.00, '2025-09-09', 'card', 'Office Maintenance', 'Maintenance'),
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca', '44cd538b-aa0c-496c-9f4a-8fb80f68d6d1', 1500.00, 'USD', 1500.00, '2025-09-15', 'transfer', 'Office Rent', 'September rent'),
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca', '4f007757-440d-4b86-9273-aeeb960e293e', 1200.00, 'USD', 1200.00, '2025-09-20', 'transfer', 'Cloud Provider', 'Subscription'),
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca', '35104290-2153-49c5-b9c4-96a49330cd5b', 550.00, 'USD', 550.00, '2025-10-10', 'card', 'Office Supplies Co', 'Supplies'),
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca', '44cd538b-aa0c-496c-9f4a-8fb80f68d6d1', 1500.00, 'USD', 1500.00, '2025-10-15', 'transfer', 'Office Rent', 'October rent'),
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca', '716594a5-e630-46b7-8ce8-78df06ad2514', 1150.00, 'USD', 1150.00, '2025-11-12', 'card', 'Professional Services', 'Services'),
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca', '44cd538b-aa0c-496c-9f4a-8fb80f68d6d1', 1500.00, 'USD', 1500.00, '2025-11-15', 'transfer', 'Office Rent', 'November rent'),
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca', '44cd538b-aa0c-496c-9f4a-8fb80f68d6d1', 1500.00, 'USD', 1500.00, '2025-12-15', 'transfer', 'Office Rent', 'December rent'),
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca', '4f007757-440d-4b86-9273-aeeb960e293e', 1200.00, 'USD', 1200.00, '2025-12-20', 'transfer', 'Cloud Provider', 'Annual renewal'),

-- 2026 Expenses (Jan-Feb)
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca', '35104290-2153-49c5-b9c4-96a49330cd5b', 650.00, 'USD', 650.00, '2026-01-10', 'card', 'Office Supplies Co', 'January supplies'),
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca', '44cd538b-aa0c-496c-9f4a-8fb80f68d6d1', 1500.00, 'USD', 1500.00, '2026-01-15', 'transfer', 'Office Rent', 'January rent'),
('3e3837f1-fadf-4c2d-bd02-195c9ed521ca', '4f007757-440d-4b86-9273-aeeb960e293e', 1200.00, 'USD', 1200.00, '2026-01-20', 'transfer', 'Cloud Provider', 'Subscription');

-- INVOICES DATA (2023-2026, Monthly entries)
-- Invoice data with related invoice items and payments

-- 2023 Invoices
INSERT INTO invoices (user_id, business_id, invoice_number, title, issue_date, due_date, client_name, client_email, subtotal, tax_amount, tax_rate, total_amount, currency, status, payment_status, payment_method, payment_date, notes) VALUES
('user_id', '3e3837f1-fadf-4c2d-bd02-195c9ed521ca', 'INV-2023-001', 'Invoice', '2023-01-15', '2023-02-15', 'Client A', 'clienta@email.com', 4500.00, 450.00, 10.00, 4950.00, 'USD', 'paid', 'paid', 'bank_transfer', '2023-01-25', 'Monthly service'),
('user_id', '3e3837f1-fadf-4c2d-bd02-195c9ed521ca', 'INV-2023-002', 'Invoice', '2023-02-15', '2023-03-15', 'Client B', 'clientb@email.com', 5000.00, 500.00, 10.00, 5500.00, 'USD', 'paid', 'paid', 'bank_transfer', '2023-02-28', 'Consulting'),
('user_id', '3e3837f1-fadf-4c2d-bd02-195c9ed521ca', 'INV-2023-003', 'Invoice', '2023-03-15', '2023-04-15', 'Client A', 'clienta@email.com', 5500.00, 550.00, 10.00, 6050.00, 'USD', 'paid', 'paid', 'card', '2023-03-20', 'Services'),
('user_id', '3e3837f1-fadf-4c2d-bd02-195c9ed521ca', 'INV-2023-004', 'Invoice', '2023-04-20', '2023-05-20', 'Client C', 'clientc@email.com', 4700.00, 470.00, 10.00, 5170.00, 'USD', 'paid', 'paid', 'bank_transfer', '2023-04-28', 'Retainer'),
('user_id', '3e3837f1-fadf-4c2d-bd02-195c9ed521ca', 'INV-2023-005', 'Invoice', '2023-05-10', '2023-06-10', 'Client D', 'clientd@email.com', 6800.00, 680.00, 10.00, 7480.00, 'USD', 'paid', 'paid', 'bank_transfer', '2023-05-18', 'Project'),
('user_id', '3e3837f1-fadf-4c2d-bd02-195c9ed521ca', 'INV-2023-006', 'Invoice', '2023-06-15', '2023-07-15', 'Client A', 'clienta@email.com', 5300.00, 530.00, 10.00, 5830.00, 'USD', 'paid', 'paid', 'card', '2023-06-25', 'Services'),
('user_id', '3e3837f1-fadf-4c2d-bd02-195c9ed521ca', 'INV-2023-007', 'Invoice', '2023-07-12', '2023-08-12', 'Client B', 'clientb@email.com', 5600.00, 560.00, 10.00, 6160.00, 'USD', 'paid', 'paid', 'bank_transfer', '2023-07-22', 'Quarterly'),
('user_id', '3e3837f1-fadf-4c2d-bd02-195c9ed521ca', 'INV-2023-008', 'Invoice', '2023-08-15', '2023-09-15', 'Client C', 'clientc@email.com', 5400.00, 540.00, 10.00, 5940.00, 'USD', 'paid', 'paid', 'bank_transfer', '2023-08-23', 'Support'),
('user_id', '3e3837f1-fadf-4c2d-bd02-195c9ed521ca', 'INV-2023-009', 'Invoice', '2023-09-18', '2023-10-18', 'Client E', 'cliente@email.com', 7200.00, 720.00, 10.00, 7920.00, 'USD', 'paid', 'paid', 'bank_transfer', '2023-09-28', 'Major contract'),
('user_id', '3e3837f1-fadf-4c2d-bd02-195c9ed521ca', 'INV-2023-010', 'Invoice', '2023-10-14', '2023-11-14', 'Client A', 'clienta@email.com', 5500.00, 550.00, 10.00, 6050.00, 'USD', 'paid', 'paid', 'card', '2023-10-24', 'Monthly'),
('user_id', '3e3837f1-fadf-4c2d-bd02-195c9ed521ca', 'INV-2023-011', 'Invoice', '2023-11-20', '2023-12-20', 'Client B', 'clientb@email.com', 5000.00, 500.00, 10.00, 5500.00, 'USD', 'paid', 'paid', 'bank_transfer', '2023-11-30', 'Year-end'),
('user_id', '3e3837f1-fadf-4c2d-bd02-195c9ed521ca', 'INV-2023-012', 'Invoice', '2023-12-15', '2024-01-15', 'Client D', 'clientd@email.com', 6500.00, 650.00, 10.00, 7150.00, 'USD', 'paid', 'paid', 'bank_transfer', '2023-12-28', 'Holiday'),

-- 2024 Invoices
('user_id', '3e3837f1-fadf-4c2d-bd02-195c9ed521ca', 'INV-2024-001', 'Invoice', '2024-01-15', '2024-02-15', 'Client A', 'clienta@email.com', 5300.00, 530.00, 10.00, 5830.00, 'USD', 'paid', 'paid', 'bank_transfer', '2024-01-25', 'Q1 2024'),
('user_id', '3e3837f1-fadf-4c2d-bd02-195c9ed521ca', 'INV-2024-002', 'Invoice', '2024-02-14', '2024-03-14', 'Client B', 'clientb@email.com', 5600.00, 560.00, 10.00, 6160.00, 'USD', 'paid', 'paid', 'bank_transfer', '2024-02-24', 'February'),
('user_id', '3e3837f1-fadf-4c2d-bd02-195c9ed521ca', 'INV-2024-003', 'Invoice', '2024-03-18', '2024-04-18', 'Client C', 'clientc@email.com', 5400.00, 540.00, 10.00, 5940.00, 'USD', 'paid', 'paid', 'card', '2024-03-28', 'Spring'),
('user_id', '3e3837f1-fadf-4c2d-bd02-195c9ed521ca', 'INV-2024-004', 'Invoice', '2024-04-12', '2024-05-12', 'Client F', 'clientf@email.com', 6300.00, 630.00, 10.00, 6930.00, 'USD', 'paid', 'paid', 'bank_transfer', '2024-04-22', 'New client'),
('user_id', '3e3837f1-fadf-4c2d-bd02-195c9ed521ca', 'INV-2024-005', 'Invoice', '2024-05-20', '2024-06-20', 'Client A', 'clienta@email.com', 5800.00, 580.00, 10.00, 6380.00, 'USD', 'paid', 'paid', 'bank_transfer', '2024-05-30', 'May'),
('user_id', '3e3837f1-fadf-4c2d-bd02-195c9ed521ca', 'INV-2024-006', 'Invoice', '2024-06-15', '2024-07-15', 'Client B', 'clientb@email.com', 6100.00, 610.00, 10.00, 6710.00, 'USD', 'paid', 'paid', 'bank_transfer', '2024-06-25', 'H1 2024'),
('user_id', '3e3837f1-fadf-4c2d-bd02-195c9ed521ca', 'INV-2024-007', 'Invoice', '2024-07-16', '2024-08-16', 'Client D', 'clientd@email.com', 5400.00, 540.00, 10.00, 5940.00, 'USD', 'paid', 'paid', 'card', '2024-07-26', 'Summer'),
('user_id', '3e3837f1-fadf-4c2d-bd02-195c9ed521ca', 'INV-2024-008', 'Invoice', '2024-08-19', '2024-09-19', 'Client E', 'cliente@email.com', 5800.00, 580.00, 10.00, 6380.00, 'USD', 'paid', 'paid', 'bank_transfer', '2024-08-29', 'August'),
('user_id', '3e3837f1-fadf-4c2d-bd02-195c9ed521ca', 'INV-2024-009', 'Invoice', '2024-09-10', '2024-10-10', 'Client C', 'clientc@email.com', 7700.00, 770.00, 10.00, 8470.00, 'USD', 'paid', 'paid', 'bank_transfer', '2024-09-20', 'Q3 bonus'),
('user_id', '3e3837f1-fadf-4c2d-bd02-195c9ed521ca', 'INV-2024-010', 'Invoice', '2024-10-22', '2024-11-22', 'Client A', 'clienta@email.com', 5600.00, 560.00, 10.00, 6160.00, 'USD', 'paid', 'paid', 'bank_transfer', '2024-11-01', 'October'),
('user_id', '3e3837f1-fadf-4c2d-bd02-195c9ed521ca', 'INV-2024-011', 'Invoice', '2024-11-14', '2024-12-14', 'Client B', 'clientb@email.com', 6400.00, 640.00, 10.00, 7040.00, 'USD', 'paid', 'paid', 'card', '2024-11-24', 'November'),
('user_id', '3e3837f1-fadf-4c2d-bd02-195c9ed521ca', 'INV-2024-012', 'Invoice', '2024-12-20', '2025-01-20', 'Client F', 'clientf@email.com', 8000.00, 800.00, 10.00, 8800.00, 'USD', 'paid', 'paid', 'bank_transfer', '2024-12-30', 'Year-end'),

-- 2025 Invoices
('user_id', '3e3837f1-fadf-4c2d-bd02-195c9ed521ca', 'INV-2025-001', 'Invoice', '2025-01-16', '2025-02-16', 'Client A', 'clienta@email.com', 5900.00, 590.00, 10.00, 6490.00, 'USD', 'paid', 'paid', 'bank_transfer', '2025-01-26', 'January 2025'),
('user_id', '3e3837f1-fadf-4c2d-bd02-195c9ed521ca', 'INV-2025-002', 'Invoice', '2025-02-15', '2025-03-15', 'Client B', 'clientb@email.com', 6100.00, 610.00, 10.00, 6710.00, 'USD', 'paid', 'paid', 'bank_transfer', '2025-02-25', 'February 2025'),
('user_id', '3e3837f1-fadf-4c2d-bd02-195c9ed521ca', 'INV-2025-003', 'Invoice', '2025-03-18', '2025-04-18', 'Client C', 'clientc@email.com', 6500.00, 650.00, 10.00, 7150.00, 'USD', 'paid', 'paid', 'card', '2025-03-28', 'March'),
('user_id', '3e3837f1-fadf-4c2d-bd02-195c9ed521ca', 'INV-2025-004', 'Invoice', '2025-04-20', '2025-05-20', 'Client D', 'clientd@email.com', 6200.00, 620.00, 10.00, 6820.00, 'USD', 'paid', 'paid', 'bank_transfer', '2025-04-30', 'Q2 2025'),
('user_id', '3e3837f1-fadf-4c2d-bd02-195c9ed521ca', 'INV-2025-005', 'Invoice', '2025-05-14', '2025-06-14', 'Client A', 'clienta@email.com', 6700.00, 670.00, 10.00, 7370.00, 'USD', 'paid', 'paid', 'bank_transfer', '2025-05-24', 'May 2025'),
('user_id', '3e3837f1-fadf-4c2d-bd02-195c9ed521ca', 'INV-2025-006', 'Invoice', '2025-06-19', '2025-07-19', 'Client E', 'cliente@email.com', 6400.00, 640.00, 10.00, 7040.00, 'USD', 'paid', 'paid', 'bank_transfer', '2025-06-29', 'H1 completion'),
('user_id', '3e3837f1-fadf-4c2d-bd02-195c9ed521ca', 'INV-2025-007', 'Invoice', '2025-07-15', '2025-08-15', 'Client B', 'clientb@email.com', 6100.00, 610.00, 10.00, 6710.00, 'USD', 'paid', 'paid', 'card', '2025-07-25', 'July 2025'),
('user_id', '3e3837f1-fadf-4c2d-bd02-195c9ed521ca', 'INV-2025-008', 'Invoice', '2025-08-18', '2025-09-18', 'Client C', 'clientc@email.com', 6700.00, 670.00, 10.00, 7370.00, 'USD', 'paid', 'paid', 'bank_transfer', '2025-08-28', 'August 2025'),
('user_id', '3e3837f1-fadf-4c2d-bd02-195c9ed521ca', 'INV-2025-009', 'Invoice', '2025-09-12', '2025-10-12', 'Client F', 'clientf@email.com', 8100.00, 810.00, 10.00, 8910.00, 'USD', 'paid', 'paid', 'bank_transfer', '2025-09-22', 'Q3 peak'),
('user_id', '3e3837f1-fadf-4c2d-bd02-195c9ed521ca', 'INV-2025-010', 'Invoice', '2025-10-16', '2025-11-16', 'Client A', 'clienta@email.com', 6500.00, 650.00, 10.00, 7150.00, 'USD', 'paid', 'paid', 'bank_transfer', '2025-10-26', 'October 2025'),
('user_id', '3e3837f1-fadf-4c2d-bd02-195c9ed521ca', 'INV-2025-011', 'Invoice', '2025-11-20', '2025-12-20', 'Client D', 'clientd@email.com', 6900.00, 690.00, 10.00, 7590.00, 'USD', 'paid', 'paid', 'card', '2025-11-30', 'November 2025'),
('user_id', '3e3837f1-fadf-4c2d-bd02-195c9ed521ca', 'INV-2025-012', 'Invoice', '2025-12-18', '2026-01-18', 'Client E', 'cliente@email.com', 8600.00, 860.00, 10.00, 9460.00, 'USD', 'paid', 'paid', 'bank_transfer', '2025-12-28', 'Year-end'),

-- 2026 Invoices (Jan only as per current date)
('user_id', '3e3837f1-fadf-4c2d-bd02-195c9ed521ca', 'INV-2026-001', 'Invoice', '2026-01-15', '2026-02-15', 'Client A', 'clienta@email.com', 6300.00, 630.00, 10.00, 6930.00, 'USD', 'sent', 'unpaid', NULL, NULL, 'January 2026');

-- Add invoice items for some sample invoices (just a few examples)
-- These would be bulk inserted in a real scenario
INSERT INTO invoice_items (invoice_id, description, quantity, unit_price, amount) VALUES
-- Note: You'll need to get the actual invoice_id values from the invoices table
-- Example structure (replace with actual IDs):
-- (invoice_id_1, 'Professional Services', 1, 4500.00, 4500.00),
-- (invoice_id_2, 'Consulting Work', 5, 1000.00, 5000.00);

-- Add invoice payments for some sample invoices
-- Similar to invoice items, you'll need actual invoice_id values
-- Example structure:
-- (invoice_id_1, 4950.00, '2023-01-25', 'bank_transfer', 'Payment received'),

-- NOTES:
-- 1. Replace 'user_id' with your actual test user ID
-- 2. Replace '3e3837f1-fadf-4c2d-bd02-195c9ed521ca' with your actual test business ID
-- 3. Replace 'income_category_id' with your actual income category ID
-- 4. Replace 'expense_category_id' with your actual expense category ID
-- 5. For invoice items and payments, fetch the actual invoice IDs after inserting invoices
-- 6. Run this script in your Supabase SQL editor after replacing the placeholder IDs
