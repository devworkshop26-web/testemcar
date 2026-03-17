// src/pages/admin/vehicles/AdminVehicleCertificationsPage.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AdminPageShell } from "@/components/admin/AdminPageShell"

export function AdminVehicleCertificationsPage() {
  return (
    <AdminPageShell
      title="Certifications véhicules"
      description="Valider les contrôles techniques et badges certifiés."
      actions={<Button>Voir les règles de certification</Button>}
    >
      <Card className="bg-white shadow-sm">
        <CardHeader>
          <CardTitle>En attente de validation</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Véhicule</TableHead>
                <TableHead>Propriétaire</TableHead>
                <TableHead>Inspection</TableHead>
                <TableHead>Statut</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Dacia Duster 2019</TableCell>
                <TableCell>Tiana</TableCell>
                <TableCell>Contrôle technique OK</TableCell>
                <TableCell>
                  <Badge variant="outline">À examiner</Badge>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </AdminPageShell>
  )
}
