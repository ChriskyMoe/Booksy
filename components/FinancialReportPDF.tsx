"use client";

import { jsPDF } from "jspdf";
import { Button } from "@/components/ui/button";

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

interface FinancialReportPDFProps {
  analysis: string;
  financialData: FinancialData;
  period: { startDate: string; endDate: string };
}

/**
 * Parses the AI analysis text into structured sections.
 * This helps organize the report into clear, readable sections.
 */
const parseAnalysisSections = (text: string) => {
  const sections: Record<string, string> = {
    summary: "",
    revenue: "",
    expenses: "",
    profitability: "",
    cashflow: "",
    risks: "",
    recommendations: "",
  };

  const lines = text.split("\n");
  let currentSection: string | null = null;
  let currentContent: string[] = [];

  for (const line of lines) {
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

  if (!sections.summary) {
    sections.summary = text.trim();
  }

  return sections;
};

/**
 * Extracts bullet points from text.
 * Used for displaying risks and recommendations in a clean list format.
 */
const extractBulletPoints = (text: string): string[] => {
  if (!text) return [];

  const lines = text.split("\n");
  const bullets: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith("-") || trimmed.startsWith("•")) {
      bullets.push(trimmed.substring(1).trim());
    } else if (trimmed.startsWith("*")) {
      bullets.push(trimmed.substring(1).trim());
    } else if (/^\d+\.\s/.test(trimmed)) {
      bullets.push(trimmed.replace(/^\d+\.\s/, "").trim());
    } else if (trimmed && !trimmed.startsWith("#")) {
      bullets.push(trimmed);
    }
  }

  return bullets.filter((b) => b.length > 0);
};

/**
 * Sanitizes text for PDF output by removing problematic characters.
 * Removes markdown formatting, HTML entities, and control characters.
 */
function sanitizePdfText(text: string): string {
  if (!text) return "";

  return (
    text
      // Remove markdown bold/italic
      .replace(/\*\*\*/g, "")
      .replace(/\*\*/g, "")
      .replace(/\*/g, "")
      .replace(/___/g, "")
      .replace(/__/g, "")
      .replace(/_/g, "")

      // Remove markdown headers
      .replace(/^#{1,6}\s+/gm, "")

      // Remove HTML entities if any slipped in
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&nbsp;/g, " ")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")

      // Remove zero-width characters and other problematic unicode
      .replace(/[\u200B-\u200D\uFEFF]/g, "")

      // Remove control characters but keep line breaks and tabs
      .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F-\u009F]/g, "")

      // Remove special unicode symbols that don't render well
      .replace(/[⚠️🔥💡📊📈📉⭐️✅❌➡️←↑↓]/g, "")

      // Normalize to composed form (NFC) instead of decomposed
      .normalize("NFC")

      // Trim extra whitespace
      .trim()
  );
}

/**
 * Main component for generating and exporting financial reports as PDF.
 *
 * Design Choices:
 * 1. Client-side PDF generation using jsPDF - No server dependency
 * 2. Table-based layout for numbers - Easy to scan and compare
 * 3. Sectioned structure - Clear visual hierarchy
 * 4. Professional styling - Neutral colors, adequate spacing
 * 5. Unicode-safe fonts - Uses jsPDF's built-in fonts to avoid encoding issues
 */
export default function FinancialReportPDF({
  analysis,
  financialData,
  period,
}: FinancialReportPDFProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: financialData.business.currency,
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const generatePDF = () => {
    // Initialize PDF with A4 size
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    const contentWidth = pageWidth - 2 * margin;
    let yPosition = margin;

    // Helper function to check if we need a new page
    const checkPageBreak = (requiredSpace: number) => {
      if (yPosition + requiredSpace > pageHeight - margin) {
        doc.addPage();
        yPosition = margin;
        return true;
      }
      return false;
    };

    // Helper function to add text with word wrapping
    const addWrappedText = (
      text: string,
      x: number,
      y: number,
      maxWidth: number,
      lineHeight: number = 6
    ) => {
      // Ensure text is properly sanitized and encoded
      const cleanText = text || "";
      const lines = doc.splitTextToSize(cleanText, maxWidth);
      for (const line of lines) {
        checkPageBreak(lineHeight);
        // Convert to string explicitly to avoid encoding issues
        const lineText = String(line).trim();
        if (lineText) {
          doc.text(lineText, x, y);
        }
        y += lineHeight;
      }
      return y;
    };

    // ===== HEADER SECTION =====
    // Company name and report title
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text(financialData.business.name, margin, yPosition);
    yPosition += 10;

    doc.setFontSize(16);
    doc.setTextColor(60, 60, 60);
    doc.text("Financial Analysis Report", margin, yPosition);
    yPosition += 8;

    // Date range
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100);
    doc.text(
      `Period: ${formatDate(period.startDate)} - ${formatDate(period.endDate)}`,
      margin,
      yPosition
    );
    yPosition += 4;

    doc.text(
      `Generated: ${new Date().toLocaleDateString("en-US")} at ${new Date().toLocaleTimeString("en-US")}`,
      margin,
      yPosition
    );
    yPosition += 12;

    // Horizontal line separator
    doc.setDrawColor(200, 200, 200);
    doc.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 10;

    // ===== FINANCIAL OVERVIEW TABLE =====
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    doc.text("Financial Overview", margin, yPosition);
    yPosition += 8;

    // Table structure for financial metrics
    const overviewData = [
      ["Metric", "Amount"],
      ["Total Revenue", formatCurrency(financialData.totals.income)],
      ["Total Expenses", formatCurrency(financialData.totals.expenses)],
      ["Net Profit/Loss", formatCurrency(financialData.totals.profit)],
      ["Cash Balance", formatCurrency(financialData.totals.cashBalance)],
    ];

    // Draw table manually for better control
    doc.setFontSize(10);
    const tableStartY = yPosition;
    const rowHeight = 8;
    const col1Width = contentWidth * 0.5;
    const col2Width = contentWidth * 0.5;

    // Table header
    doc.setFillColor(240, 240, 240);
    doc.rect(margin, yPosition, contentWidth, rowHeight, "F");
    doc.setFont("helvetica", "bold");
    doc.text(overviewData[0][0], margin + 2, yPosition + 5.5);
    doc.text(overviewData[0][1], margin + col1Width + 2, yPosition + 5.5);
    yPosition += rowHeight;

    // Table rows
    doc.setFont("helvetica", "normal");
    for (let i = 1; i < overviewData.length; i++) {
      checkPageBreak(rowHeight);

      // Alternate row colors for readability
      if (i % 2 === 0) {
        doc.setFillColor(250, 250, 250);
        doc.rect(margin, yPosition, contentWidth, rowHeight, "F");
      }

      doc.text(overviewData[i][0], margin + 2, yPosition + 5.5);
      doc.text(overviewData[i][1], margin + col1Width + 2, yPosition + 5.5);

      // Highlight profit/loss with color
      if (i === 3) {
        if (financialData.totals.profit >= 0) {
          doc.setTextColor(0, 128, 0); // Green for profit
        } else {
          doc.setTextColor(200, 0, 0); // Red for loss
        }
        doc.text(overviewData[i][1], margin + col1Width + 2, yPosition + 5.5);
        doc.setTextColor(0, 0, 0);
      }

      yPosition += rowHeight;
    }

    // Table border
    doc.setDrawColor(200, 200, 200);
    doc.rect(
      margin,
      tableStartY,
      contentWidth,
      rowHeight * overviewData.length
    );

    yPosition += 8;

    // ===== KEY METRICS TABLE =====
    checkPageBreak(60);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Key Metrics", margin, yPosition);
    yPosition += 8;

    const metricsData = [
      ["Metric", "Value"],
      ["Gross Margin", `${financialData.metrics.grossMargin.toFixed(2)}%`],
      ["Net Margin", `${financialData.metrics.netMargin.toFixed(2)}%`],
      [
        "Monthly Burn Rate",
        financialData.metrics.burnRate === null
          ? "N/A"
          : formatCurrency(financialData.metrics.burnRate),
      ],
      [
        "Cash Runway",
        financialData.metrics.cashRunway === null
          ? "N/A"
          : `${financialData.metrics.cashRunway.toFixed(1)} months`,
      ],
    ];

    const metricsTableStartY = yPosition;
    doc.setFontSize(10);

    // Table header
    doc.setFillColor(240, 240, 240);
    doc.rect(margin, yPosition, contentWidth, rowHeight, "F");
    doc.setFont("helvetica", "bold");
    doc.text(metricsData[0][0], margin + 2, yPosition + 5.5);
    doc.text(metricsData[0][1], margin + col1Width + 2, yPosition + 5.5);
    yPosition += rowHeight;

    // Table rows
    doc.setFont("helvetica", "normal");
    for (let i = 1; i < metricsData.length; i++) {
      checkPageBreak(rowHeight);

      if (i % 2 === 0) {
        doc.setFillColor(250, 250, 250);
        doc.rect(margin, yPosition, contentWidth, rowHeight, "F");
      }

      doc.text(metricsData[i][0], margin + 2, yPosition + 5.5);
      doc.text(metricsData[i][1], margin + col1Width + 2, yPosition + 5.5);
      yPosition += rowHeight;
    }

    doc.setDrawColor(200, 200, 200);
    doc.rect(
      margin,
      metricsTableStartY,
      contentWidth,
      rowHeight * metricsData.length
    );

    yPosition += 10;

    // ===== ANALYSIS SECTIONS =====
    const sections = parseAnalysisSections(analysis);

    // Executive Summary
    if (sections.summary) {
      checkPageBreak(30);
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0, 0, 0);
      doc.text("Executive Summary", margin, yPosition);
      yPosition += 8;

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(60, 60, 60);
      yPosition = addWrappedText(
        sanitizePdfText(sections.summary),
        margin,
        yPosition,
        contentWidth
      );
      yPosition += 8;
    }

    // Risks & Warnings Section (visually emphasized)
    if (sections.risks) {
      checkPageBreak(40);

      const riskBullets = extractBulletPoints(sections.risks).map(
        sanitizePdfText
      );

      // Calculate dynamic box height based on actual wrapped text
      let totalRiskHeight = 0;
      for (const bullet of riskBullets) {
        const lines = doc.splitTextToSize(bullet, contentWidth - 12);
        totalRiskHeight += lines.length * 6; // 6 is lineHeight
      }
      const riskBoxHeight = 10 + totalRiskHeight + (riskBullets.length - 1) * 1;

      doc.setFillColor(255, 245, 245);
      doc.rect(margin, yPosition, contentWidth, riskBoxHeight, "F");

      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(180, 0, 0);
      doc.text("RISKS & WARNINGS", margin + 2, yPosition + 6);
      yPosition += 10;

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(100, 0, 0);

      for (const bullet of riskBullets) {
        checkPageBreak(7);
        doc.text("-", margin + 4, yPosition);
        yPosition = addWrappedText(
          bullet,
          margin + 8,
          yPosition,
          contentWidth - 12,
          6
        );
        yPosition += 1;
      }

      doc.setTextColor(0, 0, 0);
      yPosition += 8;
    }

    // Recommendations Section (with priority labels)
    if (sections.recommendations) {
      checkPageBreak(40);
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Recommendations", margin, yPosition);
      yPosition += 8;

      const recBullets = extractBulletPoints(sections.recommendations).map(
        sanitizePdfText
      );
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(60, 60, 60);

      for (let i = 0; i < recBullets.length; i++) {
        checkPageBreak(15);

        // Number the recommendation
        doc.setFont("helvetica", "bold");
        doc.text(`${i + 1}.`, margin, yPosition);

        // Add priority label for first 3 recommendations
        if (i < 3) {
          doc.setFont("helvetica", "bold");
          doc.setTextColor(0, 100, 200);
          doc.text("[HIGH PRIORITY]", margin + 8, yPosition);
          yPosition += 6;
          doc.setFont("helvetica", "normal");
          doc.setTextColor(60, 60, 60);
        } else {
          doc.setFont("helvetica", "normal");
        }

        yPosition = addWrappedText(
          recBullets[i],
          margin + 8,
          yPosition,
          contentWidth - 8,
          6
        );
        yPosition += 3;
      }

      yPosition += 6;
    }

    // Additional Analysis Sections
    const additionalSections = [
      { key: "revenue", title: "Revenue Analysis" },
      { key: "expenses", title: "Expense Analysis" },
      { key: "profitability", title: "Profitability Analysis" },
      { key: "cashflow", title: "Cash Flow Analysis" },
    ];

    for (const section of additionalSections) {
      if (sections[section.key]) {
        checkPageBreak(25);
        doc.setFontSize(13);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(0, 0, 0);
        doc.text(section.title, margin, yPosition);
        yPosition += 7;

        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(60, 60, 60);
        yPosition = addWrappedText(
          sanitizePdfText(sections[section.key]),
          margin,
          yPosition,
          contentWidth
        );
        yPosition += 8;
      }
    }

    // Footer on last page
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(
      "This report was generated automatically by AI. Please review with your financial advisor.",
      margin,
      pageHeight - 15
    );
    doc.text(
      `© ${new Date().getFullYear()} ${financialData.business.name}`,
      margin,
      pageHeight - 10
    );

    // Save the PDF
    const fileName = `financial-report-${period.startDate}-to-${period.endDate}.pdf`;
    doc.save(fileName);
  };

  return (
    <Button onClick={generatePDF} variant="default" className="gap-2">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
      Export as PDF
    </Button>
  );
}
