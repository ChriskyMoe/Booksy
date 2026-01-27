'use client'

import { useState } from 'react'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, Bell, User, Settings, LogOut } from 'lucide-react'
import LogoutButton from '@/components/LogoutButton'
import { cn } from '@/lib/utils'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface TopBarProps {
  businessName?: string
}

export default function TopBar({ businessName }: TopBarProps) {
  const [query, setQuery] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

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

          <DropdownMenu>
            <DropdownMenuTrigger className="hidden sm:flex items-center gap-2 rounded-full border border-border bg-muted/50 px-3 py-1.5 outline-none hover:bg-muted transition-colors">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10">
                <User className="h-4 w-4 text-primary" />
              </div>
              <div className="flex flex-col items-start">
                <span className="text-xs font-medium text-foreground">
                  {businessName || 'Your business'}
                </span>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push('/settings')}>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push('/settings')}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sign out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="sm:hidden">
            <LogoutButton variant="ghost" className="w-auto px-2 h-9" />
          </div>
        </div>
      </div>
    </header>
  )
}

