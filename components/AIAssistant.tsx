'use client'

import { useState } from 'react'
import { generateFinancialInsights } from '@/lib/ai/insights'

export default function AIAssistant() {
  const [question, setQuestion] = useState('')
  const [loading, setLoading] = useState(false)
  const [response, setResponse] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!question.trim()) return

    setLoading(true)
    setError(null)
    setResponse(null)

    const result = await generateFinancialInsights(question)

    if (result.error) {
      setError(result.error)
    } else if (result.data) {
      setResponse(result.data)
    }

    setLoading(false)
  }

  const handleQuickQuestion = async (quickQuestion: string) => {
    setQuestion(quickQuestion)
    setLoading(true)
    setError(null)
    setResponse(null)

    const result = await generateFinancialInsights(quickQuestion)

    if (result.error) {
      setError(result.error)
    } else if (result.data) {
      setResponse(result.data)
    }

    setLoading(false)
  }

  return (
    <div className="space-y-6">
      {/* Quick Questions */}
      <div className="rounded-lg bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">Quick Questions</h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {[
            'Why was my profit lower this month?',
            'How much did I spend on marketing?',
            'Can I afford new equipment this month?',
            'What are my biggest expenses?',
          ].map((q) => (
            <button
              key={q}
              onClick={() => handleQuickQuestion(q)}
              disabled={loading}
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Question Form */}
      <div className="rounded-lg bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">Ask a Question</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              rows={3}
              placeholder="Ask anything about your finances... e.g., 'Why was my profit lower this month?'"
              className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
              disabled={loading}
            />
          </div>
          <button
            type="submit"
            disabled={loading || !question.trim()}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500 disabled:opacity-50"
          >
            {loading ? 'Analyzing...' : 'Ask'}
          </button>
        </form>
      </div>

      {/* Response */}
      {error && (
        <div className="rounded-lg bg-red-50 p-6 shadow-sm">
          <h3 className="mb-2 text-lg font-semibold text-red-900">Error</h3>
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {response && (
        <div className="rounded-lg bg-blue-50 p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-blue-900">AI Insight</h3>
          <div className="prose prose-sm max-w-none text-blue-800 whitespace-pre-wrap">
            {response}
          </div>
        </div>
      )}

      {/* Auto-generate insights */}
      {!response && !loading && (
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">General Insights</h3>
          <button
            onClick={() => handleQuickQuestion('')}
            disabled={loading}
            className="rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 disabled:opacity-50"
          >
            Generate Financial Insights
          </button>
        </div>
      )}
    </div>
  )
}
