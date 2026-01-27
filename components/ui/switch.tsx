'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface SwitchProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export function Switch({ className, ...props }: SwitchProps) {
  return (
    <input
      type="checkbox"
      role="switch"
      className={cn(
        "peer h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-input transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary",
        className
      )}
      {...props}
    />
  )
}
