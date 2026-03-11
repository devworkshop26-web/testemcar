import { ReactNode } from "react";
import { Link } from "react-router-dom";
import HeroCarousel from "@/components/HeroCarousel";
import SearchBar from "@/components/SearchBar";

import {
  PopularVehicles,
  FavoriteVehicles,
  MostBookedVehicles,
  WhyGasyCarSection,
  FeaturesSection,
  HowItWorksSection,
  BecomeHostCTA,
  SideContent,
} from "@/components/home";
import CategorySelectModal from "@/components/CategorySelectModal";
import { Button } from "@/components/ui/button";

/** Wrapper */
const ContentWrapper = ({ children }: { children: ReactNode }) => (
  <div className="px-4 sm:px-6 lg:px-12 max-w-[1400px] mx-auto">{children}</div>
);

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <CategorySelectModal />

      {/* HERO + SEARCH + BANDE CTA */}
      <section className="relative flex flex-col">
        <HeroCarousel />

        {/* CONTENEUR BANDE CTA */}
        <div className="w-full bg-[linear-gradient(135deg,rgba(13,27,42,0.96),rgba(8,47,73,0.92))] relative">
          {/* SEARCHBAR : Tirée vers le haut pour chevaucher la limite Hero/Bannière */}
          <div
            className="
              relative z-30
              w-full
              px-4 sm:px-6 md:px-10
              flex justify-center
              -mt-12 sm:-mt-16 lg:-mt-20
              mb-8 sm:mb-10
            "
          >
            <div className="w-full max-w-5xl">
              <SearchBar />
            </div>
          </div>

          {/* TEXTE & BOUTON CTA */}
          <ContentWrapper>
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-4 sm:pb-4 px-2 md:px-4">
              <div className="flex flex-col gap-1 text-center md:text-left">
                <h2 className="text-white text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight">
                  Votre voiture vous rapporte de l&apos;argent.
                </h2>
                <p className="text-white/90 text-sm sm:text-base font-medium">
                  Monétisez votre véhicule quand vous ne l’utilisez pas.
                </p>
              </div>

              <Button
                asChild
                className="bg-white text-[#0D1B2A] hover:bg-slate-100 rounded-full px-8 py-6 text-base font-bold shadow-lg transition-transform hover:scale-105 shrink-0"
              >
                <Link to="/devenir-hote">En savoir plus</Link>
              </Button>
            </div>
          </ContentWrapper>
        </div>
      </section>

      {/* CONTENU PRINCIPAL */}
      <ContentWrapper>
        <div className="mt-10 sm:mt-12 lg:mt-14">
          <div className="flex flex-col lg:flex-row">
            {/* MAIN COLUMN */}
            <div className="w-full lg:w-3/4 lg:pr-1">
              <PopularVehicles />
              <FavoriteVehicles />
              <MostBookedVehicles />
              <WhyGasyCarSection />
              <FeaturesSection />
              <HowItWorksSection />
              <BecomeHostCTA />
            </div>

            {/* SIDEBAR */}
            <SideContent />
          </div>
        </div>
      </ContentWrapper>
    </div>
  );
};

export default Index;