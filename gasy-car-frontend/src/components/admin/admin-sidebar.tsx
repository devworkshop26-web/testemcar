// src/components/layout/AdminSidebar.tsx
import { NavLink, Link } from "react-router-dom";
import { useLocation } from "react-router";
import { Car } from "lucide-react";
import Logo from "@/components/Logo";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import {
  adminMainNav,
  adminUsersNav,
  adminVehicleSettingsNav,
  type AdminSidebarItem,
  adminActionNav,
  adminPlatformNav,
} from "@/data/adminSidebar";
import { useCurrentUserQuery } from "@/useQuery/useCurrentUserQuery";

export function AdminSidebar() {
  const location = useLocation();

  const { data: currentUser } = useCurrentUserQuery(); // to refresh user data on sidebar load
  const currentYear = new Date().getFullYear();


  const renderSection = (label: string, items: AdminSidebarItem[]) => (
    <SidebarGroup>
      <SidebarGroupLabel className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => {
            const isActive =
              item.url !== "#" && location.pathname.startsWith(item.url);

            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild isActive={isActive}>
                  <NavLink
                    to={item.url}
                    className="t group
    flex w-full items-center gap-2
    rounded-md px-2 py-1.5
    text-sm text-muted-foreground
    transition-colors duration-150
    hover:bg-slate-100 hover:text-primary
    dark:hover:bg-slate-800/70 dark:hover:text-primary"
                  >
                    <item.icon className="h-4 w-4" />
                    <span className="truncate ">{item.title}</span>
                    {item.badge && (
                      <span className=" ml-auto rounded-full bg-primary/10 px-2 text-xs font-medium
      text-primary">
                        {item.badge}
                      </span>
                    )}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );

  return (
    <Sidebar>
      {/* HEADER : Logo + Super Admin */}
      <SidebarHeader className="border-b border-border/60 px-4 py-3">
          <Link to="/admin" className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
            <Logo size={110} />
          </Link>
      </SidebarHeader>

      {/* CONTENU */}
      <SidebarContent className="space-y-2">
        {renderSection("Vue générale", adminMainNav)}
        {renderSection("Utilisateurs", adminUsersNav)}
        {renderSection("Véhicules", adminVehicleSettingsNav)}
        {renderSection("Actions", adminActionNav)}
        {renderSection("Plateforme", adminPlatformNav)}
      </SidebarContent>

      {/* FOOTER */}
      <SidebarFooter className="border-t border-border/60 px-4 py-3">
        <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
          <div className="flex flex-col">
            <span className="font-medium text-foreground">
            {currentUser?.first_name + " "+currentUser?.last_name || 'Admin'}
            </span>
            <span>Gasy&apos;Car © {currentYear}</span>
          </div>

          {/* futur avatar admin */}
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-semibold text-primary">
            SA
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
