import { Link } from "react-router-dom";
import { AnimatedSection } from "@/components/animations";

/**
 * CTA pour devenir hôte
 * Section d'appel à l'action pour les propriétaires de véhicules
 */
export const BecomeHostCTA = () => {
  return (
    <AnimatedSection 
      className="py-12 bg-gradient-to-r from-primary to-secondary text-white rounded-xl shadow-md mb-10" 
      delay={200}
    >
      <div className="mx-auto text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-poppins font-bold mb-6">
            Vous possédez une voiture ?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Gagnez jusqu'à 150 000 Ar par mois en partageant votre véhicule quand vous ne l'utilisez pas
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/devenir-proprietaire"
              className="bg-white text-primary hover:bg-white/90 font-medium font-poppins text-lg px-8 py-4 rounded-full transition-all duration-300 hover:shadow-lg hover:scale-105"
            >
              Devenir hôte
            </Link>
            <Link
              to="/comment-ca-marche"
              className="border-2 border-white text-white hover:bg-white/10 font-medium font-poppins text-lg px-8 py-4 rounded-full transition-all duration-300"
            >
              En savoir plus
            </Link>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
};
