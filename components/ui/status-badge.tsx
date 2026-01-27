import React from 'react'
import { cn } from '@/lib/utils'

interface StatusBadgeProps {
  status: 'draft' | 'sent' | 'paid' | 'overdue'
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const statusConfig = {
    draft: {
      label: 'Draft',
      className: 'bg-muted text-muted-foreground border border-border',
    },
    sent: {
      label: 'Sent',
      className: 'bg-primary/10 text-primary border border-primary/30',
    },
    paid: {
      label: 'Paid',
      className: 'bg-success/10 text-success border border-success/30',
    },
    overdue: {
      label: 'Overdue',
      className: 'bg-destructive/10 text-destructive border border-destructive/30',
    },
  }

  const config = statusConfig[status]

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium transition-colors",
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  )
}
