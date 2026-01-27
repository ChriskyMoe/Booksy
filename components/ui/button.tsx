import React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cn } from '@/lib/utils'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'ghost' | 'link' | 'destructive'
  size?: 'sm' | 'default' | 'lg' | 'icon'
  asChild?: boolean
}

export function Button({
  children,
  variant = 'default',
  size = 'default',
  className = '',
  asChild = false,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : 'button'
  return (
    <Comp
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-60 hover:shadow-md",
        {
          "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg": variant === 'default',
          "bg-secondary text-secondary-foreground hover:bg-secondary/80": variant === 'secondary',
          "border border-border bg-background hover:bg-muted hover:text-foreground hover:border-primary/50": variant === 'outline',
          "hover:bg-muted hover:text-foreground": variant === 'ghost',
          "text-primary underline-offset-4 hover:underline": variant === 'link',
          "bg-destructive text-destructive-foreground hover:bg-destructive/90": variant === 'destructive',
        },
        {
          "h-9 rounded-lg px-3 text-xs": size === 'sm',
          "h-10 px-4 py-2": size === 'default',
          "h-11 rounded-lg px-8": size === 'lg',
          "h-10 w-10": size === 'icon',
        },
        className
      )}
      {...props}
    >
      {children}
    </Comp>
  )
}
