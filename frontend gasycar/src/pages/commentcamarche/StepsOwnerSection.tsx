import { Card, CardContent } from "@/components/ui/card";
import { Key, Wallet } from "lucide-react";

// ICON CUSTOM
const CarIcon = () => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 24 24"
    fill="white"
    className="animate-[soft-bounce_2s_ease-in-out_infinite]"
  >
    <path d="M3 13L5 7H19L21 13V20H19V18H5V20H3V13ZM6.5 9L5.5 12H18.5L17.5 9H6.5Z" />
  </svg>
);

export const StepsOwnerSection = () => {
  const steps = [
    {
      icon: <CarIcon />,
      title: "Listez votre véhicule",
      desc: "Ajoutez votre voiture sur la plateforme et définissez le tarif.",
      color: "from-yellow-500 to-yellow-600",
    },
    {
      icon: (
        <Key
          size={28}
          className="text-white animate-[soft-bounce_2s_ease-in-out_infinite]"
        />
      ),
      title: "Validez & Louez",
      desc: "Acceptez les demandes des clients vérifiés.",
      color: "from-blue-600 to-blue-700",
    },
    {
      icon: (
        <Wallet
          size={28}
          className="text-white animate-[soft-bounce_2s_ease-in-out_infinite]"
        />
      ),
      title: "Recevez vos gains",
      desc: "Paiement sécurisé 48h après chaque location.",
      color: "from-green-700 to-green-800",
    },
  ];

  return (
    <section className="py-12 bg-secondary-950 text-white">
      <div className="max-w-7xl mx-auto px-6">

        {/* TITRE */}
        <div className="mb-8">
          <span className="text-black font-semibold uppercase tracking-wide">
            Investissement & Revenus
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold mt-1 text-black">
            Rentabilisez votre véhicule
          </h2>
        </div>

        {/* GRID */}
        <div className="grid md:grid-cols-3 gap-6">
          {steps.map((step, i) => (
            <Card
              key={i}
              className="
                bg-white rounded-2xl shadow-md border border-gray-200 
                hover:shadow-2xl hover:-translate-y-1 hover:scale-[1.02]
                transition-all duration-300
                cursor-pointer group
              "
            >
              <CardContent className="p-6">

                {/* ICON */}
                <div
                  className={`
                    w-16 h-16 rounded-xl bg-gradient-to-br ${step.color}
                    flex items-center justify-center shadow-lg mb-4
                    group-hover:animate-[soft-spin_0.4s_ease-in-out]
                    transition-all
                  `}
                >
                  {step.icon}
                </div>

                <h3 className="text-lg font-bold mb-2 text-black">
                  {step.title}
                </h3>

                <p className="text-black/80 leading-relaxed text-[15px]">
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
