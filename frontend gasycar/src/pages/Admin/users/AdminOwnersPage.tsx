// src/pages/admin/users/AdminOwnersPage.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { AdminPageShell } from "@/components/admin/AdminPageShell"
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
import { useToast } from "@/components/ui/use-toast"

export function AdminOwnersPage() {
  const { prestataireData } = adminUseQuery();
  const [searchTerm, setSearchTerm] = useState("");
  const { deleteUser } = usersUseQuery();
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);
  const [adminPassword, setAdminPassword] = useState("");
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const filteredData = prestataireData?.filter((user) =>
    user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (user: User) => {
    setDeletingUser(user);
  };

  const confirmDelete = () => {
    const trimmedPassword = adminPassword.trim();

    if (!trimmedPassword) {
      toast({
        title: "Mot de passe requis",
        description: "Veuillez saisir votre mot de passe administrateur.",
        variant: "destructive",
      });
      return;
    }

    if (deletingUser) {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      deleteUser.mutate({ id: deletingUser.id, password: trimmedPassword }, {
        onSuccess: () => {
          setAdminPassword("");
          setDeletingUser(null);
        },
      });
    }
  };

  return (
    <AdminPageShell
      title="Prestataires"
      description="Gestion des propriétaires de véhicules."
    >
      <Card className="bg-white shadow-sm">
        <CardHeader>
          <CardTitle>Propriétaires</CardTitle>
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
                <TableHead>Véhicules</TableHead>
                <TableHead>Revenus estimés</TableHead>
                <TableHead>Statut</TableHead>
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
                    <TableCell> 0 </TableCell>
                    <TableCell>
                      0
                    </TableCell>
                    <TableCell>
                      {user.is_active ? (
                        <Badge className="bg-emerald-100 text-emerald-700">
                          Actif
                        </Badge>
                      ) : (
                        <Badge className="bg-rose-100 text-rose-700">
                          Inactif
                        </Badge>
                      )}
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

      <AlertDialog
        open={!!deletingUser}
        onOpenChange={(open) => {
          if (!open) {
            setAdminPassword("");
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
            <label htmlFor="admin-password-delete-owner" className="text-sm font-medium">
              Mot de passe administrateur
            </label>
            <Input
              id="admin-password-delete-owner"
              type="password"
              placeholder="Votre mot de passe"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setAdminPassword("");
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
    </AdminPageShell>
  );
}
