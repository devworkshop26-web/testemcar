import { AnimatedSection, AnimatedItem } from "@/components/animations";
import { features } from "@/data/homeData";

/**
 * Section des features avancées
 * Affiche les avantages exclusifs avec design harmonieux et sophistiqué
 */
export const FeaturesSection = () => {
  return (
    <AnimatedSection
      className="relative mb-10 overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-slate-950 via-primary to-secondary py-14 text-white shadow-2xl md:py-16"
      delay={0}
    >
      {/* Décor de fond */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-20 left-0 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.14),transparent_35%)]" />
        <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:32px_32px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <div className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-white/90 backdrop-blur-sm">
            Expérience Premium
          </div>

          <h2 className="mt-4 text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
            Des avantages{" "}
            <span className="bg-gradient-to-r from-white via-white/90 to-white/70 bg-clip-text text-transparent">
              exclusifs
            </span>
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-white/75 sm:text-base">
            Tout ce dont vous avez besoin pour une location de voiture réussie
            à Madagascar : flexibilité, sérénité, accompagnement et économies.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
          {features?.map((feature, index) => (
            <AnimatedItem key={index} delay={100 + index * 100}>
              <div className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/15 bg-white/10 p-6 text-center shadow-lg backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:border-white/30 hover:bg-white/15 hover:shadow-2xl">
                {/* Accent haut */}
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-white/70 via-white/30 to-white/70 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                <div className="mx-auto mb-6 flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-white shadow-md ring-1 ring-white/20 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                  <feature.icon className="h-8 w-8 text-primary" />
                </div>

                <h3 className="mb-3 text-xl font-semibold leading-snug text-white">
                  {feature.title}
                </h3>

                <p className="flex-grow text-sm leading-7 text-white/75">
                  {feature.description}
                </p>

                <div className="mt-6 h-px w-full bg-gradient-to-r from-transparent via-white/30 to-transparent" />
              </div>
            </AnimatedItem>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
};