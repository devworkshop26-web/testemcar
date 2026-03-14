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
  <div className="px-4 sm:px-6 lg:px-10 xl:px-12 max-w-[1380px] mx-auto">
    {children}
  </div>
);

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <CategorySelectModal />

      {/* HERO + SEARCH + BANDE CTA */}
      <section className="relative flex flex-col">
        <HeroCarousel />

        <div className="w-full bg-[linear-gradient(135deg,rgba(13,27,42,0.96),rgba(8,47,73,0.92))] relative">
          <div
            className="
              relative z-30
              w-full
              px-4 sm:px-6 md:px-10
              flex justify-center
              -mt-10 sm:-mt-12 lg:-mt-14
              mb-4 sm:mb-5
            "
          >
            <div className="w-full max-w-5xl">
              <SearchBar />
            </div>
          </div>

          <ContentWrapper>
            <div className="flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4 pb-3 sm:pb-4 px-2 md:px-4">
              <div className="flex flex-col gap-1 text-center md:text-left max-w-2xl">
                <h2 className="text-white text-lg sm:text-xl lg:text-[1.65rem] font-semibold tracking-[-0.02em] leading-[1.2]">
                  Votre voiture vous rapporte de l&apos;argent.
                </h2>
                <p className="text-white/80 text-[13px] sm:text-sm lg:text-[15px] font-normal leading-[1.5]">
                  Monétisez votre véhicule quand vous ne l’utilisez pas.
                </p>
              </div>

              <Button
                asChild
                className="bg-white text-[#0D1B2A] hover:bg-slate-100 rounded-full px-6 sm:px-7 py-4 text-sm sm:text-[15px] font-semibold shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02] shrink-0"
              >
                <Link to="/devenir-hote">En savoir plus</Link>
              </Button>
            </div>
          </ContentWrapper>
        </div>
      </section>

      {/* CONTENU PRINCIPAL */}
      <ContentWrapper>
        <div className="mt-8 sm:mt-10 lg:mt-10">
          <div className="flex flex-col lg:flex-row gap-6 xl:gap-8">
            <div className="w-full lg:w-[79%] xl:w-[80%] min-w-0">
              <PopularVehicles />
              <FavoriteVehicles />
              <MostBookedVehicles />
              <WhyGasyCarSection />
        {/*  <FeaturesSection />
              <HowItWorksSection />  */}
              <BecomeHostCTA />
            </div>

            <SideContent />
          </div>
        </div>
      </ContentWrapper>
    </div>
  );
};


export default Index;
