// src/pages/support/SupportReservation.tsx
"use client";

import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  RefreshCcw,
  User,
  Car,
  CreditCard,
  AlertCircle,
  Banknote,
  Eye,
  Settings2,
  Search,
  ChevronLeft,
  ChevronRight,
  ListTodo,
  FilterX,
  Wallet,
  CheckCircle2,
} from "lucide-react";

/* Composants UI Shadcn */
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

/* Types & Queries */
import { Reservation } from "@/types/reservationsType";
import {
  useReservationsQuery,
  useUpdateReservationMutation,
  useUpdateReservationPaymentMutation,
} from "@/useQuery/reservationsUseQuery";

/* --- UTILS --- */

const formatCurrency = (amount: any) => {
  const safeAmount = Number(amount);
  if (isNaN(safeAmount)) return "0 Ar";
  return new Intl.NumberFormat("fr-MG", {
    style: "currency",
    currency: "MGA",
    maximumFractionDigits: 0,
  }).format(safeAmount);
};

const formatDateTime = (dateString?: string | null) => {
  if (!dateString) return "—";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

/* Config Badges & Statuts */
const STATUS_CONFIG: Record<string, { label: string; style: string; icon: any }> =
  {
    PENDING: {
      label: "En attente",
      style: "bg-yellow-100 text-yellow-800 border-yellow-200",
      icon: AlertCircle,
    },
    CONFIRMED: {
      label: "Confirmée",
      style: "bg-blue-100 text-blue-800 border-blue-200",
      icon: CheckCircle2,
    },
    IN_PROGRESS: {
      label: "En cours",
      style: "bg-purple-100 text-purple-800 border-purple-200",
      icon: Car,
    },
    COMPLETED: {
      label: "Terminée",
      style: "bg-green-100 text-green-800 border-green-200",
      icon: CheckCircle2,
    },
    CANCELLED: {
      label: "Annulée",
      style: "bg-red-100 text-red-800 border-red-200",
      icon: AlertCircle,
    },
  };

const PAYMENT_CONFIG: Record<string, { label: string; className: string }> = {
  PENDING: {
    label: "Non payé",
    className: "text-yellow-600 font-medium",
  },

  VALIDATED: {
    label: "Payé",
    className: "text-green-700 font-bold",
  },

  REFUSED: {
    label: "Refusé",
    className: "text-red-600 font-bold",
  },

  // compatibilité si jamais
  SUCCESS: {
    label: "Payé",
    className: "text-green-700 font-bold",
  },
  PAID: {
    label: "Payé",
    className: "text-green-700 font-bold",
  },
  FAILED: {
    label: "Échoué",
    className: "text-red-600 font-bold",
  },
};

/** NEW: config statut paiement (modale select) */
const PAYMENT_STATUS_CONFIG: Record<string, { label: string; style: string }> = {
  PENDING: { label: "En attente", style: "bg-yellow-100 text-yellow-800" },
  VALIDATED: { label: "Validé", style: "bg-green-100 text-green-800" },
  REJECTED: { label: "Refusé", style: "bg-red-100 text-red-800" },
};

export default function SupportReservationPage() {
  const navigate = useNavigate();

  // États
  const [page, setPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [statusToEdit, setStatusToEdit] = useState<Reservation | null>(null);
  const [newStatus, setNewStatus] = useState("");

  /** NEW: états modale paiement */
  const [paymentToEdit, setPaymentToEdit] = useState<any | null>(null);
  const [newPaymentStatus, setNewPaymentStatus] = useState("");

  /** ✅ NEW: filtre retrait (sans casser le reste) */
  const [pickupFilter, setPickupFilter] = useState<"ALL" | "UPCOMING_24H" | "OTHER">("ALL");

  const {
    data: reservations = [],
    isLoading,
    isError,
    refetch,
    isRefetching,
  } = useReservationsQuery();

  const updateReservationMutation = useUpdateReservationMutation();

  /** NEW: mutation update paiement (doit exister dans reservationsUseQuery) */
  const updateReservationPaymentMutation = useUpdateReservationPaymentMutation();

  // Urgence check
  const isUrgent = (dateString?: string | null) => {
    if (!dateString) return false;
    const diff = new Date(dateString).getTime() - Date.now();
    return diff > 0 && diff <= 24 * 60 * 60 * 1000;
  };

  /** ✅ NEW: helper retrait prévu 24h */
  const isPickupUpcoming24h = (start?: string | null) => {
    if (!start) return false;

    const now = new Date();
    const startDate = new Date(start);

    return (
      startDate > now &&
      startDate.getTime() <= now.getTime() + 24 * 60 * 60 * 1000
    );
  };

  // Filtrage
  const filteredData = useMemo(() => {
    return reservations.filter((row: any) => {
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        searchQuery === "" ||
        row.reference?.toLowerCase().includes(searchLower) ||
        row.client_data?.email?.toLowerCase().includes(searchLower) ||
        row.vehicle_data?.numero_immatriculation
          ?.toLowerCase()
          .includes(searchLower);

      const matchesStatus = statusFilter === "ALL" || row.status === statusFilter;

      /** ✅ NEW: filtre retrait */
      let matchesPickup = true;

      if (pickupFilter === "UPCOMING_24H") {
        matchesPickup = isPickupUpcoming24h(row.start_datetime);
      }

      if (pickupFilter === "OTHER") {
        matchesPickup = !isPickupUpcoming24h(row.start_datetime);
      }

      return matchesSearch && matchesStatus && matchesPickup;
    });
  }, [reservations, searchQuery, statusFilter, pickupFilter]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, page, itemsPerPage]);

  const stats = useMemo(() => {
    const revenue = reservations.reduce(
      (acc: number, curr: any) =>
        curr.status !== "CANCELLED"
          ? acc + (Number(curr.total_amount) || 0)
          : acc,
      0
    );
    return {
      total: reservations.length,
      revenue,
      pendingDossier: reservations.filter((r: any) => r.status === "PENDING")
        .length,
      unpaid: reservations.filter(
        (r: any) => !r.payment || r.payment.status === "PENDING"
      ).length,
    };
  }, [reservations]);

  if (isLoading) return <SupportReservationSkeleton />;

  return (
    <div className="w-full p-4 sm:p-6 space-y-6 animate-in fade-in duration-500">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Pilotage Réservations
          </h1>
          <p className="text-slate-500 text-sm">
            Contrôle des flux financiers et logistiques.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          disabled={isRefetching}
        >
          <RefreshCcw
            className={`mr-2 h-4 w-4 ${isRefetching ? "animate-spin" : ""}`}
          />
          Actualiser les données
        </Button>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Volume d'affaires"
          value={formatCurrency(stats.revenue)}
          icon={<Banknote className="text-emerald-600" />}
          className="border-l-4 border-l-emerald-500"
        />
        <StatCard
          title="Total Dossiers"
          value={stats.total}
          icon={<ListTodo className="text-blue-600" />}
          className="border-l-4 border-l-blue-500"
        />
        <StatCard
          title="À Valider"
          value={stats.pendingDossier}
          icon={<AlertCircle className="text-orange-600" />}
          className="border-l-4 border-l-orange-500"
        />
        <StatCard
          title="Impayés"
          value={stats.unpaid}
          icon={<Wallet className="text-red-600" />}
          className="border-l-4 border-l-red-500"
        />
      </div>

      {/* FILTRES AVANCÉS */}
      <Card className="bg-slate-50/50">
        <CardContent className="p-4 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Réf, Email, Immatriculation..."
              className="pl-10 bg-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-[200px] bg-white">
              <SelectValue placeholder="Tous les statuts" />
            </SelectTrigger>
            <SelectContent className="bg-white border-slate-200 shadow-xl">
              <SelectItem value="ALL">Tous les statuts</SelectItem>
              {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                <SelectItem key={key} value={key}>
                  {cfg.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* ✅ NEW: Filtre retrait prévu / autres */}
          <Select value={pickupFilter} onValueChange={(v: any) => setPickupFilter(v)}>
            <SelectTrigger className="w-full md:w-[220px] bg-white">
              <SelectValue placeholder="Type de retrait" />
            </SelectTrigger>
            <SelectContent className="bg-white border-slate-200 shadow-xl">
              <SelectItem value="ALL">Tous les retraits</SelectItem>
              <SelectItem value="UPCOMING_24H">Retrait prévu (24h)</SelectItem>
              <SelectItem value="OTHER">Autres retraits</SelectItem>
            </SelectContent>
          </Select>

          {(searchQuery || statusFilter !== "ALL" || pickupFilter !== "ALL") && (
            <Button
              variant="ghost"
              onClick={() => {
                setSearchQuery("");
                setStatusFilter("ALL");
                setPickupFilter("ALL");
              }}
              className="text-slate-500"
            >
              <FilterX className="h-4 w-4 mr-2" /> Effacer
            </Button>
          )}
        </CardContent>
      </Card>

      {/* TABLEAU */}
      <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="font-bold text-slate-700">
                Référence
              </TableHead>
              <TableHead className="font-bold text-slate-700">
                Client / Véhicule
              </TableHead>
              <TableHead className="font-bold text-slate-700">Période</TableHead>
              <TableHead className="font-bold text-slate-700">
                Paiement
              </TableHead>
              <TableHead className="font-bold text-slate-700">
                Statut Dossier
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((row: any) => (
              <TableRow
                key={row.id}
                className="hover:bg-slate-50/50 transition-colors"
              >
                <TableCell className="font-mono text-blue-600 font-bold">
                  #{row.reference}
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">
                      {row.client_data?.full_name || row.client_data?.email}
                    </p>
                    <div className="flex items-center text-[11px] text-slate-500">
                      <Car className="h-3 w-3 mr-1" />{" "}
                      {row.vehicle_data?.marque_data?.nom} -{" "}
                      {row.vehicle_data?.numero_immatriculation}
                    </div>

                    {/* NEW: Avec / Sans chauffeur (sans supprimer le reste) */}
                    {row.vehicle_data?.driver_data ? (
                      <Badge className="mt-1 bg-green-100 text-green-700 text-[10px]">
                        Avec chauffeur
                      </Badge>
                    ) : (
                      <Badge className="mt-1 bg-gray-100 text-gray-600 text-[10px]">
                        Sans chauffeur
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div
                    className={`text-[11px] p-2 rounded-lg border ${
                      isUrgent(row.start_datetime)
                        ? "bg-red-50 border-red-100"
                        : "bg-slate-50 border-slate-100"
                    }`}
                  >
                    <p className="flex justify-between">
                      <span>Départ:</span>{" "}
                      <span className="font-semibold text-slate-700">
                        {formatDateTime(row.start_datetime)}
                      </span>
                    </p>
                    <p className="flex justify-between mt-1">
                      <span>Retour:</span>{" "}
                      <span className="font-semibold text-slate-700">
                        {formatDateTime(row.end_datetime)}
                      </span>
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-bold text-slate-900">
                      {formatCurrency(row.total_amount)}
                    </span>
                    <span
                      className={`text-[10px] uppercase tracking-wider ${
                        row.payment
                          ? PAYMENT_CONFIG[row.payment.status]?.className ||
                            "text-slate-500"
                          : "text-slate-400"
                      }`}
                    >
                      {row.payment
                        ? PAYMENT_CONFIG[row.payment.status]?.label ||
                          row.payment.status
                        : "Non initié"}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={`${STATUS_CONFIG[row.status]?.style} border-none shadow-sm`}
                  >
                    {row.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    {/* EXISTING: edit dossier status */}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                      onClick={() => {
                        setStatusToEdit(row);
                        setNewStatus(row.status);
                      }}
                    >
                      <Settings2 className="h-4 w-4" />
                    </Button>

                    {/* NEW: edit payment status (dynamic, no static) */}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-emerald-600 hover:bg-emerald-50"
                      onClick={() => {
                        if (row.payment) {
                          setPaymentToEdit(row.payment);
                          setNewPaymentStatus(row.payment.status);
                        }
                      }}
                      disabled={!row.payment}
                      title={!row.payment ? "Aucun paiement" : "Modifier paiement"}
                    >
                      <CreditCard className="h-4 w-4" />
                    </Button>

                    {/* EXISTING: details */}
                    <Button
                      variant="secondary"
                      size="sm"
                      className="h-8"
                      onClick={() => navigate(`/support/reservations/${row.id}`)}
                    >
                      <Eye className="h-3.5 w-3.5 mr-2" /> Détails
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* MODALE DE CHANGEMENT DE STATUT (FIXED TRANSPARENCY) */}
      <Dialog
        open={!!statusToEdit}
        onOpenChange={(open) => !open && setStatusToEdit(null)}
      >
        <DialogContent className="sm:max-w-[425px] bg-white border-none shadow-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings2 className="h-5 w-5 text-blue-600" />
              Mettre à jour le dossier
            </DialogTitle>
            <DialogDescription>
              Modification du statut pour la réservation{" "}
              <span className="font-bold text-slate-900">
                #{statusToEdit?.reference}
              </span>
              .
            </DialogDescription>
          </DialogHeader>

          <div className="py-6">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">
              Nouveau Statut Logistique
            </label>
            <Select value={newStatus} onValueChange={setNewStatus}>
              <SelectTrigger className="w-full h-12 bg-slate-50 border-slate-200 text-slate-900 focus:ring-2 focus:ring-blue-500 shadow-sm">
                <SelectValue placeholder="Sélectionner un statut" />
              </SelectTrigger>
              {/* Force le fond blanc et l'opacité ici */}
              <SelectContent className="bg-white border border-slate-200 shadow-2xl z-[100] min-w-[200px]">
                {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                  <SelectItem
                    key={key}
                    value={key}
                    className="focus:bg-blue-50 focus:text-blue-700 cursor-pointer py-3 text-slate-700 border-b border-slate-50 last:border-0"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`h-2 w-2 rounded-full ${
                          cfg.style.split(" ")[0]
                        }`}
                      />
                      <span className="font-medium text-slate-900">
                        {cfg.label}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-[11px] text-slate-400 mt-4 italic">
              * Ce changement affectera uniquement l'état logistique, pas le
              paiement bancaire.
            </p>
          </div>

          <DialogFooter className="bg-slate-50 p-4 -m-6 mt-2 rounded-b-xl flex gap-2">
            <Button variant="ghost" onClick={() => setStatusToEdit(null)}>
              Annuler
            </Button>
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white px-8"
              disabled={updateReservationMutation.isPending}
              onClick={() => {
                if (statusToEdit) {
                  updateReservationMutation.mutate(
                    { id: statusToEdit.id, payload: { status: newStatus } },
                    { onSuccess: () => setStatusToEdit(null) }
                  );
                }
              }}
            >
              {updateReservationMutation.isPending ? "Mise à jour..." : "Confirmer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* NEW: MODALE DE CHANGEMENT DE STATUT PAIEMENT (CHOIX COMME STATUT DOSSIER) */}
      <Dialog
        open={!!paymentToEdit}
        onOpenChange={(open) => !open && setPaymentToEdit(null)}
      >
        <DialogContent className="sm:max-w-[425px] bg-white border-none shadow-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-emerald-600" />
              Mettre à jour le paiement
            </DialogTitle>
            <DialogDescription>
              Modification du statut pour le paiement{" "}
              <span className="font-bold text-slate-900">
                {paymentToEdit?.reason ? paymentToEdit.reason : "—"}
              </span>
              .
            </DialogDescription>
          </DialogHeader>

          <div className="py-6">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">
              Nouveau Statut Paiement
            </label>

            <Select value={newPaymentStatus} onValueChange={setNewPaymentStatus}>
              <SelectTrigger className="w-full h-12 bg-slate-50 border-slate-200 text-slate-900 focus:ring-2 focus:ring-emerald-500 shadow-sm">
                <SelectValue placeholder="Sélectionner un statut" />
              </SelectTrigger>

              <SelectContent className="bg-white border border-slate-200 shadow-2xl z-[100] min-w-[200px]">
                {Object.entries(PAYMENT_STATUS_CONFIG).map(([key, cfg]) => (
                  <SelectItem
                    key={key}
                    value={key}
                    className="focus:bg-emerald-50 focus:text-emerald-700 cursor-pointer py-3 text-slate-700 border-b border-slate-50 last:border-0"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`h-2 w-2 rounded-full ${cfg.style.split(" ")[0]}`}
                      />
                      <span className="font-medium text-slate-900">
                        {cfg.label}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <p className="text-[11px] text-slate-400 mt-4 italic">
              * Ce changement met à jour uniquement le paiement, pas le statut du dossier.
            </p>
          </div>

          <DialogFooter className="bg-slate-50 p-4 -m-6 mt-2 rounded-b-xl flex gap-2">
            <Button variant="ghost" onClick={() => setPaymentToEdit(null)}>
              Annuler
            </Button>
            <Button
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-8"
              disabled={updateReservationPaymentMutation.isPending}
              onClick={() => {
                if (paymentToEdit) {
                  updateReservationPaymentMutation.mutate(
                    { id: paymentToEdit.id, payload: { status: newPaymentStatus } },
                    { onSuccess: () => setPaymentToEdit(null) }
                  );
                }
              }}
            >
              {updateReservationPaymentMutation.isPending ? "Mise à jour..." : "Confirmer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function StatCard({ title, value, icon, className }: any) {
  return (
    <Card className={`overflow-hidden transition-all hover:shadow-md bg-white ${className}`}>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          {title}
        </CardTitle>
        <div className="p-2 bg-slate-50 rounded-lg">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-slate-900">{value}</div>
      </CardContent>
    </Card>
  );
}

function SupportReservationSkeleton() {
  return (
    <div className="p-6 space-y-6">
      <Skeleton className="h-10 w-1/3" />
      <div className="grid grid-cols-4 gap-4">
        <Skeleton className="h-24" />
        <Skeleton className="h-24" />
        <Skeleton className="h-24" />
        <Skeleton className="h-24" />
      </div>
      <Skeleton className="h-96 w-full" />
    </div>
  );
}
