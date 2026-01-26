// src/pages/admin/users/AdminSupportUsersPage.tsx
import { AdminPageShell } from "@/components/admin/AdminPageShell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { adminUseQuery } from "@/useQuery/adminUseQuery"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { usersUseQuery } from "@/useQuery/usersUseQuery"
import { User } from "@/types/userType"
import { useQueryClient } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2 } from "lucide-react"
import { EditUserSheet } from "./EditUserSheet"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export function AdminSupportUsersPage() {
  const { supportData } = adminUseQuery();
  const [searchTerm, setSearchTerm] = useState("");
  const { deleteUser } = usersUseQuery();
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);
  const queryClient = useQueryClient();

  const filteredData = supportData?.filter((user) =>
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
      title="Équipe support"
      description="Comptes disposant d’un accès au support & tickets."
    >
      <Card className="bg-white shadow-sm">
        <CardHeader>
          <CardTitle>Membres support</CardTitle>
          <div className="pt-4">
            <Input
              placeholder="Rechercher par nom ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Tickets en cours</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData && filteredData.length > 0 ? (
                filteredData.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      {user.first_name} {user.last_name}
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      0
                    </TableCell>
                    <TableCell>
                      0
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
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
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                // si le donne est vide
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    Aucun utilisateur trouvé.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
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
