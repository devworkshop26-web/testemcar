import { AlertTriangle, XCircle, ShieldCheck, CheckCircle } from "lucide-react";

export const ComparisonSection = () => {
  return (
    <section id="comparison" className="py-24 bg-gray-50 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center mb-16">
          <h2 className="text-4xl font-black text-secondary-900 mb-4">
            Le choix vous appartient
          </h2>
          <p className="text-xl text-gray-500">
            Deux manières de louer, deux résultats très différents.
          </p>
        </div>

        <div className="grid md:grid-cols-2 rounded-[3rem] overflow-hidden shadow-2xl">

          {/* INFORMEL */}
          <div className="bg-secondary-900 text-white p-12 relative">
            {/* BACKGROUND IMAGE NETTE */}
<div 
  className="
    absolute inset-0 
    bg-[url('https://images.unsplash.com/photo-1487754180451-c456f719a1fc?auto=format&fit=crop&q=80&w=1600')] 
    bg-cover bg-center 
    scale-110
  "
/>

{/* OVERLAY NET + TEXTE CLAIR */}
<div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" />

            <div className="relative z-10">
              <div className="w-16 h-16 bg-red-500/20 border border-red-500/30 rounded-2xl flex items-center justify-center mb-8">
                <AlertTriangle size={32} className="text-red-500" />
              </div>

              <h3 className="text-3xl font-bold mb-2">Le Marché Informel</h3>
              <p className="text-red-300 text-xs font-bold uppercase mb-8">
                Facebook, Leboncoin…
              </p>

              <ul className="space-y-6 text-sm">
                {[
                  ["Abandon Client / Prestataire", "Le prestataire ne vient pas ou le client disparaît."],
                  ["Véhicule Non Conforme", "État déplorable, fausse déclaration."],
                  ["Double Location", "Le véhicule est loué à un plus offrant."],
                  ["Papiers Expirés", "Assurance invalide ou visite technique expirée."],
                  ["Arnaque à l'Avance", "Vous payez, le propriétaire ne vient jamais."],
                  ["Fuite après Accident", "Aucune assurance, aucun recours."],
                ].map(([title, desc], i) => (
                  <li key={i} className="flex items-start gap-4">
                    <XCircle className="text-red-500 mt-1" size={24} />
                    <div>
                      <strong className="block text-white mb-1">{title}</strong>
                      <p className="text-gray-400">{desc}</p>
                    </div>
                  </li>
                ))}
              </ul>

            </div>
          </div>

          {/* MCAR */}
          <div className="bg-white p-12 relative">
            <div className="relative z-10">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-8">
                <ShieldCheck size={32} className="text-primary-600" />
              </div>

              <h3 className="text-3xl font-bold mb-2">La Protection Mcar</h3>
              <p className="text-primary-600 font-bold text-xs uppercase mb-8">
                Tiers de Confiance
              </p>

              <ul className="space-y-8 text-sm">
                {[
                  ["Propriétaires Vérifiés (KYC)", "CIN, carte grise et état du véhicule vérifiés."],
                  ["Paiement Sécurisé", "Séquestre jusqu'à la remise des clés."],
                  ["Assurances à la Carte", "Choisissez votre niveau de protection."],
                ].map(([title, desc], i) => (
                  <li key={i} className="flex items-start gap-4">
                    <CheckCircle className="text-green-500 mt-1" size={24} />
                    <div>
                      <strong className="block text-gray-900 mb-1">{title}</strong>
                      <p className="text-gray-500">{desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
