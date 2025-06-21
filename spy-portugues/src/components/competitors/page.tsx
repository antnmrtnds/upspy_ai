import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { AppSidebar } from '@/components/app-sidebar'
import { SiteHeader } from '@/components/site-header'
import {
  SidebarProvider,
  SidebarInset,
} from '@/components/ui/sidebar'
import { CompetitorManagement } from '@/components/competitors'

export default async function Page() {
  const { userId } = await auth()
  if (!userId) {
    redirect('/sign-in')
  }
  return (
    <SidebarProvider
      style={{
        '--sidebar-width': 'calc(var(--spacing) * 72)',
        '--header-height': 'calc(var(--spacing) * 12)',
      } as React.CSSProperties}
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col p-4 md:p-6">
          <CompetitorManagement />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}