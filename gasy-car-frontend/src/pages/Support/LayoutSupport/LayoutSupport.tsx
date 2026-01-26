// src/pages/Support/LayoutSupport.tsx
import { useState, useMemo } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { Home, DoorOpen, Settings, ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

import SupportSidebar from "./SupportSidebar";
import { useCurentuser } from "@/useQuery/authUseQuery";
import AvatarPrestataire from "@/components/Prestataire/AvatarPrestataire";
import { deconnectionAction } from "@/helper/utils";

export default function LayoutSupport() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useCurentuser();

  const pageTitle = useMemo(() => {
    if (location.pathname === "/support") return "Aperçu Général";
    if (location.pathname.startsWith("/support/reservations")) return "Gestion des Réservations";
    if (location.pathname.startsWith("/support/clients")) return "Base Clients";
    if (location.pathname.startsWith("/support/fleet")) return "Flotte de Véhicules";
    if (location.pathname.startsWith("/support/tickets")) return "Tickets Support";
    if (location.pathname.startsWith("/support/settings")) return "Mon Profil";
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
        <header className="flex items-center justify-between px-4 md:px-6 py-4 bg-white border-b shadow-sm">
          <div className="min-w-0">
            <h1 className="text-xl md:text-2xl font-semibold text-slate-900 truncate">
              {pageTitle}
            </h1>
            <p className="text-xs text-slate-500 hidden md:block">
              Espace de gestion du support client.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="outline" size="icon" asChild className="rounded-xl border-slate-200">
              <Link to="/">
                <Home className="w-5 h-5" />
              </Link>
            </Button>

            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 px-2 py-1 rounded-xl hover:bg-slate-100 transition">
                    <AvatarPrestataire user={user} size={40} />
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align="end"
                  className="w-56 rounded-xl p-2 bg-white"
                >
                  <div className="px-3 py-2">
                    <p className="text-sm font-semibold">
                      {user.first_name} {user.last_name}
                    </p>
                    <p className="text-xs text-slate-500 truncate">
                      {user.email}
                    </p>
                    <p className="text-[10px] mt-1 italic text-blue-600">
                      Support
                    </p>
                  </div>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    onClick={() => navigate("/support/settings")}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer"
                  >
                    <Settings className="w-4 h-4" />
                    <span className="text-sm font-medium">Paramètres</span>
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={deconnectionAction}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer text-red-600 font-semibold"
                  >
                    <DoorOpen className="w-4 h-4" />
                    <span>Déconnexion</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
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
