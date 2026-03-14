"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { CreateModePaymentDialog } from "@/components/admin/CreateModePaymentDialog";
import { UpdateModePaymentDialog } from "@/components/admin/UpdateModePaymentDialog";
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
import { ModePayment } from "@/types/modePayment";
import { formatDate } from "@/helper/utils";
import { useDeleteModePaymentMutation, useModePaymentsQuery } from "@/useQuery/modePaymentUseQuery";
import { Loader2, MoreHorizontal, Pencil, Search, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AdminPageShell } from "@/components/admin/AdminPageShell";

export default function AdminModePaymentsPage() {
  const { toast } = useToast();
  const { data: modePayments = [], isLoading, isError, refetch } = useModePaymentsQuery();
  const deleteMutation = useDeleteModePaymentMutation();
  const [search, setSearch] = useState("");
  const [editingMode, setEditingMode] = useState<ModePayment | null>(null);
  const [deletingMode, setDeletingMode] = useState<ModePayment | null>(null);
  const mediaBaseUrl =
    import.meta.env.VITE_MEDIA_BASE_URL ?? import.meta.env.VITE_API_BASE_URL ?? "";

  const getImageUrl = (image?: string | null) => {
    if (!image) return null;
    if (image.startsWith("http")) return image;
    return `${mediaBaseUrl}${image}`;
  };

  const filteredData = useMemo(() => {
    if (!search.trim()) return modePayments;
    const lower = search.toLowerCase();
    return modePayments.filter(
      (mode) =>
        mode.name.toLowerCase().includes(lower) ||
        mode.numero.toLowerCase().includes(lower) ||
        (mode.operateur ?? "").toLowerCase().includes(lower) ||
        (mode.description ?? "").toLowerCase().includes(lower),
    );
  }, [modePayments, search]);

  const handleDelete = () => {
    if (!deletingMode) return;
    deleteMutation.mutate(deletingMode.id, {
      onSuccess: () => {
        toast({
          title: "Mode de paiement supprimé",
          description: `"${deletingMode.name}" a été supprimé avec succès.`,
        });
        setDeletingMode(null);
      },
      onError: (error: any) => {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: error?.message || "Impossible de supprimer ce mode de paiement.",
        });
      },
    });
  };

  return (
    <AdminPageShell
      title="Modes de paiement"
      description="Gérez les différents modes de paiement disponibles pour vos clients."
      actions={<CreateModePaymentDialog />}
    >
      <Card className="rounded-2xl border shadow-sm">
        <CardHeader className="space-y-2 pb-4 sm:flex sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div>
            <CardTitle className="text-xl">Modes de paiement</CardTitle>
            <CardDescription>
              Centralisez les méthodes de paiement et maintenez vos informations à jour.
            </CardDescription>
          </div>
          <div className="flex w-full gap-3 sm:w-auto sm:items-center">
            <div className="relative w-full sm:w-64">
              <Input
                placeholder="Rechercher par nom ou numéro"
                className="pl-10"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            </div>
          </div>
        </CardHeader>
        <Separator />
        <CardContent className="space-y-4 p-0">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center gap-3 py-10 text-muted-foreground">
              <Loader2 className="h-6 w-6 animate-spin" />
              <p>Chargement des modes de paiement...</p>
            </div>
          ) : isError ? (
            <div className="flex flex-col items-center justify-center gap-3 py-10 text-center text-muted-foreground">
              <p>Impossible de charger les modes de paiement.</p>
              <Button variant="outline" onClick={() => refetch()}>
                Réessayer
              </Button>
            </div>
          ) : filteredData.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
              <p className="text-base font-medium text-foreground">Aucun mode de paiement trouvé.</p>
              <p className="text-sm text-muted-foreground">
                Ajoutez votre premier mode de paiement pour le rendre disponible lors des réservations.
              </p>
              <CreateModePaymentDialog />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table className="min-w-full">
                <TableHeader>
                  <TableRow>
                    <TableHead>Image</TableHead>
                    <TableHead>Nom</TableHead>
                    <TableHead>Numéro</TableHead>
                    <TableHead>Opérateur</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Date de création</TableHead>
                    <TableHead>Dernière mise à jour</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.map((mode) => (
                    <TableRow key={mode.id} className="hover:bg-muted/50">
                      <TableCell>
                        {getImageUrl(mode.image) ? (
                          <img
                            src={getImageUrl(mode.image) ?? ""}
                            alt={mode.name}
                            className="h-10 w-10 rounded-md object-cover"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-md bg-gray-200" />
                        )}
                      </TableCell>
                      <TableCell className="font-medium">{mode.name}</TableCell>
                      <TableCell>{mode.numero}</TableCell>
                      <TableCell>{mode.operateur || "—"}</TableCell>
                      <TableCell className="max-w-xs text-sm text-muted-foreground">
                        {mode.description || "—"}
                      </TableCell>
                      <TableCell>{formatDate(mode.created_at) ?? "—"}</TableCell>
                      <TableCell>{formatDate(mode.updated_at) ?? "—"}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => setEditingMode(mode)} className="flex items-center gap-2">
                              <Pencil className="h-4 w-4" />
                              Modifier
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => setDeletingMode(mode)}
                              className="flex items-center gap-2 text-destructive focus:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                              Supprimer
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <UpdateModePaymentDialog
        open={!!editingMode}
        onOpenChange={(open) => !open && setEditingMode(null)}
        modePayment={editingMode}
        onUpdated={() => setEditingMode(null)}
      />

      <AlertDialog open={!!deletingMode} onOpenChange={(open) => !open && setDeletingMode(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer ce mode de paiement ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Êtes-vous sûr de vouloir supprimer ce mode de paiement ?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteMutation.isPending}>Annuler</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminPageShell>
  );
}
