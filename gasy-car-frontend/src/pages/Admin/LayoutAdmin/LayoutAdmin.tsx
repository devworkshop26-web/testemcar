import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Outlet } from "react-router-dom";
import AdminHeader from "@/pages/Admin/LayoutAdmin/AdminHeader";

export default function LayoutAdmin() {
  return (
    <SidebarProvider>
      <AdminSidebar />

      <main className="flex-1 overflow-auto bg-muted/20">
        <div className="mx-auto flex h-full max-w-6xl flex-col px-4 py-4 lg:px-6">
          <AdminHeader />
          <Outlet />
        </div>
      </main>
    </SidebarProvider>
  );
}