import { ReactNode } from "react";
import HeroCarousel from "@/components/HeroCarousel";
import SearchBar from "@/components/SearchBar";

import {
  PopularVehicles,
  FavoriteVehicles,
  MostBookedVehicles,
  VehicleCategories,
  VehicleCategories2,
  WhyGasyCarSection,
  FeaturesSection,
  HowItWorksSection,
  StatsSection,
  BecomeHostCTA,
  SideContent,
} from "@/components/home";
import CategorySelectModal from "@/components/CategorySelectModal";
import { categoryVehiculeUseQuery } from "@/useQuery/categoryUseQuery";

/** Wrapper */
const ContentWrapper = ({ children }: { children: ReactNode }) => (
  <div className="px-4 sm:px-6 lg:px-12 max-w-[1400px] mx-auto">{children}</div>
);

const Index = () => {

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* category */}
      <CategorySelectModal />

      {/* HERO + SEARCH */}
      {/* HERO + SEARCH */}
      <section className="relative bg-background text-foreground pb-0">
        {/* HERO */}
        <HeroCarousel />

        {/* SEARCHBARall */}
        <div
          className="
          
            z-30 
            w-full 
            px-4 sm:px-6 md:px-10
            flex justify-center

           /* mobile: en relative pour être dans le flux et pas chevaucher l’image */
            relative
            -mt-16 sm:-mt-20 md:-mt-24 lg:-mt-0
            lg:absolute lg:bottom-[-80px] lg:left-1/2 lg:-translate-x-1/2

            /* web: en relative pour être dans le flux et pas chevaucher l’image */

            sm:absolute  sm:left-1/2 sm:-translate-x-1/2 
            -bottom-6 sm:-bottom-8 md:-bottom-10 lg:-bottom-[-5vh] 
          "
        >
          <div className="w-full max-w-5xl">
            <SearchBar />
          </div>
        </div>
      </section>

      {/* CONTENU PRINCIPAL */}
      <ContentWrapper>
        {/* 
          Mobile: Juste un peu de margin-top pour espacer de la SearchBar qui est en 'relative' 
          Desktop: On doit compenser le fait que la SearchBar est absolute et dépasse de la section Hero
        */}
        <div className="mt-8 lg:mt-32 sm:-mt-14 md:-mt-16 lg:-mt-20">
          <div className="flex flex-col lg:flex-row">
            {/* MAIN COLUMN */}
            <div className="w-full lg:w-3/4 lg:pr-1">
              <PopularVehicles />
              <FavoriteVehicles />
              <MostBookedVehicles />
              {/* <VehicleCategories2 /> */}
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
