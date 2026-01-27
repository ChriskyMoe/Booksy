'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, Bell, User } from 'lucide-react'
import LogoutButton from '@/components/LogoutButton'
import { cn } from '@/lib/utils'

interface TopBarProps {
  businessName?: string
}

export default function TopBar({ businessName }: TopBarProps) {
  const [query, setQuery] = useState('')

  return (
    <header className="border-b border-border bg-background/80 backdrop-blur">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8 gap-4">
        <div className="relative w-full max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search transactions, categories, clients..."
            className="pl-9"
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            className={cn(
              'inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background text-muted-foreground hover:bg-muted transition-colors'
            )}
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4" />
          </button>

          <div className="hidden sm:flex items-center gap-2 rounded-full border border-border bg-muted/50 px-3 py-1.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10">
              <User className="h-4 w-4 text-primary" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-medium text-foreground">
                {businessName || 'Your business'}
              </span>
              <span className="text-[11px] text-muted-foreground">Owner</span>
            </div>
          </div>

          <div className="hidden sm:block">
            <LogoutButton variant="outline" className="w-auto px-3 py-1 h-9" />
          </div>

          <div className="sm:hidden">
            <LogoutButton variant="ghost" className="w-auto px-2 h-9" />
          </div>
        </div>
      </div>
    </header>
  )
}

