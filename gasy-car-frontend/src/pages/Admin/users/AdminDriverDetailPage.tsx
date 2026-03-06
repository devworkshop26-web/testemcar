import { useParams, Link } from "react-router-dom";
import { AdminPageShell } from "@/components/admin/AdminPageShell";
import { useDriverQuery } from "@/useQuery/driverUseQuery";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, Pencil, User, Phone, MapPin, Calendar, Briefcase, CreditCard, FileText } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export function AdminDriverDetailPage() {
    const { id } = useParams<{ id: string }>();
    const { data: driver, isLoading, isError } = useDriverQuery(id || "");

    if (isLoading) {
        return (
            <AdminPageShell title="Détails du Chauffeur">
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
            </AdminPageShell>
        );
    }

    if (isError || !driver) {
        return (
            <AdminPageShell title="Erreur">
                <div className="text-center py-12">
                    <p className="text-destructive mb-4">Chauffeur non trouvé ou erreur de chargement.</p>
                    <Button asChild variant="outline">
                        <Link to="/admin/users/drivers">Retour à la liste</Link>
                    </Button>
                </div>
            </AdminPageShell>
        );
    }

    return (
        <AdminPageShell
            title={`${driver.first_name} ${driver.last_name}`}
            description="Informations détaillées du chauffeur."
        >
            <div className="mb-6">
                <Button asChild variant="ghost" size="sm" className="mb-4">
                    <Link to="/admin/users/drivers">
                        <ChevronLeft className="mr-2 h-4 w-4" /> Retour à la liste
                    </Link>
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Profile Card */}
                <Card className="lg:col-span-1">
                    <CardHeader className="text-center pb-2">
                        <div className="mx-auto w-32 h-32 rounded-full overflow-hidden bg-muted flex items-center justify-center border-4 border-white shadow-lg mb-4">
                            {driver.profile_photo ? (
                                <img src={driver.profile_photo} alt={`${driver.first_name}`} className="w-full h-full object-cover" />
                            ) : (
                                <User className="w-16 h-16 text-muted-foreground" />
                            )}
                        </div>
                        <CardTitle className="text-2xl">{driver.first_name} {driver.last_name}</CardTitle>
                        <div className="flex justify-center mt-2">
                            {driver.is_available ? (
                                <Badge className="bg-emerald-100 text-emerald-700">Disponible</Badge>
                            ) : (
                                <Badge variant="secondary">Occupé</Badge>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-4">
                        <div className="flex items-center gap-3 text-sm">
                            <Phone className="h-4 w-4 text-primary" />
                            <span>{driver.phone_number}</span>
                        </div>
                        {driver.secondary_phone && (
                            <div className="flex items-center gap-3 text-sm text-muted-foreground ml-7">
                                <span>{driver.secondary_phone} (Sec.)</span>
                            </div>
                        )}
                        <div className="flex items-center gap-3 text-sm">
                            <Briefcase className="h-4 w-4 text-primary" />
                            <span>{driver.experience_years} ans d'expérience</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                            <MapPin className="h-4 w-4 text-primary" />
                            <span>{driver.address || "Non spécifié"}, {driver.city || driver.nationality}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                            <Calendar className="h-4 w-4 text-primary" />
                            <span>Né le {driver.date_of_birth ? new Date(driver.date_of_birth).toLocaleDateString() : "Inconnu"}</span>
                        </div>

                        <Separator className="my-4" />

                        <Button asChild className="w-full">
                            <Link to={`/admin/users/drivers/${driver.id}/edit`}>
                                <Pencil className="mr-2 h-4 w-4" /> Modifier le profil
                            </Link>
                        </Button>
                    </CardContent>
                </Card>

                {/* Detailed Info */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Documents Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="h-5 w-5 text-primary" />
                                Documents officiels
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Permis */}
                                <div className="space-y-3">
                                    <h4 className="font-semibold flex items-center gap-2">
                                        <CreditCard className="h-4 w-4" /> Permis de conduire
                                    </h4>
                                    <div className="bg-muted rounded-lg p-3 text-sm space-y-1">
                                        <p><span className="text-muted-foreground">Numéro:</span> {driver.license_number || "N/A"}</p>
                                        <p><span className="text-muted-foreground">Catégorie:</span> {driver.license_category || "N/A"}</p>
                                        <p><span className="text-muted-foreground">Expiration:</span> {driver.license_expiry_date ? new Date(driver.license_expiry_date).toLocaleDateString() : "N/A"}</p>
                                    </div>
                                    {driver.license_photo && (
                                        <div className="mt-2 aspect-video rounded-md overflow-hidden border">
                                            <img src={driver.license_photo} alt="Permis" className="w-full h-full object-cover cursor-pointer hover:opacity-90" onClick={() => window.open(driver.license_photo!, '_blank')} />
                                        </div>
                                    )}
                                </div>

                                {/* CIN */}
                                <div className="space-y-3">
                                    <h4 className="font-semibold flex items-center gap-2">
                                        <User className="h-4 w-4" /> Carte d'Identité (CIN)
                                    </h4>
                                    <div className="bg-muted rounded-lg p-3 text-sm space-y-1">
                                        <p><span className="text-muted-foreground">Numéro CIN:</span> {driver.cin_number || "N/A"}</p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 mt-2">
                                        {driver.cin_recto ? (
                                            <div className="aspect-video rounded-md overflow-hidden border">
                                                <img src={driver.cin_recto} alt="CIN Recto" className="w-full h-full object-cover cursor-pointer" onClick={() => window.open(driver.cin_recto!, '_blank')} />
                                            </div>
                                        ) : <div className="aspect-video rounded-md bg-muted flex items-center justify-center text-xs text-muted-foreground">Recto non dispo</div>}

                                        {driver.cin_verso ? (
                                            <div className="aspect-video rounded-md overflow-hidden border">
                                                <img src={driver.cin_verso} alt="CIN Verso" className="w-full h-full object-cover cursor-pointer" onClick={() => window.open(driver.cin_verso!, '_blank')} />
                                            </div>
                                        ) : <div className="aspect-video rounded-md bg-muted flex items-center justify-center text-xs text-muted-foreground">Verso non dispo</div>}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Additional Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Autres informations</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="text-muted-foreground">Propriétaire / Prestataire</p>
                                    <p className="font-medium">{driver.owner_name || "Admin Pool"}</p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground">Inscrit le</p>
                                    <p className="font-medium">{new Date(driver.created_at).toLocaleString()}</p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground">Dernière mise à jour</p>
                                    <p className="font-medium">{new Date(driver.updated_at).toLocaleString()}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AdminPageShell>
    );
}
