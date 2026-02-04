import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { type, extractedData, fileName, receiptOrigin } = body;

    if (!type || !extractedData) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Get user's business
    const { data: businessData, error: businessError } = await supabase
      .from("businesses")
      .select("id")
      .eq("user_id", user.id)
      .single();

    if (businessError || !businessData) {
      return NextResponse.json(
        {
          error: "Business not found",
          details: "Please set up your business first",
        },
        { status: 400 }
      );
    }

    const businessId = businessData.id;
    let savedRecord = null;

    const normalizePaymentMethod = (value: string | null | undefined) => {
      const raw = (value || "").toLowerCase();
      if (
        raw.includes("card") ||
        raw.includes("credit") ||
        raw.includes("debit")
      ) {
        return "card";
      }
      if (raw.includes("cash")) {
        return "cash";
      }
      if (raw.includes("transfer") || raw.includes("bank")) {
        return "transfer";
      }
      if (raw.includes("other")) {
        return "other";
      }
      return "other";
    };

    const normalizeCategoryName = (value: string | null | undefined) => {
      const trimmed = (value || "").trim();
      return trimmed.length > 0 ? trimmed : "Other";
    };

    const getCategoryType = (
      categoryName: string,
      amount: number | null | undefined,
      forceType?: "income" | "expense"
    ): "income" | "expense" => {
      // If receipt origin is explicitly set, use it
      if (forceType) {
        return forceType;
      }

      const raw = categoryName.toLowerCase();
      const incomeKeywords = [
        "income",
        "revenue",
        "sales",
        "sale",
        "refund",
        "reimbursement",
        "interest",
        "dividend",
        "commission",
        "bonus",
      ];

      if (incomeKeywords.some((k) => raw.includes(k))) {
        return "income";
      }

      if (typeof amount === "number" && amount < 0) {
        return "income";
      }

      return "expense";
    };

    const normalizeCurrency = (value: string | null | undefined): string => {
      const raw = (value || "USD").toUpperCase().trim();

      // If already 3 letters, return it
      if (raw.length === 3 && /^[A-Z]{3}$/.test(raw)) {
        return raw;
      }

      // Map common currency names to codes
      const currencyMap: { [key: string]: string } = {
        DOLLAR: "USD",
        "US DOLLAR": "USD",
        "AMERICAN DOLLAR": "USD",
        EURO: "EUR",
        GBP: "GBP",
        POUND: "GBP",
        "BRITISH POUND": "GBP",
        YEN: "JPY",
        "JAPANESE YEN": "JPY",
        RUPEE: "INR",
        "INDIAN RUPEE": "INR",
        PESO: "MXN",
        CANADIAN: "CAD",
        CAD: "CAD",
        AUD: "AUD",
        AUSTRALIAN: "AUD",
        CHF: "CHF",
        SWISS: "CHF",
        CNY: "CNY",
        YUAN: "CNY",
        "CHINESE YUAN": "CNY",
        THB: "THB",
        BAHT: "THB",
        "THAI BAHT": "THB",
      };

      for (const [key, code] of Object.entries(currencyMap)) {
        if (raw.includes(key)) {
          return code;
        }
      }

      // Default to USD
      return "USD";
    };

    // Auto-save to database based on document type
    if (type === "receipt") {
      const categoryName = normalizeCategoryName(extractedData.category);
      const categoryType = getCategoryType(
        categoryName,
        extractedData.total_amount,
        receiptOrigin
      );

      // Get or create category
      const { data: categoryData } = await supabase
        .from("categories")
        .select("id")
        .eq("business_id", businessId)
        .eq("name", categoryName)
        .eq("type", categoryType)
        .single();

      let categoryId = categoryData?.id;

      // If category doesn't exist, create it
      if (!categoryId) {
        const { data: newCategory, error: categoryError } = await supabase
          .from("categories")
          .insert({
            business_id: businessId,
            name: categoryName,
            type: categoryType,
          })
          .select()
          .single();

        if (!categoryError && newCategory) {
          categoryId = newCategory.id;
        }
      }

      // Create transaction
      if (categoryId) {
        const { data: transaction, error: transactionError } = await supabase
          .from("transactions")
          .insert({
            business_id: businessId,
            category_id: categoryId,
            amount: extractedData.total_amount || 0,
            currency: normalizeCurrency(extractedData.currency),
            base_amount: extractedData.total_amount || 0,
            transaction_date:
              extractedData.date || new Date().toISOString().split("T")[0],
            payment_method: normalizePaymentMethod(
              extractedData.payment_method
            ),
            client_vendor: extractedData.merchant_name || "Unknown",
            notes: `Receipt from ${extractedData.merchant_name || "Unknown"}. File: ${fileName || "unknown"}`,
          })
          .select()
          .single();

        if (!transactionError && transaction) {
          savedRecord = {
            type: "transaction",
            id: transaction.id,
            data: transaction,
          };
        } else if (transactionError) {
          console.error("Transaction creation error:", transactionError);
        }
      }
    } else if (type === "invoice") {
      // Create invoice
      const invoiceNumber = `INV-${Date.now()}`;
      const { data: invoice, error: invoiceError } = await supabase
        .from("invoices")
        .insert({
          user_id: user.id,
          business_id: businessId,
          type: "income",
          invoice_number: invoiceNumber,
          client_name: extractedData.customer_name || "Unknown",
          client_email: extractedData.customer_email || null,
          client_address: extractedData.customer_address || null,
          issue_date:
            extractedData.invoice_date ||
            new Date().toISOString().split("T")[0],
          due_date:
            extractedData.due_date || new Date().toISOString().split("T")[0],
          subtotal: extractedData.subtotal || extractedData.total_amount || 0,
          tax_amount: extractedData.tax_amount || 0,
          total_amount: extractedData.total_amount || 0,
          currency: normalizeCurrency(extractedData.currency),
          notes: `Invoice from uploaded file: ${fileName || "unknown"}`,
          status: "draft",
          payment_status: "unpaid",
        })
        .select()
        .single();

      if (!invoiceError && invoice) {
        // Create invoice items
        if (extractedData.items && Array.isArray(extractedData.items)) {
          for (const item of extractedData.items) {
            await supabase.from("invoice_items").insert({
              invoice_id: invoice.id,
              description: item.description || "Item",
              quantity: item.quantity || 1,
              unit_price: item.unit_price || item.amount || 0,
              amount: item.amount || 0,
            });
          }
        }

        savedRecord = {
          type: "invoice",
          id: invoice.id,
          data: invoice,
        };
      } else if (invoiceError) {
        console.error("Invoice creation error:", invoiceError);
      }
    }

    return NextResponse.json({
      success: true,
      saved: savedRecord ? true : false,
      savedRecord: savedRecord,
    });
  } catch (error) {
    console.error("Auto-save error:", error);
    return NextResponse.json(
      {
        error: "Failed to save document",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
