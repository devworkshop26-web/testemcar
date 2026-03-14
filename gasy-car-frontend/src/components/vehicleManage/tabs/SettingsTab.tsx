import React, { useState } from "react";
import { Settings, FileEdit, Hash, AlignLeft, Loader2, Save } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useUpdateVehiculeMutation } from "@/useQuery/vehiculeUseQuery";
import { Vehicule } from "@/types/vehiculeType";

interface SettingsTabProps {
  vehicle: Vehicule;
}

const SettingsTab: React.FC<SettingsTabProps> = ({ vehicle }) => {
  const { toast } = useToast();
  const updateMutation = useUpdateVehiculeMutation();
  
  // États pour gérer l'édition locale
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    numero_immatriculation: vehicle.numero_immatriculation || "",
    description: vehicle.description || "",
    conditions_particulieres: vehicle.conditions_particulieres || "",
  });

  const handleUpdate = async (field: string) => {
    try {
      const payload = new FormData();
      // On envoie la valeur actuelle du champ modifié
      payload.append(field, (formData as any)[field]);

      await updateMutation.mutateAsync({
        id: vehicle.id,
        payload: payload,
      });

      toast({
        title: "Succès",
        description: "Information mise à jour avec succès.",
      });
      setIsEditing(null);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le champ.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6 slide-up">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
          <Settings className="w-5 h-5 text-primary" />
          Paramètres du véhicule
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Configurez les informations d'identification et les règles du véhicule
        </p>
      </div>

      <div className="space-y-4">
        {/* 1. Numéro de Matricule */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4 flex-1">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0">
                  <Hash className="w-6 h-6 text-blue-500" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">Numéro d'immatriculation</h3>
                  {isEditing === "numero_immatriculation" ? (
                    <div className="mt-2 space-y-2">
                      <Input 
                        value={formData.numero_immatriculation}
                        onChange={(e) => setFormData({...formData, numero_immatriculation: e.target.value})}
                        placeholder="Ex: 1234 TAB"
                      />
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => handleUpdate("numero_immatriculation")} disabled={updateMutation.isPending}>
                          {updateMutation.isPending && <Loader2 className="w-3 h-3 animate-spin mr-1" />} Enregistrer
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => setIsEditing(null)}>Annuler</Button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground mt-1">{vehicle.numero_immatriculation || "Non défini"}</p>
                  )}
                </div>
              </div>
              {isEditing !== "numero_immatriculation" && (
                <Button variant="outline" size="sm" onClick={() => setIsEditing("numero_immatriculation")}>Modifier</Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* 2. Description */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4 flex-1">
                <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center shrink-0">
                  <AlignLeft className="w-6 h-6 text-orange-500" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">Description globale</h3>
                  {isEditing === "description" ? (
                    <div className="mt-2 space-y-2">
                      <Textarea 
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        rows={4}
                      />
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => handleUpdate("description")} disabled={updateMutation.isPending}>
                          Enregistrer
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => setIsEditing(null)}>Annuler</Button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-3">
                      {vehicle.description || "Aucune description fournie"}
                    </p>
                  )}
                </div>
              </div>
              {isEditing !== "description" && (
                <Button variant="outline" size="sm" onClick={() => setIsEditing("description")}>Modifier</Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* 3. Conditions Particulières */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4 flex-1">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <FileEdit className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">Conditions particulières</h3>
                  {isEditing === "conditions_particulieres" ? (
                    <div className="mt-2 space-y-2">
                      <Textarea 
                        value={formData.conditions_particulieres}
                        onChange={(e) => setFormData({...formData, conditions_particulieres: e.target.value})}
                        placeholder="Ex: Non fumeur, pas d'animaux..."
                      />
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => handleUpdate("conditions_particulieres")} disabled={updateMutation.isPending}>
                          Enregistrer
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => setIsEditing(null)}>Annuler</Button>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-1">
                        <p className="text-sm text-muted-foreground italic">
                            {vehicle.conditions_particulieres || "Aucune règle spécifique définie"}
                        </p>
                    </div>
                  )}
                </div>
              </div>
              {isEditing !== "conditions_particulieres" && (
                <Button variant="outline" size="sm" onClick={() => setIsEditing("conditions_particulieres")}>
                  {vehicle.conditions_particulieres ? "Modifier" : "Ajouter"}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SettingsTab;