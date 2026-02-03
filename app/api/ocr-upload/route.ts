import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const type = formData.get("type") as "receipt" | "invoice";
    const receiptOrigin = formData.get("receiptOrigin") as
      | "expense"
      | "income"
      | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File size exceeds 10MB limit" },
        { status: 400 }
      );
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Image = buffer.toString("base64");
    const mimeType = file.type;

    // Process with OpenAI Vision API
    const prompt =
      type === "receipt"
        ? `Analyze this receipt image and extract the following information in JSON format:
{
  "merchant_name": "name of the merchant/store",
  "date": "date in YYYY-MM-DD format",
  "total_amount": "total amount as a number",
  "currency": "currency code (e.g., USD, EUR, GBP, JPY, THB). If you see a $ symbol, use USD. If you see € symbol, use EUR. If you see £ symbol, use GBP. If you see ¥ symbol, use JPY. If you see ฿ symbol, use THB. Default to USD if no currency symbol or text is visible.",
  "category": "suggested category (e.g., Food, Transportation, Office Supplies)",
  "items": [
    {
      "description": "item description",
      "amount": "item amount as a number"
    }
  ],
  "tax_amount": "tax amount if available",
  "payment_method": "payment method if visible"
}

Extract all visible information. If a field is not visible, use null.`
        : `Analyze this invoice image and extract the following information in JSON format:
{
  "invoice_number": "invoice number",
  "invoice_date": "date in YYYY-MM-DD format",
  "due_date": "due date in YYYY-MM-DD format",
  "customer_name": "customer name",
  "customer_email": "customer email",
  "customer_address": "customer address",
  "items": [
    {
      "description": "item/service description",
      "quantity": "quantity as a number",
      "unit_price": "price per unit as a number",
      "amount": "total amount as a number"
    }
  ],
  "subtotal": "subtotal before tax",
  "tax_amount": "tax amount",
  "total_amount": "total amount",
  "currency": "currency code (e.g., USD, EUR, GBP, JPY, THB). If you see a $ symbol, use USD. If you see € symbol, use EUR. If you see £ symbol, use GBP. If you see ¥ symbol, use JPY. If you see ฿ symbol, use THB. Default to USD if no currency symbol or text is visible.",
  "notes": "any additional notes or terms"
}

Extract all visible information. If a field is not visible, use null.`;

    const completion = await openai.chat.completions.create({
      model: "openai/gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            {
              type: "image_url",
              image_url: {
                url: `data:${mimeType};base64,${base64Image}`,
              },
            },
          ],
        },
      ],
      max_tokens: 1000,
    });

    const response = completion.choices[0]?.message?.content;
    if (!response) {
      throw new Error("No response from OCR");
    }

    // Parse JSON from response
    let extractedData;
    try {
      // Try to find JSON in the response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        extractedData = JSON.parse(jsonMatch[0]);
      } else {
        extractedData = JSON.parse(response);
      }
    } catch (parseError) {
      console.error("Failed to parse OCR response:", response);
      throw new Error("Failed to parse OCR response");
    }

    // Upload file to Supabase Storage
    const fileExt = file.name.split(".").pop();
    const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const storageBucket = type === "receipt" ? "receipts" : "invoices";

    const { error: uploadError } = await supabase.storage
      .from(storageBucket)
      .upload(fileName, buffer, {
        contentType: mimeType,
        upsert: false,
      });

    if (uploadError) {
      console.error("Storage upload error:", uploadError);
      // Continue even if storage upload fails
    }

    const { data: publicUrlData } = supabase.storage
      .from(storageBucket)
      .getPublicUrl(fileName);

    // Return extracted data with file info
    return NextResponse.json({
      success: true,
      type,
      data: extractedData,
      receiptOrigin: type === "receipt" ? receiptOrigin : undefined,
      file: {
        name: file.name,
        url: publicUrlData?.publicUrl || null,
        path: fileName,
      },
    });
  } catch (error) {
    console.error("OCR upload error:", error);
    return NextResponse.json(
      {
        error: "Failed to process document",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
