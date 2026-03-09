import { Briefcase, BarChart3, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

export const B2BSection = () => {
  return (
    <section className="pb-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">

        <div className="mt-12 bg-white border border-gray-200 shadow-xl p-10 rounded-3xl flex flex-col md:flex-row items-center gap-10 relative">

          {/* Icône principale */}
          <div className="p-5 bg-primary-50 rounded-2xl border border-primary-200">
            <Briefcase size={48} className="text-primary-600" />
          </div>

          {/* Texte */}
          <div className="flex-1">
            <h3 className="text-3xl font-extrabold text-black mb-3">
              Offre B2B & Gestion de Flotte
            </h3>

            <p className="text-gray-700 mb-6 text-lg">
              Vous gérez plus de 5 véhicules ? Passez au Dashboard Pro.
            </p>

            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-base text-black">
              {[
                "Facturation centralisée",
                "Suivi de maintenance",
                "Rotation optimisée",
                "Manager dédié",
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3">
                  <CheckCircle size={18} className="text-green-600" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Bouton */}
          <Link
            to="/prestataire/dashboard"
            className="bg-green-600 text-white hover:bg-primary-500 px-7 py-4 rounded-xl font-semibold shadow-md transition flex items-center gap-2"
          >
            <BarChart3 size={20} />
            Espace Gestionnaire
          </Link>
        </div>

      </div>
    </section>
  );
};
