// src/pages/admin/AdminSettingsPage.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AdminPageShell } from "@/components/admin/AdminPageShell"
import { useNavigate } from "react-router-dom"
import { accessTokenKey, refreshTokenKey } from "@/helper/InstanceAxios"

export function AdminSettingsPage() {
  const navigate = useNavigate()

  const handleLogout = () => {
    // Supprimer les tokens
    localStorage.removeItem(accessTokenKey)
    localStorage.removeItem(refreshTokenKey)

    // Redirection vers login
    navigate("/login")
  }

  return (
    <AdminPageShell
      title="Configuration du compte administrateur"
      description="Gérez les options de votre compte administrateur."
    >
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
    </AdminPageShell>
  )
}
