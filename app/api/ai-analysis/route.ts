import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import OpenAI from 'openai'

const SYSTEM_PROMPT = `You are a professional financial analyst for small businesses. Your role is to analyze financial data and provide comprehensive, actionable insights.

Rules:
- Be professional and analytical, not conversational
- Use data-driven insights
- Provide specific, actionable recommendations
- Identify risks and opportunities clearly
- Never ask questions - provide direct analysis
- Use clear structure: summary, analysis, risks, recommendations
- Format responses in structured sections with clear headings

Your analysis should include:
1. Executive Summary (high-level overview)
2. Revenue Analysis (trends, patterns, anomalies)
3. Expense Breakdown (fixed vs variable, top categories, spikes)
4. Profitability Analysis (margins, comparisons)
5. Cash Flow Analysis (inflow/outflow, burn rate, liquidity)
6. Risks & Warnings (detected issues)
7. Recommendations (actionable next steps with impact levels)`

export async function POST(request: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: 'OPENAI_API_KEY is not set' }, { status: 500 })
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      baseURL: 'https://openrouter.ai/api/v1',
      defaultHeaders: {
        'HTTP-Referer': 'http://localhost:3000',
        'X-Title': 'Booksy Finance App',
      },
    })

    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { startDate, endDate } = body

    // Get business
    const { data: business, error: businessError } = await supabase
      .from('businesses')
      .select('id, name, base_currency, business_type')
      .eq('user_id', user.id)
      .single()

    if (businessError || !business) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 })
    }

    // Get transactions for the period
    let query = supabase
      .from('transactions')
      .select('*, category:categories(*)')
      .eq('business_id', business.id)
      .order('transaction_date', { ascending: true })

    if (startDate && endDate) {
      query = query.gte('transaction_date', startDate).lte('transaction_date', endDate)
    }

    const { data: transactions, error: txError } = await query

    if (txError) {
      return NextResponse.json({ error: txError.message }, { status: 500 })
    }

    // Get all transactions for cash balance calculation
    const { data: allTransactions } = await supabase
      .from('transactions')
      .select('base_amount, transaction_date, category:categories(type)')
      .eq('business_id', business.id)
      .order('transaction_date', { ascending: true })

    // Calculate metrics
    const periodTransactions = transactions || []
    const income = periodTransactions
      .filter((t) => t.category?.type === 'income')
      .reduce((sum, t) => sum + Number(t.base_amount), 0)

    const expenses = periodTransactions
      .filter((t) => t.category?.type === 'expense')
      .reduce((sum, t) => sum + Number(t.base_amount), 0)

    const profit = income - expenses

    // Cash balance (all time)
    const cashBalance = allTransactions?.reduce((sum, t) => {
      const amount = Number(t.base_amount)
      return t.category?.type === 'income' ? sum + amount : sum - amount
    }, 0) || 0

    // Expense breakdown by category
    const expenseBreakdown: Record<string, number> = {}
    periodTransactions
      .filter((t) => t.category?.type === 'expense')
      .forEach((t) => {
        const categoryName = t.category?.name || 'Uncategorized'
        expenseBreakdown[categoryName] = (expenseBreakdown[categoryName] || 0) + Number(t.base_amount)
      })

    // Income breakdown by category
    const incomeBreakdown: Record<string, number> = {}
    periodTransactions
      .filter((t) => t.category?.type === 'income')
      .forEach((t) => {
        const categoryName = t.category?.name || 'Uncategorized'
        incomeBreakdown[categoryName] = (incomeBreakdown[categoryName] || 0) + Number(t.base_amount)
      })

    // Monthly trends
    const monthlyData: Record<string, { income: number; expenses: number; profit: number }> = {}
    periodTransactions.forEach((t) => {
      const month = t.transaction_date.substring(0, 7) // YYYY-MM
      if (!monthlyData[month]) {
        monthlyData[month] = { income: 0, expenses: 0, profit: 0 }
      }
      const amount = Number(t.base_amount)
      if (t.category?.type === 'income') {
        monthlyData[month].income += amount
      } else if (t.category?.type === 'expense') {
        monthlyData[month].expenses += amount
      }
    })
    Object.keys(monthlyData).forEach((month) => {
      monthlyData[month].profit = monthlyData[month].income - monthlyData[month].expenses
    })

    // Calculate burn rate (if expenses > income)
    const monthlyAvgExpenses = Object.values(monthlyData).reduce((sum, m) => sum + m.expenses, 0) / Math.max(Object.keys(monthlyData).length, 1)
    const burnRate = monthlyAvgExpenses
    const cashRunway = cashBalance > 0 && burnRate > 0 ? cashBalance / burnRate : null

    // Prepare comprehensive financial data
    const financialData = {
      business: {
        name: business.name,
        type: business.business_type,
        currency: business.base_currency,
      },
      period: {
        startDate: startDate || null,
        endDate: endDate || null,
      },
      totals: {
        income,
        expenses,
        profit,
        cashBalance,
      },
      breakdowns: {
        expenses: expenseBreakdown,
        income: incomeBreakdown,
      },
      trends: {
        monthly: monthlyData,
      },
      metrics: {
        transactionCount: periodTransactions.length,
        averageTransactionSize: periodTransactions.length > 0 
          ? (income + expenses) / periodTransactions.length 
          : 0,
        burnRate: burnRate > 0 ? burnRate : null,
        cashRunway: cashRunway,
        grossMargin: income > 0 ? ((income - expenses) / income) * 100 : 0,
        netMargin: income > 0 ? (profit / income) * 100 : 0,
      },
      transactions: periodTransactions.slice(0, 50).map((t) => ({
        date: t.transaction_date,
        category: t.category?.name,
        type: t.category?.type,
        amount: Number(t.base_amount),
        paymentMethod: t.payment_method,
      })),
    }

    // Generate comprehensive analysis prompt
    const analysisPrompt = `Analyze the following financial data for ${business.name} (${business.business_type || 'Business'}) and provide a comprehensive financial analysis report.

PERIOD: ${startDate ? `${startDate} to ${endDate}` : 'All time'}
CURRENCY: ${business.base_currency}

FINANCIAL SUMMARY:
- Total Income: ${business.base_currency} ${income.toFixed(2)}
- Total Expenses: ${business.base_currency} ${expenses.toFixed(2)}
- Net Profit: ${business.base_currency} ${profit.toFixed(2)}
- Cash Balance: ${business.base_currency} ${cashBalance.toFixed(2)}
${cashRunway ? `- Estimated Cash Runway: ${cashRunway.toFixed(1)} months` : ''}

INCOME BREAKDOWN:
${Object.entries(incomeBreakdown)
  .map(([cat, amount]) => `- ${cat}: ${business.base_currency} ${amount.toFixed(2)}`)
  .join('\n') || 'No income data'}

EXPENSE BREAKDOWN:
${Object.entries(expenseBreakdown)
  .map(([cat, amount]) => `- ${cat}: ${business.base_currency} ${amount.toFixed(2)}`)
  .join('\n') || 'No expense data'}

MONTHLY TRENDS:
${Object.entries(monthlyData)
  .map(([month, data]) => `${month}: Income ${data.income.toFixed(2)}, Expenses ${data.expenses.toFixed(2)}, Profit ${data.profit.toFixed(2)}`)
  .join('\n') || 'No monthly data'}

METRICS:
- Gross Margin: ${financialData.metrics.grossMargin.toFixed(1)}%
- Net Margin: ${financialData.metrics.netMargin.toFixed(1)}%
- Transaction Count: ${financialData.metrics.transactionCount}
${financialData.metrics.burnRate ? `- Monthly Burn Rate: ${business.base_currency} ${financialData.metrics.burnRate.toFixed(2)}` : ''}

Provide a structured analysis with these sections:

1. EXECUTIVE SUMMARY (2-3 paragraphs)
   - Overall financial health
   - Key highlights
   - Primary concerns or strengths

2. REVENUE ANALYSIS
   - Revenue trends
   - Best performing categories
   - Seasonal patterns (if detectable)
   - Anomalies or unusual patterns

3. EXPENSE BREAKDOWN
   - Fixed vs Variable costs analysis
   - Top 5 expense categories
   - Unusual spikes or increases
   - Cost efficiency observations

4. PROFITABILITY ANALYSIS
   - Gross margin analysis
   - Net margin analysis
   - Comparison to industry standards (if applicable)
   - Profitability trends

5. CASH FLOW ANALYSIS
   - Inflow vs Outflow patterns
   - Burn rate assessment
   - Liquidity risk evaluation
   - Cash runway assessment

6. RISKS & WARNINGS
   - Specific risks detected (use ⚠️ emoji)
   - Warning signs
   - Areas of concern

7. RECOMMENDATIONS
   - Actionable recommendations with:
     * Specific actions to take
     * Impact level (High/Medium/Low)
     * Priority
   - Format each recommendation clearly

Use clear, professional language. Be specific with numbers and percentages. Use emojis sparingly for emphasis (⚠️ for risks, 📈 for growth, 📉 for decline).`

    // Generate AI analysis
    const completion = await openai.chat.completions.create({
      model: 'openai/gpt-4o-mini',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: analysisPrompt },
      ],
      temperature: 0.3,
      max_tokens: 2000,
    })

    const aiResponse = completion.choices?.[0]?.message?.content

    if (!aiResponse) {
      return NextResponse.json({ error: 'AI response failed' }, { status: 500 })
    }

    return NextResponse.json({
      analysis: aiResponse,
      financialData,
    })
  } catch (err: any) {
    console.error('[AI_ANALYSIS_ERROR]', err)
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 })
  }
}
