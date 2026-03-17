import { Button } from "@/components/ui/button";
import { CreateReservationDialog } from "@/components/admin/CreateReservationDialog";
import { ResourceListPage } from "@/components/admin/ResourceListPage";
import { Reservation } from "@/types/reservationsType";
import {
  useDeleteAllReservationsMutation,
  useDeleteReservationMutation,
  useReservationsQuery,
} from "@/useQuery/reservationsUseQuery";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { UpdateReservationDialog } from "@/components/admin/UpdateReservationDialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Eye, EyeOff } from "lucide-react";

export default function AdminReservationsPage() {
  const { data: reservations = [] } = useReservationsQuery();
  const deleteMutation = useDeleteReservationMutation();
  const deleteAllMutation = useDeleteAllReservationsMutation();
  const [localData, setLocalData] = useState<Reservation[] | null>(null);
  const [editingReservation, setEditingReservation] = useState<Reservation | null>(null);
  const [deletingReservation, setDeletingReservation] = useState<Reservation | null>(null);
  const [isDeleteAllDialogOpen, setIsDeleteAllDialogOpen] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [isAdminPasswordVisible, setIsAdminPasswordVisible] = useState(false);
  const { toast } = useToast();

  const rows = localData ?? reservations;

  const getDeleteAllErrorMessage = (error: unknown) => {
    if (typeof error === "object" && error !== null) {
      const maybeError = error as {
        response?: {
          data?: {
            detail?: string;
            message?: string;
          };
        };
      };

      return (
        maybeError.response?.data?.detail ||
        maybeError.response?.data?.message ||
        "Une erreur est survenue lors de la suppression des réservations."
      );
    }

    return "Une erreur est survenue lors de la suppression des réservations.";
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; className: string }> = {
      PENDING: { label: "En attente", className: "bg-yellow-100 text-yellow-700" },
      CONFIRMED: { label: "Confirmée", className: "bg-blue-100 text-blue-700" },
      IN_PROGRESS: { label: "En cours", className: "bg-purple-100 text-purple-700" },
      COMPLETED: { label: "Terminée", className: "bg-green-100 text-green-700" },
      CANCELLED: { label: "Annulée", className: "bg-red-100 text-red-700" },
    };

    const config = statusConfig[status] || { label: status, className: "bg-gray-100 text-gray-700" };
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const handleDelete = (reservation: Reservation) => {
    setDeletingReservation(reservation);
  };

  const confirmDelete = () => {
    if (deletingReservation) {
      deleteMutation.mutate(deletingReservation.id, {
        onSuccess: () => {
          setLocalData((prev) =>
            (prev ?? reservations).filter((r) => r.id !== deletingReservation.id)
          );
          setDeletingReservation(null);
        },
      });
    }
  };

  const confirmDeleteAll = () => {
    const trimmedPassword = adminPassword.trim();

    if (!trimmedPassword) {
      toast({
        title: "Mot de passe requis",
        description: "Veuillez saisir votre mot de passe administrateur.",
        variant: "destructive",
      });
      return;
    }

    deleteAllMutation.mutate(trimmedPassword, {
      onSuccess: (data) => {
        setLocalData([]);
        setIsDeleteAllDialogOpen(false);
        setAdminPassword("");
        setIsAdminPasswordVisible(false);
        toast({
          title: "Suppression terminée",
          description: `${data.deleted_count ?? 0} réservation(s) supprimée(s).`,
        });
      },
      onError: (error: unknown) => {
        toast({
          title: "Échec de la suppression",
          description: getDeleteAllErrorMessage(error),
          variant: "destructive",
        });
      },
    });
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
        <Button
          variant="destructive"
          onClick={() => setIsDeleteAllDialogOpen(true)}
          disabled={rows.length === 0}
        >
          Supprimer toutes les réservations
        </Button>
        <CreateReservationDialog
          onCreated={(r) =>
            setLocalData((prev) => (prev ? [r, ...prev] : [r, ...reservations]))
          }
        />
      </div>

      <ResourceListPage
        title="Réservations"
        description="Suivez et gérez les réservations de véhicules."
        columns={[
          {
            key: "reference",
            header: "Référence",
            render: (row) => (
              <span className="text-sm font-semibold font-mono">
                {row.reference}
              </span>
            )
          },
          {
            key: "client",
            header: "Client",
            render: (row) => {
              const client = row.client_data;
              return (
                <div className="flex flex-col">
                  <span className="font-medium">
                    {client?.username || client?.email || "N/A"}
                  </span>
                  {client?.first_name && client?.last_name && (
                    <span className="text-xs text-muted-foreground">
                      {client.first_name} {client.last_name}
                    </span>
                  )}
                </div>
              );
            }
          },
          {
            key: "vehicle",
            header: "Véhicule",
            render: (row) => {
              const vehicle = row.vehicle_data;
              return (
                <div className="flex flex-col">
                  <span className="font-medium">
                    {vehicle?.marque_data?.nom} {vehicle?.modele_data?.label}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {vehicle?.annee} - {vehicle?.titre || "N/A"}
                  </span>
                </div>
              );
            }
          },
          {
            key: "start_datetime",
            header: "Début",
            render: (row) => {
              try {
                return (
                  <span className="text-sm">
                    {format(new Date(row.start_datetime), "dd MMM yyyy HH:mm", { locale: fr })}
                  </span>
                );
              } catch {
                return <span className="text-xs text-muted-foreground">{row.start_datetime}</span>;
              }
            }
          },
          {
            key: "end_datetime",
            header: "Fin",
            render: (row) => {
              try {
                return (
                  <span className="text-sm">
                    {format(new Date(row.end_datetime), "dd MMM yyyy HH:mm", { locale: fr })}
                  </span>
                );
              } catch {
                return <span className="text-xs text-muted-foreground">{row.end_datetime}</span>;
              }
            }
          },
          {
            key: "total_amount",
            header: "Total",
            render: (row) => (
              <span className="font-medium">{row.total_amount} Ar</span>
            )
          },
          {
            key: "status",
            header: "Statut",
            render: (row) => getStatusBadge(row.status),
          },
          {
            key: "with_chauffeur",
            header: "Chauffeur",
            render: (row) =>
              row.with_chauffeur ? (
                <Badge className="bg-emerald-100 text-emerald-700">Oui</Badge>
              ) : (
                <Badge variant="outline" className="text-gray-500">Non</Badge>
              ),
          },
          {
            key: "actions",
            header: "Actions",
            render: (row: Reservation) => (
              <Button
                variant="ghost"
                size="sm"
                onClick={(e: React.MouseEvent) => {
                  e.stopPropagation();
                  window.location.href = `/admin/reservations/${row.id}`;
                }}
              >
                Voir
              </Button>
            )
          }
        ]}
        data={rows}
        onEditRow={(row) => setEditingReservation(row)}
        onDeleteRow={handleDelete}
      />

      <UpdateReservationDialog
        open={!!editingReservation}
        onOpenChange={(open) => !open && setEditingReservation(null)}
        reservation={editingReservation}
        onUpdated={() => {
          setLocalData(null);
        }}
      />

      <AlertDialog open={!!deletingReservation} onOpenChange={() => setDeletingReservation(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Cela supprimera définitivement la réservation {deletingReservation?.reference}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={confirmDelete}
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={isDeleteAllDialogOpen}
        onOpenChange={(open) => {
          setIsDeleteAllDialogOpen(open);
          if (!open) {
            setAdminPassword("");
            setIsAdminPasswordVisible(false);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer toutes les réservations ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Toutes les réservations et les photos de preuve de paiement liées seront supprimées.
              Entrez votre mot de passe administrateur pour confirmer.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-2">
            <label htmlFor="admin-password-delete-all-reservations" className="text-sm font-medium">
              Mot de passe administrateur
            </label>
            <div className="relative">
              <Input
                id="admin-password-delete-all-reservations"
                type={isAdminPasswordVisible ? "text" : "password"}
                placeholder="Votre mot de passe"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setIsAdminPasswordVisible((current) => !current)}
                className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
                aria-label={
                  isAdminPasswordVisible ? "Masquer le mot de passe" : "Afficher le mot de passe"
                }
              >
                {isAdminPasswordVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setAdminPassword("");
                setIsAdminPasswordVisible(false);
                setIsDeleteAllDialogOpen(false);
              }}
            >
              Annuler
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={(e) => {
                e.preventDefault();
                confirmDeleteAll();
              }}
              disabled={deleteAllMutation.isPending}
            >
              {deleteAllMutation.isPending ? "Suppression..." : "Confirmer la suppression"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
