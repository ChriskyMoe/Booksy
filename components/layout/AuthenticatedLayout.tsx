import { getBusiness } from '@/lib/actions/business'
import type { Database } from '@/types/supabase'
import Sidebar from './Sidebar'
import TopBar from './TopBar'
import ChatWidget from '@/components/ChatWidget'

interface AuthenticatedLayoutProps {
  children: React.ReactNode
}

export default async function AuthenticatedLayout({ children }: AuthenticatedLayoutProps) {
  const businessResult = await getBusiness()
  const business = businessResult.data as Database['public']['Tables']['businesses']['Row'] | undefined
  const businessName = business?.name
  const avatarUrl = business?.avatar_url

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background">
      <TopBar businessName={businessName} avatarUrl={avatarUrl} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar businessName={businessName} />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
      {/* Global AI chat assistant, shown on all authenticated pages */}
      <ChatWidget />
    </div>
  )
}
