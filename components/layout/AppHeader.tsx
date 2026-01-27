import React from 'react'

interface AppHeaderProps {
  title: string
  subtitle?: string
  children?: React.ReactNode
}

export function AppHeader({ title, subtitle, children }: AppHeaderProps) {
  return (
    <div className="bg-gradient-to-r from-background to-background border-b border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-foreground">{title}</h1>
            {subtitle && (
              <p className="mt-3 text-base text-muted-foreground">{subtitle}</p>
            )}
          </div>
          {children && <div className="flex items-center gap-3">{children}</div>}
        </div>
      </div>
    </div>
  )
}
