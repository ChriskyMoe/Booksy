"use server";

import { createClient } from "@/lib/supabase/server";
import { createTransaction } from "@/lib/actions/transactions";
import { Invoice, CreateInvoicePayload } from "@/types/invoice";

// Create invoice
export async function createInvoice(data: CreateInvoicePayload) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated");

  // Get business to link invoice
  const { data: business } = await supabase
    .from("businesses")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (!business) throw new Error("Business not found");

  const { data: invoice, error } = await supabase
    .from("invoices")
    .insert({
      user_id: user.id,
      business_id: business.id,
      type: data.type || "income",
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
      invoice_line_items: data.invoice_line_items,
      status: "draft",
      payment_status: "unpaid",
    })
    .select()
    .single();

  if (error) throw error;

  return invoice;
}

// Get invoice by ID
export async function getInvoice(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("invoices")
    .select(
      `
      *,
      invoice_payments(*)
    `
    )
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error) throw error;
  if (!data) throw new Error("Invoice not found");

  // Fetch catalog item details for invoice line items
  const invoice = data as any;
  const lineItems = invoice.invoice_line_items || [];

  let enrichedItems = [];
  if (lineItems.length > 0) {
    const catalogIds = lineItems.map((item: any) => item.catalogItemId);

    const { data: catalogItems } = await supabase
      .from("invoice_catalog_items")
      .select("*")
      .in("id", catalogIds);

    // Enrich line items with catalog details
    enrichedItems = lineItems.map((lineItem: any) => {
      const catalogItem = catalogItems?.find(
        (c) => c.id === lineItem.catalogItemId
      );
      if (catalogItem) {
        return {
          catalogItemId: lineItem.catalogItemId,
          quantity: lineItem.quantity,
          name: catalogItem.name,
          description: catalogItem.description,
          unit_price: catalogItem.unit_price,
          unit: catalogItem.unit,
          amount: lineItem.quantity * catalogItem.unit_price,
        };
      }
      return lineItem;
    });
  }

  return {
    ...invoice,
    invoice_line_items: lineItems,
    items: enrichedItems,
    payments: invoice.invoice_payments || [],
  } as Invoice;
}

// Get all invoices
export async function getInvoices(filters?: {
  status?: string;
  type?: "income" | "expense";
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
      type,
      created_at
    `
    )
    .eq("user_id", user.id)
    .order("issue_date", { ascending: false });

  if (filters?.status) {
    query = query.eq("status", filters.status);
  }

  if (filters?.type) {
    query = query.eq("type", filters.type);
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

  // Get business to verify ownership
  const { data: business } = await supabase
    .from("businesses")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (!business) throw new Error("Business not found");

  // Prepare the update object - exclude invoice_line_items for now
  const updateObj: any = {};

  const fieldsToUpdate = [
    "type",
    "invoice_number",
    "title",
    "description",
    "issue_date",
    "due_date",
    "client_name",
    "client_email",
    "client_address",
    "client_phone",
    "subtotal",
    "tax_rate",
    "tax_amount",
    "total_amount",
    "currency",
    "notes",
    "terms",
  ];

  fieldsToUpdate.forEach((field) => {
    if (field in updates) {
      updateObj[field] = (updates as any)[field];
    }
  });

  // Handle invoice_line_items update
  if (updates.invoice_line_items) {
    updateObj.invoice_line_items = updates.invoice_line_items;
  }

  const { data, error } = await supabase
    .from("invoices")
    .update(updateObj)
    .eq("id", id)
    .eq("user_id", user.id)
    .eq("business_id", business.id)
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

  // Get business to verify ownership
  const { data: business } = await supabase
    .from("businesses")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (!business) throw new Error("Business not found");

  const { data, error } = await supabase
    .from("invoices")
    .update({ status })
    .eq("id", id)
    .eq("user_id", user.id)
    .eq("business_id", business.id)
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
export async function generateInvoiceNumber(
  type: "income" | "expense" = "income"
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated");

  const { data } = await supabase
    .from("invoices")
    .select("invoice_number")
    .eq("user_id", user.id)
    .eq("type", type)
    .order("created_at", { ascending: false })
    .limit(1);

  const prefix = type === "expense" ? "BILL" : "INV";

  if (!data || data.length === 0) {
    return `${prefix}-001`;
  }

  const lastNumber = data[0].invoice_number || "";
  const match = lastNumber.match(/^(.*?)(\d+)$/);

  if (!match) {
    return `${prefix}-001`;
  }

  const base = match[1];
  const numeric = match[2];
  const next = Number(numeric) + 1;
  const padded = String(next).padStart(numeric.length, "0");

  if (lastNumber.startsWith(prefix)) {
    return `${base}${padded}`;
  }

  return `${prefix}-001`;
}
// Mark invoice as paid and create income transaction
export async function markInvoiceAsPaid(
  invoiceId: string,
  paymentMethod: "cash" | "card" | "transfer" | "other"
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated");

  // Get invoice
  const invoice = await getInvoice(invoiceId);
  if (!invoice) throw new Error("Invoice not found");

  // Get or create category based on invoice type
  const { data: business } = await supabase
    .from("businesses")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (!business) throw new Error("Business not found");

  const categoryName = invoice.type === "expense" ? "Bills" : "Sales";
  const categoryType = invoice.type === "expense" ? "expense" : "income";

  let { data: category } = await supabase
    .from("categories")
    .select("id")
    .eq("business_id", business.id)
    .eq("type", categoryType)
    .eq("name", categoryName)
    .single();

  // Create category if it doesn't exist
  if (!category) {
    const { data: newCategory, error: categoryError } = await supabase
      .from("categories")
      .insert({
        business_id: business.id,
        name: categoryName,
        type: categoryType,
        is_default: false,
      })
      .select()
      .single();

    if (categoryError) throw categoryError;
    category = newCategory;
  }

  const txResult = await createTransaction({
    category_id: category.id,
    amount: invoice.total_amount,
    currency: invoice.currency,
    transaction_date: new Date().toISOString().split("T")[0],
    payment_method: paymentMethod,
    client_vendor: invoice.client_name,
    notes:
      invoice.type === "expense"
        ? `Bill #${invoice.invoice_number} - ${invoice.title}`
        : `Invoice #${invoice.invoice_number} - ${invoice.title}`,
  });

  if (txResult.error) throw new Error(txResult.error);

  // Update invoice status to paid
  const { data, error } = await supabase
    .from("invoices")
    .update({ status: "paid", payment_status: "paid" })
    .eq("id", invoiceId)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) throw error;
  return data;
}
