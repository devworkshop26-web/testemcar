import { AnimatedSection, AnimatedItem } from "@/components/animations";
import { steps } from "@/data/homeData";

/**
 * Section "Comment ça marche"
 * Affiche les 4 étapes du processus de location
 */
export const HowItWorksSection = () => {
  return (
    <AnimatedSection className="py-16 from-white to-primary/5 mb-10" delay={0}>
      <div className="text-center mb-16">
        <span className="text-sm font-semibold uppercase text-secondary tracking-widest">
          Simplicité Garantie
        </span>
        <h2 className="text-5xl font-poppins font-extrabold text-foreground mt-2 mb-4">
          Comment ça fonctionne ?
        </h2>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Louez la voiture parfaite en seulement <span className="text-primary">4 étapes</span> simples et rapides.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 max-w-7xl mx-auto">
        {steps?.map((step, index) => (
          <AnimatedItem key={index} delay={index * 150}>
            <div className="text-center p-8 bg-white border border-border/50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 h-full relative group">
              {/* Numéro de l'étape */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white text-xl font-bold border-4 border-white shadow-lg group-hover:scale-110 transition-transform">
                {step.number}
              </div>

              <div className="mt-6">
                <step.icon className="w-10 h-10 text-primary mx-auto mb-4" />
                <h3 className="text-2xl font-poppins font-semibold text-foreground mb-3">
                  {step.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          </AnimatedItem>
        ))}
      </div>
    </AnimatedSection>
  );
};
