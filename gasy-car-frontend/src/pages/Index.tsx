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
            absolute left-1/2 bottom-0 -translate-x-1/2 translate-y-1/2
          "
        >
          <div className="w-full max-w-5xl">
            <SearchBar />
          </div>
        </div>
      </section>

      {/* CONTENU PRINCIPAL */}
      <ContentWrapper>
        <div className="mt-24 sm:mt-28 lg:mt-32">
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
