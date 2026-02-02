# Invoice & Transaction Integration Guide

## Overview

This guide shows how to implement seamless integration between the Invoice and Transaction modules, enabling users to convert paid invoices into income transactions automatically.

---

## Architecture

### Current State

```
Invoices (Independent)
├── invoices table
├── invoice_items table
└── invoice_payments table

Transactions (Independent)
├── transactions table
├── category_id reference
└── currency conversion support
```

### After Integration

```
Invoices → Record Payment → Convert to Transaction → Dashboard Analytics
     ↓
  payment_date
  amount
  currency
     ↓
   Creates
     ↓
Income Transaction in Ledger
```

---

## Implementation Steps

### Step 1: Add Invoice Reference to Transactions Table

**Database Migration:**

```sql
-- Add invoice_id column to transactions table
ALTER TABLE transactions ADD COLUMN invoice_id UUID REFERENCES invoices(id) ON DELETE SET NULL;
ALTER TABLE transactions ADD COLUMN invoice_payment_id UUID REFERENCES invoice_payments(id) ON DELETE SET NULL;

-- Create indexes for faster queries
CREATE INDEX idx_transactions_invoice_id ON transactions(invoice_id);
CREATE INDEX idx_transactions_invoice_payment_id ON transactions(invoice_payment_id);
```

**Why?**

- Links transactions back to their source invoice
- Allows filtering/reporting on invoice-related income
- Maintains audit trail

---

### Step 2: Create Invoice-to-Transaction Conversion Function

**File: `lib/actions/invoices.ts`**

Add this new function:

```typescript
// Convert invoice payment to transaction
export async function convertInvoicePaymentToTransaction(
  invoiceId: string,
  paymentId: string
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated");

  // Get invoice and payment details
  const invoice = await getInvoice(invoiceId);
  const { data: payment } = await supabase
    .from("invoice_payments")
    .select("*")
    .eq("id", paymentId)
    .single();

  if (!payment) throw new Error("Payment not found");

  // Get business to find income category
  const { data: business } = await supabase
    .from("businesses")
    .select("id, base_currency")
    .eq("user_id", user.id)
    .single();

  if (!business) throw new Error("Business not found");

  // Find or create "Invoice Income" category
  let { data: incomeCat } = await supabase
    .from("categories")
    .select("id")
    .eq("business_id", business.id)
    .eq("name", "Invoice Income")
    .eq("type", "income")
    .single();

  if (!incomeCat) {
    const { data: newCat } = await supabase
      .from("categories")
      .insert({
        business_id: business.id,
        name: "Invoice Income",
        type: "income",
        is_default: false,
      })
      .select()
      .single();
    incomeCat = newCat;
  }

  // Create transaction from payment
  const { data: transaction, error } = await supabase
    .from("transactions")
    .insert({
      business_id: business.id,
      category_id: incomeCat.id,
      amount: payment.amount,
      currency: invoice.currency,
      base_amount: payment.amount, // Will recalculate with exchange rate if needed
      transaction_date: payment.payment_date,
      payment_method: payment.payment_method || "transfer",
      client_vendor: invoice.client_name,
      notes: `Payment received for Invoice ${invoice.invoice_number}`,
      invoice_id: invoiceId,
      invoice_payment_id: paymentId,
    })
    .select("*, category:categories(*)")
    .single();

  if (error) throw error;

  return transaction;
}
```

---

### Step 3: Create UI Component for Transaction Conversion

**File: `components/invoices/ConvertToTransactionButton.tsx`** (New File)

```typescript
"use client";

import { useState } from "react";
import { Invoice, InvoicePayment } from "@/types/invoice";
import { convertInvoicePaymentToTransaction } from "@/lib/actions/invoices";
import { Button } from "@/components/ui/button";

interface ConvertToTransactionButtonProps {
  invoice: Invoice;
  payment: InvoicePayment;
  onSuccess?: () => void;
}

export default function ConvertToTransactionButton({
  invoice,
  payment,
  onSuccess,
}: ConvertToTransactionButtonProps) {
  const [loading, setLoading] = useState(false);
  const [converted, setConverted] = useState(false);

  const handleConvert = async () => {
    setLoading(true);
    try {
      await convertInvoicePaymentToTransaction(invoice.id, payment.id!);
      setConverted(true);
      onSuccess?.();
    } catch (error) {
      console.error("Error converting to transaction:", error);
      alert("Failed to convert to transaction");
    } finally {
      setLoading(false);
    }
  };

  if (converted) {
    return (
      <div className="text-sm text-green-600 font-medium">
        ✓ Converted to transaction
      </div>
    );
  }

  return (
    <Button
      onClick={handleConvert}
      disabled={loading}
      variant="outline"
      size="sm"
    >
      {loading ? "Converting..." : "Convert to Transaction"}
    </Button>
  );
}
```

---

### Step 4: Update Payment Form to Show Conversion Option

**File: `components/invoices/PaymentForm.tsx`** (Modify)

Add after successful payment recording:

```typescript
import ConvertToTransactionButton from "./ConvertToTransactionButton";

// In the payment form, after recording payment:
const [lastPayment, setLastPayment] = useState<InvoicePayment | null>(null);

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);

  try {
    const payment = await recordPayment(
      invoice.id,
      parseFloat(amount),
      paymentDate
    );
    setLastPayment(payment); // Store the payment
    onPaymentRecorded?.();
  } catch (error) {
    console.error("Error recording payment:", error);
  } finally {
    setLoading(false);
  }
};

// In JSX, show conversion button after payment recorded:
{lastPayment && (
  <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
    <p className="text-sm text-blue-900 mb-3">
      Payment recorded! Would you like to add this to your transactions?
    </p>
    <ConvertToTransactionButton
      invoice={invoice}
      payment={lastPayment}
      onSuccess={() => {
        setLastPayment(null);
      }}
    />
  </div>
)}
```

---

### Step 5: Show Transaction Status in Invoice Details

**File: `components/invoices/InvoiceDetailClient.tsx`** (Modify)

Add transaction info display:

```typescript
// Add hook to track related transactions
const [relatedTransaction, setRelatedTransaction] = useState<any>(null);

useEffect(() => {
  const checkForTransaction = async () => {
    if (invoice?.id) {
      const { data: transactions } = await supabase
        .from("transactions")
        .select("*")
        .eq("invoice_id", invoiceId)
        .single();

      setRelatedTransaction(transactions);
    }
  };

  if (invoice) checkForTransaction();
}, [invoice]);

// In JSX, show transaction status:
{relatedTransaction && (
  <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
    <p className="text-green-800 font-semibold">
      ✓ Transaction recorded
    </p>
    <p className="text-green-700 text-sm mt-1">
      This invoice payment is tracked in your ledger
    </p>
  </div>
)}
```

---

## Integration Scenarios

### Scenario 1: Quick Conversion (Recommended)

```
1. User creates invoice
2. User records payment
3. Quick "Convert to Transaction" button appears
4. Payment automatically becomes income transaction
5. Dashboard shows updated balance
```

### Scenario 2: Batch Conversion (Admin)

```
1. Multiple invoices marked as paid
2. Admin dashboard shows "Unconverted Payments"
3. Click "Sync to Ledger" to convert all at once
4. Transactions created with audit trail
```

### Scenario 3: Automatic Conversion (Advanced)

```
1. Set preference: "Auto-convert invoice payments"
2. Record payment → Automatically creates transaction
3. User can still manually adjust/undo if needed
```

---

## Data Flow Example

```
Create Invoice
  ↓
Invoice #INV-001: $1,000 USD to "Acme Corp"
  ↓
Record Payment: $1,000 on Jan 15, 2026
  ↓
Button: "Convert to Transaction"
  ↓
Creates Transaction:
  - Amount: $1,000
  - Currency: USD
  - Category: "Invoice Income"
  - Date: Jan 15, 2026
  - Client: "Acme Corp"
  - Notes: "Payment received for Invoice INV-001"
  - Linked to: invoice_id, invoice_payment_id
  ↓
Dashboard Updates:
  - Total Income: +$1,000
  - Ledger shows transaction
  - Monthly revenue includes this payment
```

---

## Database Schema Changes

### invoices table (No changes needed)

Already tracks:

- invoice_number, total_amount, currency
- client_name
- status, payment_status

### invoice_payments table (No changes needed)

Already tracks:

- amount, payment_date
- payment_method

### transactions table (Add 2 columns)

```sql
invoice_id UUID -- Links back to source invoice
invoice_payment_id UUID -- Links to specific payment record
```

---

## Query Examples

### Get all transactions from invoices

```typescript
const { data: invoiceTransactions } = await supabase
  .from("transactions")
  .select("*, invoice:invoices(*)")
  .not("invoice_id", "is", null)
  .order("transaction_date", { ascending: false });
```

### Get unpaid invoices not yet converted

```typescript
const { data: unconverted } = await supabase
  .from("invoices")
  .select("*, payments:invoice_payments(*)")
  .eq("payment_status", "paid")
  .not(
    "id",
    "in",
    "(SELECT DISTINCT invoice_id FROM transactions WHERE invoice_id IS NOT NULL)"
  );
```

### Get invoice with its transaction

```typescript
const { data: invoice } = await supabase
  .from("invoices")
  .select("*, transactions:transactions(*)")
  .eq("id", invoiceId)
  .single();
```

---

## API Changes Summary

### New Functions in `lib/actions/invoices.ts`

- `convertInvoicePaymentToTransaction()` - Convert single payment to transaction
- `getInvoiceTransactions()` - Get all transactions from an invoice
- `syncAllInvoicePayments()` - Batch convert all unpaid invoices

### New Components

- `ConvertToTransactionButton.tsx` - Quick action button
- `InvoiceTransactionStatus.tsx` - Shows transaction status
- `UnconvertedPaymentsList.tsx` - Shows payments pending conversion

---

## Benefits After Implementation

✅ **Complete Financial Picture**: Dashboard shows both invoices sent and payments received
✅ **Automated Bookkeeping**: No manual entry of invoice payments into transactions
✅ **Audit Trail**: Every transaction linked back to original invoice
✅ **Currency Handling**: Invoices in different currencies auto-convert when creating transaction
✅ **Report Generation**: Can report on "Invoice Revenue" separately
✅ **Tax Compliance**: Clear record of which income came from invoices

---

## Testing Checklist

- [ ] Create invoice with items and tax
- [ ] Record partial payment
- [ ] Click "Convert to Transaction"
- [ ] Verify transaction appears in Ledger
- [ ] Verify Dashboard updates with new income
- [ ] Check currency conversion if different
- [ ] Verify invoice shows "Transaction recorded" status
- [ ] Test with multiple payments on same invoice
- [ ] Verify transaction links back to invoice via ID
- [ ] Test batch conversion of multiple invoices
