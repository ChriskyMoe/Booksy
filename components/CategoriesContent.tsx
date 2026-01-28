'use client'

import { useState, useEffect } from 'react'
import { Search, Plus, Tag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import CategoryCard from '@/components/CategoryCard'
import CategoryModal from '@/components/CategoryModal'
import CategoryDetailPanel from '@/components/CategoryDetailPanel'
import { getCategories, deleteCategory } from '@/lib/actions/categories'
import { useRouter } from 'next/navigation'

type FilterType = 'all' | 'income' | 'expense'

interface Category {
    id: string
    name: string
    type: 'income' | 'expense'
    is_default: boolean
}

export default function CategoriesContent() {
    const router = useRouter()
    const [categories, setCategories] = useState<Category[]>([])
    const [filteredCategories, setFilteredCategories] = useState<Category[]>([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState<FilterType>('all')
    const [searchQuery, setSearchQuery] = useState('')

    // Modal states
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingCategory, setEditingCategory] = useState<{ id: string; name: string; type: 'income' | 'expense' } | null>(null)

    // Detail panel state
    const [detailPanelOpen, setDetailPanelOpen] = useState(false)
    const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null)

    useEffect(() => {
        loadCategories()
    }, [])

    useEffect(() => {
        applyFilters()
    }, [categories, filter, searchQuery])

    const loadCategories = async () => {
        setLoading(true)
        const result = await getCategories()
        if (result.data) {
            setCategories(result.data as Category[])
        }
        setLoading(false)
    }

    const applyFilters = () => {
        let filtered = categories

        // Apply type filter
        if (filter !== 'all') {
            filtered = filtered.filter((cat) => cat.type === filter)
        }

        // Apply search filter
        if (searchQuery.trim()) {
            filtered = filtered.filter((cat) =>
                cat.name.toLowerCase().includes(searchQuery.toLowerCase())
            )
        }

        setFilteredCategories(filtered)
    }

    const handleView = (id: string) => {
        setSelectedCategoryId(id)
        setDetailPanelOpen(true)
    }

    const handleEdit = (id: string) => {
        const category = categories.find((c) => c.id === id)
        if (category) {
            setEditingCategory({
                id: category.id,
                name: category.name,
                type: category.type,
            })
            setIsModalOpen(true)
        }
    }

    const handleDelete = async (id: string) => {
        const category = categories.find((c) => c.id === id)
        if (!category) return

        const confirmed = window.confirm(
            `Are you sure you want to delete "${category.name}"? This action cannot be undone.`
        )

        if (confirmed) {
            const result = await deleteCategory(id)
            if (result.error) {
                alert(`Error: ${result.error}`)
            } else {
                loadCategories()
            }
        }
    }

    const handleModalClose = () => {
        setIsModalOpen(false)
        setEditingCategory(null)
        loadCategories()
    }

    const handleNewCategory = () => {
        setEditingCategory(null)
        setIsModalOpen(true)
    }

    return (
        <div className="max-w-7xl mx-auto">
            {/* Top Controls */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                {/* Filter Tabs */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setFilter('all')}
                        className={`
              px-4 py-2 rounded-lg font-medium text-sm transition-all
              ${filter === 'all'
                                ? 'bg-primary text-primary-foreground shadow-sm'
                                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                            }
            `}
                    >
                        All
                    </button>
                    <button
                        onClick={() => setFilter('income')}
                        className={`
              px-4 py-2 rounded-lg font-medium text-sm transition-all
              ${filter === 'income'
                                ? 'bg-primary text-primary-foreground shadow-sm'
                                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                            }
            `}
                    >
                        Income
                    </button>
                    <button
                        onClick={() => setFilter('expense')}
                        className={`
              px-4 py-2 rounded-lg font-medium text-sm transition-all
              ${filter === 'expense'
                                ? 'bg-primary text-primary-foreground shadow-sm'
                                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                            }
            `}
                    >
                        Expense
                    </button>
                </div>

                {/* Search and New Button */}
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className="relative flex-1 sm:flex-initial sm:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search categories…"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                    <Button onClick={handleNewCategory}>
                        <Plus className="h-4 w-4 mr-2" />
                        New Category
                    </Button>
                </div>
            </div>

            {/* Categories Grid */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-48 bg-muted animate-pulse rounded-xl" />
                    ))}
                </div>
            ) : filteredCategories.length === 0 ? (
                <div className="text-center py-16">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                        <Tag className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                        {searchQuery ? 'No categories found' : 'No categories yet'}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-6">
                        {searchQuery
                            ? 'Try adjusting your search or filters'
                            : 'Create your first category to start organizing your finances'}
                    </p>
                    {!searchQuery && (
                        <Button onClick={handleNewCategory}>
                            <Plus className="h-4 w-4 mr-2" />
                            Create Category
                        </Button>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredCategories.map((category) => (
                        <CategoryCard
                            key={category.id}
                            id={category.id}
                            name={category.name}
                            type={category.type}
                            onView={handleView}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
            )}

            {/* Modals and Panels */}
            <CategoryModal
                isOpen={isModalOpen}
                onClose={handleModalClose}
                editCategory={editingCategory}
            />

            <CategoryDetailPanel
                isOpen={detailPanelOpen}
                categoryId={selectedCategoryId}
                onClose={() => setDetailPanelOpen(false)}
            />
        </div>
    )
}
