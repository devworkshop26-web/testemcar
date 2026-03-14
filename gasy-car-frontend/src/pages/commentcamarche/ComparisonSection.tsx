import { AlertTriangle, XCircle, ShieldCheck, CheckCircle } from "lucide-react";

export const ComparisonSection = () => {
  return (
    <section id="comparison" className="py-14 sm:py-16 lg:py-20 scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="text-center mb-10 sm:mb-12">
          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            Comparaison claire
          </span>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 mt-2 mb-3">
            Le choix vous appartient
          </h2>
          <p className="text-base md:text-lg text-slate-500 max-w-2xl mx-auto">
            Deux façons de louer, deux niveaux de confiance très différents.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-5">
          {/* Informel */}
          <div className="relative overflow-hidden rounded-[2rem] border border-white/10 shadow-xl min-h-full">
            <div
              className="absolute inset-0 bg-cover bg-center scale-110"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1487754180451-c456f719a1fc?auto=format&fit=crop&q=80&w=1600')",
              }}
            />
            <div className="absolute inset-0 bg-slate-950/80" />

            <div className="relative z-10 p-6 sm:p-8 lg:p-10">
              <div className="w-14 h-14 bg-red-500/15 border border-red-500/20 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                <AlertTriangle size={28} className="text-red-400" />
              </div>

              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                Le Marché Informel
              </h3>
              <p className="text-red-300 text-xs font-semibold uppercase tracking-[0.2em] mb-8">
                Facebook, petites annonces, bouche-à-oreille
              </p>

              <ul className="space-y-5">
                {[
                  ["Abandon client ou prestataire", "Le prestataire ne vient pas ou le client disparaît."],
                  ["Véhicule non conforme", "État déplorable, annonce trompeuse ou panne cachée."],
                  ["Double location", "Le véhicule est donné au plus offrant à la dernière minute."],
                  ["Papiers expirés", "Assurance invalide ou visite technique expirée."],
                  ["Arnaque à l'avance", "Vous payez un acompte et personne ne vient."],
                  ["Aucun recours après incident", "En cas de problème, tout repose sur vous."],
                ].map(([title, desc], i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 rounded-2xl bg-white/5 border border-white/10 p-4 backdrop-blur-sm hover:bg-white/[0.07] transition-colors"
                  >
                    <XCircle className="text-red-400 mt-0.5 shrink-0" size={22} />
                    <div>
                      <strong className="block text-white mb-1 text-sm sm:text-base">{title}</strong>
                      <p className="text-slate-300 text-sm leading-relaxed">{desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Mcar */}
          <div className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-xl">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-white to-sky-50" />

            <div className="relative z-10 p-6 sm:p-8 lg:p-10">
              <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                <ShieldCheck size={28} className="text-emerald-600" />
              </div>

              <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
                La Protection Mcar
              </h3>
              <p className="text-emerald-600 text-xs font-semibold uppercase tracking-[0.2em] mb-8">
                Une expérience plus encadrée
              </p>

              <ul className="space-y-5">
                {[
                  ["Propriétaires vérifiés", "CIN, carte grise et état du véhicule contrôlés avant mise en ligne."],
                  ["Paiement plus sécurisé", "Le processus de réservation est plus cadré et plus transparent."],
                  ["Documents et conformité", "Les pièces essentielles sont vérifiées avant la location."],
                  ["Annonce plus fiable", "Informations plus claires, photos et véhicule mieux présentés."],
                  ["Support local", "Une équipe peut vous guider en cas de besoin pendant la location."],
                  ["Cadre plus rassurant", "Moins d’improvisation, plus de visibilité pour le client et l’hôte."],
                ].map(([title, desc], i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 rounded-2xl bg-white border border-slate-200 p-4 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <CheckCircle className="text-emerald-500 mt-0.5 shrink-0" size={22} />
                    <div>
                      <strong className="block text-slate-900 mb-1 text-sm sm:text-base">{title}</strong>
                      <p className="text-slate-600 text-sm leading-relaxed">{desc}</p>
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