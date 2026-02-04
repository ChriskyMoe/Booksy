export interface InvoiceLineItem {
  catalogItemId: string;
  quantity: number;
}

export interface InvoiceItemWithDetails extends InvoiceLineItem {
  name: string;
  description?: string;
  unit_price: number;
  unit: string;
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
  type: "income" | "expense";
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

  invoice_line_items: InvoiceLineItem[];
  items?: InvoiceItemWithDetails[]; // Enriched items with full catalog details
  payments: InvoicePayment[];

  created_at: string;
  updated_at: string;
  user_id: string;
}

export interface CreateInvoicePayload {
  type: "income" | "expense";
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
  invoice_line_items: InvoiceLineItem[];
}
