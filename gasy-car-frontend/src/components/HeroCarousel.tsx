import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { useMarketingHerosQuery } from "@/useQuery/marketingUseQuery";
import { marketingHeroData } from "@/data/heroData";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight, Sparkles } from "lucide-react";

export default function HeroSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const { data: apiHero, isLoading } = useMarketingHerosQuery();
  const [herodata, setHeroData] = useState(marketingHeroData);
  const [imageError, setImageError] = useState<Record<number, boolean>>({});

  useEffect(() => {
    if (!isLoading && apiHero?.length) {
      setHeroData(apiHero);
      setActiveIndex(0);
    }
  }, [apiHero, isLoading]);

  const totalSlides = herodata.length;
  const currentSlide = herodata[activeIndex] ?? herodata[0];

  useEffect(() => {
    herodata.forEach((slide, i) => {
      const img = new Image();
      img.src = slide.image;
      img.onerror = () => setImageError((prev) => ({ ...prev, [i]: true }));
    });
  }, [herodata]);

  const nextSlide = useCallback(() => {
    if (totalSlides > 0) {
      setActiveIndex((i) => (i + 1) % totalSlides);
    }
  }, [totalSlides]);

  useEffect(() => {
    if (totalSlides <= 1) return;
    const id = setInterval(nextSlide, 8000);
    return () => clearInterval(id);
  }, [nextSlide, totalSlides]);

  const fallbackImage =
    "data:image/svg+xml,%3Csvg width='800' height='600' xmlns='http://www.w3.org/2000/svg'%3E%3Crect fill='%23ddd' width='800' height='600'/%3E%3Ctext x='50%25' y='50%25' font-size='26' text-anchor='middle' fill='%23777'%3EImage indisponible%3C/text%3E%3C/svg%3E";

  if (isLoading) {
    return (
      <div className="relative overflow-hidden min-h-[600px] w-full flex items-center bg-slate-900 px-6">
        <div className="container mx-auto">
          <Skeleton className="mb-4 h-12 w-3/4 bg-slate-800" />
          <Skeleton className="h-6 w-1/2 bg-slate-800" />
        </div>
      </div>
    );
  }

  if (!currentSlide) {
    return null;
  }

  return (
    <div className="relative flex min-h-[500px] w-full items-center overflow-hidden bg-black sm:min-h-[540px] md:min-h-[600px] lg:min-h-[72vh]">
      <div key={activeIndex} className="absolute inset-0 z-0">
        <div className="absolute inset-0 z-10 bg-black/20" />
        <img
          src={imageError[activeIndex] ? fallbackImage : currentSlide.image}
          className="h-full w-full object-cover animate-in fade-in zoom-in-105 [animation-duration:2000ms] ease-out fill-mode-forwards"
          style={{
            animationName: "subtleZoom",
            animationDuration: "10s",
            animationFillMode: "forwards",
            animationTimingFunction: "ease-out",
          }}
          alt="Hero background"
        />
        <style>{`
          @keyframes subtleZoom {
            from { transform: scale(1); filter: brightness(0.8); }
            to { transform: scale(1.1); filter: brightness(1); }
          }
        `}</style>
      </div>

      <div className="absolute inset-0 z-[1] bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
      <div className="absolute inset-0 z-[1] bg-gradient-to-t from-black/80 via-transparent to-transparent md:hidden" />

      <div className="relative z-[10] container mx-auto flex h-full w-full flex-col justify-center px-4 sm:mt-10 sm:px-6 lg:px-12">
        <div
          key={activeIndex}
          className="max-w-3xl space-y-6 animate-in slide-in-from-bottom-5 fade-in duration-700"
        >
          {currentSlide.subtitle && (
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-emerald-300 shadow-lg backdrop-blur-md animate-in slide-in-from-left-5 fade-in duration-700 delay-100">
              <Sparkles className="h-3.5 w-3.5" />
              <span className="text-xs font-bold uppercase tracking-wider">
                {currentSlide.subtitle}
              </span>
            </div>
          )}

          <h1 className="max-w-2xl text-4xl font-bold leading-[1.22] tracking-[0.01em] text-white drop-shadow-lg sm:text-5xl lg:text-[3.2rem]">
            {currentSlide.titre}
          </h1>

          <p className="max-w-2xl text-base font-light leading-relaxed text-slate-200 opacity-90 animate-in slide-in-from-bottom-3 fade-in duration-700 delay-200 sm:text-lg md:text-[1rem]">
            {currentSlide.description}
          </p>

          <div className="flex flex-wrap gap-3 pt-3 animate-in slide-in-from-bottom-3 fade-in duration-700 delay-300">
            <Link
              to={currentSlide.link || "/allCars"}
              className="group inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-medium text-slate-900 transition-all duration-200 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-white/70 active:scale-95"
            >
              <span className="mr-2">
                {currentSlide.btn_text || "Découvrir nos offres"}
              </span>
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>

            <Link
              to="/devenir-hote"
              className="inline-flex items-center justify-center rounded-full border border-white/70 bg-transparent px-6 py-3 text-sm font-medium text-white transition-all duration-200 hover:bg-white hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-white/70 active:scale-95"
            >
              Proposer mon véhicule
            </Link>
          </div>
        </div>

        {totalSlides > 1 && (
          <div className="absolute bottom-[-6vh] z-20 flex items-center space-x-4 sm:left-6 lg:left-12">
            {herodata.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`group relative flex items-center justify-center transition-all duration-500 ${
                  i === activeIndex ? "w-12" : "w-3 hover:w-6"
                }`}
              >
                <span
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === activeIndex
                      ? "w-full bg-emerald-500"
                      : "w-3 bg-white/30 group-hover:bg-white/60"
                  }`}
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}