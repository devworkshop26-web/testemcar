import { AnimatedSection, AnimatedItem } from "@/components/animations";
import { steps } from "@/data/homeData";

/**
 * Section "Comment ça marche"
 * Affiche les 4 étapes du processus de location
 */
export const HowItWorksSection = () => {
  return (
    <AnimatedSection
      className="relative mb-10 overflow-hidden rounded-[2rem] border border-border/50 bg-gradient-to-br from-background via-muted/20 to-primary/5 py-14 md:py-16"
      delay={0}
    >
      {/* Décor de fond */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-16 left-0 h-44 w-44 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute right-0 bottom-0 h-56 w-56 rounded-full bg-secondary/10 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.55),transparent_35%)]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            Simplicité Garantie
          </div>

          <h2 className="mt-4 text-3xl font-bold leading-tight text-foreground sm:text-4xl md:text-5xl">
            Comment ça{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              fonctionne
            </span>{" "}
            ?
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
            Louez la voiture idéale en seulement{" "}
            <span className="font-semibold text-primary">4 étapes</span> simples,
            fluides et rapides.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          {steps?.map((step, index) => (
            <AnimatedItem key={index} delay={index * 150}>
              <div className="group relative h-full overflow-hidden rounded-3xl border border-border/50 bg-background/90 p-6 pt-10 text-center shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-2 hover:border-primary/30 hover:shadow-2xl">
                {/* Accent top */}
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary/70 via-secondary/70 to-primary/70 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                {/* Numéro */}
                <div className="absolute left-1/2 top-0 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-secondary text-lg font-bold text-white shadow-lg ring-4 ring-background transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                  {step.number}
                </div>

                {/* Icône */}
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/15 via-primary/10 to-secondary/10 ring-1 ring-primary/10 transition-all duration-300 group-hover:scale-110">
                  <step.icon className="h-8 w-8 text-primary" />
                </div>

                {/* Titre */}
                <h3 className="mb-3 text-xl font-bold leading-snug text-foreground">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-sm leading-7 text-muted-foreground">
                  {step.description}
                </p>

                <div className="mt-6 h-px w-full bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
              </div>
            </AnimatedItem>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
};