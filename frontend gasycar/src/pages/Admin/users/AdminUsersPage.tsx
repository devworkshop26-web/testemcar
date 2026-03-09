// src/pages/admin/users/AdminUsersPage.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AdminPageShell } from "@/components/admin/AdminPageShell";
import { adminAPI } from "@/Actions/adminApi";
import { adminUseQuery } from "@/useQuery/adminUseQuery";
import { usersUseQuery } from "@/useQuery/usersUseQuery";
import { useEffect, useMemo, useState } from "react";
import { User } from "@/types/userType";
import { Eye, EyeOff, Pencil, Trash2 } from "lucide-react";
import { EditUserSheet } from "./EditUserSheet";
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
import { useQueryClient } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useToast } from "@/components/ui/use-toast";

const ITEMS_PER_PAGE = 12;

export function AdminUsersPage() {
  const { usersData } = adminUseQuery();
  const { deleteUser } = usersUseQuery();
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);
  const [singleDeletePassword, setSingleDeletePassword] = useState("");
  const [isDeleteAllDialogOpen, setIsDeleteAllDialogOpen] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [isAdminPasswordVisible, setIsAdminPasswordVisible] = useState(false);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();

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
        "Une erreur est survenue lors de la suppression des comptes."
      );
    }

    return "Une erreur est survenue lors de la suppression des comptes.";
  };

  const filteredData = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    if (!normalizedSearch) {
      return usersData ?? [];
    }

    return (usersData ?? []).filter((user) =>
      `${user.first_name} ${user.last_name} ${user.email}`
        .toLowerCase()
        .includes(normalizedSearch),
    );
  }, [usersData, searchTerm]);

  const totalPages = Math.max(1, Math.ceil(filteredData.length / ITEMS_PER_PAGE));

  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredData.slice(start, start + ITEMS_PER_PAGE);
  }, [currentPage, filteredData]);

  const currentPageSafe = Math.min(currentPage, totalPages);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const handleDelete = (user: User) => {
    setDeletingUser(user);
  };

  const confirmDelete = () => {
    const trimmedPassword = singleDeletePassword.trim();

    if (!trimmedPassword) {
      toast({
        title: "Mot de passe requis",
        description: "Veuillez saisir votre mot de passe administrateur.",
        variant: "destructive",
      });
      return;
    }

    if (deletingUser) {
      deleteUser.mutate(
        { id: deletingUser.id, password: trimmedPassword },
        {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["users"] });
          setSingleDeletePassword("");
          setDeletingUser(null);
          toast({
            title: "Compte supprimé",
            description: "L'utilisateur a été supprimé avec succès.",
          });
        },
        onError: (error: unknown) => {
          const message = getDeleteAllErrorMessage(error);
          toast({
            title: "Échec de la suppression",
            description: message,
            variant: "destructive",
          });
        },
      });
    }
  };

  const confirmDeleteAllNonAdmin = async () => {
    const trimmedPassword = adminPassword.trim();

    if (!trimmedPassword) {
      toast({
        title: "Mot de passe requis",
        description: "Veuillez saisir votre mot de passe administrateur.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsBulkDeleting(true);
      const { data } = await adminAPI.delete_non_admin_users(adminPassword);
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setIsDeleteAllDialogOpen(false);
      setAdminPassword("");
      setIsAdminPasswordVisible(false);
      toast({
        title: "Suppression terminée",
        description: `${data.deleted_count ?? 0} compte(s) non admin supprimé(s).`,
      });
    } catch (error: unknown) {
      const message = getDeleteAllErrorMessage(error);
      toast({
        title: "Échec de la suppression",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsBulkDeleting(false);
    }
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const visiblePages = useMemo(() => {
    const maxVisiblePages = 5;
    const pages: number[] = [];
    let start = Math.max(1, currentPageSafe - 2);
    const end = Math.min(totalPages, start + maxVisiblePages - 1);

    if (end - start < maxVisiblePages - 1) {
      start = Math.max(1, end - maxVisiblePages + 1);
    }

    for (let i = start; i <= end; i += 1) {
      pages.push(i);
    }

    return pages;
  }, [currentPageSafe, totalPages]);

  return (
    <AdminPageShell
      title="Tous les utilisateurs"
      description="Liste globale des comptes (clients, prestataires, admins)."
    >
      <Card className="w-full rounded-xl bg-white shadow-sm">
        <CardHeader className="space-y-1">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <CardTitle className="text-base sm:text-lg">Utilisateurs</CardTitle>
              <p className="text-sm text-muted-foreground">
                Vue consolidée des comptes avec statut d’activité.
              </p>
            </div>
            <Button
              variant="destructive"
              onClick={() => setIsDeleteAllDialogOpen(true)}
              disabled={!usersData?.length}
            >
              Supprimer tous les non-admin
            </Button>
          </div>
          <div className="pt-4">
            <Input
              placeholder="Rechercher par nom ou email..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="max-w-sm"
            />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3 sm:hidden">
            {paginatedUsers.length > 0 ? (
              paginatedUsers.map((user) => (
                <div
                  key={user.id}
                  className="rounded-xl border border-muted-foreground/10 bg-muted/30 p-4 shadow-sm"
                >
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-foreground">
                        {user.first_name} {user.last_name}
                      </p>
                      <Badge variant="outline" className="text-xs">
                        {user.role}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground break-words">{user.email}</p>
                    <div className="flex items-center justify-between">
                      {user.is_active ? (
                        <Badge className="bg-emerald-100 text-emerald-700">Actif</Badge>
                      ) : (
                        <Badge className="bg-rose-100 text-rose-700">Inactif</Badge>
                      )}
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon" onClick={() => setEditingUser(user)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleDelete(user)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-sm text-muted-foreground">
                Aucun utilisateur trouvé.
              </p>
            )}
          </div>

          <div className="hidden overflow-x-auto sm:block">
            <Table className="min-w-full text-sm">
              <TableHeader>
                <TableRow>
                  <TableHead className="whitespace-nowrap">Nom</TableHead>
                  <TableHead className="whitespace-nowrap">Email</TableHead>
                  <TableHead className="whitespace-nowrap">Rôle</TableHead>
                  <TableHead className="whitespace-nowrap">Statut</TableHead>
                  <TableHead className="whitespace-nowrap text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedUsers.length > 0 ? (
                  paginatedUsers.map((user) => (
                    <TableRow key={user.id} className="hover:bg-muted/40">
                      <TableCell className="whitespace-nowrap">
                        {user.first_name} {user.last_name}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">{user.email}</TableCell>
                      <TableCell className="whitespace-nowrap">
                        <Badge variant="outline">{user.role}</Badge>
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        {user.is_active ? (
                          <Badge className="bg-emerald-100 text-emerald-700">Actif</Badge>
                        ) : (
                          <Badge className="bg-rose-100 text-rose-700">Inactif</Badge>
                        )}
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-right">
                        <Button variant="ghost" size="icon" onClick={() => setEditingUser(user)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleDelete(user)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-sm text-muted-foreground">
                      Aucun utilisateur trouvé.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {filteredData.length > ITEMS_PER_PAGE && (
            <div className="flex flex-col gap-3 border-t pt-4">
              <p className="text-center text-xs text-muted-foreground sm:text-sm">
                Page {currentPageSafe} sur {totalPages} ({filteredData.length} utilisateurs)
              </p>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        goToPage(currentPageSafe - 1);
                      }}
                      className={currentPageSafe === 1 ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>

                  {visiblePages.map((page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        href="#"
                        isActive={currentPageSafe === page}
                        onClick={(e) => {
                          e.preventDefault();
                          goToPage(page);
                        }}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}

                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        goToPage(currentPageSafe + 1);
                      }}
                      className={
                        currentPageSafe === totalPages ? "pointer-events-none opacity-50" : ""
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>

      <EditUserSheet user={editingUser} isOpen={!!editingUser} onClose={() => setEditingUser(null)} />

      <AlertDialog
        open={!!deletingUser}
        onOpenChange={(open) => {
          if (!open) {
            setSingleDeletePassword("");
            setDeletingUser(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Cela supprimera définitivement le compte de{" "}
              <span className="font-semibold">
                {deletingUser?.first_name} {deletingUser?.last_name}
              </span>
              .
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-2">
            <label htmlFor="single-delete-admin-password" className="text-sm font-medium">
              Mot de passe administrateur
            </label>
            <Input
              id="single-delete-admin-password"
              type="password"
              placeholder="Votre mot de passe"
              value={singleDeletePassword}
              onChange={(e) => setSingleDeletePassword(e.target.value)}
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setSingleDeletePassword("");
                setDeletingUser(null);
              }}
            >
              Annuler
            </AlertDialogCancel>
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
            <AlertDialogTitle>Supprimer tous les comptes non-admin ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Tous les comptes sauf les administrateurs seront
              supprimés. Entrez votre mot de passe administrateur pour confirmer.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-2">
            <label htmlFor="admin-password" className="text-sm font-medium">
              Mot de passe administrateur
            </label>
            <div className="relative">
              <Input
                id="admin-password"
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
                void confirmDeleteAllNonAdmin();
              }}
              disabled={isBulkDeleting}
            >
              {isBulkDeleting ? "Suppression..." : "Confirmer la suppression"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminPageShell>
  );
}
