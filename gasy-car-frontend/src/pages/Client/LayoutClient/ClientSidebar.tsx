import React from "react";
import { useCurentuser } from "@/useQuery/authUseQuery";
import { NavLink, Link } from "react-router-dom";
import { ClientSidebarItem, menuItemsClient } from "@/data/clienSideBar";
import { Car } from "lucide-react";
import AvatarClient from "@/components/client/AvatarClient";
import Logo from "@/components/Logo";

export default function ClientSidebar({ isOpen }: { isOpen: boolean }) {
  const { user } = useCurentuser();

  const renderSection = (items: ClientSidebarItem[]) => (
    <nav className="px-4 space-y-2 mt-4 overflow-y-auto scrollbar-none">
      {items.map((item) => (
        <NavLink
          key={item.label}
          to={item.url}
          end
          className={({ isActive }) =>
            `w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition duration-200 whitespace-nowrap
            ${isActive
              ? "bg-blue-50 text-blue-600 shadow-sm ring-1 ring-blue-100"
              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`
          }
        >
          <item.icon className="w-5 h-5 min-w-[1.25rem]" />

          <span className="truncate">{item.label}</span>

          {item.badge && (
            <span className="ml-auto rounded-full bg-primary/10 px-2 text-xs font-medium text-primary">
              {item.badge}
            </span>
          )}
        </NavLink>
      ))}
    </nav>
  );

  return (
    <aside
      className={`fixed h-full z-20 bg-white border-r border-gray-200 transition-all duration-300 ease-in-out 
        ${isOpen ? "translate-x-0 w-64" : "-translate-x-full w-64"}`}
    >
      <div className="flex flex-col h-full w-64">

        {/* HEADER */}
        <Link to="/client" className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
          <Logo size={110} className="ml-3" />
        </Link>

        {/* MENU */}
        <div className="flex-1">{renderSection(menuItemsClient)}</div>

        {/* FOOTER HARMONISÉ */}
        <div className="p-4 border-t border-gray-100">

          <div className={`flex items-center gap-3 ${!isOpen && "lg:justify-center"}`}>
            <AvatarClient user={user} size={40} />

            {/* Texte caché en mode minifié */}
            <div
              className={`
        flex flex-col leading-tight transition-all duration-300
        ${isOpen ? "opacity-100" : "opacity-0 w-0 overflow-hidden lg:hidden"}
      `}
            >
              <span className="font-medium text-gray-900 text-sm truncate">
                {user?.first_name} {user?.last_name}
              </span>
              <span className="text-xs text-gray-500 truncate">
                {user?.email}
              </span>
            </div>
          </div>

        </div>


      </div>
    </aside>
  );
}
