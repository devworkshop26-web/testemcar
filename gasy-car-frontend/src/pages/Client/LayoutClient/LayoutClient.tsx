import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import ClientSidebar from "./ClientSidebar";
import { HeaderClient } from "./ClientHeader";

export default function LayoutClient() {
  const location = useLocation();

  // 👉 Toujours fermé par défaut (même comportement que prestataire sur mobile)
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 1024);

  // 👉 Fermer automatiquement la sidebar quand on change de page EN MOBILE
  useEffect(() => {
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  }, [location.pathname]);

  // 👉 Gestion du resize (comme prestataire)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50">

      {/* SIDEBAR */}
      <ClientSidebar isOpen={isSidebarOpen} />

      {/* CONTENU */}
      <div
        className={`flex flex-col flex-1 transition-all duration-300 
          ${isSidebarOpen && window.innerWidth >= 1024 ? "ml-64" : "ml-0"}
        `}
      >
        <HeaderClient
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />

        <main className="p-6 flex-1 w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
