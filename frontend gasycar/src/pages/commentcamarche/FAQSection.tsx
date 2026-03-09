import { Car, Wallet, Key } from "lucide-react";
import { FaqItem } from "./FaqItem";

export const FAQSection = () => {
    return (
        <section className="py-24 bg-gray-50">
            <div className="max-w-7xl mx-auto px-6">

                <div className="flex flex-col lg:flex-row gap-12 items-start">

                    <div className="lg:w-2/3">
                        <h2 className="text-3xl font-black mb-8">FAQ (Foire Aux Questions)</h2>

                        {/* LOCATAIRES */}
                        <div className="mb-8">
                            <h3 className="text-lg font-bold text-primary-600 flex items-center gap-2 mb-4">
                                <Car size={18}/> Pour les Locataires
                            </h3>

                            <FaqItem 
                                question="Quels documents sont nécessaires pour louer ?" 
                                answer="Permis + CIN/Passeport vérifiés par notre équipe KYC."
                            />
                            <FaqItem 
                                question="Y a-t-il une limite de kilométrage ?" 
                                answer="En général 200km/jour, au-delà un supplément peut s'appliquer."
                            />
                        </div>

                        {/* PROPRIÉTAIRES */}
                        <div className="mb-8">
                            <h3 className="text-lg font-bold text-primary-600 flex items-center gap-2 mb-4">
                                <Key size={18}/> Pour les Propriétaires
                            </h3>

                            <FaqItem 
                                question="Combien coûte l'inscription sur Mcar ?" 
                                answer="100% gratuit. Commission uniquement sur les locations confirmées."
                            />
                        </div>

                        {/* PAIEMENT */}
                        <div>
                            <h3 className="text-lg font-bold text-primary-600 flex items-center gap-2 mb-4">
                                <Wallet size={18}/> Paiement & Caution
                            </h3>

                            <FaqItem 
                                question="Comment fonctionne la caution ?" 
                                answer="Empreinte bancaire ou chèque remis au propriétaire."
                            />
                        </div>
                    </div>

                </div>

            </div>
        </section>
    );
};
