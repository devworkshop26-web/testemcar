import { type ComponentType, useState, FC } from "react";
import { Link, useLocation } from "react-router-dom";
import AvatarClient from "@/components/client/AvatarClient";
import Logo from "@/components/Logo";
import {
  ClipboardList,
  LayoutDashboard,
  Menu,
  Settings,
  Truck,
  User as UserIcon,
  Users,
  WalletCards,
  DoorOpen,
  Key,
  ChevronDown,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCurrentUserQuery } from "@/useQuery/useCurrentUserQuery";
import { deconnectionAction } from "@/helper/utils";
import { User, UserRole } from "@/types/userType";

// --- LOGIQUE ET TYPES ---
interface MenuItem {
  label: string;
  icon: ComponentType<{ className?: string }>;
  path: string;
}

const roleMenus: Record<UserRole, MenuItem[]> = {
  ADMIN: [
    { label: "Vue d’ensemble", icon: LayoutDashboard, path: "/admin/" },
    { label: "Utilisateurs", icon: Users, path: "/admin/users" },
    { label: "Paiements", icon: WalletCards, path: "/admin/payments" },
  ],
  PRESTATAIRE: [
    { label: "Vue d’ensemble", icon: LayoutDashboard, path: "/prestataire/dashboard" },
    { label: "Mes véhicules", icon: Truck, path: "/prestataire/fleet" },
    { label: "Réservations", icon: ClipboardList, path: "/prestataire/booking" },
    { label: "Paramètres", icon: Settings, path: "/prestataire/parameters" },
  ],
  CLIENT: [
    { label: "Vue d’ensemble", icon: LayoutDashboard, path: "/client/" },
    { label: "Mes réservations", icon: ClipboardList, path: "/client/booking" },
    { label: "Profil", icon: UserIcon, path: "/client/settings" },
  ],
  CHAUFFEUR: [{ label: "Dashboard", icon: LayoutDashboard, path: "/driver" }],
  MECANICIEN: [{ label: "Dashboard", icon: LayoutDashboard, path: "/mecanicien" }],
  SUPPORT: [
    { label: "Vue d’ensemble", icon: LayoutDashboard, path: "/support/" },
    { label: "Tickets", icon: ClipboardList, path: "/support/tickets" },
  ],
};

const navigationLinks = [
  { label: "Accueil", path: "/" },
  { label: "Nos Véhicules", path: "/allcars" },
  { label: "Comment ça marche ?", path: "/comment-ca-marche" },
  { label: "Blog", path: "/blog" },
];

// --- COMPOSANT DE RENDU DES ITEMS DE MENU ---
interface MenuItemsRendererProps {
  user: User;
  onLogout: () => void;
  isMobile?: boolean;
}

const MenuItemsRenderer: FC<MenuItemsRendererProps> = ({ user, onLogout, isMobile = false }) => {
  const userSpecificMenuItems = roleMenus[user.role] || [];
  const allMenuItems = [...userSpecificMenuItems];

  const handleLogout = (event: React.MouseEvent | React.UIEvent) => {
    event.preventDefault();
    onLogout();
  };

  const logoutItem = (
    <button onClick={handleLogout} className="flex items-center gap-3 w-full">
      <DoorOpen className="h-4 w-4 text-red-500" />
      <span>Déconnexion</span>
    </button>
  );


  if (isMobile) {
    return (
      <nav className="flex flex-col gap-1 mt-4">
        {allMenuItems.map((item) => (
          <SheetClose asChild key={item.label}>
            <Link to={item.path} className="flex items-center gap-3 text-sm font-medium text-foreground rounded-md px-3 py-2.5 transition-colors hover:bg-accent">
              <item.icon className="h-4 w-4 text-muted-foreground" />
              <span>{item.label}</span>
            </Link>
          </SheetClose>
        ))}
        <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-lg transition-colors mt-2">
          <DoorOpen className="h-5 w-5" />
          <span className="font-medium text-sm">Déconnexion</span>
        </button>
      </nav>
    );
  }

  return (
    <>
      {allMenuItems.map((item) => (
        <DropdownMenuItem key={item.label} asChild className="cursor-pointer">
          <Link to={item.path} className="flex items-center gap-3 w-full">
            <item.icon className="h-4 w-4 text-muted-foreground" />
            <span>{item.label}</span>
          </Link>
        </DropdownMenuItem>
      ))}
      <DropdownMenuSeparator />
      <DropdownMenuItem onClick={handleLogout} className="text-red-500 focus:text-red-500 cursor-pointer py-2">
        <DoorOpen className="h-4 w-4 mr-2" />
        Déconnexion
      </DropdownMenuItem>
    </>
  );
};

// --- COMPOSANT HEADER PRINCIPAL ---
const Header = () => {
  const location = useLocation();
  const { data: user } = useCurrentUserQuery();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItemStyles = "relative px-4 py-2 text-sm font-medium transition-all duration-300 ease-out group flex items-center gap-1";

  const getLinkStateClasses = (path: string) =>
    location.pathname === path ? "text-primary" : "text-slate-600 hover:text-primary hover:-translate-y-0.5";

  const getMobileLinkClasses = (path: string) =>
    `flex items-center w-full px-4 py-3 rounded-xl text-base font-medium transition-all ${location.pathname === path ? "bg-primary/10 text-primary" : "text-slate-600 hover:bg-slate-50"}`;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white backdrop-blur-xl border-b border-slate-100 transition-all duration-300">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">

          {/* LOGO */}
          <Link to="/" className="flex-shrink-0 transition-transform hover:scale-105 active:scale-95">
            <Logo size={120} />
          </Link>

          {/* DESKTOP NAV */}
          <nav className="hidden md:flex items-center gap-2">
            {navigationLinks.map((link) => {
              const isActive = location.pathname === link.path;
              if (link.label === "Nos Véhicules") {
                return (
                  <DropdownMenu key={link.path} modal={false}>
                    <DropdownMenuTrigger className={`${navItemStyles} ${getLinkStateClasses(link.path)} outline-none border-none bg-transparent cursor-pointer`}>
                      <span className="absolute inset-0 rounded-full bg-slate-100/0 group-hover:bg-slate-100/80 transition-all duration-300 -z-10 scale-90 group-hover:scale-100 opacity-0 group-hover:opacity-100" />
                      <span>{link.label}</span>
                      <ChevronDown className="w-4 h-4 opacity-50 transition-transform duration-300 group-data-[state=open]:rotate-180 group-hover:text-primary" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-56 p-2 mt-2 shadow-2xl rounded-2xl border-slate-100 bg-white">
                      <DropdownMenuItem asChild className="rounded-lg cursor-pointer"><Link to="/allcars">Tous les véhicules</Link></DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-slate-50" />
                      <DropdownMenuItem asChild className="rounded-lg cursor-pointer"><Link to="/allcars?type=UTILITAIRE">Utilitaires</Link></DropdownMenuItem>
                      <DropdownMenuItem asChild className="rounded-lg cursor-pointer"><Link to="/allcars?type=TOURISME">Tourisme</Link></DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                );
              }
              return (
                <Link key={link.path} to={link.path} className={`${navItemStyles} ${getLinkStateClasses(link.path)}`}>
                  <span className={`absolute inset-0 rounded-full transition-all duration-300 -z-10 
                    ${isActive ? 'bg-primary/10 opacity-100 scale-100' : 'bg-slate-100/0 group-hover:bg-slate-100/80 group-hover:opacity-100 group-hover:scale-100 opacity-0 scale-90'}`}
                  />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* DESKTOP ACTIONS */}
          <div className="hidden md:flex items-center gap-4">
            {!user ? (
              <>
                <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-primary transition-all hover:-translate-y-0.5 flex items-center gap-2">
                  <Key size={16} /> Devenir Hôte
                </Link>
                <div className="h-4 w-px bg-slate-200 mx-2" />
                <Button asChild className="rounded-full px-6 bg-primary shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:scale-105 active:scale-95 transition-all duration-300">
                  <Link to="/login">Connexion</Link>
                </Button>
              </>
            ) : (
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 bg-slate-50/50 border border-slate-100 px-4 py-2 rounded-full hover:bg-slate-50 transition-colors cursor-default group">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Mode</span>
                  <span className="text-xs font-bold text-primary uppercase tracking-wide group-hover:scale-105 transition-transform">{user.role}</span>
                </div>

                <div className="flex items-center gap-4 pl-4 border-l border-slate-100">
                  <DropdownMenu modal={false}>
                    <DropdownMenuTrigger asChild>
                      <div className="flex items-center gap-3 cursor-pointer group">
                        <div className="flex flex-col items-end">
                          <span className="text-sm font-bold text-slate-900 leading-none mb-1">
                            {user.first_name} {user.last_name}
                          </span>
                          <span className="text-[11px] font-semibold text-primary/80">
                            Membre Vérifié
                          </span>
                        </div>

                        {/* CONTENEUR IMAGE AVEC INDICATEUR CONNECTÉ */}
                        <div className="relative">
                          <div
                            className="p-0.5 bg-white border border-slate-200 shadow-sm transition-all duration-300 ease-out group-hover:scale-110 group-hover:shadow-lg group-hover:border-primary/20 overflow-hidden"
                            style={{ borderRadius: '20%' }}
                          >
                            <AvatarClient user={user} size={42} />
                          </div>
                          {/* Point Vert Connecté */}
                          <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-500 border-2 border-white shadow-sm"></span>
                        </div>
                      </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-64 mt-2 p-2 shadow-2xl rounded-2xl bg-white border-slate-100 animate-in slide-in-from-top-2 duration-300">
                      <DropdownMenuLabel className="px-4 py-3">
                        <p className="text-sm font-bold text-slate-900">{user.first_name} {user.last_name}</p>
                        <p className="text-xs text-slate-500 font-normal truncate">{user.email}</p>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <MenuItemsRenderer user={user} onLogout={deconnectionAction} />
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            )}
          </div>

          {/* MOBILE MENU */}
          <div className="md:hidden flex items-center gap-3">
            {user && (
              <div className="relative">
                <div
                  className="shadow-sm border border-slate-200 overflow-hidden bg-white"
                  style={{ borderRadius: '20%' }}
                >
                  <AvatarClient user={user} size={36} />
                </div>
                {/* Point Vert Mobile */}
                <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-500 border-2 border-white"></span>
              </div>
            )}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="hover:bg-slate-50 rounded-full">
                  <Menu className="h-6 w-6 text-slate-600" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[85%] sm:w-[400px] p-0 border-none flex flex-col h-full bg-white">
                <SheetHeader className="p-6 text-left border-b border-slate-50">
                  <SheetTitle><Logo size={100} /></SheetTitle>
                </SheetHeader>
                <div className="flex-1 overflow-y-auto px-4 py-8">
                  {user && (
                    <div className="mb-8 p-5 bg-gradient-to-br from-slate-50 to-white border border-slate-100 rounded-[2rem] flex items-center gap-4">
                      <div className="relative">
                        <div
                          className="p-1 bg-white shadow-md border border-slate-100 overflow-hidden"
                          style={{ borderRadius: '20%' }}
                        >
                          <AvatarClient user={user} size={54} />
                        </div>
                        {/* Point Vert Intérieur Menu Mobile */}
                        <span className="absolute bottom-0.5 right-0.5 block h-4 w-4 rounded-full bg-green-500 border-[3px] border-white shadow-sm"></span>
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 text-lg leading-tight">{user.first_name}</p>
                        <p className="text-xs text-primary font-bold uppercase tracking-widest">{user.role}</p>
                      </div>
                    </div>
                  )}
                  {/* ... reste du menu mobile */}
                  <div className="space-y-1 mb-8">
                    <p className="px-4 text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-3">Menu</p>
                    {navigationLinks.map((link) => (
                      <SheetClose asChild key={link.path}>
                        <Link to={link.path} className={getMobileLinkClasses(link.path)}>
                          {link.label}
                        </Link>
                      </SheetClose>
                    ))}
                  </div>
                  {user && (
                    <div className="space-y-1 mb-8">
                      <p className="px-4 text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-3">Mon Compte</p>
                      <MenuItemsRenderer user={user} onLogout={deconnectionAction} isMobile />
                    </div>
                  )}
                </div>
                <div className="p-8 border-t border-slate-50 text-center">
                  <p className="text-[11px] text-slate-400 font-medium">© 2025 MadagasyCar • Premium Service</p>
                </div>
              </SheetContent>
            </Sheet>
          </div>

        </div>
      </div>
    </header>
  );
};

export default Header;