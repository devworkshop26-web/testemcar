import { Card, CardContent } from "@/components/ui/card";
import { Key, Wallet, CarFront } from "lucide-react";

export const StepsOwnerSection = () => {
  const steps = [
    {
      icon: <CarFront size={28} className="text-white" />,
      title: "Publiez votre véhicule",
      desc: "Ajoutez votre voiture, définissez vos conditions et présentez votre offre proprement.",
      color: "from-amber-500 to-orange-500",
    },
    {
      icon: <Key size={28} className="text-white" />,
      title: "Acceptez les réservations",
      desc: "Recevez les demandes et louez à des clients avec un cadre plus clair.",
      color: "from-sky-500 to-blue-600",
    },
    {
      icon: <Wallet size={28} className="text-white" />,
      title: "Recevez vos revenus",
      desc: "Monétisez votre véhicule quand vous ne l'utilisez pas avec une gestion plus simple.",
      color: "from-emerald-500 to-green-600",
    },
  ];

  return (
    <section className="py-14 sm:py-16 lg:py-20 bg-[linear-gradient(135deg,rgba(13,27,42,0.98),rgba(8,47,73,0.95))] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="text-center mb-10 sm:mb-12">
          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300">
            Hôtes & revenus
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2 tracking-tight">
            Rentabilisez votre véhicule
          </h2>
          <p className="text-white/75 text-base md:text-lg mt-3 max-w-2xl mx-auto">
            Une manière plus moderne et plus professionnelle de proposer votre voiture à la location.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5 lg:gap-6">
          {steps.map((step, i) => (
            <Card
              key={i}
              className="group bg-white/95 border border-white/10 rounded-[1.75rem] shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 animate-in fade-in slide-in-from-bottom-4"
              style={{ animationDelay: `${i * 120}ms` }}
            >
              <CardContent className="p-6 sm:p-7">
                <div
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg mb-5 group-hover:scale-105 transition-transform duration-300`}
                >
                  {step.icon}
                </div>

                <h3 className="text-xl font-semibold mb-2 text-slate-900">
                  {step.title}
                </h3>

                <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                  {step.desc}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};