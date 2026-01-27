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
  LogOut,
} from 'lucide-react'
import LogoutButton from '@/components/LogoutButton'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Transactions', href: '/transactions', icon: Receipt },
  { name: 'Ledger', href: '/ledger', icon: BookOpen },
  { name: 'Currency Converter', href: '/currency-converter', icon: DollarSign },
  { name: 'AI Assistant', href: '/ai-assistant', icon: Sparkles },
]

interface SidebarProps {
  businessName?: string
}

export default function Sidebar({ businessName }: SidebarProps) {
  const pathname = usePathname()

  return (
    <div className="flex h-full w-64 flex-col border-r border-sidebar-border bg-sidebar">
      {/* Logo */}
      <div className="flex h-16 items-center border-b border-sidebar-border px-6">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <span className="text-lg">📘</span>
          </div>
          <span className="text-xl font-bold text-sidebar-foreground">Booksy</span>
        </Link>
      </div>

      {/* Business Name */}
      {businessName && (
        <div className="border-b border-sidebar-border px-6 py-4">
          <p className="text-sm font-medium text-sidebar-foreground truncate">
            {businessName}
          </p>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          const Icon = item.icon

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              <Icon className={cn(
                "h-5 w-5",
                isActive ? "text-sidebar-accent-foreground" : "text-sidebar-foreground"
              )} />
              {item.name}
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="border-t border-sidebar-border p-4">
        <LogoutButton />
      </div>
    </div>
  )
}
