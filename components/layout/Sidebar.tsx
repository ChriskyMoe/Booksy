'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Receipt,
  BookOpen,
  DollarSign,
  Sparkles,
  Settings,
  User,
  LogOut,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Transactions', href: '/transactions', icon: Receipt },
  { name: 'Ledger', href: '/ledger', icon: BookOpen },
  { name: 'Currency Converter', href: '/currency-converter', icon: DollarSign },
  { name: 'AI Assistant', href: '/ai-assistant', icon: Sparkles },
  { name: 'Settings', href: '/settings', icon: Settings },
]

interface SidebarProps {
  businessName?: string
}

export default function Sidebar({ businessName }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <div className="flex h-full w-64 flex-col border-r border-sidebar-border bg-sidebar transition-all duration-300 ease-in-out">
      {/* Logo */}
      <div className="flex h-16 items-center px-6 border-b border-sidebar-border/50">
        <Link href="/dashboard" className="flex items-center gap-2 group">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold shadow-md transition-transform group-hover:scale-105">
            B
          </div>
          <span className="text-xl font-bold text-sidebar-foreground tracking-tight">Booksy</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2 px-4 py-6">
        {businessName && (
          <div className="px-2 mb-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              {businessName}
            </p>
          </div>
        )}

        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          const Icon = item.icon

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm translate-x-1"
                  : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground hover:translate-x-1"
              )}
            >
              <Icon className={cn(
                "h-5 w-5 transition-colors",
                isActive ? "text-primary" : "text-muted-foreground group-hover:text-sidebar-foreground"
              )} />
              {item.name}
            </Link>
          )
        })}
      </nav>

      {/* User Profile Dropdown */}
      <div className="border-t border-sidebar-border p-4">
        <DropdownMenu>
          <DropdownMenuTrigger className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium hover:bg-sidebar-accent transition-colors outline-none cursor-pointer">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 border border-border">
              <User className="h-4 w-4 text-primary" />
            </div>
            <div className="flex flex-col items-start flex-1 overflow-hidden">
              <span className="text-xs font-medium text-sidebar-foreground truncate w-full text-left">
                My Account
              </span>
              <span className="text-[10px] text-muted-foreground truncate w-full text-left">
                Manage Profile
              </span>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" side="top" className="w-56">
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
      </div>
    </div>
  )
}
