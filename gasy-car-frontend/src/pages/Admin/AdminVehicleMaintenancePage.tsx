// src/pages/admin/vehicles/AdminVehicleMaintenancePage.tsx
import { AdminPageShell } from "@/components/admin/AdminPageShell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function AdminVehicleMaintenancePage() {
  return (
    <AdminPageShell
      title="Maintenances"
      description="Suivi des opérations de maintenance déclarées par les propriétaires ou mécaniciens."
    >
      <Card className="bg-white shadow-sm">
        <CardHeader>
          <CardTitle>Historiques & alertes</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Tu pourras ici afficher la liste des maintenances, avec alertes :
            date prochaine vidange, pneus à changer, etc.
          </p>
        </CardContent>
      </Card>
    </AdminPageShell>
  )
}
