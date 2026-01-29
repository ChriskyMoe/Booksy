'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Search, Bell, User } from 'lucide-react'
import { ThemeToggle } from '@/components/ThemeToggle'
import LogoutButton from '@/components/LogoutButton'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { DropdownMenu, DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { useRouter } from 'next/navigation'

interface TopBarProps {
  businessName?: string
  avatarUrl?: string | null
}

export default function TopBar({ businessName, avatarUrl }: TopBarProps) {
  const [query, setQuery] = useState('')
  const [avatarLoadFailed, setAvatarLoadFailed] = useState(false)
  const router = useRouter()

  const showAvatarImage = Boolean(avatarUrl) && !avatarLoadFailed

  return (
    <header className="border-b border-border bg-background/80 backdrop-blur text-white bg-gradient-to-br from-blue-500/20 via-indigo-700/20 to-purple-900/20 overflow-x-hidden">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8 gap-4">
        <Link href="/dashboard" className="flex items-center gap-2">
          <span className="text-xl font-bold text-foreground">Booksy</span>
        </Link>
        <div className="right-49 relative w-full max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search transactions, categories, clients..."
            className="pl-9"
          />
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <button
            type="button"
            className={cn(
              'inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background text-muted-foreground hover:bg-muted transition-colors'
            )}
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4" />
          </button>

          {/* Profile Dropdown */}
          <DropdownMenu
            trigger={
              <div className="hidden sm:flex items-center gap-2 rounded-full border border-border bg-muted/50 px-3 py-1.5 cursor-pointer hover:bg-accent">
                <div className="relative flex h-7 w-7 items-center justify-center overflow-hidden rounded-full bg-primary/10">
                  {showAvatarImage ? (
                    // Use plain img to avoid Next/Image remote config issues.
                    <img
                      src={avatarUrl!}
                      alt="Business avatar"
                      className="h-full w-full object-cover"
                      onError={() => setAvatarLoadFailed(true)}
                    />
                  ) : (
                    <User className="h-4 w-4 text-primary" />
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-medium text-foreground">
                    {businessName || 'Your business'}
                  </span>
                </div>
              </div>
            }
          >
            <DropdownMenuItem onClick={() => router.push('/profile')}>
              View Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push('/analytics')}>
              Analytics
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push('/help')}>
              Help Center
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push('/account-settings')}>
              Account Settings
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push('/upgrade')}>
              Upgrade Plan
            </DropdownMenuItem>
            <DropdownMenuItem>
              <LogoutButton variant="ghost" className="w-full justify-start p-0 h-auto" />
            </DropdownMenuItem>
          </DropdownMenu>

          <div className="sm:hidden">
            <LogoutButton variant="ghost" className="w-auto px-2 h-9" />
          </div>
        </div>
      </div>
    </header>
  )
}

