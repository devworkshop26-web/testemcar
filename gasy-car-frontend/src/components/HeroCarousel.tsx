import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { useMarketingHerosQuery } from "@/useQuery/marketingUseQuery";
import { marketingHeroData } from "@/data/heroData";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight, Sparkles } from "lucide-react"; // J'ai ajouté des icônes pour le style

export default function HeroSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const { data: apiHero, isLoading } = useMarketingHerosQuery();
  const [herodata, setHeroData] = useState(marketingHeroData);
  const [imageLoaded, setImageLoaded] = useState<Record<number, boolean>>({});
  const [imageError, setImageError] = useState<Record<number, boolean>>({});

  useEffect(() => {
    if (!isLoading && apiHero?.length) {
      setHeroData(apiHero);
      setActiveIndex(0);
    }
  }, [apiHero, isLoading]);

  const totalSlides = herodata.length;
  const currentSlide = herodata[activeIndex]

  useEffect(() => {
    herodata.forEach((slide, i) => {
      const img = new Image();
      img.src = slide.image;
      img.onload = () => setImageLoaded((p) => ({ ...p, [i]: true }));
      img.onerror = () => setImageError((p) => ({ ...p, [i]: true }));
    });
  }, [herodata]);

  const nextSlide = useCallback(() => {
    setActiveIndex((i) => (i + 1) % totalSlides);
  }, [totalSlides]);

  useEffect(() => {
    if (totalSlides <= 1) return;
    const id = setInterval(nextSlide, 8000); // 8 secondes par slide
    return () => clearInterval(id);
  }, [nextSlide, totalSlides]);

  const fallbackImage =
    "data:image/svg+xml,%3Csvg width='800' height='600' xmlns='http://www.w3.org/2000/svg'%3E%3Crect fill='%23ddd' width='800' height='600'/%3E%3Ctext x='50%25' y='50%25' font-size='26' text-anchor='middle' fill='%23777'%3EImage indisponible%3C/text%3E%3C/svg%3E";

  if (isLoading) {
    return (
      <div className="relative overflow-hidden min-h-[600px] w-full flex items-center bg-slate-900 px-6">
        <div className="container mx-auto">
          <Skeleton className="h-12 w-3/4 mb-4 bg-slate-800" />
          <Skeleton className="h-6 w-1/2 bg-slate-800" />
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full overflow-hidden min-h-[650px] md:min-h-[750px] lg:min-h-[89vh] flex items-center bg-black">

      {/* ================= BACKGROUND IMAGE & ANIMATION ================= */}
      <div key={activeIndex} className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-black/20 z-10" /> {/* Overlay global subtil */}
        <img
          src={imageError[activeIndex] ? fallbackImage : currentSlide.image}
          className="w-full h-full object-cover animate-in fade-in zoom-in-105 [animation-duration:2000ms] ease-out fill-mode-forwards"
          style={{
            animationName: 'subtleZoom',
            animationDuration: '10s',
            animationFillMode: 'forwards',
            animationTimingFunction: 'ease-out'
          }}
          alt="Hero background"
        />
        {/* Style inline pour l'animation custom si Tailwind config n'a pas de keyframes complexes */}
        <style>{`
          @keyframes subtleZoom {
            from { transform: scale(1); filter: brightness(0.8); }
            to { transform: scale(1.1); filter: brightness(1); }
          }
        `}</style>
      </div>

      {/* ================= GRADIENT OVERLAYS ================= */}
      {/* Dégradé principal gauche -> droite */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-r from-black/90 via-black/50 to-transparent"></div>

      {/* Dégradé bas -> haut pour la lisibilité sur mobile */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-t from-black/80 via-transparent to-transparent md:hidden"></div>


      {/* ================= CONTENT BLOCK ================= */}
      <div className="relative z-[10] container mx-auto px-4 sm:px-6 lg:px-12 w-full h-full flex flex-col justify-center sm:mt-10">

        {/* Utilisation de key={activeIndex} pour relancer l'animation du texte à chaque slide */}
        <div key={activeIndex} className="max-w-3xl space-y-8 animate-in slide-in-from-bottom-5 fade-in duration-700">

          {/* BADGE / SUBTITLE */}
          {currentSlide.subtitle && (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 bg-white/10 backdrop-blur-md text-sm font-medium text-emerald-300 shadow-lg animate-in slide-in-from-left-5 fade-in duration-700 delay-100">
              <Sparkles className="w-3.5 h-3.5" />
              <span className="uppercase tracking-wider text-xs font-bold">{currentSlide.subtitle}</span>
            </div>
          )}

          {/* TITRE PRINCIPAL */}
          <h1 className="font-bold leading-[1.1] text-white tracking-tight text-5xl sm:text-4xl lg:text-[3rem] drop-shadow-lg">
            {currentSlide.titre}
          </h1>

          {/* DESCRIPTION */}
          <p className="text-lg sm:text-xl md:text-[1.rem] text-slate-200 max-w-2xl leading-relaxed font-light opacity-90 animate-in slide-in-from-bottom-3 fade-in duration-700 delay-200">
            {currentSlide.description}
          </p>

          {/* ACTION BUTTONS */}
          <div className="flex flex-wrap gap-4 pt-4 animate-in slide-in-from-bottom-3 fade-in duration-700 delay-300">
            <Link

              to={currentSlide.link || "/allcars"}
              
              className="group relative inline-flex items-center justify-center px-8 py-4 text-base font-medium font-poppins text-white transition-all duration-200 bg-emerald-600 rounded-full hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-600 shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] active:scale-95"

//               to={currentSlide.link || "/cars"}
//               className="group relative inline-flex items-center justify-center px-8 py-4 text-base font-medium font-poppins text-white transition-all duration-200 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-95 btn-gradient-premium 
//              /* Ombre adaptée aux teintes du dégradé (ici, Vert Émeraude/Bleu) */ shadow-lg shadow-[rgba(16,185,129,0.4)] hover:shadow-xl hover:shadow-[rgba(16,185,129,0.6)]
//              /* Anneau de focus utilisant une des couleurs du dégradé (Bleu) */ focus:ring-[#0ea5e9]"
            >
              <span className="mr-2">{currentSlide.btn_text || "Découvrir nos offres"}</span>
              <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>

            {/* Bouton secondaire optionnel pour équilibrer */}
            {/* <button className="px-8 py-4 text-base font-bold text-white transition-all duration-200 bg-white/5 border border-white/20 rounded-full hover:bg-white/10 backdrop-blur-sm">
                En savoir plus
            </button> */}
          </div>
        </div>

        {/* ================= NAVIGATION DOTS ================= */}
        <div className="absolute bottom-[-6vh] sm:left-6 lg:left-12 flex items-center space-x-4 z-20">
          {herodata.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`
                group relative flex items-center justify-center transition-all duration-500
                ${i === activeIndex ? "w-12" : "w-3 hover:w-6"}
              `}
            >
              {/* Ligne active */}
              <span
                className={`
                  h-1.5 rounded-full shadow-sm transition-all duration-300
                  ${i === activeIndex
                    ? "w-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.6)]"
                    : "w-3 bg-white/30 group-hover:bg-white/60"}
                `}
              />
            </button>
          ))}
        </div>

      </div>
    </div>
  );
}
