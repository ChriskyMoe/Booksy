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
