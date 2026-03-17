import { StepsRenterSection } from "./commentcamarche/StepsRenterSection";
import { B2BSection } from "./commentcamarche/B2BSection";
import { ComparisonSection } from "./commentcamarche/ComparisonSection";
import { FAQSection } from "./commentcamarche/FAQSection";
import { HeroSection } from "./commentcamarche/HeroSection";
import { StepsOwnerSection } from "./commentcamarche/StepsOwnerSection";

const HowItWorksPage = () => {
  return (
    <div className="font-sans text-slate-900">
      <HeroSection />
      <ComparisonSection />
      <StepsRenterSection />
      <StepsOwnerSection />
      <B2BSection />
      {/* <FAQSection /> */}
    </div>
  );
};

export default HowItWorksPage;