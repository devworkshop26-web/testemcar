// src/pages/admin/vehicles/AdminVehicleDisputesPage.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AdminPageShell } from "@/components/admin/AdminPageShell"

export function AdminVehicleDisputesPage() {
  return (
    <AdminPageShell
      title="Litiges véhicules"
      description="Gestion des déclarations de dommages et véhicules non conformes."
    >
      <Card className="bg-white shadow-sm">
        <CardHeader>
          <CardTitle>Litiges ouverts</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-md border bg-muted/40 p-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-foreground">
                Dommage carrosserie RAV4 #R-2025-02
              </p>
              <Badge variant="outline">En cours</Badge>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Signalé par le propriétaire suite à une réservation. Montant
              estimé : 450 000 Ar.
            </p>
          </div>
        </CardContent>
      </Card>
    </AdminPageShell>
  )
}
