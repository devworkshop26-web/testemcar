import { Link, useLocation } from "react-router-dom";
import { Home, UserCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import NotificationBell from "@/components/NotificationBell";
import { useCurrentUserQuery } from "@/useQuery/useCurrentUserQuery";
import AvatarAdmin from "@/components/admin/AvatarAdmin";

const getPageTitle = (pathname: string) => {
  if (pathname.startsWith("/admin/reservations")) return "Réservations";
  if (pathname.startsWith("/admin/vehicles")) return "Véhicules";
  if (pathname.startsWith("/admin/users")) return "Utilisateurs";
  if (pathname.startsWith("/admin/payments")) return "Paiements";
  if (pathname.startsWith("/admin/support")) return "Support";
  if (pathname.startsWith("/admin/settings")) return "Paramètres";
  return "Tableau de bord administrateur";
};

export default function AdminHeader() {
  const location = useLocation();
  const { data: currentUser } = useCurrentUserQuery();

  const pageTitle = getPageTitle(location.pathname);

  const adminDisplayName =
    currentUser?.first_name || currentUser?.last_name
      ? `${currentUser?.first_name ?? ""} ${currentUser?.last_name ?? ""}`.trim()
      : "Administrateur";

  return (
    <header className="sticky top-0 z-30 mb-6">
      <div className="rounded-2xl border border-border/60 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 shadow-sm">
        <div className="flex flex-col gap-4 px-4 py-4 md:px-5">
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <SidebarTrigger className="h-10 w-10 rounded-xl border border-border/60 hover:bg-muted" />

              <div className="min-w-0">
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                  Administration
                </p>
                <h1 className="truncate text-lg font-semibold text-foreground md:text-xl">
                  {pageTitle}
                </h1>
              </div>
            </div>

            <div className="hidden items-center gap-2 md:flex">
              <Link to="/">
                <Button
                  variant="outline"
                  className="rounded-xl border-border/70 bg-background"
                >
                  <Home className="mr-2 h-4 w-4" />
                  Retour accueil
                </Button>
              </Link>

              <div className="rounded-xl border border-border/70 bg-background px-1 py-1">
                <NotificationBell />
              </div>

              {/* PROFIL ADMIN NON CLIQUABLE */}
              <div className="flex items-center rounded-2xl px-2 py-1.5 bg-muted/40 border border-border/60">
                <div className="mr-3">
                  <AvatarAdmin user={currentUser ?? null} size={40} />
                </div>

                <div className="text-left">
                  <p className="max-w-[140px] truncate text-sm font-semibold text-foreground">
                    {adminDisplayName}
                  </p>
                  <p className="max-w-[180px] truncate text-xs text-muted-foreground">
                    {currentUser?.email || "Compte admin"}
                  </p>
                </div>

                {/* <UserCircle2 className="ml-3 h-4 w-4 text-muted-foreground" /> */}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <Link to="/" className="flex-1">
              <Button
                variant="outline"
                className="w-full rounded-xl border-border/70 bg-background"
              >
                <Home className="mr-2 h-4 w-4" />
                Accueil
              </Button>
            </Link>

            <div className="rounded-xl border border-border/70 bg-background px-1 py-1">
              <NotificationBell />
            </div>

            {/* VERSION MOBILE NON CLIQUABLE */}
            <div className="flex items-center justify-center rounded-xl border border-border/70 bg-background p-1.5">
              <AvatarAdmin user={currentUser ?? null} size={32} />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}