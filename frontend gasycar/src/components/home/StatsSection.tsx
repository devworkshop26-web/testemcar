import { AnimatedSection, AnimatedItem } from "@/components/animations";
import { stats } from "@/data/homeData";

/**
 * Section des statistiques
 * Affiche les chiffres clés de la communauté Madagasycar
 */
export const StatsSection = () => {
  return (
    <AnimatedSection className="py-16 mb-10" delay={0}>
      <div className="text-center mb-16">
        <span className="text-sm font-semibold uppercase text-primary tracking-widest">
          En Chiffres
        </span>
        <h2 className="text-4xl md:text-5xl font-poppins font-extrabold text-foreground mt-2 mb-4">
          La communauté <span className="text-primary">Madagasycar</span>
        </h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto px-4">
          Rejoignez la plus grande communauté de location de voitures entre particuliers à Madagascar.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-y-12 gap-x-6 max-w-7xl mx-auto px-4">
        {stats?.map((stat, index) => (
          <AnimatedItem key={index} delay={stat.delay}>
            <div className="text-center group">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 border-4 border-primary/20 transition-all duration-300 group-hover:bg-primary/20 group-hover:border-primary/40">
                <stat.icon className="w-10 h-10 text-primary transition-transform duration-300 group-hover:scale-110" />
              </div>

              <div className="text-lg md:text-6xl font-poppins font-semibold text-primary mb-2">
                {stat.number}
              </div>

              <div className="text-lg font-medium text-foreground max-w-[200px] mx-auto">
                {stat.label}
              </div>
            </div>
          </AnimatedItem>
        ))}
      </div>
    </AnimatedSection>
  );
};
