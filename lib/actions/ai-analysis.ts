"use server";

import { createClient } from "@/lib/supabase/server";

export interface AIAnalysisHistoryItem {
  id: string;
  business_id: string;
  period_start: string;
  period_end: string;
  analysis_text: string;
  financial_snapshot: {
    totals: {
      income: number;
      expenses: number;
      profit: number;
      cashBalance: number;
    };
    metrics: {
      grossMargin: number;
      netMargin: number;
      burnRate: number | null;
      cashRunway: number | null;
    };
    breakdowns: {
      expenses: Record<string, number>;
      income: Record<string, number>;
    };
  };
  created_at: string;
}

export async function saveAIAnalysis(
  businessId: string,
  periodStart: string,
  periodEnd: string,
  analysisText: string,
  financialSnapshot: any
) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("ai_analysis_history")
    .insert({
      business_id: businessId,
      period_start: periodStart,
      period_end: periodEnd,
      analysis_text: analysisText,
      financial_snapshot: financialSnapshot,
    })
    .select()
    .single();

  if (error) {
    console.error("Error saving AI analysis:", error);
    return { error: error.message };
  }

  return { data };
}

export async function getAIAnalysisHistory(limit: number = 10) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("ai_analysis_history")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching AI analysis history:", error);
    return { error: error.message, data: [] };
  }

  return { data: data as AIAnalysisHistoryItem[] };
}

export async function getAIAnalysisById(id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("ai_analysis_history")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching AI analysis:", error);
    return { error: error.message };
  }

  return { data: data as AIAnalysisHistoryItem };
}

export async function deleteAIAnalysis(id: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("ai_analysis_history")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting AI analysis:", error);
    return { error: error.message };
  }

  return { success: true };
}
