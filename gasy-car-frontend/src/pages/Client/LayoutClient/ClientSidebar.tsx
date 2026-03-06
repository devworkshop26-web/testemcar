import React from "react";
import { useCurentuser } from "@/useQuery/authUseQuery";
import { Link, useLocation } from "react-router-dom";
import { ClientSidebarItem, menuItemsClient } from "@/data/clienSideBar";
import AvatarClient from "@/components/client/AvatarClient";
import Logo from "@/components/Logo";
import { ChevronLeft, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ClientSidebar({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}) {
  const { user } = useCurentuser();
  const location = useLocation();

  const renderSection = (items: ClientSidebarItem[]) => (
    <nav className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-4 space-y-1 custom-scrollbar">
      {items.map((item) => {
        // ✅ Active robust (comme prestataire)
        // - si item.url === "/client" => actif uniquement sur "/client"
        // - sinon => actif si la route commence par item.url
        const isActive =
          item.url === "/client"
            ? location.pathname === "/client"
            : location.pathname.startsWith(item.url);

        return (
          <Link
            key={item.label}
            to={item.url}
            className={`
              relative group flex items-center rounded-xl px-3 py-2.5
              transition-all duration-200
              ${isActive ? "bg-primary/5 text-primary" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"}
              ${!isOpen ? "justify-center" : "gap-3"}
            `}
          >
            {/* Indicateur actif vertical */}
            {isActive && <div className="absolute left-0 w-1 h-5 bg-primary rounded-r-full" />}

            <item.icon
              className={`
                shrink-0 transition-transform duration-200
                ${isActive ? "text-primary" : "text-slate-400 group-hover:scale-110 group-hover:text-slate-600"}
                ${!isOpen ? "h-6 w-6" : "h-5 w-5"}
              `}
            />

            <span
              className={`
                text-sm font-medium whitespace-nowrap transition-all duration-300
                ${!isOpen ? "w-0 opacity-0 invisible" : "w-auto opacity-100 visible"}
              `}
            >
              {item.label}
            </span>

            {item.badge && (
              <span
                className={`
                  ml-auto rounded-full px-2 py-0.5 text-[11px] font-medium
                  bg-primary/10 text-primary
                  ${!isOpen ? "hidden" : ""}
                `}
              >
                {item.badge}
              </span>
            )}

            {/* Tooltip moderne en mode réduit */}
            {!isOpen && (
              <div
                className="
                  fixed left-[70px] ml-2 px-3 py-1.5
                  bg-slate-900 text-white text-[11px] font-medium
                  rounded-lg opacity-0 group-hover:opacity-100
                  transition-all duration-200 pointer-events-none
                  shadow-xl translate-x-[-10px] group-hover:translate-x-0
                  z-[100]
                "
              >
                {item.label}
              </div>
            )}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* Overlay mobile */}
      <div
        className={`fixed inset-0 z-40 bg-slate-900/20 backdrop-blur-sm transition-opacity lg:hidden ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
      />

      <aside
        className={`
          fixed inset-y-0 left-0 z-50 h-screen
          bg-white border-r border-slate-200/60
          transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
          flex flex-col shadow-sm
          ${isOpen ? "translate-x-0 w-64" : "-translate-x-full w-64 lg:translate-x-0 lg:w-[78px]"}
        `}
      >
        {/* Toggle desktop */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`
            absolute -right-3 top-8 hidden lg:flex
            h-6 w-6 items-center justify-center
            rounded-full bg-white border border-slate-200
            shadow-sm text-slate-400
            hover:text-primary hover:border-primary/50
            transition-all duration-300 z-50
            ${!isOpen && "rotate-180"}
          `}
        >
          <ChevronLeft size={14} />
        </button>

        {/* Header */}
        <div className="flex items-center h-20 px-5 shrink-0">
          <Link to="/client" className="flex items-center gap-3 overflow-hidden">
            <div className="shrink-0 scale-90">
              <Logo size={isOpen ? 120 : 40} />
            </div>
          </Link>

          {/* Close mobile */}
          <Button
            variant="ghost"
            size="icon"
            className="ml-auto lg:hidden text-slate-400 hover:bg-slate-50"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Menu */}
        {renderSection(menuItemsClient)}

        {/* Footer premium */}
        <div className="p-4 mt-auto">
          <div
            className={`
              relative overflow-hidden rounded-2xl border border-slate-200/70
              bg-gradient-to-br from-white via-slate-50 to-slate-100/60
              shadow-[0_10px_30px_-20px_rgba(2,6,23,0.35)]
              ${!isOpen ? "p-2" : "p-3"}
            `}
          >
            <div className="pointer-events-none absolute -top-10 -right-10 h-24 w-24 rounded-full bg-primary/10 blur-2xl" />
            <div className="pointer-events-none absolute -bottom-10 -left-10 h-24 w-24 rounded-full bg-sky-500/10 blur-2xl" />

            <div className={`flex items-center ${!isOpen ? "justify-center" : "gap-3"}`}>
              <div className="relative shrink-0">
                <div className="absolute -inset-[2px] rounded-xl bg-gradient-to-br from-primary/30 via-sky-400/20 to-transparent" />
                <div className="relative rounded-xl bg-white p-0.5 shadow-sm">
                  <div className="rounded-[10px] overflow-hidden">
                    <AvatarClient user={user} size={36} />
                  </div>
                </div>
                <span className="absolute -right-0.5 -bottom-0.5 h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-white" />
              </div>

              {isOpen && (
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="truncate text-sm font-semibold text-slate-900">
                      {user?.first_name} {user?.last_name}
                    </span>
                    <span className="shrink-0 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                      Client
                    </span>
                  </div>
                  <div className="mt-0.5 truncate text-xs text-slate-500">{user?.email}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}