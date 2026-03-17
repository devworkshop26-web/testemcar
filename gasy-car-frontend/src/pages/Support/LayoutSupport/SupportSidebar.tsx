// src/components/support/SupportSidebar.tsx
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Star } from "lucide-react";
import {
  LayoutDashboard, CalendarCheck, Users, Car, Headset, Settings,
  ChevronLeft, ChevronRight, LogOut
} from "lucide-react";

export default function SupportSidebar({ onToggle }) {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();

  const toggleSidebar = () => {
    setIsOpen((prev) => {
      const newState = !prev;
      onToggle(newState);
      return newState;
    });
  };

  const handleLogout = () => {
    // 🔥 Même comportement que ton Header
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    window.location.href = "/login";
  };

  const menuItems = [
    { label: "Aperçu Général", icon: LayoutDashboard, path: "/support" },
    { label: "Gérer les Réservations", icon: CalendarCheck, path: "/support/reservations" },
    { label: "Base Clients", icon: Users, path: "/support/clients" },
    { label: "Flotte de Véhicules", icon: Car, path: "/support/fleet" },
    { label: "Tickets Support", icon: Headset, path: "/support/tickets" },
    { label: "Gestion des avis", icon: Star, path: "/support/reviews" },
    { label: "Mon Profil", icon: Settings, path: "/support/settings" },
  ];

  return (
    <aside
      className={`
        h-full bg-white border-r border-slate-200 shadow-sm
        transition-all duration-300 fixed left-0 top-0 z-50 flex flex-col
        ${isOpen ? "w-64" : "w-16"}
      `}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        {isOpen && (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center font-bold">
              GS
            </div>
            <h1 className="text-lg font-semibold">Support</h1>
          </div>
        )}

        <button onClick={toggleSidebar} className="p-2 rounded-lg hover:bg-slate-100 transition">
          {isOpen ? <ChevronLeft /> : <ChevronRight />}
        </button>
      </div>

      {/* Menu */}
      <nav className="px-2 mt-3 flex-1">
        {menuItems.map((item) => {
          const active = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`
                flex items-center gap-3 px-3 py-2 rounded-lg my-1
                transition-colors text-sm font-medium
                ${active ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-100"}
              `}
            >
              <item.icon className="w-5 h-5" />
              {isOpen && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* 🔥 Déconnexion */}
      <div className="p-4 border-t">
        <button
          onClick={handleLogout}
          className={`
            flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm font-medium
            text-red-600 hover:bg-red-50 transition
          `}
        >
          <LogOut className="w-5 h-5" />
          {isOpen && <span>Déconnexion</span>}
        </button>
      </div>
    </aside>
  );
}
