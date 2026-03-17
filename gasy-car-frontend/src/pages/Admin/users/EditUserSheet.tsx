import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { User } from "@/types/userType";
import { useEffect, useState } from "react";
import { adminUseQuery } from "@/useQuery/adminUseQuery";
import { usersUseQuery } from "@/useQuery/usersUseQuery";
import { useToast } from "@/components/ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";

interface EditUserSheetProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
}

export function EditUserSheet({ user, isOpen, onClose }: EditUserSheetProps) {
  const { updateUser } = usersUseQuery();
  const { toast } = useToast();
    const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    role: "",
    is_active: true,
  });

  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        email: user.email || "",
        role: user.role || "CLIENT",
        is_active: user.is_active,
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (value: string) => {
    setFormData((prev) => ({ ...prev, role: value }));
  };

  const handleStatusChange = (value: string) => {
    setFormData((prev) => ({ ...prev, is_active: value === "true" }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
     queryClient.invalidateQueries({ queryKey: ['users'] });

    updateUser.mutate(
      { id: user.id, data: formData },
      {
        onSuccess: () => {
          toast({
            title: "Succès",
            description: "Utilisateur mis à jour avec succès.",
            className: "bg-green-600 text-white border-none",
          });
          onClose();
        },
        onError: (error) => {
          toast({
            title: "Erreur",
            description: "Erreur lors de la mise à jour de l'utilisateur.",
            variant: "destructive",
          });
          console.error("Update error:", error);
        },
      }
    );
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Modifier l'utilisateur</SheetTitle>
          <SheetDescription>
            Modifiez les informations de l'utilisateur ici. Cliquez sur sauvegarder une fois terminé.
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="first_name" className="text-right">
              Prénom
            </Label>
            <Input
              id="first_name"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="last_name" className="text-right">
              Nom
            </Label>
            <Input
              id="last_name"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Input
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="role" className="text-right">
              Rôle
            </Label>
            <Select value={formData.role} onValueChange={handleRoleChange}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Sélectionner un rôle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CLIENT">Client</SelectItem>
                <SelectItem value="PRESTATAIRE">Prestataire</SelectItem>
                <SelectItem value="ADMIN">Admin</SelectItem>
                <SelectItem value="SUPPORT">Support</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-right">
              Statut
            </Label>
            <Select
              value={formData.is_active ? "true" : "false"}
              onValueChange={handleStatusChange}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Sélectionner un statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Actif</SelectItem>
                <SelectItem value="false">Inactif</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <SheetFooter>
            <Button type="submit" disabled={updateUser.isPending}>
              {updateUser.isPending ? "Sauvegarde..." : "Sauvegarder"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
