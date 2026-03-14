import { AdminSidebar } from '@/components/admin/admin-sidebar'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { Outlet } from 'react-router-dom'

export default function LayoutAdmin() {
  return (
     <SidebarProvider>
      <AdminSidebar />
    
      <main className="flex-1 overflow-auto bg-muted/20">
        <SidebarTrigger />
        <div className="mx-auto flex h-full max-w-6xl flex-col px-4 py-6 lg:px-6">
          <Outlet />
        </div>
      </main>
    </SidebarProvider>
  )
}


