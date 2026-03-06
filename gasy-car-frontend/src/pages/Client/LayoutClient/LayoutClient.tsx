import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import ClientSidebar from "./ClientSidebar";
import { HeaderClient } from "./ClientHeader";

export default function LayoutClient() {
  const location = useLocation();

  // ✅ Même logique que prestataire : ouvert par défaut
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Scroll top comme prestataire
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 font-poppins">
      {/* SIDEBAR (avec setIsOpen pour pouvoir minifier) */}
      <ClientSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      {/* CONTENU */}
      <div
        className={`
          flex min-h-screen flex-1 flex-col
          transition-all duration-300 ease-in-out
          ${isSidebarOpen ? "lg:ml-64" : "lg:ml-20"}
        `}
      >
        <HeaderClient
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8" role="main">
          <div className="mx-auto w-full max-w-7xl animate-in fade-in duration-500">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}