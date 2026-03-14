import { HeaderPrestataire } from "./LayoutPrestataire/HeaderPrestataire";
import Sidebar from "./LayoutPrestataire/SideBar";
import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";

export const IndexPrestataire = () => {
  // On initialise à true (ouvert) par défaut
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 font-poppins">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <div
        className={`
          flex min-h-screen flex-1 flex-col 
          transition-all duration-300 ease-in-out
          ${isSidebarOpen ? "lg:ml-64" : "lg:ml-20"}
        `}
      >
        {/* On passe aussi l'état au header si besoin d'ajuster des choses dedans */}
        <HeaderPrestataire isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8" role="main">
          <div className="mx-auto w-full max-w-7xl animate-in fade-in duration-500">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default IndexPrestataire;