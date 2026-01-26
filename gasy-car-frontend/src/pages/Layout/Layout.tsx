import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 pt-16 sm:pt-20 pb-16">
          <Outlet />
      </main>
      <Footer />
    </div>
  );
}