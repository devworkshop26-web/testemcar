import React from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { PrestataireRoutes } from "./PrestataireRouter";
import { AdminRoutes } from "./AdminRouter";
import { ClientRoutes } from "./ClientRouter";
import { ChauffeurRoutes } from "./ChauffeurRouter";
import { MecanicienRoutes } from "./MecanicienRouter";
import { SupportRoutes } from "./SupportRouter";
import { AllRoutes } from "./AllRouter";
import { SessionManager } from "@/components/SessionManager";
import NotFound from "@/pages/NotFound";

export default function Router() {
  const ScrollToTop = () => {
    const { pathname } = useLocation();
    React.useEffect(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, [pathname]);
    return null;
  };

  return (
    <BrowserRouter>
      <ScrollToTop />
      <SessionManager />
      {/* Put all your routers here */}
      <Routes>
        {AllRoutes()}
        {PrestataireRoutes()}
        {AdminRoutes()}
        {ClientRoutes()}
        {ChauffeurRoutes()}
        {MecanicienRoutes()}
        {SupportRoutes()}
        
        {/* Catch all - 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
