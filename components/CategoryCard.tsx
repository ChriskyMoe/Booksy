'use client'

import { useState } from 'react'
import { ArrowUpCircle, ArrowDownCircle, Eye, Edit, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface CategoryCardProps {
    id: string
    name: string
    type: 'income' | 'expense'
    onView: (id: string) => void
    onEdit: (id: string) => void
    onDelete: (id: string) => void
}

export default function CategoryCard({
    id,
    name,
    type,
    onView,
    onEdit,
    onDelete,
}: CategoryCardProps) {
    const [isHovered, setIsHovered] = useState(false)

    const isIncome = type === 'income'
    const Icon = isIncome ? ArrowUpCircle : ArrowDownCircle
    const iconColor = isIncome ? 'text-success' : 'text-destructive'
    const bgColor = isIncome ? 'bg-success/5' : 'bg-destructive/5'
    const decorativeColor = isIncome ? 'bg-success/10' : 'bg-destructive/10'

    return (
        <div
            className="relative group"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Card */}
            <div
                className={`
          relative overflow-hidden
          bg-card rounded-xl border border-border
          p-6 shadow-card
          transition-all duration-300 ease-out
          ${isHovered ? 'shadow-elevated -translate-y-1' : ''}
        `}
            >
                {/* Decorative shapes */}
                <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full opacity-50 blur-2xl pointer-events-none"
                    style={{ backgroundColor: isIncome ? 'hsl(var(--success))' : 'hsl(var(--destructive))', opacity: 0.08 }}
                />
                <div className="absolute -bottom-6 -left-6 w-20 h-20 rounded-full opacity-50 blur-xl pointer-events-none"
                    style={{ backgroundColor: isIncome ? 'hsl(var(--success))' : 'hsl(var(--destructive))', opacity: 0.05 }}
                />

                {/* Content */}
                <div className="relative z-10">
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold text-foreground mb-2">
                                {name}
                            </h3>
                            <span
                                className={`
                  inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full
                  text-xs font-medium
                  ${isIncome ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'}
                `}
                            >
                                {type.charAt(0).toUpperCase() + type.slice(1)}
                            </span>
                        </div>

                        {/* Icon */}
                        <div className={`
              flex items-center justify-center
              w-12 h-12 rounded-full ${bgColor}
            `}>
                            <Icon className={`w-6 h-6 ${iconColor}`} />
                        </div>
                    </div>

                    {/* Hover Actions */}
                    <div
                        className={`
              flex items-center gap-2 mt-4 pt-4 border-t border-border
              transition-all duration-300
              ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'}
            `}
                    >
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onView(id)}
                            className="flex-1 text-xs"
                        >
                            <Eye className="w-3.5 h-3.5 mr-1.5" />
                            View
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onEdit(id)}
                            className="flex-1 text-xs"
                        >
                            <Edit className="w-3.5 h-3.5 mr-1.5" />
                            Edit
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onDelete(id)}
                            className="flex-1 text-xs text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                            <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                            Delete
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
