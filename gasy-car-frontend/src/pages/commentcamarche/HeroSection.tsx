import { AlertOctagon, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export const HeroSection = () => {

  const scrollToRisks = () => {
    const section = document.getElementById("comparison");
    section?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="relative h-screen w-full flex items-center justify-center overflow-hidden">

      <img
        src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=1920"
        className="absolute inset-0 w-full h-full object-cover scale-105"
        alt="Madagascar Road Trip"
      />

      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-black/80"></div>

      <div className="relative z-10 px-6 text-center text-white max-w-5xl mx-auto flex flex-col items-center">

        <div className="inline-flex items-center gap-2 bg-red-600/20 border border-red-500/50 backdrop-blur-md px-4 py-2 rounded-full mb-8 animate-pulse">
          <AlertOctagon size={18} className="text-red-500" />
          <span className="font-bold text-sm tracking-wide uppercase">Stop aux arnaques sur Facebook</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-black mb-8 leading-tight">
          Votre sécurité n'est pas <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
            une option.
          </span>
        </h1>

        <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl">
          Louer une voiture à Madagascar peut être un cauchemar : épaves, vol d'acompte, fausses assurances.  
          <strong className="text-white font-bold"> Ne jouez pas avec votre voyage. Choisissez Mcar.</strong>
        </p>

        <div className="flex flex-col sm:flex-row gap-6">
  
  {/* Bouton principal – même style que "Comprendre les risques" mais version premium */}
  <Link
    to="/allcars"
    className="
      px-8 py-4 
      rounded-full 
      font-bold text-lg 
      flex items-center justify-center gap-2 
      border border-white/30 
      bg-white/10 
      text-white
      backdrop-blur-md
      hover:bg-white/20 
      hover:scale-105 
      transition-all duration-300
    "
  >
    Trouver un véhicule sûr 
    <ArrowRight size={20} />
  </Link>

  {/* Bouton secondaire */}
  <button
    onClick={scrollToRisks}
    className="
      px-8 py-4 
      rounded-full 
      font-bold text-lg 
      flex items-center justify-center 
      border border-white/20 
      bg-white/10 
      text-white
      backdrop-blur-md
      hover:bg-white/20 
      hover:scale-105 
      transition-all duration-300
    "
  >
    Comprendre les risques
  </button>

</div>


      </div>
    </div>
  );
};
