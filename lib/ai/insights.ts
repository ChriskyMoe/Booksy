'use server'

import OpenAI from 'openai'
import { getDashboardData } from '@/lib/actions/dashboard'
import { getJournalEntries } from '@/lib/actions/journal'
import { processJournalForDisplay } from '@/lib/utils'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function generateFinancialInsights(question?: string) {
  if (!process.env.OPENAI_API_KEY) {
    return {
      error: 'OpenAI API key not configured',
    }
  }

  // Get financial data
  const dashboardResult = await getDashboardData()
  const journalEntriesResult = await getJournalEntries() // Use new action

  if (dashboardResult.error || !dashboardResult.data) {
    return { error: 'Failed to load financial data' }
  }

  const { data: dashboard } = dashboardResult
  const processedTransactions = (journalEntriesResult.data || []).map(processJournalForDisplay) // Process journal entries

  // Prepare context for AI
  const context = {
    income: dashboard.income,
    expenses: dashboard.expenses,
    profit: dashboard.profit,
    cashBalance: dashboard.cashBalance,
    expenseBreakdown: dashboard.expenseBreakdown,
    currency: dashboard.currency,
    transactionCount: processedTransactions.length, // Update transaction count
    recentTransactions: processedTransactions.slice(0, 10).map((t) => ({ // Map to expected format
      date: t.date,
      category: t.accountName, // Use accountName as category
      type: t.type,
      amount: t.amount,
    })),
  }

  // Generate prompt
  const prompt = question
    ? `As a financial advisor for a small business, answer this question based on the following financial data:

Financial Summary:
- Total Income: ${dashboard.currency} ${dashboard.income.toFixed(2)}
- Total Expenses: ${dashboard.currency} ${dashboard.expenses.toFixed(2)}
- Net Profit: ${dashboard.currency} ${dashboard.profit.toFixed(2)}
- Cash Balance: ${dashboard.currency} ${dashboard.cashBalance.toFixed(2)}

Expense Breakdown:
${Object.entries(dashboard.expenseBreakdown)
  .map(([cat, amount]) => `- ${cat}: ${dashboard.currency} ${amount.toFixed(2)}`)
  .join('\n')}

Question: ${question}

Provide a clear, actionable answer in plain language (no accounting jargon). Be specific and helpful.`
    : `As a financial advisor for a small business, analyze the following financial data and provide insights:

Financial Summary:
- Total Income: ${dashboard.currency} ${dashboard.income.toFixed(2)}
- Total Expenses: ${dashboard.currency} ${dashboard.expenses.toFixed(2)}
- Net Profit: ${dashboard.currency} ${dashboard.profit.toFixed(2)}
- Cash Balance: ${dashboard.currency} ${dashboard.cashBalance.toFixed(2)}

Expense Breakdown:
${Object.entries(dashboard.expenseBreakdown)
  .map(([cat, amount]) => `- ${cat}: ${dashboard.currency} ${amount.toFixed(2)}`)
  .join('\n')}

Provide:
1. A brief summary of financial health
2. Key trends or patterns you notice
3. Actionable recommendations
4. Any potential risks or concerns

Use plain language (no accounting jargon). Be specific and helpful.`

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            'You are a helpful financial advisor for small businesses. Provide clear, actionable insights in plain language without accounting jargon.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 500,
    })

    return {
      data: completion.choices[0]?.message?.content || 'No response generated',
    }
  } catch (error: any) {
    return {
      error: error.message || 'Failed to generate insights',
    }
  }
}

export async function generateMonthlySummary(month: string, year: number) {
  const startDate = `${year}-${month.padStart(2, '0')}-01`
  const endDate = `${year}-${month.padStart(2, '0')}-31`

  const dashboardResult = await getDashboardData({ startDate, endDate })
  const journalEntriesResult = await getJournalEntries({ startDate, endDate }) // Use new action

  if (dashboardResult.error || !dashboardResult.data) {
    return { error: 'Failed to load financial data' }
  }

  const { data: dashboard } = dashboardResult
  const processedTransactions = (journalEntriesResult.data || []).map(processJournalForDisplay) // Process journal entries
  // 'processedTransactions' is not directly used in the prompt here, but keeping it consistent.

  if (!process.env.OPENAI_API_KEY) {
    return {
      error: 'OpenAI API key not configured',
    }
  }

  const prompt = `Generate a monthly financial summary for a small business:

Month: ${month}/${year}
- Total Income: ${dashboard.currency} ${dashboard.income.toFixed(2)}
- Total Expenses: ${dashboard.currency} ${dashboard.expenses.toFixed(2)}
- Net Profit: ${dashboard.currency} ${dashboard.profit.toFixed(2)}

Expense Breakdown:
${Object.entries(dashboard.expenseBreakdown)
  .map(([cat, amount]) => `- ${cat}: ${dashboard.currency} ${amount.toFixed(2)}`)
  .join('\n')}

Provide a concise monthly summary (2-3 paragraphs) covering:
1. Performance overview
2. Key highlights
3. Recommendations for next month

Use plain language, be encouraging but honest.`

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            'You are a helpful financial advisor generating monthly summaries for small businesses. Be clear, encouraging, and actionable.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 400,
    })

    return {
      data: completion.choices[0]?.message?.content || 'No summary generated',
    }
  } catch (error: any) {
    return {
      error: error.message || 'Failed to generate summary',
    }
  }
}
