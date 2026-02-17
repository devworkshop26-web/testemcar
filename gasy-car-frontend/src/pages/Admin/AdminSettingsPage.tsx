import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AdminPageShell } from "@/components/admin/AdminPageShell";
import { useNavigate } from "react-router-dom";
import { accessTokenKey, refreshTokenKey } from "@/helper/InstanceAxios";
import { useQueryClient } from "@tanstack/react-query";
import {
  useReservationPricingConfigQuery,
  useUpdateReservationPricingConfigMutation,
} from "@/useQuery/reservationsUseQuery";
import { useToast } from "@/components/ui/use-toast";

export function AdminSettingsPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: pricingConfig, isLoading: isLoadingPricing } = useReservationPricingConfigQuery();
  const updatePricingMutation = useUpdateReservationPricingConfigMutation();

  const [serviceFee, setServiceFee] = useState("5000");

  useEffect(() => {
    if (pricingConfig?.service_fee !== undefined && pricingConfig?.service_fee !== null) {
      setServiceFee(String(pricingConfig.service_fee));
    }
  }, [pricingConfig?.service_fee]);

  const normalizedServiceFee = useMemo(() => Number(serviceFee), [serviceFee]);

  const handleSavePricing = async () => {
    if (!Number.isFinite(normalizedServiceFee) || normalizedServiceFee < 0) {
      toast({
        variant: "destructive",
        title: "Valeur invalide",
        description: "Le frais de service doit être un nombre positif ou nul.",
      });
      return;
    }

    try {
      await updatePricingMutation.mutateAsync({ service_fee: normalizedServiceFee });
      toast({
        title: "Configuration enregistrée",
        description: "Le frais de service & assurance a été mis à jour.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error?.message || "Impossible d'enregistrer la configuration.",
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem(accessTokenKey);
    localStorage.removeItem(refreshTokenKey);

    // Important: clear cached user to avoid immediate redirect back to dashboard.
    queryClient.removeQueries({ queryKey: ["currentUser"] });
    queryClient.setQueryData(["currentUser"], null);

    navigate("/login", { replace: true });
  };

  return (
    <AdminPageShell
      title="Configuration du compte administrateur"
      description="Gérez les options de votre compte administrateur."
    >
      <div className="space-y-4">
        <Card className="bg-white shadow-sm">
          <CardHeader>
            <CardTitle>Tarification plateforme</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="grid gap-2 max-w-sm">
              <Label htmlFor="service-fee">Frais de service & assurance (Ar)</Label>
              <Input
                id="service-fee"
                type="number"
                min="0"
                step="1"
                value={serviceFee}
                onChange={(event) => setServiceFee(event.target.value)}
                disabled={isLoadingPricing || updatePricingMutation.isPending}
              />
              <p className="text-xs text-gray-500">
                Ce montant est appliqué sur le tunnel de réservation client.
              </p>
            </div>

            <Button
              onClick={handleSavePricing}
              disabled={isLoadingPricing || updatePricingMutation.isPending}
            >
              {updatePricingMutation.isPending ? "Enregistrement..." : "Enregistrer"}
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm">
          <CardHeader>
            <CardTitle>Gestion du compte</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <Button
              variant="destructive"
              className="w-full sm:w-auto"
              onClick={handleLogout}
            >
              Déconnexion
            </Button>
          </CardContent>
        </Card>
      </div>
    </AdminPageShell>
  );
}
