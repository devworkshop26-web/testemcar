import { AnimatedSection, AnimatedItem } from "@/components/animations";
import { features } from "@/data/homeData";

/**
 * Section des features avancées
 * Affiche les avantages exclusifs avec design gradient
 */
export const FeaturesSection = () => {
  return (
    <AnimatedSection 
      className="py-16 bg-gradient-to-r from-primary/90 to-secondary text-white rounded-3xl shadow-2xl mb-10" 
      delay={0}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-5xl font-poppins font-extrabold text-center mb-4">
          Des avantages exclusifs
        </h2>
        <p className="text-xl text-white/80 text-center mb-16 max-w-3xl mx-auto">
          Tout ce dont vous avez besoin pour une location de voiture réussie à Madagascar : flexibilité, assurance et économies.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {features?.map((feature, index) => (
          <AnimatedItem key={index} delay={100 + index * 100}>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:border-white/40 transition-all duration-300 h-full flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center mx-auto mb-6 flex-shrink-0">
                <feature.icon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-poppins font-semibold mb-3">
                {feature.title}
              </h3>
              <p className="text-white/80 text-sm leading-relaxed flex-grow">
                {feature.description}
              </p>
            </div>
          </AnimatedItem>
        ))}
      </div>
    </AnimatedSection>
  );
};
