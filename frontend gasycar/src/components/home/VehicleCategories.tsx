import { Link } from "react-router-dom";
import { AnimatedSection, AnimatedItem } from "@/components/animations";
import { categoryVehiculeUseQuery } from "@/useQuery/categoryUseQuery";
import {
  Car,
  Truck,
  Bus,
  Bike,
  Loader2,
  ArrowRight,
  Sparkles,
  Zap,
  Leaf,
  Briefcase,
  Users
} from "lucide-react";
import { useMemo, useRef } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { Button } from "@/components/ui/button"; // Ajout de l'import Button pour styliser les flèches

// Mapping des icônes par nom de catégorie
const getCategoryIcon = (categoryName: string) => {
  const name = categoryName.toLowerCase();
  if (name.includes("suv") || name.includes("4x4") || name.includes("tout-terrain")) return Truck;
  if (name.includes("bus") || name.includes("minibus") || name.includes("van")) return Bus;
  if (name.includes("moto") || name.includes("scooter") || name.includes("bike")) return Bike;
  if (name.includes("électrique") || name.includes("hybride")) return Zap;
  if (name.includes("éco") || name.includes("vert")) return Leaf;
  if (name.includes("utilitaire") || name.includes("camion")) return Briefcase;
  if (name.includes("familiale") || name.includes("monospace")) return Users;
  return Car;
};

// Générer une description par défaut basée sur le nom de la catégorie
const getDefaultDescription = (categoryName: string) => {
  const name = categoryName.toLowerCase();
  if (name.includes("suv") || name.includes("4x4")) return "Véhicules tout-terrain et robustes pour l'aventure.";
  if (name.includes("berline")) return "Confort et élégance au quotidien pour vos trajets professionnels ou personnels.";
  if (name.includes("citadine")) return "Idéal pour la ville, facile à garer et économique.";
  if (name.includes("sport")) return "Performance et sensations fortes garanties.";
  if (name.includes("luxe")) return "Prestige, raffinement et technologies haut de gamme.";
  if (name.includes("utilitaire")) return "Pour tous vos besoins professionnels et de transport de marchandises.";
  if (name.includes("familiale")) return "Espace et confort optimal pour toute la famille.";
  if (name.includes("électrique")) return "Roulez vert, silencieux et profitez d'une conduite moderne.";
  return "Découvrez notre sélection de véhicules triés sur le volet.";
};

/**
 * Section des catégories de véhicules
 * Affiche les catégories disponibles dans un carrousel
 */
export const VehicleCategories = () => {
  const { CategoryData, isLoading } = categoryVehiculeUseQuery();
  const plugin = useRef(
    Autoplay({ delay: 3000, stopOnInteraction: true })
  );

  // Préparer les données des catégories avec leurs icônes
  const categories = useMemo(() => {
    if (!CategoryData) return [];
    return CategoryData.map((category) => ({
      id: category.id,
      name: category.nom,
      description: getDefaultDescription(category.nom),
      icon: getCategoryIcon(category.nom),
      hasChildren: category.children && category.children.length > 0,
    }));
  }, [CategoryData]);

  if (isLoading) {
    return (
      <section className="py-16 from-white to-muted/10 overflow-hidden mb-10 border border-border/50">
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
          <p className="text-muted-foreground">Chargement des catégories...</p>
        </div>
      </section>
    );
  }

  if (!categories.length) {
    return null;
  }

  return (
    <AnimatedSection
      // Utilisation de shadow-xl pour un look plus luxueux
      className="py-16 bg-gradient-to-br from-white via-white to-slate-50 overflow-hidden mb-10 shadow-xl border-t border-b border-border/50"
      delay={0}
    >
      <div className="text-center mb-16">
        <span className="inline-flex items-center gap-2 text-sm font-semibold uppercase text-primary tracking-widest mb-3 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
          <Sparkles className="w-4 h-4" />
          Sélectionnez Votre Style
        </span>
        <h2 className="text-4xl md:text-5xl font-poppins font-extrabold text-foreground mt-2 mb-4 leading-tight">
          Trouvez le véhicule parfait
        </h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto px-4">
          Découvrez notre sélection de **{categories.length} catégories** de véhicules adaptés à tous vos besoins.
        </p>
      </div>

      {/*         Wrapper du carrousel pour centrer et gérer le padding. 
        J'ai ajouté un padding horizontal large (px-12 lg:px-20) pour donner de l'espace aux boutons de navigation 
      */}
      <div className="max-w-[1400px] mx-auto relative px-12 lg:px-20">
        <Carousel
          plugins={[plugin.current]}
          className="w-full"
          onMouseEnter={plugin.current.stop}
          onMouseLeave={plugin.current.reset}
        >
          {/* Padding de 16px à gauche pour le premier élément */}
          <CarouselContent className="-ml-4">
            {categories.map((category, index) => (
              < CarouselItem key={category.id} className="pl-4 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5" >
                {/* Ajout d'un padding vertical au AnimatedItem pour que le hover ne coupe pas */}
                <AnimatedItem delay={index * 50} className="h-full py-4" >
                  <Link to={`/category/${category.id}`} className="block h-full">
                    <div className="group relative flex flex-col items-center text-center p-5 sm:p-6 bg-gradient-to-br from-white via-white to-primary/5 border-2 border-border/50 rounded-2xl shadow-xl hover:shadow-primary/40 transition-all duration-300 cursor-pointer h-full group-hover:border-primary/50 group-hover:-translate-y-2">
                      {/* Le translate-y-2 est appliqué ici, à l'intérieur du padding vertical du CarouselItem */}

                      {/* Effet de fond animé au survol */}
                      <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors duration-500 rounded-[14px] " />

                      {/* Cercles décoratifs en arrière-plan (optimisés pour la performance) */}
                      <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/5 rounded-full blur-xl opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-primary/5 rounded-full blur-xl opacity-50 group-hover:opacity-100 transition-opacity duration-500" />

                      {/* Icône */}
                      <div className="relative z-10 w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border-2 border-primary/20 flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-105 group-hover:rotate-3 group-hover:border-primary/50 group-hover:shadow-2xl group-hover:shadow-primary/30">
                        <category.icon className="w-10 h-10 text-primary transition-all duration-300 group-hover:scale-110" strokeWidth={2.5} />
                      </div>

                      {/* Nom de la catégorie */}
                      <h3 className="relative z-10 text-base sm:text-lg font-poppins font-bold text-slate-800 mb-2 group-hover:text-primary transition-colors line-clamp-1 px-2">
                        {category.name}
                      </h3>

                      {/* Description */}
                      <p className="relative z-10 text-xs sm:text-sm text-muted-foreground line-clamp-2 mb-4 h-10 leading-normal px-2">
                        {category.description}
                      </p>

                      {/* Bouton d'action */}
                      <div className="relative z-10 mt-auto flex items-center justify-center gap-2 w-full">
                        <div className="flex-1 flex items-center justify-center gap-2 text-xs sm:text-sm font-medium font-poppins text-primary bg-primary/5 px-4 py-2.5 rounded-full border border-primary/20 group-hover:bg-primary group-hover:text-white group-hover:border-primary/50 transition-all duration-300 group-hover:shadow-md">
                          <span>Explorer</span>
                          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </div>
                      </div>

                      {/* Badge pour les catégories avec sous-catégories */}
                      {category.hasChildren && (
                        <div className="absolute top-3 right-3 z-20">
                          <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-white bg-gradient-to-r from-blue-500 to-indigo-600 px-2 py-1 rounded-full shadow-lg">
                            <Sparkles className="w-3 h-3" />
                            <span>Multi</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </Link>
                </AnimatedItem>
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* Boutons de navigation du carrousel */}
          <div className="hidden lg:block">
            {/* Bouton Précédent : Positionné à -40px à l'intérieur du conteneur parent (px-12) */}
            <CarouselPrevious className="-left-4 lg:-left-10 h-12 w-12 rounded-full border-2 border-primary/20 bg-white shadow-xl hover:bg-primary hover:text-white transition-all duration-300" />
            {/* Bouton Suivant : Positionné à -40px à l'intérieur du conteneur parent (px-12) */}
            <CarouselNext className="-right-4 lg:-right-10 h-12 w-12 rounded-full border-2 border-primary/20 bg-white shadow-xl hover:bg-primary hover:text-white transition-all duration-300" />
          </div>

          {/* Boutons de navigation pour les écrans MD/SM (dans la zone de padding) */}
          <div className="lg:hidden">
            <CarouselPrevious className="-left-4 sm:-left-6 h-10 w-10 border-2 border-primary/20 bg-white shadow-lg hover:bg-primary hover:text-white" />
            <CarouselNext className="-right-4 sm:-right-6 h-10 w-10 border-2 border-primary/20 bg-white shadow-lg hover:bg-primary hover:text-white" />
          </div>

        </Carousel>
      </div >

      {/* Lien vers toutes les catégories */}
      <div className="text-center mt-16" >
        <Link
          to="/allcars"
          className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-primary via-primary to-primary/90 text-white font-medium font-poppins rounded-full shadow-lg hover:shadow-2xl hover:shadow-primary/40 hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden"
        >
          {/* Effet de brillance animé */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

          <span className="relative z-10">Voir tous les véhicules</span>
          <ArrowRight className="relative z-10 w-5 h-5 transition-transform group-hover:translate-x-2" />
        </Link>
      </div >
    </AnimatedSection >
  );
};