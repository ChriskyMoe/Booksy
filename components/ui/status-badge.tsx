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
      className: 'bg-muted text-muted-foreground',
    },
    sent: {
      label: 'Sent',
      className: 'bg-primary/10 text-primary',
    },
    paid: {
      label: 'Paid',
      className: 'bg-success/10 text-success',
    },
    overdue: {
      label: 'Overdue',
      className: 'bg-destructive/10 text-destructive',
    },
  }

  const config = statusConfig[status]

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  )
}
