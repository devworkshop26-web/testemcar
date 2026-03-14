// src/pages/admin/AdminPaymentsPage.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AdminPageShell } from "@/components/admin/AdminPageShell"

export function AdminPaymentsPage() {
  return (
    <AdminPageShell
      title="Paiements & reversements"
      description="Suivi des transactions, commissions et reversements prestataires."
      actions={<Button variant="outline">Exporter les transactions</Button>}
    >
      <Card className="w-full rounded-xl bg-white shadow-sm">
        <CardHeader className="space-y-1">
          <CardTitle className="text-base sm:text-lg">Transactions récentes</CardTitle>
          <p className="text-sm text-muted-foreground">
            Vue détaillée des paiements clients et reversements prestataires.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3 sm:hidden">
            {[1, 2].map((item) => (
              <div
                key={item}
                className="rounded-xl border border-muted-foreground/10 bg-muted/30 p-4 shadow-sm"
              >
                <div className="flex flex-col gap-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-foreground">#R-2025-0{item}</p>
                    <Badge className={item === 1 ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}>
                      {item === 1 ? "Validé" : "En attente"}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">Montant : {item === 1 ? "250 000" : "310 000"} Ar</p>
                  <p className="text-sm text-muted-foreground">
                    Méthode : {item === 1 ? "Mobile Money" : "Carte bancaire"}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="hidden overflow-x-auto sm:block">
            <Table className="min-w-full text-sm">
              <TableHeader>
                <TableRow>
                  <TableHead className="whitespace-nowrap">Réservation</TableHead>
                  <TableHead className="whitespace-nowrap">Montant</TableHead>
                  <TableHead className="whitespace-nowrap">Méthode</TableHead>
                  <TableHead className="whitespace-nowrap">Statut</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow className="hover:bg-muted/40">
                  <TableCell className="whitespace-nowrap">#R-2025-01</TableCell>
                  <TableCell className="whitespace-nowrap">250 000 Ar</TableCell>
                  <TableCell className="whitespace-nowrap">Mobile Money</TableCell>
                  <TableCell className="whitespace-nowrap">
                    <Badge className="bg-emerald-100 text-emerald-700">Validé</Badge>
                  </TableCell>
                </TableRow>
                <TableRow className="hover:bg-muted/40">
                  <TableCell className="whitespace-nowrap">#R-2025-02</TableCell>
                  <TableCell className="whitespace-nowrap">310 000 Ar</TableCell>
                  <TableCell className="whitespace-nowrap">Carte bancaire</TableCell>
                  <TableCell className="whitespace-nowrap">
                    <Badge className="bg-amber-100 text-amber-700">En attente</Badge>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </AdminPageShell>
  )
}
