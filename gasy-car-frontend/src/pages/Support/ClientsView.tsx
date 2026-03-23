import React, { useState, useMemo } from "react";
import { 
  Search, Mail, Phone, Car, Eye, Edit, Users, Briefcase, 
  Headset, UserPlus, ShieldCheck, MapPin, Calendar, ExternalLink,
  ChevronRight, Filter
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useClients } from "@/useQuery/support/useClients";
import { Link, useNavigate } from "react-router-dom";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { InstanceAxis } from "@/helper/InstanceAxios";
import { Badge } from "@/components/ui/badge";

const ClientsView = () => {
  const { data: clients, isLoading } = useClients();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("TOUT");

  const RAW_BASE_URL = InstanceAxis.defaults.baseURL || "";
  const BASE_URL = RAW_BASE_URL.replace("/api", "").replace(/\/+$/, "");

  const buildMediaUrl = (value?: string | null) => {
    if (!value || typeof value !== "string") return null;
    if (/^https?:\/\//i.test(value)) return value;
    return `${BASE_URL}${value}`;
  };

  const filteredClients = useMemo(() => {
    let list = clients ?? [];
    if (roleFilter !== "TOUT") list = list.filter((c) => c.role === roleFilter);
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      list = list.filter((c) =>
        `${c.first_name} ${c.last_name} ${c.email}`.toLowerCase().includes(term)
      );
    }
    return list;
  }, [clients, searchTerm, roleFilter]);

  const roles = [
    { id: "TOUT", label: "Tous", icon: <Users className="w-4 h-4" /> },
    { id: "CLIENT", label: "Clients", icon: <Users className="w-4 h-4" /> },
    { id: "PRESTATAIRE", label: "Prestataires", icon: <Briefcase className="w-4 h-4" /> },
    { id: "SUPPORT", label: "Support", icon: <Headset className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 lg:p-10 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* TOP HEADER SECTION */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-blue-600 font-semibold text-sm uppercase tracking-wider">
              <div className="h-1 w-8 bg-blue-600 rounded-full" />
              Support Utilisateur
            </div>
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
              Gestion des <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">Membres</span>
            </h1>
            <p className="text-slate-500 font-medium">
              Supervisez et gérez les accès de vos {filteredClients.length} collaborateurs.
            </p>
          </div>
          
        </header>

        {/* SEARCH & FILTERS BAR */}
        <div className="flex flex-col lg:flex-row gap-4 items-center p-2 bg-white rounded-2xl border border-slate-200/60 shadow-sm">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              placeholder="Rechercher un talent, un email..."
              className="h-12 pl-12 border-none bg-transparent focus-visible:ring-0 text-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-1 p-1 bg-slate-50 rounded-xl border border-slate-100">
            {roles.map((role) => (
              <button
                key={role.id}
                onClick={() => setRoleFilter(role.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                  roleFilter === role.id
                    ? "bg-white text-blue-600 shadow-md ring-1 ring-slate-200/50"
                    : "text-slate-500 hover:bg-slate-200/50 hover:text-slate-900"
                }`}
              >
                {role.icon}
                {role.label}
              </button>
            ))}
          </div>
        </div>

        {/* GRID OF IDENTITY CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
          ) : (
            filteredClients.map((client) => (
              <IdentityCard 
                key={client.id} 
                client={client} 
                buildMediaUrl={buildMediaUrl}
                navigate={navigate}
              />
            ))
          )}
        </div>

        {/* EMPTY STATE */}
        {!isLoading && filteredClients.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border-2 border-dashed border-slate-200">
            <div className="p-4 bg-slate-50 rounded-full mb-4">
              <Users className="w-10 h-10 text-slate-300" />
            </div>
            <p className="text-slate-900 font-bold text-xl">Aucun résultat</p>
            <p className="text-slate-500">Essayez de modifier vos filtres ou votre recherche.</p>
          </div>
        )}
      </div>
    </div>
  );
};

/* --- SUB-COMPONENT: IDENTITY CARD --- */
const IdentityCard = ({ client, buildMediaUrl, navigate }: any) => {
  const profileImageUrl = buildMediaUrl(client.image) || buildMediaUrl(client.image_url);
  
  const roleStyles: any = {
    PRESTATAIRE: "bg-purple-50 text-purple-700 border-purple-100",
    SUPPORT: "bg-orange-50 text-orange-700 border-orange-100",
    CLIENT: "bg-blue-50 text-blue-700 border-blue-100",
  };

  return (
    <Card className="group relative overflow-hidden border-none shadow-sm hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 bg-white rounded-3xl p-6 border border-slate-100">
      {/* Top Action Buttons (Floating) */}
      <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <Button size="icon" variant="secondary" className="h-9 w-9 rounded-full bg-white/80 backdrop-blur-sm shadow-sm" asChild>
          <Link to={`/support/client/${client.user_id ?? client.id}/edit`} state={{ clientSummary: client }}>
            <Edit className="w-4 h-4 text-slate-600" />
          </Link>
        </Button>
      </div>

      <div className="flex flex-col h-full">
        {/* Header: Avatar & Name */}
        <div className="flex items-start gap-4 mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-blue-500 rounded-2xl blur-lg opacity-0 group-hover:opacity-20 transition-opacity" />
            <Avatar className="h-16 w-16 rounded-2xl border-2 border-white shadow-md relative">
              <AvatarImage src={profileImageUrl || ""} className="object-cover" />
              <AvatarFallback className="bg-gradient-to-br from-slate-100 to-slate-200 text-slate-600 font-bold text-lg">
                {client.first_name?.[0]}{client.last_name?.[0]}
              </AvatarFallback>
            </Avatar>
            {client.email_verified && (
              <div className="absolute -top-1 -right-1 bg-blue-500 text-white rounded-full p-1 shadow-lg ring-2 ring-white">
                <ShieldCheck className="w-3 h-3" />
              </div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <Badge variant="outline" className={`mb-2 px-2 py-0 border ${roleStyles[client.role] || roleStyles.CLIENT}`}>
              {client.role}
            </Badge>
            <h3 className="text-lg font-bold text-slate-900 truncate leading-tight group-hover:text-blue-600 transition-colors">
              {client.first_name} {client.last_name}
            </h3>
            <div className="flex items-center text-slate-400 text-xs mt-1">
              <Mail className="w-3 h-3 mr-1" />
              <span className="truncate">{client.email}</span>
            </div>
          </div>
        </div>

        {/* Body: Key Stats */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-slate-50/50 p-3 rounded-2xl border border-slate-100">
            <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1">Téléphone</p>
            <p className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-blue-500" />
              {client.phone || "--"}
            </p>
          </div>
          <div className="bg-slate-50/50 p-3 rounded-2xl border border-slate-100">
            <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1">Locations</p>
            <p className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <Car className="w-3.5 h-3.5 text-indigo-500" />
              {client.total_rentals ?? 0}
            </p>
          </div>
        </div>

        {/* Footer: Button Action */}
        <Button 
          onClick={() => navigate(`/support/client/${client.user_id ?? client.id}`, { state: { clientSummary: client } })}
          variant="ghost" 
          className="w-full mt-auto justify-between bg-slate-50 hover:bg-blue-600 hover:text-white group/btn rounded-xl h-11 transition-all"
        >
          <span className="font-semibold text-sm">Voir le profil complet</span>
          <ChevronRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
        </Button>
      </div>
    </Card>
  );
};

/* --- SKELETON LOADING CARD --- */
const SkeletonCard = () => (
  <Card className="p-6 rounded-3xl border-none shadow-sm space-y-4">
    <div className="flex gap-4">
      <Skeleton className="h-16 w-16 rounded-2xl" />
      <div className="space-y-2 flex-1">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    </div>
    <div className="grid grid-cols-2 gap-3">
      <Skeleton className="h-14 rounded-2xl" />
      <Skeleton className="h-14 rounded-2xl" />
    </div>
    <Skeleton className="h-11 w-full rounded-xl" />
  </Card>
);

export default ClientsView;