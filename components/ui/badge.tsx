import React from 'react'
import { cn } from '@/lib/utils'

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'destructive'
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-lg border px-3 py-1 text-xs font-medium transition-all focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2",
        {
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/90": variant === 'default',
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/90": variant === 'secondary',
          "border-border text-foreground hover:bg-muted": variant === 'outline',
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/90": variant === 'destructive',
        },
        className
      )}
      {...props}
    />
  )
}
