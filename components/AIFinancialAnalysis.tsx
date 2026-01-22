'use client'

import { useState, useEffect } from 'react'
import { getDashboardData } from '@/lib/actions/dashboard'
import { getBusiness } from '@/lib/actions/business'

interface FinancialData {
  business: {
    name: string
    type: string | null
    currency: string
  }
  totals: {
    income: number
    expenses: number
    profit: number
    cashBalance: number
  }
  breakdowns: {
    expenses: Record<string, number>
    income: Record<string, number>
  }
  metrics: {
    grossMargin: number
    netMargin: number
    burnRate: number | null
    cashRunway: number | null
  }
}

interface AnalysisResponse {
  analysis: string
  financialData: FinancialData
}

type Period = 'thisMonth' | 'last3Months' | 'last6Months' | 'thisYear' | 'custom'

export default function AIFinancialAnalysis() {
  const [period, setPeriod] = useState<Period>('thisMonth')
  const [customStartDate, setCustomStartDate] = useState('')
  const [customEndDate, setCustomEndDate] = useState('')
  const [loading, setLoading] = useState(false)
  const [analysis, setAnalysis] = useState<string | null>(null)
  const [financialData, setFinancialData] = useState<FinancialData | null>(null)
  const [businessName, setBusinessName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    revenue: true,
    expenses: true,
    profitability: true,
    cashflow: true,
    risks: true,
    recommendations: true,
  })

  useEffect(() => {
    loadBusinessInfo()
  }, [])

  const loadBusinessInfo = async () => {
    try {
      const result = await getBusiness() as { data?: { name: string } } | { error: string }
      if (result && 'data' in result && result.data) {
        setBusinessName(result.data.name)
      }
    } catch (err) {
      // Silently fail - business name is optional
    }
  }

  const getDateRange = (): { startDate: string; endDate: string } => {
    const now = new Date()
    const today = now.toISOString().split('T')[0]

    switch (period) {
      case 'thisMonth': {
        const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)
          .toISOString()
          .split('T')[0]
        return { startDate: firstDay, endDate: today }
      }
      case 'last3Months': {
        const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, 1)
          .toISOString()
          .split('T')[0]
        return { startDate: threeMonthsAgo, endDate: today }
      }
      case 'last6Months': {
        const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 6, 1)
          .toISOString()
          .split('T')[0]
        return { startDate: sixMonthsAgo, endDate: today }
      }
      case 'thisYear': {
        const firstDayOfYear = new Date(now.getFullYear(), 0, 1)
          .toISOString()
          .split('T')[0]
        return { startDate: firstDayOfYear, endDate: today }
      }
      case 'custom':
        return {
          startDate: customStartDate || today,
          endDate: customEndDate || today,
        }
      default:
        return { startDate: today, endDate: today }
    }
  }

  const generateReport = async () => {
    setLoading(true)
    setError(null)
    setAnalysis(null)

    try {
      const { startDate, endDate } = getDateRange()

      const response = await fetch('/api/ai-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ startDate, endDate }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to generate analysis')
      }

      const data: AnalysisResponse = await response.json()
      setAnalysis(data.analysis)
      setFinancialData(data.financialData)
    } catch (err: any) {
      setError(err.message || 'Failed to generate analysis')
    } finally {
      setLoading(false)
    }
  }

  const getCashFlowStatus = (): { status: 'healthy' | 'warning' | 'risk'; label: string } => {
    if (!financialData) return { status: 'healthy', label: 'Unknown' }

    const { cashRunway } = financialData.metrics
    const { profit, cashBalance } = financialData.totals

    if (profit < 0 && cashRunway !== null && cashRunway < 3) {
      return { status: 'risk', label: 'Risk' }
    }
    if (profit < 0 || (cashRunway !== null && cashRunway < 6)) {
      return { status: 'warning', label: 'Warning' }
    }
    return { status: 'healthy', label: 'Healthy' }
  }

  const parseAnalysisSections = (text: string) => {
    const sections: Record<string, string> = {}
    const lines = text.split('\n')
    let currentSection: string | null = null
    let currentContent: string[] = []

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      const upperLine = line.toUpperCase().trim()
      const trimmedLine = line.trim()
      
      // Check if this is a section header (markdown header or numbered section)
      const isHeader = trimmedLine.startsWith('#') || /^\d+\.\s/.test(trimmedLine)
      
      if (isHeader) {
        // Save previous section if it exists
        if (currentSection && currentContent.length > 0) {
          sections[currentSection] = currentContent.join('\n').trim()
        }
        
        // Detect which section this is (check most specific first)
        if (upperLine.includes('EXECUTIVE SUMMARY')) {
          currentSection = 'summary'
        } else if (upperLine.includes('REVENUE ANALYSIS')) {
          currentSection = 'revenue'
        } else if (upperLine.includes('EXPENSE BREAKDOWN')) {
          currentSection = 'expenses'
        } else if (upperLine.includes('PROFITABILITY ANALYSIS')) {
          currentSection = 'profitability'
        } else if (upperLine.includes('CASH FLOW ANALYSIS')) {
          currentSection = 'cashflow'
        } else if (upperLine.includes('RISKS') && upperLine.includes('WARNINGS')) {
          currentSection = 'risks'
        } else if (upperLine.includes('RISKS') || upperLine.includes('WARNINGS')) {
          currentSection = 'risks'
        } else if (upperLine.includes('RECOMMENDATIONS') || upperLine.includes('RECOMMENDATION')) {
          currentSection = 'recommendations'
        } else if (upperLine.includes('SUMMARY') && !upperLine.includes('RECOMMENDATION')) {
          currentSection = 'summary'
        } else if (upperLine.includes('REVENUE') && !upperLine.includes('EXPENSE')) {
          currentSection = 'revenue'
        } else if (upperLine.includes('EXPENSE') && !upperLine.includes('REVENUE')) {
          currentSection = 'expenses'
        } else if (upperLine.includes('PROFITABILITY')) {
          currentSection = 'profitability'
        } else if (upperLine.includes('CASH') && upperLine.includes('FLOW')) {
          currentSection = 'cashflow'
        } else {
          // Unknown header, continue with current section or start summary
          if (!currentSection) {
            currentSection = 'summary'
          }
          currentContent.push(line)
          continue
        }
        
        // Start new content for this section (skip the header line)
        currentContent = []
        continue
      }

      // Add content to current section
      if (currentSection) {
        currentContent.push(line)
      } else {
        // No section detected yet, start with summary
        currentSection = 'summary'
        currentContent.push(line)
      }
    }

    // Save the last section
    if (currentSection && currentContent.length > 0) {
      sections[currentSection] = currentContent.join('\n').trim()
    }

    // If no sections were found, put everything in summary
    if (Object.keys(sections).length === 0) {
      sections.summary = text.trim()
    }

    return sections
  }

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  const formatCurrency = (amount: number) => {
    if (!financialData) return amount.toFixed(2)
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: financialData.business.currency,
      minimumFractionDigits: 2,
    }).format(amount)
  }

  const cashFlowStatus = financialData ? getCashFlowStatus() : null

  return (
    <div className="space-y-6">
      {/* Overview Header */}
      <div className="rounded-lg bg-white p-6 shadow-sm">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{businessName || 'Business'}</h2>
            <p className="mt-1 text-sm text-gray-600">AI Financial Analysis</p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">Period:</label>
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value as Period)}
                className="rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-900 bg-white focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                disabled={loading}
              >
                <option value="thisMonth">This Month</option>
                <option value="last3Months">Last 3 Months</option>
                <option value="last6Months">Last 6 Months</option>
                <option value="thisYear">This Year</option>
                <option value="custom">Custom</option>
              </select>
            </div>

            {period === 'custom' && (
              <div className="flex items-center gap-2">
                <input
                  type="date"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                  className="rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-900 bg-white focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                />
                <span className="text-sm text-gray-600">to</span>
                <input
                  type="date"
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                  className="rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-900 bg-white focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                />
              </div>
            )}

            <button
              onClick={generateReport}
              disabled={loading}
              className="rounded-md bg-blue-600 px-6 py-2 text-sm font-semibold text-white hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
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
                'Generate AI Report'
              )}
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        {financialData && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="mt-1 text-2xl font-bold text-gray-900">
                {formatCurrency(financialData.totals.income)}
              </p>
            </div>
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
              <p className="text-sm font-medium text-gray-600">Total Expenses</p>
              <p className="mt-1 text-2xl font-bold text-gray-900">
                {formatCurrency(financialData.totals.expenses)}
              </p>
            </div>
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
              <p className="text-sm font-medium text-gray-600">Net Profit</p>
              <p
                className={`mt-1 text-2xl font-bold ${
                  financialData.totals.profit >= 0 ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {formatCurrency(financialData.totals.profit)}
              </p>
            </div>
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
              <p className="text-sm font-medium text-gray-600">Cash Flow Status</p>
              <p
                className={`mt-1 text-2xl font-bold ${
                  cashFlowStatus?.status === 'healthy'
                    ? 'text-green-600'
                    : cashFlowStatus?.status === 'warning'
                    ? 'text-yellow-600'
                    : 'text-red-600'
                }`}
              >
                {cashFlowStatus?.label || 'N/A'}
              </p>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 p-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {analysis && financialData && (
        <>
          {/* AI Summary Section */}
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-xl font-semibold text-gray-900">AI Financial Summary</h3>
            <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap">
              {parseAnalysisSections(analysis).summary || analysis.split('\n').slice(0, 10).join('\n')}
            </div>
          </div>

          {/* Deep Financial Analysis Sections */}
          <div className="space-y-4">
            {/* Revenue Analysis */}
            <div className="rounded-lg border border-gray-200 bg-white">
              <button
                onClick={() => toggleSection('revenue')}
                className="flex w-full items-center justify-between p-4 text-left"
              >
                <h3 className="text-lg font-semibold text-gray-900">Revenue Analysis</h3>
                <svg
                  className={`h-5 w-5 text-gray-500 transition-transform ${
                    expandedSections.revenue ? 'rotate-180' : ''
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
                <div className="border-t border-gray-200 p-4">
                  <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap">
                    {parseAnalysisSections(analysis).revenue || 'No revenue analysis available.'}
                  </div>
                </div>
              )}
            </div>

            {/* Expense Breakdown */}
            <div className="rounded-lg border border-gray-200 bg-white">
              <button
                onClick={() => toggleSection('expenses')}
                className="flex w-full items-center justify-between p-4 text-left"
              >
                <h3 className="text-lg font-semibold text-gray-900">Expense Breakdown</h3>
                <svg
                  className={`h-5 w-5 text-gray-500 transition-transform ${
                    expandedSections.expenses ? 'rotate-180' : ''
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
                <div className="border-t border-gray-200 p-4">
                  <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap">
                    {parseAnalysisSections(analysis).expenses || 'No expense analysis available.'}
                  </div>
                </div>
              )}
            </div>

            {/* Profitability Analysis */}
            <div className="rounded-lg border border-gray-200 bg-white">
              <button
                onClick={() => toggleSection('profitability')}
                className="flex w-full items-center justify-between p-4 text-left"
              >
                <h3 className="text-lg font-semibold text-gray-900">Profitability Analysis</h3>
                <svg
                  className={`h-5 w-5 text-gray-500 transition-transform ${
                    expandedSections.profitability ? 'rotate-180' : ''
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
                <div className="border-t border-gray-200 p-4">
                  <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap">
                    {parseAnalysisSections(analysis).profitability ||
                      'No profitability analysis available.'}
                  </div>
                </div>
              )}
            </div>

            {/* Cash Flow Analysis */}
            <div className="rounded-lg border border-gray-200 bg-white">
              <button
                onClick={() => toggleSection('cashflow')}
                className="flex w-full items-center justify-between p-4 text-left"
              >
                <h3 className="text-lg font-semibold text-gray-900">Cash Flow Analysis</h3>
                <svg
                  className={`h-5 w-5 text-gray-500 transition-transform ${
                    expandedSections.cashflow ? 'rotate-180' : ''
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
                <div className="border-t border-gray-200 p-4">
                  <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap">
                    {parseAnalysisSections(analysis).cashflow || 'No cash flow analysis available.'}
                  </div>
                </div>
              )}
            </div>

            {/* AI Insights & Warnings */}
            <div className="rounded-lg border border-red-200 bg-red-50">
              <button
                onClick={() => toggleSection('risks')}
                className="flex w-full items-center justify-between p-4 text-left"
              >
                <h3 className="text-lg font-semibold text-red-900">⚠️ Risks & Warnings</h3>
                <svg
                  className={`h-5 w-5 text-red-500 transition-transform ${
                    expandedSections.risks ? 'rotate-180' : ''
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
                <div className="border-t border-red-200 p-4">
                  <div className="prose prose-sm max-w-none text-red-800 whitespace-pre-wrap">
                    {parseAnalysisSections(analysis).risks || 'No risks detected.'}
                  </div>
                </div>
              )}
            </div>

            {/* AI Recommendations */}
            <div className="rounded-lg border border-blue-200 bg-blue-50">
              <button
                onClick={() => toggleSection('recommendations')}
                className="flex w-full items-center justify-between p-4 text-left"
              >
                <h3 className="text-lg font-semibold text-blue-900">💡 AI Recommendations</h3>
                <svg
                  className={`h-5 w-5 text-blue-500 transition-transform ${
                    expandedSections.recommendations ? 'rotate-180' : ''
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
                <div className="border-t border-blue-200 p-4">
                  <div className="prose prose-sm max-w-none text-blue-800 whitespace-pre-wrap">
                    {parseAnalysisSections(analysis).recommendations ||
                      'No recommendations available.'}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Downloadable Report */}
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">Export Report</h3>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => {
                  const blob = new Blob([analysis], { type: 'text/plain' })
                  const url = URL.createObjectURL(blob)
                  const a = document.createElement('a')
                  a.href = url
                  a.download = `financial-analysis-${new Date().toISOString().split('T')[0]}.txt`
                  a.click()
                  URL.revokeObjectURL(url)
                }}
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                📄 Download as Text
              </button>
              <button
                onClick={() => {
                  const csv = `Period,Income,Expenses,Profit,Cash Balance\n${getDateRange().startDate} to ${getDateRange().endDate},${financialData.totals.income},${financialData.totals.expenses},${financialData.totals.profit},${financialData.totals.cashBalance}`
                  const blob = new Blob([csv], { type: 'text/csv' })
                  const url = URL.createObjectURL(blob)
                  const a = document.createElement('a')
                  a.href = url
                  a.download = `financial-data-${new Date().toISOString().split('T')[0]}.csv`
                  a.click()
                  URL.revokeObjectURL(url)
                }}
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                📊 Export CSV
              </button>
            </div>
          </div>
        </>
      )}

      {!analysis && !loading && (
        <div className="rounded-lg bg-white p-12 text-center shadow-sm">
          <p className="text-gray-600">Click "Generate AI Report" to create your financial analysis</p>
        </div>
      )}
    </div>
  )
}
