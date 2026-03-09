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
      title: "100% Sécurisé", 
      desc: "Tous nos hôtes et véhicules sont vérifiés. Assurance complète incluse pour une location en toute tranquillité.", 
      delay: 100 
    },
    { 
      icon: Zap, 
      title: "Réservation Rapide", 
      desc: "Réservez votre véhicule en quelques clics. Confirmation instantanée et processus simplifié.", 
      delay: 200 
    },
    { 
      icon: Headset, 
      title: "Support Local 24/7", 
      desc: "Notre équipe locale dédiée est disponible à tout moment pour vous accompagner pendant votre location.", 
      delay: 300 
    },
    { 
      icon: MapPin, 
      title: "Livraison Partout", 
      desc: "Des véhicules disponibles dans toutes les grandes villes et régions de Madagascar.", 
      delay: 400 
    },
  ];

  return (
    <AnimatedSection className="py-16 bg-muted/50 rounded-3xl mb-10 overflow-hidden" delay={0}>
      <div className="text-center mb-16">
        <span className="text-sm font-semibold uppercase text-secondary tracking-widest">
          Notre Engagement Qualité
        </span>
        <h2 className="text-4xl md:text-5xl font-poppins font-extrabold text-foreground mt-2 mb-4">
          Pourquoi choisir <span className="text-primary">Madagasycar</span> ?
        </h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto px-4">
          La plateforme de location entre particuliers conçue pour votre <span className="text-primary font-medium">confort</span> et votre <span className="text-primary font-medium">sécurité</span> à Madagascar.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto px-4">
        {advantages?.map((item, index) => (
          <AnimatedItem key={index} delay={item.delay}>
            <div className="text-center p-6 bg-white border border-border/50 rounded-xl shadow-lg hover:shadow-primary/30 hover:shadow-2xl transition-all duration-300 h-full group transform hover:-translate-y-1">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/10 to-secondary/5 flex items-center justify-center mx-auto mb-4 group-hover:scale-105 group-hover:bg-primary/20 transition-all duration-300">
                <item.icon className="w-8 h-8 text-primary" />
              </div>

              <h3 className="text-xl font-poppins font-bold text-foreground mb-3 leading-snug">
                {item.title}
              </h3>

              <p className="text-sm text-muted-foreground leading-normal">
                {item.desc}
              </p>
            </div>
          </AnimatedItem>
        ))}
      </div>
    </AnimatedSection>
  );
};
