"use client";

import { useState, useEffect } from "react";
import { jsPDF } from "jspdf";
import { getBusiness } from "@/lib/actions/business";
import {
  getAIAnalysisHistory,
  deleteAIAnalysis,
  type AIAnalysisHistoryItem,
} from "@/lib/actions/ai-analysis";
import { Button } from "@/components/ui/button";

// ... (interfaces and type definitions remain the same)

interface FinancialData {
  business: {
    name: string;
    type: string | null;
    currency: string;
  };
  totals: {
    income: number;
    expenses: number;
    profit: number;
    cashBalance: number;
  };
  breakdowns: {
    expenses: Record<string, number>;
    income: Record<string, number>;
  };
  metrics: {
    grossMargin: number;
    netMargin: number;
    burnRate: number | null;
    cashRunway: number | null;
  };
}

interface AnalysisResponse {
  analysis: string;
  financialData: FinancialData;
}

type Period =
  | "thisMonth"
  | "last3Months"
  | "last6Months"
  | "thisYear"
  | "custom";

export default function AIFinancialAnalysis() {
  const [period, setPeriod] = useState<Period>("thisMonth");
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [financialData, setFinancialData] = useState<FinancialData | null>(
    null
  );
  const [businessName, setBusinessName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({
    revenue: true,
    expenses: true,
    profitability: true,
    cashflow: true,
    risks: true,
    recommendations: true,
  });
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState<AIAnalysisHistoryItem[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  useEffect(() => {
    loadBusinessInfo();
    loadHistory();
  }, []);

  const loadBusinessInfo = async () => {
    try {
      const result = (await getBusiness()) as
        | { data?: { name: string } }
        | { error: string };
      if (result && "data" in result && result.data) {
        setBusinessName(result.data.name);
      }
    } catch (err) {
      // Silently fail
    }
  };

  const loadHistory = async () => {
    setLoadingHistory(true);
    try {
      const result = await getAIAnalysisHistory(20);
      if (result.data) {
        setHistory(result.data);
      }
    } catch (err) {
      console.error("Error loading history:", err);
    } finally {
      setLoadingHistory(false);
    }
  };

  const loadHistoryItem = (item: AIAnalysisHistoryItem) => {
    setAnalysis(item.analysis_text);
    setFinancialData({
      business: {
        name: businessName,
        type: null,
        currency: "USD",
      },
      totals: item.financial_snapshot.totals,
      breakdowns: item.financial_snapshot.breakdowns,
      metrics: item.financial_snapshot.metrics,
    });
    setShowHistory(false);
  };

  const handleDeleteHistory = async (id: string) => {
    if (!confirm("Are you sure you want to delete this analysis?")) return;

    try {
      await deleteAIAnalysis(id);
      await loadHistory();
    } catch (err) {
      console.error("Error deleting history:", err);
    }
  };

  const getDateRange = (): { startDate: string; endDate: string } => {
    const now = new Date();
    const today = now.toISOString().split("T")[0];

    switch (period) {
      case "thisMonth": {
        const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)
          .toISOString()
          .split("T")[0];
        return { startDate: firstDay, endDate: today };
      }
      case "last3Months": {
        const threeMonthsAgo = new Date(
          now.getFullYear(),
          now.getMonth() - 3,
          1
        )
          .toISOString()
          .split("T")[0];
        return { startDate: threeMonthsAgo, endDate: today };
      }
      case "last6Months": {
        const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 6, 1)
          .toISOString()
          .split("T")[0];
        return { startDate: sixMonthsAgo, endDate: today };
      }
      case "thisYear": {
        const firstDayOfYear = new Date(now.getFullYear(), 0, 1)
          .toISOString()
          .split("T")[0];
        return { startDate: firstDayOfYear, endDate: today };
      }
      case "custom":
        return {
          startDate: customStartDate || today,
          endDate: customEndDate || today,
        };
      default:
        return { startDate: today, endDate: today };
    }
  };

  const generateReport = async () => {
    setLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      const { startDate, endDate } = getDateRange();

      const response = await fetch("/api/ai-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ startDate, endDate }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate analysis");
      }

      const data: AnalysisResponse = await response.json();
      setAnalysis(data.analysis);
      setFinancialData(data.financialData);
    } catch (err: any) {
      setError(err.message || "Failed to generate analysis");
    } finally {
      setLoading(false);
    }
  };

  const getCashFlowStatus = (): {
    status: "healthy" | "warning" | "risk";
    label: string;
  } => {
    if (!financialData) return { status: "healthy", label: "Unknown" };

    const { cashRunway } = financialData.metrics;
    const { profit } = financialData.totals;

    if (profit < 0 && cashRunway !== null && cashRunway < 3) {
      return { status: "risk", label: "Risk" };
    }
    if (profit < 0 || (cashRunway !== null && cashRunway < 6)) {
      return { status: "warning", label: "Warning" };
    }
    return { status: "healthy", label: "Healthy" };
  };

  const parseAnalysisSections = (text: string) => {
    const sections: Record<string, string> = {};
    const lines = text.split("\n");
    let currentSection: string | null = null;
    let currentContent: string[] = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const upperLine = line.toUpperCase().trim();
      const trimmedLine = line.trim();

      const isHeader =
        trimmedLine.startsWith("#") || /^\d+\.\s/.test(trimmedLine);

      if (isHeader) {
        if (currentSection && currentContent.length > 0) {
          sections[currentSection] = currentContent.join("\n").trim();
        }

        if (upperLine.includes("EXECUTIVE SUMMARY")) {
          currentSection = "summary";
        } else if (upperLine.includes("REVENUE ANALYSIS")) {
          currentSection = "revenue";
        } else if (upperLine.includes("EXPENSE BREAKDOWN")) {
          currentSection = "expenses";
        } else if (upperLine.includes("PROFITABILITY ANALYSIS")) {
          currentSection = "profitability";
        } else if (upperLine.includes("CASH FLOW ANALYSIS")) {
          currentSection = "cashflow";
        } else if (
          upperLine.includes("RISKS") &&
          upperLine.includes("WARNINGS")
        ) {
          currentSection = "risks";
        } else if (
          upperLine.includes("RISKS") ||
          upperLine.includes("WARNINGS")
        ) {
          currentSection = "risks";
        } else if (
          upperLine.includes("RECOMMENDATIONS") ||
          upperLine.includes("RECOMMENDATION")
        ) {
          currentSection = "recommendations";
        } else if (
          upperLine.includes("SUMMARY") &&
          !upperLine.includes("RECOMMENDATION")
        ) {
          currentSection = "summary";
        } else if (
          upperLine.includes("REVENUE") &&
          !upperLine.includes("EXPENSE")
        ) {
          currentSection = "revenue";
        } else if (
          upperLine.includes("EXPENSE") &&
          !upperLine.includes("REVENUE")
        ) {
          currentSection = "expenses";
        } else if (upperLine.includes("PROFITABILITY")) {
          currentSection = "profitability";
        } else if (upperLine.includes("CASH") && upperLine.includes("FLOW")) {
          currentSection = "cashflow";
        } else {
          if (!currentSection) {
            currentSection = "summary";
          }
          currentContent.push(line);
          continue;
        }

        currentContent = [];
        continue;
      }

      if (currentSection) {
        currentContent.push(line);
      } else {
        currentSection = "summary";
        currentContent.push(line);
      }
    }

    if (currentSection && currentContent.length > 0) {
      sections[currentSection] = currentContent.join("\n").trim();
    }

    if (Object.keys(sections).length === 0) {
      sections.summary = text.trim();
    }

    return sections;
  };

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const formatCurrency = (amount: number) => {
    if (!financialData) return amount.toFixed(2);
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: financialData.business.currency,
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const buildExportText = () => {
    if (!analysis || !financialData) return "";

    const { startDate, endDate } = getDateRange();
    const sections = parseAnalysisSections(analysis);
    const metrics = financialData.metrics;

    return [
      `AI Financial Analysis`,
      `Period: ${startDate} to ${endDate}`,
      "",
      `Totals:`,
      `- Total Revenue: ${formatCurrency(financialData.totals.income)}`,
      `- Total Expenses: ${formatCurrency(financialData.totals.expenses)}`,
      `- Net Profit: ${formatCurrency(financialData.totals.profit)}`,
      `- Cash Balance: ${formatCurrency(financialData.totals.cashBalance)}`,
      "",
      `Metrics:`,
      `- Gross Margin: ${metrics.grossMargin.toFixed(2)}%`,
      `- Net Margin: ${metrics.netMargin.toFixed(2)}%`,
      `- Burn Rate: ${metrics.burnRate === null ? "N/A" : formatCurrency(metrics.burnRate)}`,
      `- Cash Runway: ${metrics.cashRunway === null ? "N/A" : `${metrics.cashRunway.toFixed(1)} months`}`,
      "",
      `Summary:`,
      sections.summary || analysis,
      "",
      `Revenue Analysis:`,
      sections.revenue || "No revenue analysis available.",
      "",
      `Expense Breakdown:`,
      sections.expenses || "No expense analysis available.",
      "",
      `Profitability Analysis:`,
      sections.profitability || "No profitability analysis available.",
      "",
      `Cash Flow Analysis:`,
      sections.cashflow || "No cash flow analysis available.",
      "",
      `Risks & Warnings:`,
      sections.risks || "No risks detected.",
      "",
      `Recommendations:`,
      sections.recommendations || "No recommendations available.",
    ].join("\n");
  };

  const buildExportMarkdown = () => {
    if (!analysis || !financialData) return "";

    const { startDate, endDate } = getDateRange();
    const sections = parseAnalysisSections(analysis);
    const metrics = financialData.metrics;

    return [
      `# AI Financial Analysis`,
      ``,
      `**Period:** ${startDate} to ${endDate}`,
      ``,
      `## Totals`,
      `- **Total Revenue:** ${formatCurrency(financialData.totals.income)}`,
      `- **Total Expenses:** ${formatCurrency(financialData.totals.expenses)}`,
      `- **Net Profit:** ${formatCurrency(financialData.totals.profit)}`,
      `- **Cash Balance:** ${formatCurrency(financialData.totals.cashBalance)}`,
      ``,
      `## Metrics`,
      `- **Gross Margin:** ${metrics.grossMargin.toFixed(2)}%`,
      `- **Net Margin:** ${metrics.netMargin.toFixed(2)}%`,
      `- **Burn Rate:** ${metrics.burnRate === null ? "N/A" : formatCurrency(metrics.burnRate)}`,
      `- **Cash Runway:** ${metrics.cashRunway === null ? "N/A" : `${metrics.cashRunway.toFixed(1)} months`}`,
      ``,
      `## Summary`,
      sections.summary || analysis,
      ``,
      `## Revenue Analysis`,
      sections.revenue || "No revenue analysis available.",
      ``,
      `## Expense Breakdown`,
      sections.expenses || "No expense analysis available.",
      ``,
      `## Profitability Analysis`,
      sections.profitability || "No profitability analysis available.",
      ``,
      `## Cash Flow Analysis`,
      sections.cashflow || "No cash flow analysis available.",
      ``,
      `## Risks & Warnings`,
      sections.risks || "No risks detected.",
      ``,
      `## Recommendations`,
      sections.recommendations || "No recommendations available.",
    ].join("\n");
  };

  const cashFlowStatus = financialData ? getCashFlowStatus() : null;

  return (
    <div className="space-y-6">
      {/* Overview Header */}
      <div className="rounded-lg bg-card p-6 shadow-sm">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              {businessName || "Business"}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              AI Financial Analysis
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-muted-foreground">
                Period:
              </label>
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value as Period)}
                className="rounded-md border border-border bg-background px-3 py-1.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-ring"
                disabled={loading}
              >
                <option value="thisMonth">This Month</option>
                <option value="last3Months">Last 3 Months</option>
                <option value="last6Months">Last 6 Months</option>
                <option value="thisYear">This Year</option>
                <option value="custom">Custom</option>
              </select>
            </div>

            {period === "custom" && (
              <div className="flex items-center gap-2">
                <input
                  type="date"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                  className="rounded-md border border-border bg-background px-3 py-1.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-ring"
                />
                <span className="text-sm text-muted-foreground">to</span>
                <input
                  type="date"
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                  className="rounded-md border border-border bg-background px-3 py-1.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-ring"
                />
              </div>
            )}

            <Button onClick={generateReport} disabled={loading}>
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="h-4 w-4 animate-spin"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Generating...
                </span>
              ) : (
                "Generate AI Report"
              )}
            </Button>

            <Button
              variant="outline"
              onClick={() => setShowHistory(!showHistory)}
            >
              {showHistory ? "Hide History" : "📚 View History"}
            </Button>
          </div>
        </div>

        {/* History Section */}
        {showHistory && (
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="mb-4 text-lg font-semibold text-foreground">
              Analysis History
            </h3>
            {loadingHistory ? (
              <p className="text-sm text-muted-foreground">
                Loading history...
              </p>
            ) : history.length === 0 ? (
              <p className="text-sm text-muted-foreground">No history yet.</p>
            ) : (
              <div className="space-y-2">
                {history.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between rounded-lg border border-border p-3 hover:bg-muted/50"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">
                        {new Date(item.period_start).toLocaleDateString()} -{" "}
                        {new Date(item.period_end).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Generated{" "}
                        {new Date(item.created_at).toLocaleDateString()} at{" "}
                        {new Date(item.created_at).toLocaleTimeString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => loadHistoryItem(item)}
                      >
                        View
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteHistory(item.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* KPI Cards */}
        {financialData && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg border border-border bg-muted p-4">
              <p className="text-sm font-medium text-muted-foreground">
                Total Revenue
              </p>
              <p className="mt-1 text-2xl font-bold text-foreground">
                {formatCurrency(financialData.totals.income)}
              </p>
            </div>
            <div className="rounded-lg border border-border bg-muted p-4">
              <p className="text-sm font-medium text-muted-foreground">
                Total Expenses
              </p>
              <p className="mt-1 text-2xl font-bold text-foreground">
                {formatCurrency(financialData.totals.expenses)}
              </p>
            </div>
            <div className="rounded-lg border border-border bg-muted p-4">
              <p className="text-sm font-medium text-muted-foreground">
                Net Profit
              </p>
              <p
                className={`mt-1 text-2xl font-bold ${
                  financialData.totals.profit >= 0
                    ? "text-success"
                    : "text-destructive"
                }`}
              >
                {formatCurrency(financialData.totals.profit)}
              </p>
            </div>
            <div className="rounded-lg border border-border bg-muted p-4">
              <p className="text-sm font-medium text-muted-foreground">
                Cash Flow Status
              </p>
              <p
                className={`mt-1 text-2xl font-bold ${
                  cashFlowStatus?.status === "healthy"
                    ? "text-success"
                    : cashFlowStatus?.status === "warning"
                      ? "text-warning"
                      : "text-destructive"
                }`}
              >
                {cashFlowStatus?.label || "N/A"}
              </p>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="rounded-lg bg-destructive/10 p-4">
          <p className="text-sm text-destructive-foreground">{error}</p>
        </div>
      )}

      {analysis && financialData && (
        <>
          {/* AI Summary Section */}
          <div className="rounded-lg bg-card p-6 shadow-sm">
            <h3 className="mb-4 text-xl font-semibold text-foreground">
              AI Financial Summary
            </h3>
            <div className="prose prose-sm max-w-none text-muted-foreground whitespace-pre-wrap">
              {parseAnalysisSections(analysis).summary ||
                analysis.split("\n").slice(0, 10).join("\n")}
            </div>
          </div>

          {/* Deep Financial Analysis Sections */}
          <div className="space-y-4">
            {/* Revenue Analysis */}
            <div className="rounded-lg border border-border bg-card">
              <button
                onClick={() => toggleSection("revenue")}
                className="flex w-full items-center justify-between p-4 text-left"
              >
                <h3 className="text-lg font-semibold text-foreground">
                  Revenue Analysis
                </h3>
                <svg
                  className={`h-5 w-5 text-muted-foreground transition-transform ${
                    expandedSections.revenue ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {expandedSections.revenue && (
                <div className="border-t border-border p-4">
                  <div className="prose prose-sm max-w-none text-muted-foreground whitespace-pre-wrap">
                    {parseAnalysisSections(analysis).revenue ||
                      "No revenue analysis available."}
                  </div>
                </div>
              )}
            </div>

            {/* Expense Breakdown */}
            <div className="rounded-lg border border-border bg-card">
              <button
                onClick={() => toggleSection("expenses")}
                className="flex w-full items-center justify-between p-4 text-left"
              >
                <h3 className="text-lg font-semibold text-foreground">
                  Expense Breakdown
                </h3>
                <svg
                  className={`h-5 w-5 text-muted-foreground transition-transform ${
                    expandedSections.expenses ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {expandedSections.expenses && (
                <div className="border-t border-border p-4">
                  <div className="prose prose-sm max-w-none text-muted-foreground whitespace-pre-wrap">
                    {parseAnalysisSections(analysis).expenses ||
                      "No expense analysis available."}
                  </div>
                </div>
              )}
            </div>

            {/* Profitability Analysis */}
            <div className="rounded-lg border border-border bg-card">
              <button
                onClick={() => toggleSection("profitability")}
                className="flex w-full items-center justify-between p-4 text-left"
              >
                <h3 className="text-lg font-semibold text-foreground">
                  Profitability Analysis
                </h3>
                <svg
                  className={`h-5 w-5 text-muted-foreground transition-transform ${
                    expandedSections.profitability ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {expandedSections.profitability && (
                <div className="border-t border-border p-4">
                  <div className="prose prose-sm max-w-none text-muted-foreground whitespace-pre-wrap">
                    {parseAnalysisSections(analysis).profitability ||
                      "No profitability analysis available."}
                  </div>
                </div>
              )}
            </div>

            {/* Cash Flow Analysis */}
            <div className="rounded-lg border border-border bg-card">
              <button
                onClick={() => toggleSection("cashflow")}
                className="flex w-full items-center justify-between p-4 text-left"
              >
                <h3 className="text-lg font-semibold text-foreground">
                  Cash Flow Analysis
                </h3>
                <svg
                  className={`h-5 w-5 text-muted-foreground transition-transform ${
                    expandedSections.cashflow ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {expandedSections.cashflow && (
                <div className="border-t border-border p-4">
                  <div className="prose prose-sm max-w-none text-muted-foreground whitespace-pre-wrap">
                    {parseAnalysisSections(analysis).cashflow ||
                      "No cash flow analysis available."}
                  </div>
                </div>
              )}
            </div>

            {/* AI Insights & Warnings */}
            <div className="rounded-lg border border-destructive/50 bg-destructive/10">
              <button
                onClick={() => toggleSection("risks")}
                className="flex w-full items-center justify-between p-4 text-left"
              >
                <h3 className="text-lg font-semibold text-destructive">
                  ⚠️ Risks & Warnings
                </h3>
                <svg
                  className={`h-5 w-5 text-destructive/80 transition-transform ${
                    expandedSections.risks ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {expandedSections.risks && (
                <div className="border-t border-destructive/50 p-4">
                  <div className="prose prose-sm max-w-none text-destructive/90 whitespace-pre-wrap">
                    {parseAnalysisSections(analysis).risks ||
                      "No risks detected."}
                  </div>
                </div>
              )}
            </div>

            {/* AI Recommendations */}
            <div className="rounded-lg border border-primary/50 bg-primary/10">
              <button
                onClick={() => toggleSection("recommendations")}
                className="flex w-full items-center justify-between p-4 text-left"
              >
                <h3 className="text-lg font-semibold text-primary">
                  💡 AI Recommendations
                </h3>
                <svg
                  className={`h-5 w-5 text-primary/80 transition-transform ${
                    expandedSections.recommendations ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {expandedSections.recommendations && (
                <div className="border-t border-primary/50 p-4">
                  <div className="prose prose-sm max-w-none text-primary/90 whitespace-pre-wrap">
                    {parseAnalysisSections(analysis).recommendations ||
                      "No recommendations available."}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Downloadable Report */}
          <div className="rounded-lg bg-card p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold text-foreground">
              Export Report
            </h3>
            <div className="flex flex-wrap gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  const content = buildExportText();
                  const doc = new jsPDF({ unit: "pt", format: "a4" });
                  const margin = 40;
                  const pageWidth = doc.internal.pageSize.getWidth();
                  const pageHeight = doc.internal.pageSize.getHeight();
                  const textWidth = pageWidth - margin * 2;
                  const lines = doc.splitTextToSize(content, textWidth);
                  const lineHeight = 14;
                  let cursorY = margin;

                  for (let i = 0; i < lines.length; i++) {
                    if (cursorY + lineHeight > pageHeight - margin) {
                      doc.addPage();
                      cursorY = margin;
                    }
                    doc.text(lines[i], margin, cursorY);
                    cursorY += lineHeight;
                  }

                  doc.save(
                    `financial-analysis-${new Date().toISOString().split("T")[0]}.pdf`
                  );
                }}
              >
                📄 Download PDF
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  const markdown = buildExportMarkdown();
                  const blob = new Blob([markdown], { type: "text/markdown" });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = `financial-analysis-${new Date().toISOString().split("T")[0]}.md`;
                  a.click();
                  URL.revokeObjectURL(url);
                }}
              >
                📝 Download Markdown
              </Button>
            </div>
          </div>
        </>
      )}

      {!analysis && !loading && (
        <div className="rounded-lg bg-card p-12 text-center shadow-sm">
          <p className="text-muted-foreground">
            Click "Generate AI Report" to create your financial analysis
          </p>
        </div>
      )}
    </div>
  );
}
