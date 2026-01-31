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
