'use client'

import { useEffect, useState } from 'react'
import { X, Calendar, CreditCard, FileText } from 'lucide-react'
import { getCategoryWithTransactions } from '@/lib/actions/categories'
import { Badge } from '@/components/ui/badge'

interface CategoryDetailPanelProps {
    isOpen: boolean
    categoryId: string | null
    onClose: () => void
}

interface Transaction {
    id: string
    amount: number
    currency: string
    base_amount: number
    transaction_date: string
    payment_method: string
    client_vendor?: string
    notes?: string
}

interface CategoryData {
    category: {
        id: string
        name: string
        type: 'income' | 'expense'
    }
    transactions: Transaction[]
}

export default function CategoryDetailPanel({
    isOpen,
    categoryId,
    onClose,
}: CategoryDetailPanelProps) {
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState<CategoryData | null>(null)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (isOpen && categoryId) {
            loadCategoryData()
        }
    }, [isOpen, categoryId])

    const loadCategoryData = async () => {
        if (!categoryId) return

        setLoading(true)
        setError(null)

        const result = await getCategoryWithTransactions(categoryId)

        if (result.error) {
            setError(result.error)
        } else if (result.data) {
            setData(result.data as CategoryData)
        }

        setLoading(false)
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        })
    }

    const formatCurrency = (amount: number, currency: string) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency,
        }).format(amount)
    }

    if (!isOpen) return null

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-background/60 backdrop-blur-sm z-40 transition-opacity"
                onClick={onClose}
            />

            {/* Panel */}
            <div
                className={`
          fixed top-0 right-0 h-full w-full max-w-md
          bg-card border-l border-border shadow-elevated
          z-50 overflow-y-auto
          transition-transform duration-300 ease-out
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
            >
                {/* Header */}
                <div className="sticky top-0 bg-card border-b border-border p-6 z-10">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            {loading ? (
                                <div className="h-7 w-48 bg-muted animate-pulse rounded" />
                            ) : data ? (
                                <>
                                    <h2 className="text-xl font-semibold text-foreground">
                                        {data.category.name}
                                    </h2>
                                    <Badge
                                        variant={data.category.type === 'income' ? 'default' : 'secondary'}
                                        className="mt-2"
                                    >
                                        {data.category.type.charAt(0).toUpperCase() + data.category.type.slice(1)}
                                    </Badge>
                                </>
                            ) : null}
                        </div>
                        <button
                            onClick={onClose}
                            className="text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6">
                    {loading && (
                        <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="h-20 bg-muted animate-pulse rounded-lg" />
                            ))}
                        </div>
                    )}

                    {error && (
                        <div className="rounded-lg bg-destructive/10 p-4 border border-destructive/20">
                            <p className="text-sm text-destructive">{error}</p>
                        </div>
                    )}

                    {!loading && !error && data && (
                        <>
                            <div className="mb-6">
                                <h3 className="text-sm font-medium text-muted-foreground mb-4">
                                    Transaction History
                                    <span className="ml-2 text-xs">
                                        ({data.transactions.length} {data.transactions.length === 1 ? 'transaction' : 'transactions'})
                                    </span>
                                </h3>

                                {data.transactions.length === 0 ? (
                                    <div className="text-center py-12">
                                        <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                                        <p className="text-sm text-muted-foreground">
                                            No transactions yet
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            Transactions in this category will appear here
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {data.transactions.map((transaction) => (
                                            <div
                                                key={transaction.id}
                                                className="bg-background rounded-lg border border-border p-4 hover:border-primary/50 transition-colors"
                                            >
                                                <div className="flex items-start justify-between mb-2">
                                                    <div className="flex-1">
                                                        <p className="font-semibold text-foreground">
                                                            {formatCurrency(transaction.amount, transaction.currency)}
                                                        </p>
                                                        {transaction.client_vendor && (
                                                            <p className="text-sm text-muted-foreground mt-0.5">
                                                                {transaction.client_vendor}
                                                            </p>
                                                        )}
                                                    </div>
                                                    <Badge
                                                        variant="outline"
                                                        className="text-xs"
                                                    >
                                                        <CreditCard className="w-3 h-3 mr-1" />
                                                        {transaction.payment_method}
                                                    </Badge>
                                                </div>

                                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                    <Calendar className="w-3.5 h-3.5" />
                                                    {formatDate(transaction.transaction_date)}
                                                </div>

                                                {transaction.notes && (
                                                    <p className="text-sm text-muted-foreground mt-2 pt-2 border-t border-border">
                                                        {transaction.notes}
                                                    </p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    )
}
