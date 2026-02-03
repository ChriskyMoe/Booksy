"use server";

import { createClient } from "@/lib/supabase/server";
import { getBusiness } from "./business";

export interface InvoiceItemCatalog {
  id: string;
  business_id: string;
  user_id: string;
  name: string;
  description?: string;
  unit_price: number;
  unit: string;
  category?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export async function getInvoiceItems() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { data: null, error: "Not authenticated" };
    }

    const { data: business, error: businessError } = await getBusiness();
    if (businessError || !business) {
      return { data: null, error: businessError || "Business not found" };
    }

    const { data, error } = await supabase
      .from("invoice_catalog_items")
      .select("*")
      .eq("business_id", business.id)
      .eq("is_active", true)
      .order("name", { ascending: true });

    if (error) {
      console.error("Error fetching invoice items:", error);
      return { data: null, error: error.message };
    }

    return { data, error: null };
  } catch (error) {
    console.error("Unexpected error:", error);
    return { data: null, error: "An unexpected error occurred" };
  }
}

export async function createInvoiceItem(itemData: {
  name: string;
  description?: string;
  unit_price: number;
  unit?: string;
  category?: string;
}) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("Not authenticated");
    }

    const { data: business, error: businessError } = await getBusiness();
    if (businessError || !business) {
      throw new Error(businessError || "Business not found");
    }

    const { data, error } = await supabase
      .from("invoice_catalog_items")
      .insert({
        business_id: business.id,
        user_id: user.id,
        name: itemData.name,
        description: itemData.description,
        unit_price: itemData.unit_price,
        unit: itemData.unit || "unit",
        category: itemData.category,
        is_active: true,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating invoice item:", error);
      throw new Error(error.message);
    }

    return { data, error: null };
  } catch (error: any) {
    console.error("Unexpected error:", error);
    return {
      data: null,
      error: error.message || "An unexpected error occurred",
    };
  }
}

export async function updateInvoiceItem(
  id: string,
  itemData: {
    name?: string;
    description?: string;
    unit_price?: number;
    unit?: string;
    category?: string;
    is_active?: boolean;
  }
) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("Not authenticated");
    }

    const { data, error } = await supabase
      .from("invoice_catalog_items")
      .update(itemData)
      .eq("id", id)
      .eq("user_id", user.id)
      .select()
      .single();

    if (error) {
      console.error("Error updating invoice item:", error);
      throw new Error(error.message);
    }

    return { data, error: null };
  } catch (error: any) {
    console.error("Unexpected error:", error);
    return {
      data: null,
      error: error.message || "An unexpected error occurred",
    };
  }
}

export async function deleteInvoiceItem(id: string) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("Not authenticated");
    }

    // Soft delete by setting is_active to false
    const { error } = await supabase
      .from("invoice_catalog_items")
      .update({ is_active: false })
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      console.error("Error deleting invoice item:", error);
      throw new Error(error.message);
    }

    return { error: null };
  } catch (error: any) {
    console.error("Unexpected error:", error);
    return { error: error.message || "An unexpected error occurred" };
  }
}
