import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { AdminPageShell } from "@/components/admin/AdminPageShell";
import { useDriverQuery, useUpdateDriverMutation } from "@/useQuery/driverUseQuery";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronLeft, Save, Loader2, Upload, X, User } from "lucide-react";
import { toast } from "sonner";

export function AdminDriverEditPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { data: driver, isLoading } = useDriverQuery(id || "");
    const updateMutation = useUpdateDriverMutation();

    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        experience_years: 0,
        is_available: true,
        phone_number: "",
        secondary_phone: "",
        address: "",
        city: "",
        license_number: "",
        license_category: "",
        cin_number: "",
    });

    const [files, setFiles] = useState<{
        profile_photo?: File;
        license_photo?: File;
        cin_recto?: File;
        cin_verso?: File;
    }>({});

    const [previews, setPreviews] = useState<{
        profile_photo?: string;
        license_photo?: string;
        cin_recto?: string;
        cin_verso?: string;
    }>({});

    useEffect(() => {
        if (driver) {
            setFormData({
                first_name: driver.first_name || "",
                last_name: driver.last_name || "",
                experience_years: driver.experience_years || 0,
                is_available: driver.is_available ?? true,
                phone_number: driver.phone_number || "",
                secondary_phone: driver.secondary_phone || "",
                address: driver.address || "",
                city: driver.city || "",
                license_number: driver.license_number || "",
                license_category: driver.license_category || "",
                cin_number: driver.cin_number || "",
            });

            setPreviews({
                profile_photo: driver.profile_photo || undefined,
                license_photo: driver.license_photo || undefined,
                cin_recto: driver.cin_recto || undefined,
                cin_verso: driver.cin_verso || undefined,
            });
        }
    }, [driver]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : type === "number" ? parseInt(value) || 0 : value,
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof typeof files) => {
        const file = e.target.files?.[0];
        if (file) {
            setFiles((prev) => ({ ...prev, [field]: file }));
            setPreviews((prev) => ({ ...prev, [field]: URL.createObjectURL(file) }));
        }
    };

    const removeFile = (field: keyof typeof files) => {
        setFiles((prev) => {
            const newFiles = { ...prev };
            delete newFiles[field];
            return newFiles;
        });
        // For previews, we only remove if it's a new file. 
        // If it's an existing file from server, we should probably handle deletion logic if needed,
        // but here we'll just stop showing it for now if replaced.
        // Actually, let's just reset to empty if it was a new upload.
        if (files[field]) {
            setPreviews(prev => ({ ...prev, [field]: undefined }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!id) return;

        try {
            const data = new FormData();
            Object.entries(formData).forEach(([key, value]) => {
                data.append(key, String(value));
            });

            Object.entries(files).forEach(([key, file]) => {
                if (file) data.append(key, file);
            });

            await updateMutation.mutateAsync({ id, payload: data });
            toast.success("Chauffeur mis à jour avec succès");
            navigate(`/admin/users/drivers/${id}`);
        } catch (error) {
            toast.error("Erreur lors de la mise à jour");
        }
    };

    if (isLoading) return <div className="p-8 text-center">Chargement...</div>;

    return (
        <AdminPageShell
            title="Modifier le Chauffeur"
            description={`Édition du profil de ${driver?.first_name} ${driver?.last_name}`}
        >
            <div className="mb-6">
                <Button asChild variant="ghost" size="sm">
                    <Link to={`/admin/users/drivers/${id}`}>
                        <ChevronLeft className="mr-2 h-4 w-4" /> Retour aux détails
                    </Link>
                </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Informations Personnelles */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Informations Personnelles</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="first_name">Prénom</Label>
                                    <Input id="first_name" name="first_name" value={formData.first_name} onChange={handleInputChange} required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="last_name">Nom</Label>
                                    <Input id="last_name" name="last_name" value={formData.last_name} onChange={handleInputChange} required />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="phone_number">Téléphone</Label>
                                <Input id="phone_number" name="phone_number" value={formData.phone_number} onChange={handleInputChange} required />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="experience_years">Expérience (années)</Label>
                                <Input id="experience_years" name="experience_years" type="number" value={formData.experience_years} onChange={handleInputChange} required />
                            </div>

                            <div className="flex items-center space-x-2 pt-2">
                                <Checkbox
                                    id="is_available"
                                    checked={formData.is_available}
                                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_available: !!checked }))}
                                />
                                <Label htmlFor="is_available">Disponible pour de nouvelles missions</Label>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Documents & Photos */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Documents & Photos</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Profile Photo */}
                            <div className="space-y-2">
                                <Label>Photo de profil</Label>
                                <div className="flex items-center gap-4">
                                    <div className="h-16 w-16 rounded-full overflow-hidden bg-muted border">
                                        {previews.profile_photo ? (
                                            <img src={previews.profile_photo} alt="Profil" className="w-full h-full object-cover" />
                                        ) : (
                                            <User className="w-8 h-8 m-auto text-muted-foreground" />
                                        )}
                                    </div>
                                    <Input type="file" accept="image/*" className="hidden" id="profile_up" onChange={(e) => handleFileChange(e, "profile_photo")} />
                                    <Button type="button" variant="outline" size="sm" onClick={() => document.getElementById("profile_up")?.click()}>
                                        <Upload className="mr-2 h-4 w-4" /> Changer
                                    </Button>
                                </div>
                            </div>

                            <Separator />

                            {/* License */}
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="license_number">N° Permis</Label>
                                        <Input id="license_number" name="license_number" value={formData.license_number} onChange={handleInputChange} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="license_category">Catégorie</Label>
                                        <Input id="license_category" name="license_category" value={formData.license_category} onChange={handleInputChange} placeholder="Ex: B, C" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Photo du permis</Label>
                                    <Input type="file" accept="image/*" onChange={(e) => handleFileChange(e, "license_photo")} />
                                </div>
                            </div>

                            <Separator />

                            {/* CIN */}
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="cin_number">N° CIN</Label>
                                    <Input id="cin_number" name="cin_number" value={formData.cin_number} onChange={handleInputChange} />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>CIN Recto</Label>
                                        <Input type="file" accept="image/*" onChange={(e) => handleFileChange(e, "cin_recto")} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>CIN Verso</Label>
                                        <Input type="file" accept="image/*" onChange={(e) => handleFileChange(e, "cin_verso")} />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="flex justify-end gap-4">
                    <Button type="button" variant="outline" onClick={() => navigate(-1)}>Annuler</Button>
                    <Button type="submit" disabled={updateMutation.isPending} className="bg-green-600 hover:bg-green-700">
                        {updateMutation.isPending ? (
                            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Enregistrement...</>
                        ) : (
                            <><Save className="mr-2 h-4 w-4" /> Enregistrer les modifications</>
                        )}
                    </Button>
                </div>
            </form>
        </AdminPageShell>
    );
}

const Separator = () => <div className="h-px bg-border my-2" />;
