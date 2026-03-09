import { User, CreditCard, ShieldCheck, Mail, Phone, Lock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const SettingsView = () => {
    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
            <h2 className="text-2xl font-bold font-poppins">Mon Profil Chauffeur</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Profile Card */}
                <Card className="border-none shadow-md rounded-2xl md:col-span-1 h-fit">
                    <CardContent className="p-6 flex flex-col items-center text-center">
                        <div className="w-24 h-24 rounded-full bg-red-200 overflow-hidden mb-4 border-4 border-white shadow-sm">
                            <img src="https://i.pravatar.cc/150?u=a042581f4e29026024d" className="w-full h-full object-cover" />
                        </div>
                        <h3 className="font-bold text-lg">Haja Randria</h3>
                        <p className="text-gray-500 text-sm mb-6">haja.randria@email.com</p>
                        <div className="w-full space-y-2">
                            <Button variant="outline" className="w-full justify-start gap-3 rounded-xl"><User className="w-4 h-4"/> Informations perso</Button>
                            <Button variant="outline" className="w-full justify-start gap-3 rounded-xl"><CreditCard className="w-4 h-4"/> Détails bancaires</Button>
                            <Button variant="outline" className="w-full justify-start gap-3 rounded-xl"><Lock className="w-4 h-4"/> Modifier mot de passe</Button>
                            <Button variant="outline" className="w-full justify-start gap-3 rounded-xl"><ShieldCheck className="w-4 h-4"/> Documents</Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Forms */}
                <Card className="border-none shadow-md rounded-2xl md:col-span-2">
                    <CardHeader>
                        <CardTitle>Informations de Contact</CardTitle>
                        <CardDescription>Mettez à jour vos coordonnées principales.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Prénom</label>
                                <Input defaultValue="Haja" className="rounded-xl" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Nom</label>
                                <Input defaultValue="Randria" className="rounded-xl" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium flex items-center gap-2"><Mail className="w-4 h-4 text-gray-400"/> Email</label>
                            <Input defaultValue="haja.randria@email.com" className="rounded-xl" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium flex items-center gap-2"><Phone className="w-4 h-4 text-gray-400"/> Téléphone</label>
                            <Input defaultValue="+261 33 99 999 99" className="rounded-xl" />
                        </div>
                        <div className="pt-4 flex justify-end">
                            <Button className="bg-red-600 hover:bg-red-700 text-white rounded-xl">Sauvegarder</Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default SettingsView;