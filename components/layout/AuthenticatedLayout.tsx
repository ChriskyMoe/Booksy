import { getBusiness } from '@/lib/actions/business'
import Sidebar from './Sidebar'
import TopBar from './TopBar'

interface AuthenticatedLayoutProps {
  children: React.ReactNode
}

export default async function AuthenticatedLayout({ children }: AuthenticatedLayoutProps) {
  const businessResult = await getBusiness()
  const businessName = businessResult.data?.name

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background">
      <TopBar businessName={businessName} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar businessName={businessName} />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  )
}
