import { Search, CheckCircle, Key, ThumbsUp, MessageCircle } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Recherchez",
    description: "Trouvez la voiture parfaite parmi des milliers de véhicules disponibles",
  },
  {
    icon: CheckCircle,
    title: "Réservez",
    description: "Choisissez vos dates et réservez en quelques clics",
  },
  {
    icon: MessageCircle,
    title: "Contactez",
    description: "Échangez avec le propriétaire pour finaliser les détails",
  },
  {
    icon: Key,
    title: "Récupérez",
    description: "Prenez possession de votre véhicule au lieu convenu",
  },
  {
    icon: ThumbsUp,
    title: "Profitez",
    description: "Explorez Madagascar en toute liberté",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-poppins font-bold text-foreground mb-4">
            Comment ça marche ?
          </h2>
          <p className="text-xl text-muted-foreground font-roboto max-w-2xl mx-auto">
            Louez une voiture en 5 étapes simples
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={index}
                className="flex flex-col items-center text-center fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-4 shadow-premium-md hover:scale-110 transition-transform duration-300">
                  <Icon className="w-10 h-10 text-white" />
                </div>
                <div className="w-12 h-1 bg-primary/20 mb-4 rounded-full" />
                <h3 className="text-xl font-poppins font-semibold text-foreground mb-2">
                  {step.title}
                </h3>
                <p className="text-muted-foreground font-roboto text-sm">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
