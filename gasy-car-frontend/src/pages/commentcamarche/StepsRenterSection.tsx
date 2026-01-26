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
  title: "Check-in Digital",
  img: "https://images.unsplash.com/photo-1493238792000-8113da705763?auto=format&fit=crop&q=90&w=1600",
  desc: "Contrôlez l'état du véhicule directement sur l'application.",
},

    {
      id: 3,
      title: "Roulez l'esprit libre",
      img: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=90&w=1600",
      desc: "Votre caution est libérée automatiquement sous 48h.",
    },
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">

        {/* TITRE */}
        <div className="text-center mb-16">
          <span className="text-primary-600 font-bold uppercase tracking-wide">
            Pour les Voyageurs
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold mt-2 text-secondary-900">
            L'expérience Mcar en 3 étapes
          </h2>
        </div>

        {/* GRID DES ÉTAPES */}
        <div className="grid md:grid-cols-3 gap-12">
          {steps.map(step => (
            <Card
              key={step.id}
              className="
                border-none rounded-3xl shadow-xl 
                hover:shadow-2xl transition-all duration-500 
                overflow-hidden group
              "
            >
              {/* IMAGE FIXÉE – TOUJOURS VISIBLE */}
              <div className="relative w-full h-72 rounded-[2rem] overflow-hidden">
                <div
                  className="
                    absolute inset-0 
                    bg-cover bg-center 
                    transition-transform duration-700 
                    group-hover:scale-110
                  "
                  style={{ backgroundImage: `url(${step.img})` }}
                />

                {/* BADGE NUMÉRO */}
                <div className="
                  absolute top-4 left-4 
                  w-12 h-12 bg-white rounded-full 
                  flex items-center justify-center 
                  text-secondary-900 font-bold shadow-md
                ">
                  {step.id}
                </div>
              </div>

              {/* CONTENU */}
              <CardContent className="p-6 text-center">
                <h3 className="text-2xl font-bold mb-3 text-secondary-900">
                  {step.title}
                </h3>
                <p className="text-gray-500">
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
