import { AlertOctagon, ArrowRight, ShieldCheck, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";

export const HeroSection = () => {
  const scrollToRisks = () => {
    const section = document.getElementById("comparison");
    section?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-[88vh] w-full flex items-center justify-center overflow-hidden">
      <img
        src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=1920"
        className="absolute inset-0 w-full h-full object-cover scale-105"
        alt="Madagascar Road Trip"
      />

      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/35" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0D1B2A]/70 via-transparent to-transparent" />

      <div className="absolute -top-24 -left-16 w-72 h-72 bg-emerald-500/20 blur-3xl rounded-full animate-pulse" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-sky-500/20 blur-3xl rounded-full animate-pulse" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-20">
        <div className="max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/15 backdrop-blur-md px-4 py-2 rounded-full mb-6 shadow-lg">
            {/* <AlertOctagon size={18} className="text-red-400" /> */}
            <span className="font-semibold text-xs sm:text-sm tracking-wide uppercase text-white/95">
              Stop aux arnaques sur Facebook
            </span>
          </div>

          <h1 className="text-white text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black tracking-tight leading-[1.05] mb-6">
            Votre sécurité n&apos;est pas
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-sky-300 to-blue-400">
              une option.
            </span>
          </h1>

          <p className="text-base sm:text-lg lg:text-xl text-white/80 max-w-3xl leading-relaxed mb-8">
            Louer une voiture à Madagascar peut vite devenir risqué :
            épaves, fausse assurance, acompte perdu, véhicule non conforme.
            <strong className="text-white font-semibold">
              {" "}
              Avec Mcar, vous choisissez une expérience plus fiable, plus claire et plus sereine.
            </strong>
          </p>

          <div className="flex flex-wrap gap-3 sm:gap-4 mb-8">
            <Link
              to="/allcars"
              className="group inline-flex items-center justify-center gap-2 px-7 sm:px-8 py-3.5 sm:py-4 rounded-full bg-white text-[#0D1B2A] font-semibold text-sm sm:text-base shadow-xl hover:bg-slate-100 hover:scale-[1.02] transition-all duration-300"
            >
              Trouver un véhicule sûr
              <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>

            <button
              onClick={scrollToRisks}
              className="inline-flex items-center justify-center px-7 sm:px-8 py-3.5 sm:py-4 rounded-full border border-white/20 bg-white/10 text-white font-semibold text-sm sm:text-base backdrop-blur-md hover:bg-white/15 hover:scale-[1.02] transition-all duration-300"
            >
              Comprendre les risques
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 text-white/85 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-300" />
              <span className="text-sm sm:text-base">Véhicules vérifiés</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-300" />
              <span className="text-sm sm:text-base">Paiement plus sécurisé</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-300" />
              <span className="text-sm sm:text-base">Support local disponible</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};