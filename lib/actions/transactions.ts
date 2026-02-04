"use server";

import { createClient } from "@/lib/supabase/server";
import { getExchangeRate } from "@/lib/currency";
import { createJournalEntryFromTransaction } from "@/lib/actions/journal";
import { triggerLowBalanceIfNeeded } from "@/lib/actions/health";

export async function getTransactions(filters?: {
  categoryId?: string;
  startDate?: string;
  endDate?: string;
  paymentMethod?: string;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  // Get business
  const { data: business } = await supabase
    .from("businesses")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (!business) {
    return { error: "Business not found" };
  }

  let query = supabase
    .from("transactions")
    .select("*, category:categories(*)")
    .eq("business_id", business.id)
    .order("transaction_date", { ascending: false });

  if (filters?.categoryId) {
    query = query.eq("category_id", filters.categoryId);
  }

  if (filters?.startDate) {
    query = query.gte("transaction_date", filters.startDate);
  }

  if (filters?.endDate) {
    query = query.lte("transaction_date", filters.endDate);
  }

  if (filters?.paymentMethod) {
    query = query.eq("payment_method", filters.paymentMethod);
  }

  const { data, error } = await query;

  if (error) {
    return { error: error.message };
  }

  return { data };
}

/**
 * Total cash balance from the transactions table (income − expenses).
 * Use this so Ledger and Dashboard show the same total as Transactions.
 */
export async function getTotalCashBalance() {
  const result = await getTransactions();
  if (result.error) return { error: result.error, data: null };
  const list = (result.data || []).filter((t: any) => t.status !== "void");
  let total = 0;
  list.forEach((t: any) => {
    const amount = Number(t.base_amount) ?? 0;
    total += t.category?.type === "income" ? amount : -amount;
  });
  return { data: total, error: null };
}

export async function createTransaction(transaction: {
  category_id: string;
  amount: number;
  currency: string;
  transaction_date: string;
  payment_method: "cash" | "card" | "transfer" | "other";
  client_vendor?: string;
  notes?: string;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  // Get business
  const { data: business } = await supabase
    .from("businesses")
    .select("id, base_currency")
    .eq("user_id", user.id)
    .single();

  if (!business) {
    return { error: "Business not found" };
  }

  // Convert to base currency if needed
  let baseAmount = transaction.amount;
  if (transaction.currency !== business.base_currency) {
    const rate = await getExchangeRate(
      transaction.currency,
      business.base_currency,
      transaction.transaction_date
    );
    baseAmount = transaction.amount * rate;
  }

  const { data, error } = await supabase
    .from("transactions")
    .insert({
      business_id: business.id,
      ...transaction,
      base_amount: baseAmount,
    })
    .select("*, category:categories(*)")
    .single();

  if (error) {
    return { error: error.message };
  }

  // Create a ledger row (journal entry) so the Ledger shows this transaction
  const category = data?.category as {
    name: string;
    type: "income" | "expense";
  } | null;
  if (category?.name != null && category?.type != null && data?.id) {
    const journalResult = await createJournalEntryFromTransaction({
      business_id: business.id,
      transaction_date: transaction.transaction_date,
      description:
        transaction.notes || transaction.client_vendor || "Transaction",
      category_name: category.name,
      category_type: category.type,
      amount: baseAmount,
    });
    if (journalResult.error) {
      console.error("Ledger sync failed:", journalResult.error);
    } else if (journalResult.data?.id) {
      // Link transaction to journal entry so voiding updates both
      await (supabase as any)
        .from("transactions")
        .update({ journal_entry_id: journalResult.data.id })
        .eq("id", data.id);
    }
  }

  // Trigger low-balance webhook if an expense pushes net balance below 0
  if (category?.type === "expense") {
    const userName =
      (user.user_metadata?.full_name as string | undefined) ||
      (user.user_metadata?.name as string | undefined) ||
      (user.email ? user.email.split("@")[0] : undefined);
    await triggerLowBalanceIfNeeded({
      businessId: business.id,
      userEmail: user.email || "",
      userName,
      expenseDelta: baseAmount,
    });
  }

  return { data };
}

export async function updateTransaction(
  id: string,
  updates: {
    category_id?: string;
    amount?: number;
    currency?: string;
    transaction_date?: string;
    payment_method?: "cash" | "card" | "transfer" | "other";
    client_vendor?: string;
    notes?: string;
  }
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  // Get business
  const { data: business } = await supabase
    .from("businesses")
    .select("id, base_currency")
    .eq("user_id", user.id)
    .single();

  if (!business) {
    return { error: "Business not found" };
  }

  // Recalculate base_amount if amount or currency changed
  if (updates.amount || updates.currency) {
    const { data: existing } = await supabase
      .from("transactions")
      .select("currency, amount")
      .eq("id", id)
      .single();

    const currency =
      updates.currency || existing?.currency || business.base_currency;
    const amount = updates.amount || existing?.amount || 0;

    let baseAmount = amount;
    if (currency !== business.base_currency) {
      const rate = await getExchangeRate(
        currency,
        business.base_currency,
        updates.transaction_date || new Date().toISOString().split("T")[0]
      );
      baseAmount = amount * rate;
    }
    updates = { ...updates, base_amount: baseAmount };
  }

  const { data, error } = await supabase
    .from("transactions")
    .update(updates)
    .eq("id", id)
    .select("*, category:categories(*)")
    .single();

  if (error) {
    return { error: error.message };
  }

  return { data };
}

/**
 * Void a transaction (Option A: reverse): mark as voided and void the ledger entry.
 * Transaction and ledger row both show as voided; balance is corrected, history remains.
 */
export async function voidTransaction(transactionId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated" };

  const id = typeof transactionId === "string" ? transactionId.trim() : "";
  if (!id) return { error: "Transaction ID is required" };

  // Get business so we scope the lookup (same as getTransactions)
  const { data: business } = await supabase
    .from("businesses")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (!business) return { error: "Business not found" };

  // Select only columns that exist (avoid "column does not exist" before migration)
  const { data: row, error: fetchError } = await supabase
    .from("transactions")
    .select(
      "id, business_id, transaction_date, base_amount, notes, client_vendor"
    )
    .eq("id", id)
    .eq("business_id", business.id)
    .single();

  if (fetchError || !row) {
    const reason = fetchError?.message ?? (row ? "" : "No row returned");
    return {
      error: reason
        ? `Transaction not found: ${reason}`
        : "Transaction not found",
    };
  }

  const rowAny = row as { journal_entry_id?: string; status?: string };
  if (rowAny.status === "void")
    return { error: "Transaction is already voided" };

  // Void the ledger entry so it shows (Void) in the Ledger
  const { voidJournalEntry, getJournalEntries } =
    await import("@/lib/actions/journal");
  let journalEntryId = rowAny.journal_entry_id;

  if (!journalEntryId) {
    // Link not stored (migration not run): find journal entry by matching transaction
    const journalResult = await getJournalEntries();
    if (journalResult.data?.length) {
      const description = row.notes || row.client_vendor || "Transaction";
      const match = journalResult.data.find(
        (e: any) =>
          e.business_id === row.business_id &&
          e.transaction_date === row.transaction_date &&
          (e.description || "").trim() === (description || "").trim() &&
          e.status !== "void" &&
          (e.journal_lines || []).some(
            (l: any) => Number(l.amount) === Number(row.base_amount)
          )
      );
      if (match) journalEntryId = match.id;
    }
  }

  if (journalEntryId) {
    const voidResult = await voidJournalEntry(journalEntryId);
    if (voidResult.error) return { error: voidResult.error };
  }

  // Mark transaction as voided (if status column exists); else hard delete so it disappears
  const { error: updateError } = await (supabase as any)
    .from("transactions")
    .update({ status: "void" })
    .eq("id", id);

  if (updateError) {
    // status column may not exist (migration not run): hard delete so the row is removed
    const { error: deleteError } = await supabase
      .from("transactions")
      .delete()
      .eq("id", id);
    if (deleteError) return { error: deleteError.message };
  }

  return { success: true };
}

/** Hard delete (kept for compatibility). Prefer voidTransaction so ledger stays in sync. */
export async function deleteTransaction(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase.from("transactions").delete().eq("id", id);
  if (error) return { error: error.message };
  return { success: true };
}
