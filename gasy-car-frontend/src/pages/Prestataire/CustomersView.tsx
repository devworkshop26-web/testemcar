"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Search, Phone, Mail, MapPin, Filter,
  Calendar, ShieldCheck, User,
  FileText, CheckCircle2, XCircle, ExternalLink,
  Car, Image as ImageIcon, MoreHorizontal, ChevronRight, X // <--- AJOUT DE X ICI
} from "lucide-react"

/* --- Vos Hooks & Utils (Inchangés) --- */
import { useCurentuser } from "@/useQuery/authUseQuery"
import { useOwnerClientsQuery } from "@/useQuery/vehiculeUseQuery"
import { InstanceAxis } from "@/helper/InstanceAxios"

/* --- UI Shadcn --- */
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select"
import {
  Sheet, SheetContent, SheetTrigger, SheetClose // <--- AJOUT (Optionnel, mais on utilise le bouton manuel ici)
} from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"

// --- UTILS ---
const RAW_BASE_URL = InstanceAxis.defaults.baseURL || ""
const BASE_URL = RAW_BASE_URL.replace("/api", "").replace(/\/+$/, "")

const getFullUrl = (path?: string | null) => {
  if (!path) return null
  return path.startsWith("http") ? path : `${BASE_URL}${path}`
}

const formatDate = (dateStr?: string | null) => {
  if (!dateStr) return "—"
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "numeric", month: "long", year: "numeric"
  })
}

// --- 1. COMPOSANT : CARTE CLIENT (MODERNE) ---
const ClientCard = ({ client, onClick }: { client: any, onClick: () => void }) => {
  const avatarUrl = getFullUrl(client.image)
  
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      className="h-full"
    >
      <Card 
        className="group h-full flex flex-col bg-white border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 rounded-2xl overflow-hidden cursor-pointer"
        onClick={onClick}
      >
        {/* En-tête avec bannière subtile */}
        <div className="h-20 bg-gradient-to-r from-slate-100 to-slate-50 relative">
            <div className="absolute top-4 right-4">
                 {client.is_active ? (
                    <div className="flex items-center gap-1.5 bg-white/80 backdrop-blur-sm px-2.5 py-1 rounded-full shadow-sm border border-emerald-100">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wide">Actif</span>
                    </div>
                ) : (
                    <Badge variant="secondary" className="bg-white/80 text-slate-500">Inactif</Badge>
                )}
            </div>
        </div>

        <CardContent className="px-6 pb-6 pt-0 flex-grow relative">
            {/* Avatar flottant */}
            <div className="-mt-10 mb-4 flex justify-between items-end">
                <Avatar className="h-20 w-20 border-4 border-white shadow-md ring-1 ring-slate-100">
                    <AvatarImage src={avatarUrl || ""} className="object-cover" />
                    <AvatarFallback className="bg-slate-900 text-white font-bold text-lg">
                    {client.first_name?.[0]}{client.last_name?.[0]}
                    </AvatarFallback>
                </Avatar>
            </div>

            {/* Info Principales */}
            <div className="space-y-1 mb-5">
                <h3 className="font-bold text-lg text-slate-900 leading-tight group-hover:text-blue-600 transition-colors">
                    {client.first_name} <span className="uppercase">{client.last_name}</span>
                </h3>
                <div className="flex items-center text-xs text-slate-500 font-medium">
                    <MapPin className="w-3.5 h-3.5 mr-1 text-slate-400" />
                    <span className="truncate">{client.address || "Aucune adresse"}</span>
                </div>
            </div>

            {/* Grid Contact */}
            <div className="grid grid-cols-1 gap-2">
                <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50/80 border border-slate-100 group-hover:border-blue-100 group-hover:bg-blue-50/30 transition-colors">
                    <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center shadow-sm text-slate-500">
                        <Phone className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col overflow-hidden">
                        <span className="text-[10px] uppercase text-slate-400 font-semibold">Téléphone</span>
                        <span className="text-sm font-medium text-slate-700 truncate">{client.phone || "—"}</span>
                    </div>
                </div>
                
                <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50/80 border border-slate-100 group-hover:border-blue-100 group-hover:bg-blue-50/30 transition-colors">
                    <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center shadow-sm text-slate-500">
                        <Mail className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col overflow-hidden">
                        <span className="text-[10px] uppercase text-slate-400 font-semibold">Email</span>
                        <span className="text-sm font-medium text-slate-700 truncate">{client.email || "—"}</span>
                    </div>
                </div>
            </div>
        </CardContent>

        <Separator className="bg-slate-100" />

        <CardFooter className="px-6 py-4 bg-slate-50/50 flex justify-between items-center">
           <span className="text-xs text-slate-400 font-medium">
             Depuis le {formatDate(client.date_joined)}
           </span>
           <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-900">
               <ChevronRight className="w-5 h-5" />
           </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}

// --- 2. COMPOSANT : DETAIL SHEET (AMÉLIORÉ AVEC BOUTON FERMETURE) ---
const ClientDetailSheet = ({ client, open, onOpenChange }: { client: any, open: boolean, onOpenChange: (open: boolean) => void }) => {
  if (!client) return null

  const avatarUrl = getFullUrl(client.image)
  const cinRecto = getFullUrl(client.cin_photo_recto)
  const cinVerso = getFullUrl(client.cin_photo_verso)
  const permisUrl = getFullUrl(client.permis_conduire)

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-2xl w-full p-0 gap-0 border-l border-slate-200 overflow-hidden bg-slate-50">
        
        {/* Header Hero */}
        <div className="bg-slate-900 relative">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20"></div>
            
            {/* --- BOUTON DE FERMETURE AJOUTÉ ICI --- */}
            <div className="absolute top-4 right-4 z-50">
                <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-9 w-9 text-white/70 hover:text-white hover:bg-white/20 rounded-full transition-all"
                    onClick={() => onOpenChange(false)}
                >
                    <X className="w-5 h-5" />
                    <span className="sr-only">Fermer</span>
                </Button>
            </div>
            {/* -------------------------------------- */}

            <div className="relative z-10 p-8 flex flex-col md:flex-row gap-6 items-start md:items-center">
                <Avatar className="h-24 w-24 border-4 border-white/10 shadow-2xl ring-4 ring-black/20">
                    <AvatarImage src={avatarUrl || ""} className="object-cover" />
                    <AvatarFallback className="bg-slate-800 text-slate-200 text-2xl font-bold">
                        {client.first_name?.[0]}{client.last_name?.[0]}
                    </AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                    <div>
                        <h2 className="text-3xl font-bold text-white tracking-tight">
                            {client.first_name} {client.last_name}
                        </h2>
                    </div>
                    <div className="flex gap-2 pt-1">
                         {client.is_active ? (
                            <Badge className="bg-emerald-500 hover:bg-emerald-600 border-0">Compte Actif</Badge>
                         ) : <Badge variant="destructive">Inactif</Badge>}
                         <Badge variant="outline" className="text-white border-white/20 bg-white/5">{client.role || "Standard"}</Badge>
                    </div>
                </div>
            </div>
        </div>

        {/* Contenu avec Tabs Modernes */}
        <ScrollArea className="h-[calc(100vh-160px)] bg-slate-50">
            <div className="p-6 md:p-8">
                <Tabs defaultValue="overview" className="w-full">
                    <TabsList className="w-full justify-start bg-transparent border-b border-slate-200 rounded-none h-auto p-0 mb-8 gap-6">
                        <TabsTrigger value="overview" className="rounded-none border-b-2 border-transparent data-[state=active]:border-slate-900 data-[state=active]:shadow-none data-[state=active]:bg-transparent px-0 py-3 text-slate-500 data-[state=active]:text-slate-900 font-medium text-sm transition-all">
                            Vue d'ensemble
                        </TabsTrigger>
                        <TabsTrigger value="docs" className="rounded-none border-b-2 border-transparent data-[state=active]:border-slate-900 data-[state=active]:shadow-none data-[state=active]:bg-transparent px-0 py-3 text-slate-500 data-[state=active]:text-slate-900 font-medium text-sm transition-all">
                            Documents Légaux
                        </TabsTrigger>
                        <TabsTrigger value="security" className="rounded-none border-b-2 border-transparent data-[state=active]:border-slate-900 data-[state=active]:shadow-none data-[state=active]:bg-transparent px-0 py-3 text-slate-500 data-[state=active]:text-slate-900 font-medium text-sm transition-all">
                            Sécurité & Compte
                        </TabsTrigger>
                    </TabsList>

                    {/* ONGLET 1 : OVERVIEW */}
                    <TabsContent value="overview" className="space-y-6 mt-0">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Card className="border-slate-200 shadow-sm">
                                <CardHeader className="pb-3"><h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Coordonnées</h4></CardHeader>
                                <CardContent className="space-y-4">
                                    <InfoRow icon={Mail} label="Email" value={client.email} verified={client.email_verified} />
                                    <InfoRow icon={Phone} label="Téléphone" value={client.phone} verified={client.phone_verified} />
                                    <InfoRow icon={MapPin} label="Adresse" value={client.address} />
                                </CardContent>
                            </Card>
                            
                            <Card className="border-slate-200 shadow-sm">
                                <CardHeader className="pb-3"><h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Personnel</h4></CardHeader>
                                <CardContent className="space-y-4">
                                    <InfoRow icon={Calendar} label="Date de naissance" value={formatDate(client.date_of_birth)} />
                                    <InfoRow icon={FileText} label="Numéro CIN" value={client.cin_number} />
                                    <InfoRow icon={ShieldCheck} label="Dernière mise à jour" value={formatDate(client.updated_at)} />
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    {/* ONGLET 2 : DOCUMENTS */}
                    <TabsContent value="docs" className="space-y-8 mt-0">
                         {/* CIN */}
                        <div>
                            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                                <span className="bg-blue-100 p-1.5 rounded-lg text-blue-600"><FileText className="w-4 h-4" /></span>
                                Carte d'Identité Nationale
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <DocCard title="Recto" src={cinRecto} />
                                <DocCard title="Verso" src={cinVerso} />
                            </div>
                        </div>
                        
                        <Separator />

                        {/* Permis */}
                        <div>
                            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                                <span className="bg-orange-100 p-1.5 rounded-lg text-orange-600"><Car className="w-4 h-4" /></span>
                                Permis de conduire
                            </h3>
                            {permisUrl ? (
                                <div className="max-w-sm">
                                    <DocCard title="Document numérisé" src={permisUrl} />
                                </div>
                            ) : (
                                <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 flex flex-col items-center justify-center text-slate-400 bg-slate-50/50">
                                    <Car className="w-8 h-8 mb-2 opacity-50" />
                                    <p className="text-sm font-medium">Aucun permis enregistré</p>
                                </div>
                            )}
                        </div>
                    </TabsContent>

                    {/* ONGLET 3 : SECURITY */}
                    <TabsContent value="security" className="mt-0">
                         <Card className="border-slate-200 shadow-sm overflow-hidden">
                            <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
                                <h3 className="font-semibold text-slate-900">Vérifications du système</h3>
                            </div>
                            <div className="divide-y divide-slate-100">
                                <SecurityRow label="Adresse Email" active={client.email_verified} />
                                <SecurityRow label="Numéro de Téléphone" active={client.phone_verified} />
                                <SecurityRow label="Privilèges Staff" active={client.is_staff} />
                                <SecurityRow label="Super Utilisateur" active={client.is_superuser} />
                            </div>
                         </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}

// --- 3. SUB-COMPONENTS HELPERS ---

const InfoRow = ({ icon: Icon, label, value, verified }: any) => (
    <div className="flex items-start gap-3">
        <Icon className="w-4 h-4 text-slate-400 mt-1 flex-shrink-0" />
        <div className="flex-1">
            <p className="text-xs text-slate-500 font-medium mb-0.5">{label}</p>
            <div className="text-sm font-medium text-slate-900 flex items-center gap-2">
                {value || "—"}
                {verified === true && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />}
                {verified === false && <XCircle className="w-3.5 h-3.5 text-amber-500" />}
            </div>
        </div>
    </div>
)

const DocCard = ({ title, src }: { title: string, src: string | null }) => (
    <div className="group relative rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden hover:shadow-md transition-shadow">
        <div className="aspect-[1.6] w-full bg-slate-100 relative overflow-hidden">
             {src ? (
                <>
                  <img src={src} alt={title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/30 transition-all flex items-center justify-center">
                      <a href={src} target="_blank" rel="noreferrer" className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 bg-white text-slate-900 px-4 py-2 rounded-full text-xs font-bold shadow-lg flex items-center gap-2">
                         <ExternalLink className="w-3 h-3" /> Voir
                      </a>
                  </div>
                </>
             ) : (
                <div className="flex h-full items-center justify-center text-slate-300 bg-slate-50">
                    <ImageIcon className="w-8 h-8" />
                </div>
             )}
        </div>
        <div className="px-3 py-2 border-t border-slate-100">
            <span className="text-xs font-semibold text-slate-600 uppercase">{title}</span>
        </div>
    </div>
)

const SecurityRow = ({ label, active }: { label: string, active: boolean }) => (
    <div className="flex items-center justify-between px-6 py-4 hover:bg-slate-50/50 transition-colors">
        <span className="text-sm font-medium text-slate-700">{label}</span>
        {active ? (
            <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-0 shadow-none px-3 py-1">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" /> Vérifié
            </Badge>
        ) : (
             <Badge variant="outline" className="text-slate-500 border-slate-200 bg-slate-50">
                Non vérifié
            </Badge>
        )}
    </div>
)

// --- 4. PAGE PRINCIPALE ---
const CustomersView = () => {
  const { user } = useCurentuser()
  const { data: clients, isLoading } = useOwnerClientsQuery(user?.id)
  
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("newest")
  const [selectedClient, setSelectedClient] = useState<any>(null)
  const [isSheetOpen, setIsSheetOpen] = useState(false)

  const processedClients = useMemo(() => {
    if (!clients) return []
    let filtered = clients.filter((c: any) => {
        const q = searchQuery.toLowerCase()
        return (
            c.last_name?.toLowerCase().includes(q) ||
            c.first_name?.toLowerCase().includes(q) ||
            c.email?.toLowerCase().includes(q) ||
            c.phone?.includes(q) ||
            c.cin_number?.includes(q)
        )
    })

    return filtered.sort((a: any, b: any) => {
      if (sortBy === "name-asc") return (a.last_name || "").localeCompare(b.last_name || "")
      if (sortBy === "name-desc") return (b.last_name || "").localeCompare(a.last_name || "")
      if (sortBy === "newest") return new Date(b.date_joined).getTime() - new Date(a.date_joined).getTime()
      return 0
    })
  }, [clients, searchQuery, sortBy])

  const handleCardClick = (client: any) => {
      setSelectedClient(client)
      setIsSheetOpen(true)
  }

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 md:p-10 space-y-8">
      
      {/* Top Bar */}
      <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 mb-2">Clients</h1>
          <p className="text-slate-500 font-medium">Gérez votre portefeuille client et validez les documents.</p>
        </div>
        <div className="flex items-center gap-3">
             <div className="bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm text-sm font-semibold text-slate-700">
                <span className="text-slate-400 font-normal mr-2">Total:</span>
                {processedClients.length}
             </div>
        </div>
      </div>

      {/* Control Bar (Flottante) */}
      <div className="sticky top-4 z-30 bg-white/80 backdrop-blur-xl border border-slate-200 shadow-lg shadow-slate-200/50 p-2 rounded-2xl flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input 
            placeholder="Rechercher (Nom, Email, CIN...)" 
            className="pl-10 bg-transparent border-none focus-visible:ring-0 h-10 text-base"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="h-10 w-px bg-slate-200 hidden sm:block mx-1"></div>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full sm:w-[180px] border-none bg-slate-100 hover:bg-slate-200/70 h-10 rounded-xl focus:ring-0 transition-colors font-medium">
            <div className="flex items-center gap-2 text-slate-700">
                 <Filter className="w-3.5 h-3.5" />
                 <SelectValue placeholder="Trier" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Plus récents</SelectItem>
            <SelectItem value="name-asc">Alphabétique (A-Z)</SelectItem>
            <SelectItem value="name-desc">Alphabétique (Z-A)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* GRILLE PRINCIPALE (3 Colonnes Strictes) */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
             <div key={i} className="h-[300px] w-full rounded-2xl bg-white border border-slate-100 p-6 space-y-4">
                <div className="flex items-center gap-4">
                    <Skeleton className="h-16 w-16 rounded-full" />
                    <div className="space-y-2 flex-1">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                    </div>
                </div>
                <Skeleton className="h-24 w-full rounded-xl" />
             </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {processedClients.map((client: any) => (
               <ClientCard 
                 key={client.id} 
                 client={client} 
                 onClick={() => handleCardClick(client)} 
               />
            ))}
          </AnimatePresence>
          
          {processedClients.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center py-32 text-center">
                <div className="bg-slate-100 p-6 rounded-full mb-4">
                    <Search className="w-10 h-10 text-slate-400" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-1">Aucun résultat</h3>
                <p className="text-slate-500 max-w-xs mx-auto">Nous n'avons trouvé aucun client correspondant à votre recherche.</p>
            </div>
          )}
        </div>
      )}

      {/* Modal Details */}
      <ClientDetailSheet 
        client={selectedClient} 
        open={isSheetOpen} 
        onOpenChange={setIsSheetOpen} 
      />
      
    </div>
  )
}

export default CustomersView