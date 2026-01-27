import { getBusiness } from '@/lib/actions/business'
import Sidebar from './Sidebar'

interface AuthenticatedLayoutProps {
  children: React.ReactNode
}

export default async function AuthenticatedLayout({ children }: AuthenticatedLayoutProps) {
  const businessResult = await getBusiness()
  const businessName = businessResult.data?.name

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar businessName={businessName} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  )
}
