import { Shield, Zap, Headset, MapPin } from "lucide-react";
import { AnimatedSection, AnimatedItem } from "@/components/animations";

/**
 * Section "Pourquoi choisir Madagasycar"
 * Affiche 4 avantages principaux
 */
export const WhyGasyCarSection = () => {
  const advantages = [
    { 
      icon: Shield, 
      title: " Utilsateurs vérifié ", 
      desc: "Pour votre sécurité, Tous les propriétaires et leurs véhicules sont vérifiés. Documents contrôlés, contrats standardisés et paiements protégés.", 
      delay: 100 
    },
    { 
      icon: Zap, 
      title: " Réservation Intuitive", 
      desc: "Trouvez le véhicule idéal en quelques clics, près de chez vous ou de votre destination. Un parcours fluide, rapide et pensé pour votre confort.", 
      delay: 200 
    },
    { 
      icon: Headset, 
      title: " Choix personnalisé", 
      desc: "Chaque déplacement mérite le véhicule qui vous correspond, adapté à votre budget et à vos besoins (marriage, vacances, officiel, etc.) ", 
      delay: 300 
    },
    {
      icon: MapPin,
      title: "Livraison Partout",
      desc: "Des véhicules disponibles dans toutes les grandes villes et régions de Madagascar.",
      delay: 400,
    },
  ];

  return (
    <AnimatedSection className="py-12 bg-muted/40 rounded-3xl mb-8 overflow-hidden border border-border/40" delay={0}>
      <div className="text-center mb-10">
        <span className="text-sm font-semibold uppercase text-secondary tracking-widest">
           Trouver une voiture rapidement et intuitivement
        </span>
        <h2 className="text-3xl md:text-4xl font-poppins font-bold text-foreground mt-2 mb-3">
          Pourquoi choisir <span className="text-primary">Madagasycar</span> ?
        </h2>
        <p className="text-base text-muted-foreground max-w-2xl mx-auto px-4">
          Première plateforme de mise en relation entre particuliers, sécurisée, pour votre confort 
        </p>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {advantages.map((item, index) => (
            <AnimatedItem key={index} delay={item.delay}>
              <div className="group relative h-full overflow-hidden rounded-3xl border border-border/50 bg-background/90 p-6 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-2 hover:border-primary/30 hover:shadow-2xl">
                {/* Accent top */}
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary/80 via-secondary/70 to-primary/80 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                <div className="mb-5 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/15 via-primary/10 to-secondary/10 ring-1 ring-primary/10 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 group-hover:from-primary/20 group-hover:to-secondary/20">
                  <item.icon className="h-7 w-7 text-primary" />
                </div>

                <h3 className="mb-3 text-xl font-bold leading-snug text-foreground">
                  {item.title}
                </h3>

                <p className="text-sm leading-7 text-muted-foreground">
                  {item.desc}
                </p>

                <div className="mt-6 h-px w-full bg-gradient-to-r from-primary/20 via-border to-transparent" />
              </div>
            </AnimatedItem>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
};