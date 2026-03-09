import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Driver, CreateDriverPayload } from "@/Actions/driverApi";

// Form State Interface
export interface DriverFormState extends Omit<CreateDriverPayload, 'profile_photo' | 'license_photo' | 'cin_recto' | 'cin_verso' | 'residence_certificate'> {
    profile_photo?: File | string | null;
    license_photo?: File | string | null;
    cin_recto?: File | string | null;
    cin_verso?: File | string | null;
    residence_certificate?: File | string | null;
}

interface DriverFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: FormData) => Promise<void>;
    initialData: Driver | null;
    isLoading: boolean;
}

const DriverForm = ({ isOpen, onClose, onSubmit, initialData, isLoading }: DriverFormProps) => {
    const [formData, setFormData] = useState<DriverFormState>({
        first_name: "",
        last_name: "",
        phone_number: "",
        experience_years: 0,
        is_available: true,
        address: "",
        city: "",
        nationality: "",
        cin_number: "",
        license_number: "",
        license_category: "",
        license_issued_date: "",
        license_expiry_date: "",
        profile_photo: null,
        license_photo: null,
        cin_recto: null,
        cin_verso: null,
        residence_certificate: null,
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                first_name: initialData.first_name,
                last_name: initialData.last_name,
                phone_number: initialData.phone_number,
                experience_years: initialData.experience_years,
                is_available: initialData.is_available,
                address: initialData.address || "",
                city: initialData.city || "",
                nationality: initialData.nationality || "",
                cin_number: initialData.cin_number || "",
                license_number: initialData.license_number || "",
                license_category: initialData.license_category || "",
                license_issued_date: initialData.license_issued_date || "",
                license_expiry_date: initialData.license_expiry_date || "",
                // Keep existing URLs or reset
                profile_photo: initialData.profile_photo || null,
                license_photo: initialData.license_photo || null,
                cin_recto: initialData.cin_recto || null,
                cin_verso: initialData.cin_verso || null,
                residence_certificate: initialData.residence_certificate || null,
            });
        } else {
            // Reset form
            setFormData({
                first_name: "",
                last_name: "",
                phone_number: "",
                experience_years: 0,
                is_available: true,
                address: "",
                city: "",
                nationality: "",
                cin_number: "",
                license_number: "",
                license_category: "",
                license_issued_date: "",
                license_expiry_date: "",
                profile_photo: null,
                license_photo: null,
                cin_recto: null,
                cin_verso: null,
                residence_certificate: null,
            });
        }
    }, [initialData, isOpen]);

    const handleFileChange = (field: keyof DriverFormState, file: File | null) => {
        setFormData(prev => ({ ...prev, [field]: file }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const data = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            if (value instanceof File) {
                data.append(key, value);
            } else if (value !== null && value !== undefined && value !== "" && typeof value !== 'object') {
                // For existing URLs (strings), we don't send them back as 'file' usually.
                // Ideally Backend should ignore missing files and keep old ones.
                // We send primitive fields always.
                data.append(key, String(value));
            }
        });

        await onSubmit(data);
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{initialData ? "Modifier le chauffeur" : "Ajouter un chauffeur"}</DialogTitle>
                    <DialogDescription>
                        Remplissez les informations ci-dessous.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="photo">Photo de profil</Label>
                        <Input
                            id="photo"
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileChange("profile_photo", e.target.files ? e.target.files[0] : null)}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="first_name">Prénom *</Label>
                            <Input
                                id="first_name"
                                required
                                value={formData.first_name}
                                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="last_name">Nom *</Label>
                            <Input
                                id="last_name"
                                required
                                value={formData.last_name}
                                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="phone">Téléphone *</Label>
                            <Input
                                id="phone"
                                required
                                value={formData.phone_number}
                                onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="exp">Expérience (ans)</Label>
                            <Input
                                id="exp"
                                type="number"
                                min="0"
                                value={formData.experience_years}
                                onChange={(e) => setFormData({ ...formData, experience_years: parseInt(e.target.value) || 0 })}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="address">Adresse</Label>
                        <Input
                            id="address"
                            value={formData.address || ""}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="city">Ville</Label>
                            <Input
                                id="city"
                                value={formData.city || ""}
                                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="nationality">Nationalité</Label>
                            <Input
                                id="nationality"
                                value={formData.nationality || ""}
                                onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Section Permis */}
                    <div className="border-t pt-4 mt-4">
                        <h3 className="text-sm font-medium mb-3 text-gray-900">Information Permis</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="license_number">Numéro Permis</Label>
                                <Input
                                    id="license_number"
                                    value={formData.license_number || ""}
                                    onChange={(e) => setFormData({ ...formData, license_number: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="license_category">Catégorie</Label>
                                <Input
                                    id="license_category"
                                    placeholder="Ex: B"
                                    value={formData.license_category || ""}
                                    onChange={(e) => setFormData({ ...formData, license_category: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mt-4">
                            <div className="space-y-2">
                                <Label htmlFor="license_issued">Délivré le</Label>
                                <Input
                                    id="license_issued"
                                    type="date"
                                    value={formData.license_issued_date || ""}
                                    onChange={(e) => setFormData({ ...formData, license_issued_date: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="license_expiry">Expire le</Label>
                                <Input
                                    id="license_expiry"
                                    type="date"
                                    value={formData.license_expiry_date || ""}
                                    onChange={(e) => setFormData({ ...formData, license_expiry_date: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="mt-4">
                            <Label htmlFor="license_photo">Scan du Permis</Label>
                            <Input
                                id="license_photo"
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleFileChange("license_photo", e.target.files ? e.target.files[0] : null)}
                            />
                        </div>
                    </div>

                    {/* Section CIN */}
                    <div className="border-t pt-4 mt-4">
                        <h3 className="text-sm font-medium mb-3 text-gray-900">Information CIN</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="cin_number">Numéro CIN</Label>
                                <Input
                                    id="cin_number"
                                    value={formData.cin_number || ""}
                                    onChange={(e) => setFormData({ ...formData, cin_number: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mt-4">
                            <div className="space-y-2">
                                <Label htmlFor="cin_recto">Recto CIN</Label>
                                <Input
                                    id="cin_recto"
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleFileChange("cin_recto", e.target.files ? e.target.files[0] : null)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="cin_verso">Verso CIN</Label>
                                <Input
                                    id="cin_verso"
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleFileChange("cin_verso", e.target.files ? e.target.files[0] : null)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Section Certificat de Résidence */}
                    <div className="border-t pt-4 mt-4">
                        <h3 className="text-sm font-medium mb-3 text-gray-900">Certificat de Résidence</h3>
                        <div className="space-y-2">
                            <Label htmlFor="residence_certificate">Document justificatif de domicile</Label>
                            <Input
                                id="residence_certificate"
                                type="file"
                                accept="image/*,application/pdf"
                                onChange={(e) => handleFileChange("residence_certificate", e.target.files ? e.target.files[0] : null)}
                            />
                            <p className="text-xs text-gray-500">Format accepté: Image ou PDF</p>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose}>Annuler</Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? "Enregistrement..." : "Enregistrer"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default DriverForm;
