import { Card, CardContent } from "@/components/ui/card";

export const StepsRenterSection = () => {
  const steps = [
    {
      id: 1,
      title: "Réservez en ligne",
      img: "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&q=90&w=1600",
      desc: "Comparez et choisissez parmi nos véhicules certifiés.",
    },
    {
      id: 2,
      title: "Check-in digital",
      img: "https://images.unsplash.com/photo-1493238792000-8113da705763?auto=format&fit=crop&q=90&w=1600",
      desc: "Contrôlez l'état du véhicule directement sur l'application.",
    },
    {
      id: 3,
      title: "Roulez l'esprit libre",
      img: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=90&w=1600",
      desc: "Une expérience plus fluide, plus claire et mieux encadrée.",
    },
  ];

  return (
    <section className="py-14 sm:py-16 lg:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="text-center mb-10 sm:mb-12">
          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            Pour les voyageurs
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2 text-slate-900 tracking-tight">
            Louer en 3 étapes simples
          </h2>
          <p className="text-base md:text-lg text-slate-500 mt-3 max-w-2xl mx-auto">
            Une expérience pensée pour être plus rapide, plus lisible et plus rassurante.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5 lg:gap-6">
          {steps.map((step, index) => (
            <Card
              key={step.id}
              className="group overflow-hidden rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 animate-in fade-in slide-in-from-bottom-4"
              style={{ animationDelay: `${index * 120}ms` }}
            >
              <div className="relative h-64 overflow-hidden">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{ backgroundImage: `url(${step.img})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                <div className="absolute top-4 left-4 w-11 h-11 rounded-full bg-white/95 text-slate-900 font-bold flex items-center justify-center shadow-lg">
                  {step.id}
                </div>
              </div>

              <CardContent className="p-6">
                <h3 className="text-xl sm:text-2xl font-semibold mb-2 text-slate-900">
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