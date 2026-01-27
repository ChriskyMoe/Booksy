'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'

interface LogoutButtonProps {
  variant?: 'default' | 'ghost' | 'outline'
  className?: string
}

export default function LogoutButton({ variant = 'ghost', className }: LogoutButtonProps) {
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <Button
      onClick={handleLogout}
      variant={variant}
      className={cn("w-full justify-start gap-2", className)}
    >
      <LogOut className="h-4 w-4" />
      Sign Out
    </Button>
  )
}
