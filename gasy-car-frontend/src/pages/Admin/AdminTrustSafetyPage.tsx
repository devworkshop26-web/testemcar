// src/pages/admin/AdminTrustSafetyPage.tsx
import { AdminPageShell } from "@/components/admin/AdminPageShell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function AdminTrustSafetyPage() {
  return (
    <AdminPageShell
      title="Confiance & sécurité"
      description="Processus de vérification, signalisations et politiques de sécurité."
    >
      <Card className="bg-white shadow-sm">
        <CardHeader>
          <CardTitle>Politiques de vérification</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Décris ici les règles : vérification CIN, badge certifié, seuils de
            blocage en cas d’avis négatifs, etc.
          </p>
        </CardContent>
      </Card>
    </AdminPageShell>
  )
}
