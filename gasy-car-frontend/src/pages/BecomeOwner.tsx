import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DollarSign, Shield, Users, TrendingUp } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
// import ChatBubble from "@/components/ChatBubble";
import { Link } from "react-router-dom";

const BecomeOwner = () => {
  const ref1 = useScrollAnimation();
  const ref2 = useScrollAnimation();
  const ref3 = useScrollAnimation();

  return (
    <div className="min-h-screen bg-background">
      <div>
        {/* Hero */}
        <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-br from-primary to-secondary text-white">
          <div className="container mx-auto px-4 sm:px-6 text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-poppins font-bold mb-4 sm:mb-6">
              Gagnez de l'argent avec votre voiture
            </h1>
            <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
              Rejoignez des milliers de propriétaires qui génèrent des revenus passifs en partageant leur véhicule
            </p>
            <Link
              to="/register"
            >
              <Button size="lg" className="bg-white text-primary hover:bg-white/90 text-sm sm:text-base md:text-lg px-6 sm:px-8 py-4 sm:py-5 md:py-6">
                Commencer maintenant
              </Button>
              </Link>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-12 sm:py-16 md:py-20" ref={ref1}>
          <div className="container mx-auto px-4 sm:px-6">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-poppins font-bold text-center mb-8 sm:mb-10 md:mb-12">
              Pourquoi devenir propriétaire sur Madagasycar ?
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {[
                {
                  icon: DollarSign,
                  title: "Revenus supplémentaires",
                  description: "Gagnez jusqu'à 150 000 Ar par mois",
                },
                {
                  icon: Shield,
                  title: "Protection complète",
                  description: "Assurance tous risques incluse",
                },
                {
                  icon: Users,
                  title: "Communauté vérifiée",
                  description: "Tous les locataires sont vérifiés",
                },
                {
                  icon: TrendingUp,
                  title: "Flexibilité totale",
                  description: "Vous contrôlez vos disponibilités",
                },
              ].map((benefit, idx) => (
                <Card key={idx} className="card-lift">
                  <CardContent className="p-4 sm:p-6 text-center">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-3 sm:mb-4">
                      <benefit.icon className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-poppins font-semibold mb-2">{benefit.title}</h3>
                    <p className="text-sm sm:text-base text-muted-foreground">{benefit.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="py-12 sm:py-16 md:py-20 bg-muted/30" ref={ref2}>
          <div className="container mx-auto px-4 sm:px-6">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-poppins font-bold text-center mb-8 sm:mb-10 md:mb-12">
              Comment ça marche ?
            </h2>
            <div className="max-w-3xl mx-auto space-y-6 sm:space-y-8">
              {[
                {
                  step: "1",
                  title: "Créez votre annonce",
                  description: "Ajoutez des photos et une description de votre véhicule",
                },
                {
                  step: "2",
                  title: "Fixez vos tarifs",
                  description: "Définissez vos prix et vos disponibilités",
                },
                {
                  step: "3",
                  title: "Acceptez les réservations",
                  description: "Recevez et validez les demandes de location",
                },
                {
                  step: "4",
                  title: "Gagnez de l'argent",
                  description: "Recevez vos paiements de manière sécurisée",
                },
              ].map((step, idx) => (
                <div key={idx} className="flex gap-4 sm:gap-6 items-start">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary text-white flex items-center justify-center font-poppins font-bold text-lg sm:text-xl flex-shrink-0">
                    {step.step}
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl md:text-2xl font-poppins font-semibold mb-2">{step.title}</h3>
                    <p className="text-sm sm:text-base text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-12 sm:py-16 md:py-20" ref={ref3}>
          <div className="container mx-auto px-4 sm:px-6 text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-poppins font-bold mb-4 sm:mb-6">
              Prêt à commencer ?
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
              Rejoignez Madagasycar aujourd'hui et commencez à générer des revenus avec votre véhicule
            </p>
            <Link
              to="/register"
            >
            <Button size="lg" className="btn-primary text-sm sm:text-base md:text-lg px-6 sm:px-8 py-4 sm:py-5 md:py-6 font-poppins font-medium">
              Créer mon annonce
            </Button>
            </Link>
          </div>
        </section>
      </div>
      {/* <ChatBubble /> */}
    </div>
  );
};

export default BecomeOwner;
