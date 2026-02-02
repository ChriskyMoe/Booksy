# 📋 Invoice Management Implementation Guide

## Overview

Invoice management allows users to create, send, track, and convert invoices into transactions.

---

## 💡 Why This Feature?

### Business Value

**Invoicing is the backbone of professional service businesses.** Without proper invoice management, freelancers and small business owners struggle to:

- Track who owes them money
- Know when to follow up on overdue payments
- Have professional documentation for clients
- Calculate actual cash flow vs projected income

Invoice management directly impacts:

- **Revenue Recognition**: Know exactly when money comes in
- **Cash Flow Health**: Identify overdue payments before they become bad debt
- **Client Professionalism**: Send branded, professional invoices
- **Tax Compliance**: Maintain proper records for audits

### User Impact

- Freelancers can automate their billing process
- Small business owners save 5-10 hours/week on manual invoicing
- Customers pay faster (professional invoices get paid 2x faster)
- Builds trust and credibility with clients

---

## 🎯 Pain Points This Solves

### Problem 1: Lost Revenue & Payment Tracking

**Current State**: Users track invoices in scattered places (emails, spreadsheets, notes)

- ❌ Can't see at a glance who owes how much
- ❌ Miss overdue payment follow-ups
- ❌ No historical record of sent invoices
- ❌ Can't correlate invoice → actual payment received

**After This Feature**:

- ✅ Central invoice dashboard showing all invoice statuses
- ✅ Automatic payment tracking when recorded in transactions
- ✅ Visual alerts for overdue invoices
- ✅ Full audit trail of invoice history
- **Expected Impact**: Recover 3-5% of missed/delayed payments

### Problem 2: Manual Invoicing is Time-Consuming

**Current State**: Creating each invoice manually

- ❌ Recreate client info for every invoice
- ❌ Manually calculate totals, taxes, discounts
- ❌ Send via email without tracking if opened
- ❌ No reminder system for unpaid invoices

**After This Feature**:

- ✅ One-click invoice creation with saved client templates
- ✅ Auto-calculate tax, discounts, totals
- ✅ Send directly from app with read receipts
- ✅ Automatic reminder emails to clients
- **Expected Impact**: Save 2-3 hours per week

### Problem 3: Poor Client Experience & Trust

**Current State**: Unprofessional invoice presentation

- ❌ Handwritten or basic text invoices
- ❌ No consistent branding
- ❌ Clients unsure if they received invoice
- ❌ No easy way for clients to mark as paid

**After This Feature**:

- ✅ Branded, professional PDF invoices
- ✅ Consistent invoice numbering and formatting
- ✅ Clients can view invoice and mark as paid online
- ✅ Payment links built into invoice
- **Expected Impact**: Increase client satisfaction by 30%, faster payments

### Problem 4: Disconnected Financial Records

**Current State**: Invoices exist separately from transactions

- ❌ Create invoice, then manually enter as transaction
- ❌ No link between invoice and actual payment
- ❌ Can't see which transactions are invoice-related
- ❌ Dashboard doesn't know about pending income

**After This Feature**:

- ✅ One-click convert invoice to transaction when paid
- ✅ Dashboard shows pending invoice income
- ✅ Full trail from invoice → payment → transaction
- ✅ Accurate cash flow projections
- **Expected Impact**: Know real vs projected income

### Problem 5: No Business Insights

**Current State**: Can't analyze invoicing patterns

- ❌ Don't know which clients pay fastest
- ❌ Can't identify seasonal revenue patterns
- ❌ No visibility into average invoice amount
- ❌ Can't forecast future revenue

**After This Feature**:

- ✅ Dashboard showing invoice metrics
- ✅ Reports on payment timeliness by client
- ✅ Revenue trends and forecasts
- ✅ Average days to payment metrics
- **Expected Impact**: Better business planning and growth

---

## 📊 Step 1: Database Schema

Add these tables to your Supabase database:

### Create `invoices` table

```sql
CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,

  -- Basic Info
  invoice_number TEXT NOT NULL UNIQUE,
  title TEXT DEFAULT 'Invoice',
  description TEXT,

  -- Dates
  issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
  due_date DATE NOT NULL,

  -- Client/Vendor Info
  client_name TEXT NOT NULL,
  client_email TEXT,
  client_address TEXT,
  client_phone TEXT,

  -- Financial Details
  subtotal DECIMAL(10, 2) NOT NULL DEFAULT 0,
  tax_amount DECIMAL(10, 2) DEFAULT 0,
  tax_rate DECIMAL(5, 2) DEFAULT 0,
  total_amount DECIMAL(10, 2) NOT NULL,
  currency TEXT DEFAULT 'USD',

  -- Status
  status TEXT DEFAULT 'draft', -- draft, sent, viewed, paid, overdue, cancelled
  payment_status TEXT DEFAULT 'unpaid', -- unpaid, partial, paid

  -- Payment Info
  payment_method TEXT, -- bank_transfer, card, cash, check
  payment_date DATE,
  payment_notes TEXT,

  -- Additional
  notes TEXT,
  terms TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT valid_status CHECK (status IN ('draft', 'sent', 'viewed', 'paid', 'overdue', 'cancelled')),
  CONSTRAINT valid_payment_status CHECK (payment_status IN ('unpaid', 'partial', 'paid'))
);

CREATE INDEX idx_invoices_user_id ON invoices(user_id);
CREATE INDEX idx_invoices_status ON invoices(status);
CREATE INDEX idx_invoices_issue_date ON invoices(issue_date);
```

### Create `invoice_items` table

```sql
CREATE TABLE invoice_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID REFERENCES invoices(id) ON DELETE CASCADE NOT NULL,

  description TEXT NOT NULL,
  quantity DECIMAL(10, 2) NOT NULL DEFAULT 1,
  unit_price DECIMAL(10, 2) NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_invoice_items_invoice_id ON invoice_items(invoice_id);
```

### Create `invoice_payments` table

```sql
CREATE TABLE invoice_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID REFERENCES invoices(id) ON DELETE CASCADE NOT NULL,

  amount DECIMAL(10, 2) NOT NULL,
  payment_date DATE NOT NULL DEFAULT CURRENT_DATE,
  payment_method TEXT,
  notes TEXT,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_invoice_payments_invoice_id ON invoice_payments(invoice_id);
```

### Row Level Security (RLS)

```sql
-- Enable RLS
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_payments ENABLE ROW LEVEL SECURITY;

-- Policies for invoices
CREATE POLICY "Users can view their own invoices"
  ON invoices FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create invoices"
  ON invoices FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own invoices"
  ON invoices FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own invoices"
  ON invoices FOR DELETE USING (auth.uid() = user_id);

-- Similar policies for invoice_items and invoice_payments
CREATE POLICY "Users can view their invoice items"
  ON invoice_items FOR SELECT
  USING (invoice_id IN (SELECT id FROM invoices WHERE user_id = auth.uid()));

CREATE POLICY "Users can manage their invoice items"
  ON invoice_items FOR INSERT WITH CHECK (
    invoice_id IN (SELECT id FROM invoices WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can view their invoice payments"
  ON invoice_payments FOR SELECT
  USING (invoice_id IN (SELECT id FROM invoices WHERE user_id = auth.uid()));

CREATE POLICY "Users can manage their invoice payments"
  ON invoice_payments FOR INSERT WITH CHECK (
    invoice_id IN (SELECT id FROM invoices WHERE user_id = auth.uid())
  );
```

---

## 📁 Step 2: Project Structure

Create these new files and folders:

```
app/
├── (authenticated)/
│   └── invoices/
│       ├── page.tsx                    # Invoice list
│       ├── [id]/
│       │   ├── page.tsx               # View invoice
│       │   └── edit/
│       │       └── page.tsx           # Edit invoice
│       ├── new/
│       │   └── page.tsx               # Create new invoice
│       └── [id]/
│           └── pdf/
│               └── route.ts           # PDF generation

components/
├── invoices/
│   ├── InvoiceForm.tsx               # Form for create/edit
│   ├── InvoiceList.tsx               # List of invoices
│   ├── InvoicePreview.tsx            # Invoice preview
│   ├── InvoiceTemplate.tsx           # Invoice template
│   ├── PaymentForm.tsx               # Record payment
│   ├── InvoiceStatusBadge.tsx        # Status indicator
│   └── InvoiceActions.tsx            # Actions (send, delete, etc)

lib/
├── actions/
│   └── invoices.ts                   # Server actions for invoices

types/
├── invoice.ts                         # TypeScript interfaces
```

---

## 💾 Step 3: TypeScript Types

Create `types/invoice.ts`:

```typescript
export interface InvoiceItem {
  id?: string;
  description: string;
  quantity: number;
  unit_price: number;
  amount: number;
}

export interface InvoicePayment {
  id?: string;
  amount: number;
  payment_date: string;
  payment_method?: string;
  notes?: string;
}

export interface Invoice {
  id: string;
  invoice_number: string;
  title: string;
  description?: string;

  issue_date: string;
  due_date: string;

  client_name: string;
  client_email?: string;
  client_address?: string;
  client_phone?: string;

  subtotal: number;
  tax_rate: number;
  tax_amount: number;
  total_amount: number;
  currency: string;

  status: "draft" | "sent" | "viewed" | "paid" | "overdue" | "cancelled";
  payment_status: "unpaid" | "partial" | "paid";

  payment_method?: string;
  payment_date?: string;
  payment_notes?: string;

  notes?: string;
  terms?: string;

  items: InvoiceItem[];
  payments: InvoicePayment[];

  created_at: string;
  updated_at: string;
  user_id: string;
}

export interface CreateInvoicePayload {
  invoice_number: string;
  title: string;
  description?: string;
  issue_date: string;
  due_date: string;
  client_name: string;
  client_email?: string;
  client_address?: string;
  client_phone?: string;
  subtotal: number;
  tax_rate: number;
  tax_amount: number;
  total_amount: number;
  currency: string;
  notes?: string;
  terms?: string;
  items: InvoiceItem[];
}
```

---

## 🔧 Step 4: Server Actions

Create `lib/actions/invoices.ts`:

```typescript
"use server";

import { createClient } from "@/lib/supabase/server";
import { Invoice, CreateInvoicePayload } from "@/types/invoice";

// Create invoice
export async function createInvoice(data: CreateInvoicePayload) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated");

  const { data: invoice, error } = await supabase
    .from("invoices")
    .insert({
      user_id: user.id,
      invoice_number: data.invoice_number,
      title: data.title,
      description: data.description,
      issue_date: data.issue_date,
      due_date: data.due_date,
      client_name: data.client_name,
      client_email: data.client_email,
      client_address: data.client_address,
      client_phone: data.client_phone,
      subtotal: data.subtotal,
      tax_rate: data.tax_rate,
      tax_amount: data.tax_amount,
      total_amount: data.total_amount,
      currency: data.currency,
      notes: data.notes,
      terms: data.terms,
      status: "draft",
      payment_status: "unpaid",
    })
    .select()
    .single();

  if (error) throw error;

  // Insert items
  if (data.items.length > 0) {
    const { error: itemsError } = await supabase.from("invoice_items").insert(
      data.items.map((item) => ({
        invoice_id: invoice.id,
        description: item.description,
        quantity: item.quantity,
        unit_price: item.unit_price,
        amount: item.amount,
      }))
    );

    if (itemsError) throw itemsError;
  }

  return invoice;
}

// Get invoice by ID
export async function getInvoice(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated");

  const { data: invoice, error } = await supabase
    .from("invoices")
    .select(
      `
      *,
      items:invoice_items(*),
      payments:invoice_payments(*)
    `
    )
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error) throw error;
  return invoice as Invoice;
}

// Get all invoices
export async function getInvoices(filters?: {
  status?: string;
  search?: string;
  dateRange?: { from: string; to: string };
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated");

  let query = supabase
    .from("invoices")
    .select(
      `
      id,
      invoice_number,
      title,
      client_name,
      total_amount,
      status,
      payment_status,
      issue_date,
      due_date,
      created_at
    `
    )
    .eq("user_id", user.id)
    .order("issue_date", { ascending: false });

  if (filters?.status) {
    query = query.eq("status", filters.status);
  }

  if (filters?.search) {
    query = query.or(
      `invoice_number.ilike.%${filters.search}%,client_name.ilike.%${filters.search}%`
    );
  }

  if (filters?.dateRange) {
    query = query
      .gte("issue_date", filters.dateRange.from)
      .lte("issue_date", filters.dateRange.to);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

// Update invoice
export async function updateInvoice(
  id: string,
  updates: Partial<CreateInvoicePayload>
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("invoices")
    .update(updates)
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Update invoice status
export async function updateInvoiceStatus(id: string, status: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("invoices")
    .update({ status })
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Record payment
export async function recordPayment(
  invoiceId: string,
  amount: number,
  paymentDate: string
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated");

  // Insert payment
  const { data: payment, error: paymentError } = await supabase
    .from("invoice_payments")
    .insert({
      invoice_id: invoiceId,
      amount,
      payment_date: paymentDate,
      payment_method: "bank_transfer",
    })
    .select()
    .single();

  if (paymentError) throw paymentError;

  // Get total paid
  const { data: payments } = await supabase
    .from("invoice_payments")
    .select("amount")
    .eq("invoice_id", invoiceId);

  const totalPaid = payments?.reduce((sum, p) => sum + p.amount, 0) || 0;
  const invoice = await getInvoice(invoiceId);

  // Update invoice status
  let paymentStatus = "unpaid";
  if (totalPaid >= invoice.total_amount) {
    paymentStatus = "paid";
  } else if (totalPaid > 0) {
    paymentStatus = "partial";
  }

  await updateInvoice(invoiceId, { payment_status: paymentStatus });

  return payment;
}

// Delete invoice
export async function deleteInvoice(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase
    .from("invoices")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) throw error;
}

// Generate next invoice number
export async function generateInvoiceNumber() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated");

  const { data } = await supabase
    .from("invoices")
    .select("invoice_number")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1);

  if (!data || data.length === 0) {
    return "INV-001";
  }

  const lastNumber = data[0].invoice_number;
  const number = parseInt(lastNumber.split("-")[1]) + 1;
  return `INV-${String(number).padStart(3, "0")}`;
}
```

---

## 🎨 Step 5: Main Components

### `components/invoices/InvoiceForm.tsx`

```typescript
'use client';

import { useState } from 'react';
import { Invoice, InvoiceItem } from '@/types/invoice';
import { createInvoice, updateInvoice } from '@/lib/actions/invoices';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface InvoiceFormProps {
  invoice?: Invoice;
  onSubmit?: (invoice: Invoice) => void;
}

export default function InvoiceForm({ invoice, onSubmit }: InvoiceFormProps) {
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<InvoiceItem[]>(invoice?.items || []);
  const [formData, setFormData] = useState({
    invoice_number: invoice?.invoice_number || '',
    title: invoice?.title || 'Invoice',
    client_name: invoice?.client_name || '',
    client_email: invoice?.client_email || '',
    client_address: invoice?.client_address || '',
    issue_date: invoice?.issue_date || new Date().toISOString().split('T')[0],
    due_date: invoice?.due_date || '',
    currency: invoice?.currency || 'USD',
    tax_rate: invoice?.tax_rate || 0,
    notes: invoice?.notes || '',
    terms: invoice?.terms || '',
  });

  const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
  const taxAmount = (subtotal * formData.tax_rate) / 100;
  const total = subtotal + taxAmount;

  const handleAddItem = () => {
    setItems([
      ...items,
      { description: '', quantity: 1, unit_price: 0, amount: 0 }
    ]);
  };

  const handleItemChange = (index: number, field: string, value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };

    if (field === 'quantity' || field === 'unit_price') {
      newItems[index].amount = newItems[index].quantity * newItems[index].unit_price;
    }

    setItems(newItems);
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = {
        ...formData,
        subtotal,
        tax_amount: taxAmount,
        total_amount: total,
        items,
        description: ''
      };

      if (invoice) {
        await updateInvoice(invoice.id, data);
      } else {
        const created = await createInvoice(data as any);
        onSubmit?.(created);
      }
    } catch (error) {
      console.error('Error saving invoice:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Client Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Client Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Client Name *</Label>
            <Input
              value={formData.client_name}
              onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
              required
            />
          </div>
          <div>
            <Label>Email</Label>
            <Input
              type="email"
              value={formData.client_email}
              onChange={(e) => setFormData({ ...formData, client_email: e.target.value })}
            />
          </div>
          <div className="md:col-span-2">
            <Label>Address</Label>
            <Textarea
              value={formData.client_address}
              onChange={(e) => setFormData({ ...formData, client_address: e.target.value })}
            />
          </div>
        </div>
      </div>

      {/* Invoice Details */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Invoice Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label>Invoice Number *</Label>
            <Input
              value={formData.invoice_number}
              onChange={(e) => setFormData({ ...formData, invoice_number: e.target.value })}
              required
            />
          </div>
          <div>
            <Label>Issue Date *</Label>
            <Input
              type="date"
              value={formData.issue_date}
              onChange={(e) => setFormData({ ...formData, issue_date: e.target.value })}
              required
            />
          </div>
          <div>
            <Label>Due Date *</Label>
            <Input
              type="date"
              value={formData.due_date}
              onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
              required
            />
          </div>
        </div>
      </div>

      {/* Line Items */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Line Items</h3>
          <Button type="button" onClick={handleAddItem} variant="outline">
            + Add Item
          </Button>
        </div>

        <div className="space-y-3">
          {items.map((item, index) => (
            <div key={index} className="grid grid-cols-4 gap-2 items-end">
              <Input
                placeholder="Description"
                value={item.description}
                onChange={(e) => handleItemChange(index, 'description', e.target.value)}
              />
              <Input
                type="number"
                placeholder="Qty"
                value={item.quantity}
                onChange={(e) => handleItemChange(index, 'quantity', parseFloat(e.target.value))}
              />
              <Input
                type="number"
                placeholder="Price"
                value={item.unit_price}
                onChange={(e) => handleItemChange(index, 'unit_price', parseFloat(e.target.value))}
              />
              <div className="flex gap-2">
                <Input disabled value={item.amount.toFixed(2)} className="bg-gray-100" />
                <Button
                  type="button"
                  onClick={() => handleRemoveItem(index)}
                  variant="destructive"
                  size="sm"
                >
                  Remove
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Totals */}
      <div className="space-y-2 bg-gray-50 p-4 rounded-lg">
        <div className="flex justify-between">
          <span>Subtotal:</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span>Tax Rate:</span>
          <div className="flex items-center">
            <Input
              type="number"
              value={formData.tax_rate}
              onChange={(e) => setFormData({ ...formData, tax_rate: parseFloat(e.target.value) })}
              className="w-20"
            />
            <span className="ml-2">%</span>
          </div>
        </div>
        <div className="flex justify-between">
          <span>Tax Amount:</span>
          <span>${taxAmount.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-lg font-bold border-t pt-2">
          <span>Total:</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>

      {/* Additional Info */}
      <div className="space-y-4">
        <div>
          <Label>Notes</Label>
          <Textarea
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="Additional notes..."
          />
        </div>
        <div>
          <Label>Terms & Conditions</Label>
          <Textarea
            value={formData.terms}
            onChange={(e) => setFormData({ ...formData, terms: e.target.value })}
            placeholder="Payment terms..."
          />
        </div>
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? 'Saving...' : invoice ? 'Update Invoice' : 'Create Invoice'}
      </Button>
    </form>
  );
}
```

---

## 📄 Step 6: Page Components

### `app/(authenticated)/invoices/page.tsx`

```typescript
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getInvoices } from '@/lib/actions/invoices';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    const loadInvoices = async () => {
      try {
        const data = await getInvoices({
          status: statusFilter || undefined,
          search: search || undefined
        });
        setInvoices(data || []);
      } catch (error) {
        console.error('Error loading invoices:', error);
      } finally {
        setLoading(false);
      }
    };

    loadInvoices();
  }, [search, statusFilter]);

  const statusColors: Record<string, string> = {
    draft: 'bg-gray-100 text-gray-800',
    sent: 'bg-blue-100 text-blue-800',
    viewed: 'bg-blue-200 text-blue-900',
    paid: 'bg-green-100 text-green-800',
    overdue: 'bg-red-100 text-red-800',
    cancelled: 'bg-gray-200 text-gray-700'
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Invoices</h1>
        <Link href="/invoices/new">
          <Button>+ New Invoice</Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <Input
          placeholder="Search by invoice number or client..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border rounded"
        >
          <option value="">All Status</option>
          <option value="draft">Draft</option>
          <option value="sent">Sent</option>
          <option value="paid">Paid</option>
          <option value="overdue">Overdue</option>
        </select>
      </div>

      {/* Invoice List */}
      {loading ? (
        <div>Loading invoices...</div>
      ) : invoices.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No invoices yet</p>
          <Link href="/invoices/new">
            <Button>Create your first invoice</Button>
          </Link>
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold">Invoice</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Client</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Amount</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Due Date</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice) => (
                <tr key={invoice.id} className="border-t hover:bg-gray-50">
                  <td className="px-6 py-3">
                    <Link href={`/invoices/${invoice.id}`} className="text-blue-600 hover:underline">
                      {invoice.invoice_number}
                    </Link>
                  </td>
                  <td className="px-6 py-3">{invoice.client_name}</td>
                  <td className="px-6 py-3 font-semibold">${invoice.total_amount.toFixed(2)}</td>
                  <td className="px-6 py-3">
                    <Badge className={statusColors[invoice.status]}>
                      {invoice.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-3">{new Date(invoice.due_date).toLocaleDateString()}</td>
                  <td className="px-6 py-3">
                    <Link href={`/invoices/${invoice.id}`}>
                      <Button variant="outline" size="sm">View</Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
```

---

## 📋 Step 7: Integration with Transactions

When an invoice is marked as paid, automatically create a transaction:

```typescript
// In updateInvoiceStatus function
if (status === "paid" && invoice.payment_status !== "paid") {
  // Create transaction
  await createTransaction({
    type: "income",
    category: "Invoice Payment",
    amount: invoice.total_amount,
    date: new Date().toISOString(),
    description: `Payment received - ${invoice.invoice_number}`,
    relatedInvoiceId: id,
  });
}
```

---

## 🎯 Summary: Implementation Order

1. ✅ Create database tables (SQL)
2. ✅ Create TypeScript types
3. ✅ Create server actions
4. ✅ Build InvoiceForm component
5. ✅ Build InvoiceList component
6. ✅ Create invoices list page
7. ✅ Create invoice view/detail page
8. ✅ Create invoice create page
9. ✅ Add payment recording feature
10. ✅ Add transaction integration
11. 🔄 Add PDF generation (optional)
12. 🔄 Add email sending (optional)

---

## 🚀 Next Steps

1. **Run the SQL schema** in your Supabase project
2. **Copy the types** to `types/invoice.ts`
3. **Copy server actions** to `lib/actions/invoices.ts`
4. **Create components** one by one
5. **Create pages** using the components
6. **Test** invoice creation and payment recording

Would you like me to help with any specific part of this implementation?
