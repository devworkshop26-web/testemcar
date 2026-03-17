import { Briefcase, BarChart3, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

export const B2BSection = () => {
  return (
    <section className="py-14 sm:py-16 bg-slate-50/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="rounded-[2rem] border border-slate-200 bg-white shadow-xl p-6 sm:p-8 lg:p-10 flex flex-col lg:flex-row items-start lg:items-center gap-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-3xl rounded-full" />

          <div className="relative z-10 w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-primary/10 border border-primary/20 flex items-center justify-center shadow-sm">
            <Briefcase size={38} className="text-primary" />
          </div>

          <div className="relative z-10 flex-1">
            <span className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
              Solution professionnelle
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-2 mb-3 tracking-tight">
              Offre B2B & gestion de flotte
            </h3>

            <p className="text-slate-600 mb-6 text-base sm:text-lg max-w-2xl leading-relaxed">
              Vous gérez plusieurs véhicules ? Passez à un espace pensé pour les professionnels et gagnez en clarté au quotidien.
            </p>

            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm sm:text-base text-slate-800">
              {[
                "Facturation centralisée",
                "Suivi de maintenance",
                "Rotation optimisée",
                "Manager dédié",
              ].map((item, i) => (
                <li
                  key={i}
                  className="flex items-center gap-3 rounded-xl bg-slate-50 border border-slate-200 px-4 py-3"
                >
                  <CheckCircle size={18} className="text-emerald-600 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <Link
            to="/prestataire/dashboard"
            className="relative z-10 inline-flex items-center gap-2 rounded-full bg-primary text-white px-6 py-3.5 font-semibold shadow-lg hover:bg-primary/90 hover:scale-[1.02] transition-all duration-300"
          >
            <BarChart3 size={18} />
            Espace gestionnaire
          </Link>
        </div>
      </div>
    </section>
  );
};