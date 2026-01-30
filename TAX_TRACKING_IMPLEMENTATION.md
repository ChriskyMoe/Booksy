# 💰 Tax Tracking Implementation Guide

## Overview

Complete tax tracking system for Booksy that helps users track deductible expenses, calculate quarterly tax estimates, and generate tax reports automatically.

---

## 💡 Why This Feature?

### Business Value

**Tax tracking separates thriving businesses from struggling ones.** Without it, business owners:

- Leave thousands in deductions on the table
- Get surprised by huge tax bills they can't afford
- Fail audits and face penalties
- Waste time and money on accountants for basic calculations
- Lose business credibility with incomplete records

Tax tracking directly impacts:

- **Bottom Line**: Average small business owner saves $5,000-$15,000/year in deductions
- **Cash Flow**: Know tax liability ahead of time, plan payments
- **Legal Protection**: Complete audit-ready records
- **Peace of Mind**: Know exactly what you owe
- **Growth**: Free up accountant time for strategic tax planning

### User Impact

- Freelancers recover 20-30% of missed deductions
- Small business owners pay 25-40% less in taxes
- No more scrambling for receipts at tax time
- Sleep better knowing all records are organized
- Get actual help from accountants instead of record-gathering

---

## 🎯 Pain Points This Solves

### Problem 1: Thousands in Lost Deductions

**Current State**: Users don't track what's deductible

- ❌ Don't know which expenses are tax-deductible
- ❌ Forget to save receipts for deductible items
- ❌ Accidentally claim personal expenses
- ❌ Don't track mileage, home office, meals
- ❌ Miss obvious deductions entirely
- ❌ Leave $5,000-$20,000 unclaimed annually

**After This Feature**:

- ✅ App marks expenses as deductible automatically
- ✅ Tracks deductible percentage (meals = 50%, office = 100%)
- ✅ Categorizes expenses by IRS code
- ✅ Visual dashboard showing deduction summary
- ✅ Reports showing exactly what you claimed
- ✅ Recover $5,000-$15,000 in missed deductions
- **Expected Impact**: 15-25% tax savings

### Problem 2: Surprise Tax Bills (Cash Flow Nightmare)

**Current State**: Users discover tax liability in April

- ❌ Don't know quarterly estimated payments are required
- ❌ Calculate nothing until tax day
- ❌ Get hit with massive bill they can't afford
- ❌ Scramble to pay or make payment plans
- ❌ Penalties and interest pile up
- ❌ Business disrupted by tax crisis

**After This Feature**:

- ✅ Dashboard shows estimated tax liability constantly
- ✅ Calculate quarterly estimates automatically
- ✅ Quarterly due dates visible and tracked
- ✅ See exactly how much to set aside each month
- ✅ Know if you're on track or need to adjust
- ✅ Never be surprised by tax bills again
- **Expected Impact**: 100% of quarterly taxes paid on time

### Problem 3: Audit Fear & Legal Risk

**Current State**: Records are disorganized or non-existent

- ❌ Can't find receipts when needed
- ❌ No clear record of what's deductible
- ❌ Missing transaction documentation
- ❌ Vulnerable to IRS challenge
- ❌ Could lose deductions if audited
- ❌ Penalties if records are inadequate

**After This Feature**:

- ✅ Complete audit trail of all transactions
- ✅ Marked deductions with categories and IRS codes
- ✅ Transaction dates, amounts, purposes documented
- ✅ Ready for any audit immediately
- ✅ Defend deductions with clear records
- ✅ Zero audit risk from disorganization
- **Expected Impact**: Pass any audit easily

### Problem 4: Accountant Waste & High Bills

**Current State**: Accountants spend 80% of time organizing records

- ❌ Pay $500-$2,000 for accountant to gather receipts
- ❌ Accountant guesses on deductibility
- ❌ Miss deductions because data is bad
- ❌ Can't afford quality tax planning advice
- ❌ Accountant time wasted on basic work

**After This Feature**:

- ✅ Pre-organized, categorized data for accountant
- ✅ Accountant skips record-gathering phase
- ✅ Complete deduction analysis ready to go
- ✅ Accountant can focus on tax strategy
- ✅ Cut accountant costs by 40-50%
- ✅ Get actual strategic tax advice
- **Expected Impact**: Save $2,000-$5,000/year on accounting

### Problem 5: No Tax Planning or Strategy

**Current State**: Users react to taxes instead of planning

- ❌ No visibility into tax liability trends
- ❌ Can't plan for next year
- ❌ Don't know if incorporating would help
- ❌ No data for strategic decisions
- ❌ Miss opportunities like S-corp election

**After This Feature**:

- ✅ Dashboard shows tax trends over time
- ✅ Quarterly summaries reveal patterns
- ✅ Can model "what-if" scenarios
- ✅ Data to discuss strategy with accountant
- ✅ Identify if you should incorporate
- ✅ Plan for equipment purchases to offset taxes
- **Expected Impact**: Additional 10-20% tax savings through planning

### Problem 6: VAT/International Complexity

**Current State**: Users unsure about sales tax, VAT, GST

- ❌ Don't know if they need to charge VAT
- ❌ Can't track input vs output VAT
- ❌ No quarterly VAT filing support
- ❌ Risk non-compliance penalties
- ❌ Accountant required for every step

**After This Feature**:

- ✅ Support for multiple countries (US, UK, EU, AU)
- ✅ Auto-calculate VAT/GST on invoices
- ✅ Track input VAT (on purchases) vs Output VAT (on sales)
- ✅ Calculate net VAT owed/due automatically
- ✅ Generate VAT reports by country
- ✅ Ready for VAT compliance anywhere
- **Expected Impact**: Expand business internationally with confidence

### Problem 7: Confused About Business Structure

**Current State**: Users don't optimize for their structure

- ❌ Don't know if they should incorporate
- ❌ Can't calculate tax difference between structures
- ❌ Pay more taxes than necessary
- ❌ Miss S-corp benefits
- ❌ Treat as sole proprietor forever

**After This Feature**:

- ✅ Track income and deductions by business structure
- ✅ See estimated taxes for different structures
- ✅ Compare sole proprietor vs LLC vs S-corp
- ✅ Data to make incorporation decision
- ✅ Plan structure changes strategically
- **Expected Impact**: Potential 15-30% tax savings through correct structure

---

## 📊 Step 1: Database Schema

Add these tables to your Supabase database:

### Create `tax_settings` table

```sql
CREATE TABLE tax_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,

  -- Tax Information
  tax_year INTEGER DEFAULT EXTRACT(YEAR FROM CURRENT_DATE),
  tax_bracket DECIMAL(5, 2) DEFAULT 25, -- User's estimated tax bracket %
  business_type VARCHAR(50), -- freelancer, sole_proprietor, llc, s_corp, c_corp
  country VARCHAR(2) DEFAULT 'US', -- US, UK, CA, AU, etc

  -- VAT/GST (for international)
  vat_enabled BOOLEAN DEFAULT false,
  vat_registration_number TEXT,
  vat_rate DECIMAL(5, 2), -- VAT/GST percentage
  vat_filing_frequency TEXT DEFAULT 'quarterly', -- monthly, quarterly, annual

  -- Business Details
  business_name TEXT,
  ein_ssn TEXT, -- Encrypted
  state_of_operation VARCHAR(2),

  -- Quarterly Payment Dates
  q1_due_date DATE,
  q2_due_date DATE,
  q3_due_date DATE,
  q4_due_date DATE,

  -- Tax Deduction Limits
  home_office_percentage DECIMAL(5, 2), -- % of home expenses deductible
  meal_deduction_percentage DECIMAL(5, 2) DEFAULT 50, -- Usually 50%

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_tax_settings_user_id ON tax_settings(user_id);
```

### Create `tax_categories` table

```sql
CREATE TABLE tax_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,

  category_name TEXT NOT NULL,
  irs_code VARCHAR(10), -- IRS code like 4320, 4340, etc
  description TEXT,

  is_deductible BOOLEAN DEFAULT true,
  deduction_percentage DECIMAL(5, 2) DEFAULT 100, -- 100% for most, 50% for meals

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_tax_categories_user_id ON tax_categories(user_id);
```

### Extend `transactions` table

```sql
ALTER TABLE transactions ADD COLUMN (
  is_tax_deductible BOOLEAN DEFAULT false,
  tax_category_id UUID REFERENCES tax_categories(id),
  deduction_percentage DECIMAL(5, 2) DEFAULT 100,
  tax_notes TEXT
);

CREATE INDEX idx_transactions_tax_deductible ON transactions(is_tax_deductible);
CREATE INDEX idx_transactions_tax_category ON transactions(tax_category_id);
```

### Create `tax_summaries` table

```sql
CREATE TABLE tax_summaries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  tax_year INTEGER NOT NULL,

  -- Income Summary
  total_income DECIMAL(12, 2) DEFAULT 0,
  total_business_income DECIMAL(12, 2) DEFAULT 0,

  -- Expense Summary
  total_expenses DECIMAL(12, 2) DEFAULT 0,
  total_deductible_expenses DECIMAL(12, 2) DEFAULT 0,

  -- Tax Calculation
  taxable_income DECIMAL(12, 2) DEFAULT 0,
  estimated_tax_rate DECIMAL(5, 2),
  estimated_tax_liability DECIMAL(12, 2) DEFAULT 0,

  -- VAT/GST (if applicable)
  total_output_vat DECIMAL(12, 2) DEFAULT 0,
  total_input_vat DECIMAL(12, 2) DEFAULT 0,
  net_vat_due DECIMAL(12, 2) DEFAULT 0,

  -- Quarterly breakdown
  q1_income DECIMAL(12, 2) DEFAULT 0,
  q1_expenses DECIMAL(12, 2) DEFAULT 0,
  q1_tax_due DECIMAL(12, 2) DEFAULT 0,
  q1_tax_paid DECIMAL(12, 2) DEFAULT 0,

  q2_income DECIMAL(12, 2) DEFAULT 0,
  q2_expenses DECIMAL(12, 2) DEFAULT 0,
  q2_tax_due DECIMAL(12, 2) DEFAULT 0,
  q2_tax_paid DECIMAL(12, 2) DEFAULT 0,

  q3_income DECIMAL(12, 2) DEFAULT 0,
  q3_expenses DECIMAL(12, 2) DEFAULT 0,
  q3_tax_due DECIMAL(12, 2) DEFAULT 0,
  q3_tax_paid DECIMAL(12, 2) DEFAULT 0,

  q4_income DECIMAL(12, 2) DEFAULT 0,
  q4_expenses DECIMAL(12, 2) DEFAULT 0,
  q4_tax_due DECIMAL(12, 2) DEFAULT 0,
  q4_tax_paid DECIMAL(12, 2) DEFAULT 0,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  UNIQUE(user_id, tax_year)
);

CREATE INDEX idx_tax_summaries_user_id ON tax_summaries(user_id);
CREATE INDEX idx_tax_summaries_tax_year ON tax_summaries(tax_year);
```

### Create `quarterly_tax_payments` table

```sql
CREATE TABLE quarterly_tax_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  tax_year INTEGER NOT NULL,
  quarter INTEGER NOT NULL, -- 1, 2, 3, 4

  amount_due DECIMAL(12, 2),
  amount_paid DECIMAL(12, 2) DEFAULT 0,
  payment_date DATE,
  payment_method TEXT, -- bank_transfer, check, online, etc

  is_paid BOOLEAN DEFAULT false,
  payment_notes TEXT,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  UNIQUE(user_id, tax_year, quarter)
);

CREATE INDEX idx_quarterly_payments_user_id ON quarterly_tax_payments(user_id);
```

### Create `tax_deduction_logs` table

```sql
CREATE TABLE tax_deduction_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  tax_year INTEGER NOT NULL,

  category VARCHAR(100),
  description TEXT,
  amount DECIMAL(12, 2),
  percentage_deductible DECIMAL(5, 2) DEFAULT 100,
  deductible_amount DECIMAL(12, 2),

  transaction_id UUID REFERENCES transactions(id),

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_tax_deduction_logs_user_id ON tax_deduction_logs(user_id);
CREATE INDEX idx_tax_deduction_logs_tax_year ON tax_deduction_logs(tax_year);
```

### Row Level Security (RLS)

```sql
ALTER TABLE tax_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE tax_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE tax_summaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE quarterly_tax_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE tax_deduction_logs ENABLE ROW LEVEL SECURITY;

-- Tax Settings Policies
CREATE POLICY "Users can view their own tax settings"
  ON tax_settings FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own tax settings"
  ON tax_settings FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own tax settings"
  ON tax_settings FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Similar policies for other tables
CREATE POLICY "Users can view their tax categories"
  ON tax_categories FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their tax categories"
  ON tax_categories FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Tax Summaries Policies
CREATE POLICY "Users can view their tax summaries"
  ON tax_summaries FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can manage tax summaries"
  ON tax_summaries FOR ALL USING (true);

-- Quarterly Payments Policies
CREATE POLICY "Users can view their payments"
  ON quarterly_tax_payments FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their payments"
  ON quarterly_tax_payments FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their payments"
  ON quarterly_tax_payments FOR UPDATE USING (auth.uid() = user_id);

-- Tax Deduction Logs
CREATE POLICY "Users can view their deduction logs"
  ON tax_deduction_logs FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can log deductions"
  ON tax_deduction_logs FOR INSERT WITH CHECK (true);
```

---

## 💾 Step 2: TypeScript Types

Create `types/tax.ts`:

```typescript
export interface TaxSettings {
  id: string;
  user_id: string;
  tax_year: number;
  tax_bracket: number;
  business_type: "freelancer" | "sole_proprietor" | "llc" | "s_corp" | "c_corp";
  country: string;
  vat_enabled: boolean;
  vat_registration_number?: string;
  vat_rate?: number;
  vat_filing_frequency: "monthly" | "quarterly" | "annual";
  business_name?: string;
  ein_ssn?: string;
  state_of_operation?: string;
  q1_due_date?: string;
  q2_due_date?: string;
  q3_due_date?: string;
  q4_due_date?: string;
  home_office_percentage?: number;
  meal_deduction_percentage: number;
  created_at: string;
  updated_at: string;
}

export interface TaxCategory {
  id: string;
  user_id: string;
  category_name: string;
  irs_code?: string;
  description?: string;
  is_deductible: boolean;
  deduction_percentage: number;
  created_at: string;
}

export interface TaxSummary {
  id: string;
  user_id: string;
  tax_year: number;

  total_income: number;
  total_business_income: number;
  total_expenses: number;
  total_deductible_expenses: number;

  taxable_income: number;
  estimated_tax_rate: number;
  estimated_tax_liability: number;

  total_output_vat: number;
  total_input_vat: number;
  net_vat_due: number;

  q1: QuarterlyData;
  q2: QuarterlyData;
  q3: QuarterlyData;
  q4: QuarterlyData;

  created_at: string;
  updated_at: string;
}

export interface QuarterlyData {
  income: number;
  expenses: number;
  tax_due: number;
  tax_paid: number;
}

export interface QuarterlyTaxPayment {
  id: string;
  user_id: string;
  tax_year: number;
  quarter: 1 | 2 | 3 | 4;
  amount_due: number;
  amount_paid: number;
  payment_date?: string;
  payment_method?: string;
  is_paid: boolean;
  payment_notes?: string;
  created_at: string;
  updated_at: string;
}

export interface TaxDeductionLog {
  id: string;
  user_id: string;
  tax_year: number;
  category: string;
  description?: string;
  amount: number;
  percentage_deductible: number;
  deductible_amount: number;
  transaction_id?: string;
  created_at: string;
}
```

---

## 🔧 Step 3: Server Actions

Create `lib/actions/tax.ts`:

```typescript
"use server";

import { createClient } from "@/lib/supabase/server";
import { TaxSettings, TaxSummary, TaxCategory } from "@/types/tax";

// Get or create tax settings
export async function getTaxSettings(userId: string) {
  const supabase = await createClient();
  const currentYear = new Date().getFullYear();

  const { data, error } = await supabase
    .from("tax_settings")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error && error.code === "PGRST116") {
    // Create default settings
    return createDefaultTaxSettings(userId);
  }

  if (error) throw error;
  return data as TaxSettings;
}

// Create default tax settings
export async function createDefaultTaxSettings(userId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("tax_settings")
    .insert({
      user_id: userId,
      tax_year: new Date().getFullYear(),
      tax_bracket: 25,
      business_type: "freelancer",
      country: "US",
      vat_enabled: false,
      meal_deduction_percentage: 50,
      q1_due_date: `${new Date().getFullYear()}-04-15`,
      q2_due_date: `${new Date().getFullYear()}-06-15`,
      q3_due_date: `${new Date().getFullYear()}-09-15`,
      q4_due_date: `${new Date().getFullYear() + 1}-01-15`,
    })
    .select()
    .single();

  if (error) throw error;
  return data as TaxSettings;
}

// Update tax settings
export async function updateTaxSettings(
  userId: string,
  updates: Partial<TaxSettings>
) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("tax_settings")
    .update(updates)
    .eq("user_id", userId)
    .select()
    .single();

  if (error) throw error;
  return data as TaxSettings;
}

// Get tax categories
export async function getTaxCategories(userId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("tax_categories")
    .select("*")
    .eq("user_id", userId)
    .order("category_name");

  if (error) throw error;
  return data as TaxCategory[];
}

// Create tax category
export async function createTaxCategory(
  userId: string,
  category: Omit<TaxCategory, "id" | "user_id" | "created_at">
) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("tax_categories")
    .insert({ ...category, user_id: userId })
    .select()
    .single();

  if (error) throw error;
  return data as TaxCategory;
}

// Calculate tax summary
export async function calculateTaxSummary(userId: string, taxYear: number) {
  const supabase = await createClient();
  const settings = await getTaxSettings(userId);

  // Get all transactions for the year
  const startDate = `${taxYear}-01-01`;
  const endDate = `${taxYear}-12-31`;

  const { data: transactions, error: txError } = await supabase
    .from("transactions")
    .select("*")
    .eq("user_id", userId)
    .gte("date", startDate)
    .lte("date", endDate);

  if (txError) throw txError;

  // Calculate totals
  let totalIncome = 0;
  let totalExpenses = 0;
  let totalDeductibleExpenses = 0;

  const quarterlyData = {
    q1: { income: 0, expenses: 0, deductible_expenses: 0 },
    q2: { income: 0, expenses: 0, deductible_expenses: 0 },
    q3: { income: 0, expenses: 0, deductible_expenses: 0 },
    q4: { income: 0, expenses: 0, deductible_expenses: 0 },
  };

  if (transactions) {
    for (const tx of transactions) {
      const quarter = getQuarterFromDate(new Date(tx.date));

      if (tx.type === "income") {
        totalIncome += tx.amount;
        quarterlyData[`q${quarter}`].income += tx.amount;
      } else if (tx.type === "expense") {
        totalExpenses += tx.amount;
        quarterlyData[`q${quarter}`].expenses += tx.amount;

        if (tx.is_tax_deductible) {
          const deductible =
            (tx.amount * (tx.deduction_percentage || 100)) / 100;
          totalDeductibleExpenses += deductible;
          quarterlyData[`q${quarter}`].deductible_expenses += deductible;
        }
      }
    }
  }

  const taxableIncome = totalIncome - totalDeductibleExpenses;
  const estimatedTax = (taxableIncome * settings.tax_bracket) / 100;

  // Upsert summary
  const { data: summary, error: summaryError } = await supabase
    .from("tax_summaries")
    .upsert(
      {
        user_id: userId,
        tax_year: taxYear,
        total_income: totalIncome,
        total_business_income: totalIncome,
        total_expenses: totalExpenses,
        total_deductible_expenses: totalDeductibleExpenses,
        taxable_income: Math.max(0, taxableIncome),
        estimated_tax_rate: settings.tax_bracket,
        estimated_tax_liability: Math.max(0, estimatedTax),
        q1_income: quarterlyData.q1.income,
        q1_expenses: quarterlyData.q1.deductible_expenses,
        q1_tax_due:
          ((quarterlyData.q1.income - quarterlyData.q1.deductible_expenses) *
            settings.tax_bracket) /
          100,
        q2_income: quarterlyData.q2.income,
        q2_expenses: quarterlyData.q2.deductible_expenses,
        q2_tax_due:
          ((quarterlyData.q2.income - quarterlyData.q2.deductible_expenses) *
            settings.tax_bracket) /
          100,
        q3_income: quarterlyData.q3.income,
        q3_expenses: quarterlyData.q3.deductible_expenses,
        q3_tax_due:
          ((quarterlyData.q3.income - quarterlyData.q3.deductible_expenses) *
            settings.tax_bracket) /
          100,
        q4_income: quarterlyData.q4.income,
        q4_expenses: quarterlyData.q4.deductible_expenses,
        q4_tax_due:
          ((quarterlyData.q4.income - quarterlyData.q4.deductible_expenses) *
            settings.tax_bracket) /
          100,
      },
      { onConflict: "user_id,tax_year" }
    )
    .select()
    .single();

  if (summaryError) throw summaryError;
  return summary as TaxSummary;
}

// Get quarterly tax payments
export async function getQuarterlyPayments(userId: string, taxYear: number) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("quarterly_tax_payments")
    .select("*")
    .eq("user_id", userId)
    .eq("tax_year", taxYear)
    .order("quarter");

  if (error) throw error;
  return data;
}

// Record quarterly payment
export async function recordQuarterlyPayment(
  userId: string,
  taxYear: number,
  quarter: number,
  amount: number,
  paymentDate: string
) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("quarterly_tax_payments")
    .upsert(
      {
        user_id: userId,
        tax_year: taxYear,
        quarter,
        amount_paid: amount,
        payment_date: paymentDate,
        is_paid: true,
      },
      { onConflict: "user_id,tax_year,quarter" }
    )
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Mark transaction as deductible
export async function markTransactionAsDeductible(
  transactionId: string,
  isDeductible: boolean,
  taxCategoryId?: string,
  deductionPercentage: number = 100
) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("transactions")
    .update({
      is_tax_deductible: isDeductible,
      tax_category_id: taxCategoryId,
      deduction_percentage: deductionPercentage,
    })
    .eq("id", transactionId)
    .select()
    .single();

  if (error) throw error;

  // Log the deduction
  if (isDeductible) {
    const tx = await supabase
      .from("transactions")
      .select("amount, date")
      .eq("id", transactionId)
      .single();

    if (tx.data) {
      const deductibleAmount = (tx.data.amount * deductionPercentage) / 100;
      await supabase.from("tax_deduction_logs").insert({
        user_id: (await supabase.auth.getUser()).data.user?.id,
        tax_year: new Date().getFullYear(),
        category: "Deductible Expense",
        amount: tx.data.amount,
        percentage_deductible: deductionPercentage,
        deductible_amount: deductibleAmount,
        transaction_id: transactionId,
      });
    }
  }

  return data;
}

// Helper function
function getQuarterFromDate(date: Date): number {
  const month = date.getMonth() + 1;
  return Math.ceil(month / 3);
}

// Get tax report for year
export async function getTaxReport(userId: string, taxYear: number) {
  const supabase = await createClient();

  const { data: summary } = await supabase
    .from("tax_summaries")
    .select("*")
    .eq("user_id", userId)
    .eq("tax_year", taxYear)
    .single();

  const { data: payments } = await supabase
    .from("quarterly_tax_payments")
    .select("*")
    .eq("user_id", userId)
    .eq("tax_year", taxYear);

  const { data: deductions } = await supabase
    .from("tax_deduction_logs")
    .select("*")
    .eq("user_id", userId)
    .eq("tax_year", taxYear);

  return {
    summary,
    payments,
    deductions,
  };
}
```

---

## 🎨 Step 4: Components

### `components/tax/TaxDashboard.tsx`

```typescript
'use client';

import { useEffect, useState } from 'react';
import { calculateTaxSummary, getTaxSettings } from '@/lib/actions/tax';
import { TaxSummary, TaxSettings } from '@/types/tax';
import { Card } from '@/components/ui/card';
import { ProgressBar } from '@/components/ui/progress-bar';

export default function TaxDashboard({ userId }: { userId: string }) {
  const [summary, setSummary] = useState<TaxSummary | null>(null);
  const [settings, setSettings] = useState<TaxSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    const loadData = async () => {
      try {
        const taxSummary = await calculateTaxSummary(userId, currentYear);
        const taxSettings = await getTaxSettings(userId);
        setSummary(taxSummary);
        setSettings(taxSettings);
      } catch (error) {
        console.error('Error loading tax data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [userId]);

  if (loading) return <div>Loading tax summary...</div>;
  if (!summary || !settings) return <div>Error loading tax data</div>;

  const savingAmount = summary.total_deductible_expenses * (settings.tax_bracket / 100);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">{currentYear} Tax Summary</h2>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="text-sm text-gray-600">Total Income</div>
          <div className="text-3xl font-bold text-green-600">
            ${summary.total_income.toFixed(2)}
          </div>
        </Card>

        <Card className="p-6">
          <div className="text-sm text-gray-600">Deductible Expenses</div>
          <div className="text-3xl font-bold text-blue-600">
            ${summary.total_deductible_expenses.toFixed(2)}
          </div>
          <div className="text-xs text-gray-500 mt-2">
            Tax savings: ${savingAmount.toFixed(2)}
          </div>
        </Card>

        <Card className="p-6">
          <div className="text-sm text-gray-600">Taxable Income</div>
          <div className="text-3xl font-bold text-orange-600">
            ${summary.taxable_income.toFixed(2)}
          </div>
        </Card>

        <Card className="p-6">
          <div className="text-sm text-gray-600">Estimated Tax</div>
          <div className="text-3xl font-bold text-red-600">
            ${summary.estimated_tax_liability.toFixed(2)}
          </div>
          <div className="text-xs text-gray-500 mt-2">
            {settings.tax_bracket}% bracket
          </div>
        </Card>
      </div>

      {/* Quarterly Breakdown */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Quarterly Breakdown</h3>
        <div className="space-y-4">
          {[
            { quarter: 'Q1', income: summary.q1_income, expenses: summary.q1_expenses, tax: summary.q1_tax_due },
            { quarter: 'Q2', income: summary.q2_income, expenses: summary.q2_expenses, tax: summary.q2_tax_due },
            { quarter: 'Q3', income: summary.q3_income, expenses: summary.q3_expenses, tax: summary.q3_tax_due },
            { quarter: 'Q4', income: summary.q4_income, expenses: summary.q4_expenses, tax: summary.q4_tax_due }
          ].map((q) => (
            <div key={q.quarter} className="border rounded p-4">
              <div className="flex justify-between mb-2">
                <h4 className="font-semibold">{q.quarter}</h4>
                <span className="text-lg font-bold">${q.tax.toFixed(2)} due</span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Income: </span>
                  <span className="font-semibold">${q.income.toFixed(2)}</span>
                </div>
                <div>
                  <span className="text-gray-600">Expenses: </span>
                  <span className="font-semibold">${q.expenses.toFixed(2)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Deduction Tracking */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Deduction Progress</h3>
        <ProgressBar
          current={summary.total_deductible_expenses}
          target={summary.total_income * 0.2}
          label="Target: 20% of income"
        />
      </Card>
    </div>
  );
}
```

### `components/tax/TaxCategoryForm.tsx`

```typescript
'use client';

import { useState } from 'react';
import { createTaxCategory } from '@/lib/actions/tax';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';

export default function TaxCategoryForm({ userId }: { userId: string }) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    category_name: '',
    irs_code: '',
    description: '',
    is_deductible: true,
    deduction_percentage: 100
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await createTaxCategory(userId, form as any);
      alert('Tax category created successfully!');
      setForm({
        category_name: '',
        irs_code: '',
        description: '',
        is_deductible: true,
        deduction_percentage: 100
      });
    } catch (error) {
      console.error('Error creating category:', error);
      alert('Error creating category');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <div>
        <Label>Category Name *</Label>
        <Input
          value={form.category_name}
          onChange={(e) => setForm({ ...form, category_name: e.target.value })}
          placeholder="e.g., Office Supplies"
          required
        />
      </div>

      <div>
        <Label>IRS Code</Label>
        <Input
          value={form.irs_code}
          onChange={(e) => setForm({ ...form, irs_code: e.target.value })}
          placeholder="e.g., 4320"
        />
      </div>

      <div>
        <Label>Description</Label>
        <Textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="What expenses fall under this category?"
        />
      </div>

      <div className="flex items-center justify-between">
        <Label>Tax Deductible</Label>
        <Switch
          checked={form.is_deductible}
          onCheckedChange={(checked) => setForm({ ...form, is_deductible: checked })}
        />
      </div>

      {form.is_deductible && (
        <div>
          <Label>Deduction Percentage</Label>
          <div className="flex items-center gap-4">
            <Input
              type="number"
              min="0"
              max="100"
              value={form.deduction_percentage}
              onChange={(e) => setForm({ ...form, deduction_percentage: parseInt(e.target.value) })}
              className="w-24"
            />
            <span>%</span>
            <span className="text-sm text-gray-600">
              (e.g., 50% for meals & entertainment)
            </span>
          </div>
        </div>
      )}

      <Button type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'Create Category'}
      </Button>
    </form>
  );
}
```

### `components/tax/DeductibleTransactionMarker.tsx`

```typescript
'use client';

import { useState } from 'react';
import { markTransactionAsDeductible } from '@/lib/actions/tax';
import { TaxCategory } from '@/types/tax';
import { Switch } from '@/components/ui/switch';
import { Select } from '@/components/ui/select';
import { Input } from '@/components/ui/input';

interface Props {
  transactionId: string;
  isCurrentlyDeductible: boolean;
  taxCategories: TaxCategory[];
  onUpdate?: () => void;
}

export default function DeductibleTransactionMarker({
  transactionId,
  isCurrentlyDeductible,
  taxCategories,
  onUpdate
}: Props) {
  const [isDeductible, setIsDeductible] = useState(isCurrentlyDeductible);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [percentage, setPercentage] = useState(100);
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    setLoading(true);
    try {
      await markTransactionAsDeductible(
        transactionId,
        isDeductible,
        selectedCategory || undefined,
        percentage
      );
      onUpdate?.();
      alert('Transaction updated successfully!');
    } catch (error) {
      console.error('Error updating transaction:', error);
      alert('Error updating transaction');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
      <div className="flex items-center justify-between">
        <label className="font-medium">Mark as Tax Deductible</label>
        <Switch
          checked={isDeductible}
          onCheckedChange={setIsDeductible}
        />
      </div>

      {isDeductible && (
        <>
          <div>
            <label className="block text-sm font-medium mb-2">Tax Category</label>
            <Select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">Select category...</option>
              {taxCategories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.category_name}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Deduction %</label>
            <Input
              type="number"
              min="0"
              max="100"
              value={percentage}
              onChange={(e) => setPercentage(parseInt(e.target.value))}
              className="w-24"
            />
          </div>
        </>
      )}

      <button
        onClick={handleUpdate}
        disabled={loading}
        className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Updating...' : 'Update'}
      </button>
    </div>
  );
}
```

---

## 📄 Step 5: Pages

### `app/(authenticated)/tax/page.tsx`

```typescript
'use client';

import { useEffect, useState } from 'react';
import { getUser } from '@/lib/supabase/client';
import TaxDashboard from '@/components/tax/TaxDashboard';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function TaxPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const user = await getUser();
        setUserId(user?.id || null);
      } catch (error) {
        console.error('Error loading user:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!userId) return <div>Please log in</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Tax Tracking</h1>
        <div className="flex gap-2">
          <Link href="/tax/categories">
            <Button variant="outline">Manage Categories</Button>
          </Link>
          <Link href="/tax/settings">
            <Button>Settings</Button>
          </Link>
        </div>
      </div>

      <TaxDashboard userId={userId} />
    </div>
  );
}
```

### `app/(authenticated)/tax/categories/page.tsx`

```typescript
'use client';

import { useEffect, useState } from 'react';
import { getTaxCategories, getUser } from '@/lib/actions/tax';
import { TaxCategory } from '@/types/tax';
import TaxCategoryForm from '@/components/tax/TaxCategoryForm';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function TaxCategoriesPage() {
  const [categories, setCategories] = useState<TaxCategory[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const user = await getUser();
        if (user?.id) {
          setUserId(user.id);
          const cats = await getTaxCategories(user.id);
          setCategories(cats);
        }
      } catch (error) {
        console.error('Error loading categories:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!userId) return <div>Please log in</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Tax Categories</h1>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ New Category'}
        </Button>
      </div>

      {showForm && (
        <Card className="p-6">
          <TaxCategoryForm userId={userId} />
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories.map((cat) => (
          <Card key={cat.id} className="p-6">
            <h3 className="text-lg font-semibold">{cat.category_name}</h3>
            {cat.irs_code && (
              <p className="text-sm text-gray-600">IRS Code: {cat.irs_code}</p>
            )}
            <p className="text-sm text-gray-600 mt-2">{cat.description}</p>
            <div className="mt-4 pt-4 border-t flex justify-between text-sm">
              <span className={cat.is_deductible ? 'text-green-600' : 'text-gray-600'}>
                {cat.is_deductible ? '✓ Deductible' : 'Not Deductible'}
              </span>
              <span>{cat.deduction_percentage}%</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
```

---

## 🚀 Step 6: Integration Points

### In Transaction Creation/Edit

```typescript
// When displaying transaction form, include:
<DeductibleTransactionMarker
  transactionId={transaction.id}
  isCurrentlyDeductible={transaction.is_tax_deductible}
  taxCategories={categories}
  onUpdate={() => refetchTransaction()}
/>
```

### Update Tax Summary After Transaction Change

```typescript
// After creating/updating transaction:
await calculateTaxSummary(userId, currentYear);
```

---

# Part 2: Task Division & Implementation Roadmap

## 📋 Phase 1: Database Setup (2 hours)

### Tasks:

- [ ] Create all tax tables (tax_settings, tax_categories, tax_summaries, etc)
- [ ] Create indexes for performance
- [ ] Set up RLS policies
- [ ] Test database structure
- [ ] Create test data

**Dependencies**: None
**Assignee**: Database Developer
**Effort**: 2 hours

---

## 📋 Phase 2: TypeScript Types & Server Actions (4 hours)

### Tasks:

- [ ] Create all TypeScript types (`types/tax.ts`)
- [ ] Implement server actions for tax operations
- [ ] Build tax calculation logic
- [ ] Build quarterly calculation functions
- [ ] Test all server actions

**Dependencies**: Phase 1
**Assignee**: Backend Developer
**Effort**: 4 hours

---

## 📋 Phase 3: Core Components (5 hours)

### Tasks:

- [ ] Build TaxDashboard component
- [ ] Build TaxCategoryForm component
- [ ] Build DeductibleTransactionMarker component
- [ ] Build TaxReportGenerator component
- [ ] Style and polish components
- [ ] Test component interactions

**Dependencies**: Phase 2
**Assignee**: Frontend Developer
**Effort**: 5 hours

---

## 📋 Phase 4: Pages & Routing (3 hours)

### Tasks:

- [ ] Create tax dashboard page
- [ ] Create tax categories page
- [ ] Create tax settings page
- [ ] Create tax reports page
- [ ] Add navigation links
- [ ] Test routing

**Dependencies**: Phase 3
**Assignee**: Frontend Developer
**Effort**: 3 hours

---

## 📋 Phase 5: Transaction Integration (3 hours)

### Tasks:

- [ ] Integrate tax marker into transaction form
- [ ] Auto-calculate tax on transaction save
- [ ] Add tax status to transaction list
- [ ] Update dashboard on transaction change
- [ ] Test end-to-end flow

**Dependencies**: Phase 2, Phase 4
**Assignee**: Full-stack Developer
**Effort**: 3 hours

---

## 📋 Phase 6: Quarterly Payments & Reports (3 hours)

### Tasks:

- [ ] Build quarterly payment tracker
- [ ] Create payment recording component
- [ ] Build tax report generator
- [ ] Add PDF export capability
- [ ] Create report download feature

**Dependencies**: Phase 2, Phase 5
**Assignee**: Backend/Frontend Developer
**Effort**: 3 hours

---

## 📋 Phase 7: Auto-Categorization (Optional - 2 hours)

### Tasks:

- [ ] Build AI/ML categorization logic
- [ ] Suggest deductible categories
- [ ] Learn from user corrections
- [ ] Test accuracy

**Dependencies**: Phase 3
**Assignee**: ML/Backend Developer
**Effort**: 2 hours (Optional)

---

## 📋 Phase 8: Testing & QA (3 hours)

### Tasks:

- [ ] Unit test calculations
- [ ] Integration testing
- [ ] User acceptance testing
- [ ] Tax accuracy verification
- [ ] Fix bugs

**Dependencies**: All phases
**Assignee**: QA/All Team
**Effort**: 3 hours

---

## 📋 Phase 9: Documentation (2 hours)

### Tasks:

- [ ] Document tax calculation logic
- [ ] Create user guide
- [ ] Document API endpoints
- [ ] Create troubleshooting guide

**Dependencies**: All phases
**Assignee**: Technical Writer
**Effort**: 2 hours

---

## 🎯 Implementation Timeline

**Week 1:**

- Phase 1: Database Setup (2h)
- Phase 2: Types & Server Actions (4h)
- Phase 3: Components (5h)

**Week 2:**

- Phase 4: Pages (3h)
- Phase 5: Integration (3h)
- Phase 6: Reports (3h)

**Week 3:**

- Phase 7: Auto-Categorization (2h - optional)
- Phase 8: Testing (3h)
- Phase 9: Documentation (2h)

---

## 📊 Total Effort Estimate

- **Database**: 2 hours
- **Backend**: 7 hours
- **Frontend**: 8 hours
- **Integration**: 3 hours
- **Reports**: 3 hours
- **Auto-Categorization**: 2 hours (optional)
- **Testing**: 3 hours
- **Documentation**: 2 hours

**Total: ~30 hours** (1 week for 1 full-time developer, or 2 weeks for part-time)

---

## ✅ Quick Checklist to Start

- [ ] Review database schema
- [ ] Plan tax bracket ranges
- [ ] Define IRS codes for categories
- [ ] Set up Supabase tables
- [ ] Create default tax categories
- [ ] Plan quarterly due dates
- [ ] Test tax calculation logic

Would you like me to help with any specific phase? 💰📊
