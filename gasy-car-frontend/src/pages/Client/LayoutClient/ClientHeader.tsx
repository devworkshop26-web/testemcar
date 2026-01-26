import { Button } from "@/components/ui/button";
import { Menu, Home, Bell, ClipboardList, User as UserIcon, DoorOpen } from "lucide-react";
import { Link } from "react-router-dom";
import { useCurentuser } from "@/useQuery/authUseQuery";
import AvatarClient from "@/components/client/AvatarClient";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

import { deconnectionAction } from "@/helper/utils";
import NotificationBell from "@/components/NotificationBell";

export const HeaderClient = ({
  isSidebarOpen,
  setIsSidebarOpen,
}: {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
}) => {
  const { user } = useCurentuser();

  return (
    <header className="sticky top-0 z-10 bg-slate-50/90 backdrop-blur-sm p-4 border-b border-gray-100/50">
      <div className="flex justify-between items-center w-full">

        {/* ------------------------- LEFT SIDE ------------------------- */}
        <div className="flex items-center gap-4">
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-600 hover:text-primary hover:bg-gray-100 lg:hidden"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <Menu className="w-5 h-5" />
          </Button>

          {/* Title */}
          <div className="hidden md:block">
            <h2 className="text-xl font-semibold text-gray-900 font-poppins">
              Tableau de bord
            </h2>
            <p className="text-gray-500 text-sm">
              Bienvenue, {user?.first_name || "Client"} 👋
            </p>
          </div>
        </div>

        {/* ------------------------- RIGHT SIDE ------------------------- */}
        <div className="flex items-center gap-3 md:gap-4">

          {/* HOME Button */}
          <Link to="/" title="Retour à l'accueil" className="hidden sm:inline-block">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-xl text-gray-600 hover:text-primary hover:bg-gray-100 border border-gray-200 shadow-sm"
            >
              <Home className="w-5 h-5" />
            </Button>
          </Link>

          {/* Notifications */}
          <NotificationBell />
          {/* <Button
            variant="ghost"
            size="icon"
            className="relative rounded-xl text-gray-600 hover:text-primary hover:bg-gray-100 border border-gray-200 shadow-sm"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-slate-50"></span>
          </Button> */}

          {/* ------------------------- USER DROPDOWN ------------------------- */}
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="h-10 w-10 rounded-full overflow-hidden border border-primary/20 hover:border-primary transition-all">
                  <AvatarClient user={user} size={40} />
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                className="w-56 bg-white rounded-xl shadow-xl border border-gray-100 p-2"
              >
                <DropdownMenuLabel className="font-normal px-2 pt-2 pb-1">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium font-poppins text-gray-900">
                      {user.first_name} {user.last_name}
                    </span>
                    <span className="text-xs text-gray-500">{user.email}</span>
                  </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                {/* Menu items client */}
                <DropdownMenuItem asChild>
                  <Link to="/client/booking" className="flex items-center gap-3 cursor-pointer">
                    <ClipboardList className="h-4 w-4 text-muted-foreground" />
                    Mes réservations
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <Link to="/client/settings" className="flex items-center gap-3 cursor-pointer">
                    <UserIcon className="h-4 w-4 text-muted-foreground" />
                    Mon profil
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                {/* Logout */}
                <DropdownMenuItem
                  className="cursor-pointer text-red-500 hover:!bg-red-100"
                  onClick={deconnectionAction}
                >
                  <DoorOpen className="h-4 w-4" />
                  Déconnexion
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
};
