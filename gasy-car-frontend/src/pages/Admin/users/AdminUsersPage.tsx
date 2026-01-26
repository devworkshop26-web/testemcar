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
import { adminUseQuery } from "@/useQuery/adminUseQuery";
import { usersUseQuery } from "@/useQuery/usersUseQuery";
import { useState } from "react";
import { User } from "@/types/userType";
import { Pencil, Trash2 } from "lucide-react";
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

export function AdminUsersPage() {
  const { usersData } = adminUseQuery();
  const { deleteUser } = usersUseQuery();
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredData = usersData?.filter((user) =>
    user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (user: User) => {
    setDeletingUser(user);
  };

  const confirmDelete = () => {
    if (deletingUser) {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      deleteUser.mutate(deletingUser.id, {
        onSuccess: () => {
          setDeletingUser(null);
        },
      });
    }
  };

  return (
    <AdminPageShell
      title="Tous les utilisateurs"
      description="Liste globale des comptes (clients, prestataires, admins)."
    >
      <Card className="w-full rounded-xl bg-white shadow-sm">
        <CardHeader className="space-y-1">
          <CardTitle className="text-base sm:text-lg">Utilisateurs</CardTitle>
          <p className="text-sm text-muted-foreground">
            Vue consolidée des comptes avec statut d’activité.
          </p>
          <div className="pt-4">
            <Input
              placeholder="Rechercher par nom ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3 sm:hidden">
            {filteredData && filteredData.length > 0 ? (
              filteredData.map((user) => (
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
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setEditingUser(user)}
                        >
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
                {filteredData && filteredData.length > 0 ? (
                  filteredData.map((user) => (
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
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setEditingUser(user)}
                        >
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
        </CardContent>
      </Card>

      <EditUserSheet
        user={editingUser}
        isOpen={!!editingUser}
        onClose={() => setEditingUser(null)}
      />

      <AlertDialog open={!!deletingUser} onOpenChange={() => setDeletingUser(null)}>
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
    </AdminPageShell>
  );
}
