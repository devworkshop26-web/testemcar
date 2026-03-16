import { useState, useMemo } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  DoorOpen,
  Settings,
  ChevronDown,
  ClipboardList,
  LifeBuoy,
  Menu,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import NotificationBell from "@/components/NotificationBell";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

import SupportSidebar from "./SupportSidebar";
import { useCurentuser } from "@/useQuery/authUseQuery";
import AvatarSupport from "@/components/support/AvatarSupport";
import { deconnectionAction } from "@/helper/utils";

export default function LayoutSupport() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useCurentuser();

  const pageTitle = useMemo(() => {
    if (location.pathname === "/support") return "Aperçu Général";
    if (location.pathname.startsWith("/support/reservations")) {
      return "Gestion des Réservations";
    }
    if (location.pathname.startsWith("/support/clients")) {
      return "Base Clients";
    }
    if (location.pathname.startsWith("/support/fleet")) {
      return "Flotte de Véhicules";
    }
    if (location.pathname.startsWith("/support/tickets")) {
      return "Tickets Support";
    }
    if (location.pathname.startsWith("/support/settings")) {
      return "Mon Profil";
    }
    return "Support";
  }, [location.pathname]);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <SupportSidebar onToggle={setSidebarOpen} />

      <div
        className={`
          flex-1 flex flex-col transition-all duration-300 min-w-0
          ${sidebarOpen ? "ml-64" : "ml-16"}
        `}
      >
        {/* HEADER */}
        <header
          className="
            sticky top-0 z-30 w-full
            border-b border-slate-200/60
            bg-white/80 backdrop-blur-md
            transition-all duration-300 pb-2 pt-2
          "
        >
          <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6">
            {/* LEFT */}
            <div className="flex items-center gap-4 min-w-0">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden rounded-xl hover:bg-slate-100 transition-colors"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                <Menu className="h-5 w-5 text-slate-600" />
              </Button>

              <div className="hidden md:flex flex-col min-w-0">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center rounded-md bg-blue-100 px-2 py-0.5 text-[10px] font-medium text-blue-700 uppercase tracking-wider">
                    Espace Support
                  </span>
                </div>

                <h1 className="text-sm font-bold text-slate-800 lg:text-base truncate">
                  {pageTitle}
                </h1>

                <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                  Bienvenue,{" "}
                  <span className="font-semibold text-slate-700">
                    {user?.first_name || "Support"}
                  </span>
                </p>
              </div>
            </div>

            {/* RIGHT */}
            <div className="flex items-center gap-3">
              {/* Quick Access */}
              <div className="hidden sm:flex items-center gap-2 pr-2 border-r border-slate-200">
                <Link to="/">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="
                      gap-2 text-slate-600 rounded-lg px-3
                      transition-all
                      hover:bg-slate-100/80 hover:text-slate-800 hover:shadow-sm
                      active:scale-[0.98]
                    "
                  >
                    <Home className="h-4 w-4" />
                    <span className="text-xs font-medium">Voir le site</span>
                  </Button>
                </Link>
              </div>

              {/* Notifications */}
              <NotificationBell />

              {/* USER DROPDOWN */}
              {user && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      className="
                        group flex items-center gap-2.5 pl-1 pr-2 py-1
                        rounded-xl border border-transparent
                        hover:border-slate-200 hover:bg-slate-50/50
                        transition-all duration-200 focus:outline-none
                      "
                    >
                      <div className="relative">
                        <AvatarSupport user={user} size={38} />
                        <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-emerald-500" />
                      </div>

                      <div className="hidden lg:flex flex-col items-start leading-none">
                        <span className="text-sm font-semibold text-slate-700 group-hover:text-primary transition-colors">
                          {user.first_name || "Support"}
                        </span>
                        <span className="text-[10px] text-slate-400 mt-1 font-medium italic">
                          Support
                        </span>
                      </div>

                      <ChevronDown className="h-4 w-4 text-slate-400 group-hover:text-slate-600 transition-colors hidden sm:block" />
                    </button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent
                    align="end"
                    sideOffset={8}
                    className="
                      w-64 rounded-2xl p-2
                      border border-slate-200/60
                      shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)]
                      animate-in fade-in zoom-in-95
                      bg-white
                    "
                  >
                    {/* Top Profile Card */}
                    <div className="px-3 py-3 mb-2 bg-slate-50/80 rounded-xl">
                      <p className="text-xs font-medium text-slate-500 uppercase tracking-tighter">
                        Compte connecté
                      </p>
                      <p className="text-sm font-bold text-slate-900 truncate">
                        {user.first_name} {user.last_name}
                      </p>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">
                        {user.email}
                      </p>
                    </div>

                    <div className="space-y-0.5">
                      {/* Réservations */}
                      <DropdownMenuItem asChild>
                        <Link
                          to="/support/reservations"
                          className="
                            flex items-center gap-3 rounded-lg cursor-pointer px-3 py-2.5
                            focus:bg-primary/5 focus:text-primary transition-colors
                          "
                        >
                          <div className="bg-slate-100 p-1.5 rounded-md">
                            <ClipboardList className="h-4 w-4 text-slate-600" />
                          </div>
                          <span className="font-medium text-sm text-slate-700">
                            Réservations
                          </span>
                        </Link>
                      </DropdownMenuItem>

                      {/* Tickets */}
                      <DropdownMenuItem asChild>
                        <Link
                          to="/support/tickets"
                          className="
                            flex items-center gap-3 rounded-lg cursor-pointer px-3 py-2.5
                            focus:bg-primary/5 focus:text-primary transition-colors
                          "
                        >
                          <div className="bg-slate-100 p-1.5 rounded-md">
                            <LifeBuoy className="h-4 w-4 text-slate-600" />
                          </div>
                          <span className="font-medium text-sm text-slate-700">
                            Tickets support
                          </span>
                        </Link>
                      </DropdownMenuItem>

                      {/* Profil */}
                      <DropdownMenuItem asChild>
                        <Link
                          to="/support/settings"
                          className="
                            flex items-center gap-3 rounded-lg cursor-pointer px-3 py-2.5
                            focus:bg-primary/5 focus:text-primary transition-colors
                          "
                        >
                          <div className="bg-slate-100 p-1.5 rounded-md">
                            <Settings className="h-4 w-4 text-slate-600" />
                          </div>
                          <span className="font-medium text-sm text-slate-700">
                            Mon profil
                          </span>
                        </Link>
                      </DropdownMenuItem>
                    </div>

                    <DropdownMenuSeparator className="my-2 bg-slate-100" />

                    {/* Logout */}
                    <DropdownMenuItem
                      onClick={deconnectionAction}
                      className="
                        flex items-center gap-3 rounded-lg px-3 py-2.5
                        text-red-600 font-semibold focus:bg-red-50 focus:text-red-700
                        transition-colors cursor-pointer
                      "
                    >
                      <DoorOpen className="h-4 w-4" />
                      <span>Déconnexion</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
        </header>

        {/* CONTENT */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6 min-w-0">
          <div className="max-w-full min-w-0">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}