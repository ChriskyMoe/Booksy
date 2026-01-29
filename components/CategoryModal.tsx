'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { createCategory, updateCategory } from '@/lib/actions/categories'
import { createTransaction } from '@/lib/actions/transactions'
import { useRouter } from 'next/navigation'

interface CategoryModalProps {
    isOpen: boolean
    onClose: () => void
    editCategory?: {
        id: string
        name: string
        type: 'income' | 'expense'
    } | null
}

const CURRENCIES = ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF', 'CNY', 'INR', 'BRL']
const PAYMENT_METHODS = ['cash', 'card', 'transfer', 'other'] as const

export default function CategoryModal({ isOpen, onClose, editCategory }: CategoryModalProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [categoryName, setCategoryName] = useState('')
    const [categoryType, setCategoryType] = useState<'income' | 'expense'>('expense')
    const [includeTransaction, setIncludeTransaction] = useState(false)

    // Transaction fields
    const [amount, setAmount] = useState('')
    const [currency, setCurrency] = useState('USD')
    const [transactionDate, setTransactionDate] = useState(new Date().toISOString().split('T')[0])
    const [paymentMethod, setPaymentMethod] = useState<typeof PAYMENT_METHODS[number]>('cash')
    const [notes, setNotes] = useState('')

    useEffect(() => {
        if (isOpen) {
            if (editCategory) {
                setCategoryName(editCategory.name)
                setCategoryType(editCategory.type)
                setIncludeTransaction(false)
            } else {
                // Reset for new category
                setCategoryName('')
                setCategoryType('expense')
                setIncludeTransaction(false)
                setAmount('')
                setCurrency('USD')
                setTransactionDate(new Date().toISOString().split('T')[0])
                setPaymentMethod('cash')
                setNotes('')
            }
            setError(null)
        }
    }, [isOpen, editCategory])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setLoading(true)

        if (!categoryName.trim()) {
            setError('Please enter a category name')
            setLoading(false)
            return
        }

        try {
            let categoryId: string | undefined

            if (editCategory) {
                // Update existing category
                const result = await updateCategory(editCategory.id, categoryName.trim(), categoryType)
                if (result.error) {
                    setError(result.error)
                    setLoading(false)
                    return
                }
                categoryId = editCategory.id
            } else {
                // Create new category
                const result = await createCategory(categoryName.trim(), categoryType)
                if (result.error) {
                    setError(result.error)
                    setLoading(false)
                    return
                }
                categoryId = result.data?.id
            }

            // Create initial transaction if requested
            if (!editCategory && includeTransaction && categoryId && amount) {
                const txResult = await createTransaction({
                    category_id: categoryId,
                    amount: parseFloat(amount),
                    currency,
                    transaction_date: transactionDate,
                    payment_method: paymentMethod,
                    notes: notes || undefined,
                })

                if (txResult.error) {
                    setError(`Category created but transaction failed: ${txResult.error}`)
                    setLoading(false)
                    return
                }
            }

            setLoading(false)
            onClose()
            router.refresh()
        } catch (err) {
            setError('An unexpected error occurred')
            setLoading(false)
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-screen items-center justify-center p-4">
                <div
                    className="fixed inset-0 bg-background/80 backdrop-blur-sm transition-opacity"
                    onClick={onClose}
                />
                <div className="relative w-full max-w-md rounded-xl bg-card p-6 shadow-elevated border border-border">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-xl font-semibold text-foreground">
                                {editCategory ? 'Edit Category' : 'New Category'}
                            </h3>
                            <p className="text-sm text-muted-foreground mt-1">
                                {editCategory ? 'Update your category details' : 'Create a tracker for your finances'}
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {error && (
                        <div className="mb-4 rounded-md bg-destructive/10 p-3 border border-destructive/20">
                            <p className="text-sm text-destructive">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Category Name */}
                        <div className="space-y-2">
                            <Label htmlFor="categoryName">Category Name *</Label>
                            <Input
                                id="categoryName"
                                value={categoryName}
                                onChange={(e) => setCategoryName(e.target.value)}
                                placeholder="e.g., Office Supplies"
                                required
                            />
                        </div>

                        {/* Type Selector */}
                        <div className="space-y-2">
                            <Label>Type *</Label>
                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setCategoryType('income')}
                                    className={`
                    flex-1 py-2.5 px-4 rounded-lg font-medium text-sm
                    transition-all duration-200
                    ${categoryType === 'income'
                                            ? 'bg-success text-success-foreground shadow-sm'
                                            : 'bg-muted text-muted-foreground hover:bg-muted/80'
                                        }
                  `}
                                >
                                    Income
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setCategoryType('expense')}
                                    className={`
                    flex-1 py-2.5 px-4 rounded-lg font-medium text-sm
                    transition-all duration-200
                    ${categoryType === 'expense'
                                            ? 'bg-destructive text-destructive-foreground shadow-sm'
                                            : 'bg-muted text-muted-foreground hover:bg-muted/80'
                                        }
                  `}
                                >
                                    Expense
                                </button>
                            </div>
                        </div>

                        {/* Initial Transaction Section (only for new categories) */}
                        {!editCategory && (
                            <>
                                <div className="pt-4 border-t border-border">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={includeTransaction}
                                            onChange={(e) => setIncludeTransaction(e.target.checked)}
                                            className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                                        />
                                        <span className="text-sm font-medium text-foreground">
                                            Add initial transaction
                                        </span>
                                    </label>
                                </div>

                                {includeTransaction && (
                                    <div className="space-y-4 pl-6 border-l-2 border-primary/20">
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="space-y-2">
                                                <Label htmlFor="amount">Amount</Label>
                                                <Input
                                                    id="amount"
                                                    type="number"
                                                    step="0.01"
                                                    value={amount}
                                                    onChange={(e) => setAmount(e.target.value)}
                                                    placeholder="0.00"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="currency">Currency</Label>
                                                <select
                                                    id="currency"
                                                    value={currency}
                                                    onChange={(e) => setCurrency(e.target.value)}
                                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                                >
                                                    {CURRENCIES.map((curr) => (
                                                        <option key={curr} value={curr}>{curr}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="space-y-2">
                                                <Label htmlFor="date">Date</Label>
                                                <Input
                                                    id="date"
                                                    type="date"
                                                    value={transactionDate}
                                                    onChange={(e) => setTransactionDate(e.target.value)}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="paymentMethod">Payment</Label>
                                                <select
                                                    id="paymentMethod"
                                                    value={paymentMethod}
                                                    onChange={(e) => setPaymentMethod(e.target.value as typeof paymentMethod)}
                                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                                >
                                                    {PAYMENT_METHODS.map((method) => (
                                                        <option key={method} value={method}>
                                                            {method.charAt(0).toUpperCase() + method.slice(1)}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="notes">Notes</Label>
                                            <Textarea
                                                id="notes"
                                                value={notes}
                                                onChange={(e) => setNotes(e.target.value)}
                                                placeholder="Optional notes"
                                                rows={2}
                                            />
                                        </div>
                                    </div>
                                )}
                            </>
                        )}

                        {/* Actions */}
                        <div className="flex justify-end gap-3 pt-4">
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={onClose}
                                disabled={loading}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={loading}
                            >
                                {loading ? 'Saving...' : editCategory ? 'Update Category' : 'Create Category'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
