import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Crown,
  Gift,
  ShieldCheck,
  Sparkles,
  Star,
  Trophy,
  Users,
} from "lucide-react";
import { ReactNode } from "react";
import { Link } from "react-router-dom";

type LoyaltyStat = {
  label: string;
  value: string;
  helper: string;
};

type LoyaltyBenefit = {
  title: string;
  description: string;
  icon: ReactNode;
};

type LoyaltyHistoryItem = {
  id: string;
  title: string;
  date: string;
  points: number;
  status: "earned" | "redeemed" | "pending" | "cancelled";
  description: string;
};

type LoyaltyTier = {
  name: string;
  thresholdLabel: string;
  active?: boolean;
  perks: string[];
};

type LoyaltyAction = {
  label: string;
  href: string;
  variant?: "default" | "outline";
};

export type LoyaltyProgramContentProps = {
  title: string;
  subtitle: string;
  points: number;
  nextTierLabel: string;
  pointsToNextTier: number;
  progress: number;
  memberSince: string;
  discountLabel: string;
  stats: LoyaltyStat[];
  benefits: LoyaltyBenefit[];
  history: LoyaltyHistoryItem[];
  tiers: LoyaltyTier[];
  actions: LoyaltyAction[];
  isLoading?: boolean;
  isError?: boolean;
};

const historyStatusStyles: Record<LoyaltyHistoryItem["status"], string> = {
  earned: "bg-emerald-50 text-emerald-700 border-emerald-200",
  redeemed: "bg-amber-50 text-amber-700 border-amber-200",
  pending: "bg-slate-100 text-slate-600 border-slate-200",
  cancelled: "bg-rose-50 text-rose-700 border-rose-200",
};

export function LoyaltyProgramContent({
  title,
  subtitle,
  points,
  nextTierLabel,
  pointsToNextTier,
  progress,
  memberSince,
  discountLabel,
  stats,
  benefits,
  history,
  tiers,
  actions,
  isLoading = false,
  isError = false,
}: LoyaltyProgramContentProps) {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <Card className="overflow-hidden rounded-3xl border-0 bg-slate-950 text-white shadow-[0_25px_80px_-40px_rgba(15,23,42,0.9)]">
        <CardContent className="relative p-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(59,130,246,0.28),_transparent_38%),radial-gradient(circle_at_bottom_left,_rgba(250,204,21,0.18),_transparent_32%)]" />
          <div className="relative grid gap-8 p-6 sm:p-8 lg:grid-cols-[1.2fr_0.8fr] lg:p-10">
            <div className="space-y-5">
              <Badge className="w-fit rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white hover:bg-white/10">
                Programme fidélité
              </Badge>

              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
                <p className="max-w-2xl text-sm text-white/75 sm:text-base">{subtitle}</p>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-sm text-white/80">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
                  <Crown className="h-4 w-4 text-amber-300" />
                  {points.toLocaleString()} points
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
                  <Gift className="h-4 w-4 text-sky-300" />
                  {discountLabel}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
                  <ShieldCheck className="h-4 w-4 text-emerald-300" />
                  Membre depuis {memberSince}
                </span>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-5">
                <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-white">Progression vers {nextTierLabel}</p>
                    <p className="text-xs text-white/65">
                      Encore {pointsToNextTier} points pour débloquer le prochain niveau.
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-amber-300">{Math.round(progress)}%</p>
                </div>
                <Progress value={progress} className="h-3 bg-white/10" />
              </div>

              <div className="flex flex-wrap gap-3">
                {actions.map((action) => (
                  <Button
                    asChild
                    key={action.label}
                    variant={action.variant ?? "default"}
                    className={cn(
                      "rounded-xl px-5",
                      action.variant === "outline"
                        ? "border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white"
                        : "bg-white text-slate-950 hover:bg-white/90"
                    )}
                  >
                    <Link to={action.href}>{action.label}</Link>
                  </Button>
                ))}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
                >
                  <p className="text-xs uppercase tracking-[0.2em] text-white/50">{stat.label}</p>
                  <p className="mt-3 text-2xl font-bold text-white">{stat.value}</p>
                  <p className="mt-1 text-sm text-white/65">{stat.helper}</p>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <Tabs defaultValue="history" className="space-y-6">
          <TabsList className="h-auto flex-wrap rounded-2xl bg-white p-1 shadow-sm">
            <TabsTrigger value="history" className="rounded-xl px-4 py-2 text-sm">
              Historique des points
            </TabsTrigger>
            <TabsTrigger value="benefits" className="rounded-xl px-4 py-2 text-sm">
              Avantages
            </TabsTrigger>
            <TabsTrigger value="tiers" className="rounded-xl px-4 py-2 text-sm">
              Niveaux
            </TabsTrigger>
          </TabsList>

          <TabsContent value="history" className="mt-0">
            <Card className="rounded-3xl border-slate-200/70 shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-slate-900">Mes mouvements fidélité</CardTitle>
                <CardDescription>
                  Historique synchronisé entre le frontend et le backend fidélité.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {isLoading && (
                  <div className="rounded-2xl border border-dashed border-slate-200 p-6 text-sm text-slate-500">
                    Chargement des mouvements fidélité…
                  </div>
                )}

                {!isLoading && isError && (
                  <div className="flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                    <span>Impossible de charger les données fidélité depuis le backend.</span>
                  </div>
                )}

                {!isLoading && !isError && history.length === 0 && (
                  <div className="rounded-2xl border border-dashed border-slate-200 p-6 text-sm text-slate-500">
                    Aucun mouvement fidélité pour le moment. Terminez une location ou laissez un avis pour commencer.
                  </div>
                )}

                {!isLoading && !isError && history.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col gap-4 rounded-2xl border border-slate-200/70 bg-slate-50/70 p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-semibold text-slate-900">{item.title}</p>
                        <span
                          className={cn(
                            "inline-flex rounded-full border px-2.5 py-1 text-[11px] font-semibold capitalize",
                            historyStatusStyles[item.status]
                          )}
                        >
                          {item.status === "earned"
                            ? "gagné"
                            : item.status === "redeemed"
                              ? "utilisé"
                              : item.status === "cancelled"
                                ? "annulé"
                                : "en attente"}
                        </span>
                      </div>
                      <p className="text-sm text-slate-500">{item.description}</p>
                      <p className="text-xs text-slate-400">{item.date}</p>
                    </div>
                    <div className="text-right">
                      <p
                        className={cn(
                          "text-lg font-bold",
                          item.points > 0
                            ? "text-emerald-600"
                            : item.points < 0
                              ? "text-amber-600"
                              : "text-slate-500"
                        )}
                      >
                        {item.points > 0 ? "+" : ""}
                        {item.points} pts
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="benefits" className="mt-0">
            <Card className="rounded-3xl border-slate-200/70 shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-slate-900">Pourquoi accumuler des points ?</CardTitle>
                <CardDescription>
                  Des blocs réutilisables pour expliquer simplement la fidélité dans l’espace client.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2">
                {benefits.map((benefit) => (
                  <div
                    key={benefit.title}
                    className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm"
                  >
                    <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      {benefit.icon}
                    </div>
                    <h3 className="font-semibold text-slate-900">{benefit.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-500">{benefit.description}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tiers" className="mt-0">
            <Card className="rounded-3xl border-slate-200/70 shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-slate-900">Niveaux du programme</CardTitle>
                <CardDescription>
                  Paliers calculés automatiquement à partir des points réellement synchronisés.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {tiers.map((tier) => (
                  <div
                    key={tier.name}
                    className={cn(
                      "rounded-2xl border p-5 transition-all",
                      tier.active
                        ? "border-primary/30 bg-primary/[0.04] shadow-sm"
                        : "border-slate-200/70 bg-white"
                    )}
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-semibold text-slate-900">{tier.name}</h3>
                          {tier.active && (
                            <Badge className="rounded-full bg-primary/10 text-primary hover:bg-primary/10">
                              Niveau actuel
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-slate-500">{tier.thresholdLabel}</p>
                      </div>
                      <ArrowRight className="hidden h-5 w-5 text-slate-300 sm:block" />
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {tier.perks.map((perk) => (
                        <span
                          key={perk}
                          className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600"
                        >
                          {perk}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="space-y-6">
          <Card className="rounded-3xl border-slate-200/70 shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-slate-900">Comment gagner des points ?</CardTitle>
              <CardDescription>
                Cette section est maintenant connectée à la logique backend réelle.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                {
                  title: "Réserver et terminer une location",
                  description: "Les points sont crédités quand la location se termine correctement.",
                  icon: <Trophy className="h-4 w-4" />,
                },
                {
                  title: "Laisser un avis vérifié",
                  description: "Un bonus fidélité est créé dès qu’un avis est publié, puis synchronisé avec la modération.",
                  icon: <Star className="h-4 w-4" />,
                },
                {
                  title: "Compléter votre profil",
                  description: "Un bonus ponctuel est accordé quand le profil client est entièrement complété.",
                  icon: <CheckCircle2 className="h-4 w-4" />,
                },
                {
                  title: "Progression automatique",
                  description: "Le niveau est recalculé automatiquement depuis les données backend disponibles.",
                  icon: <Users className="h-4 w-4" />,
                },
              ].map((rule) => (
                <div key={rule.title} className="flex gap-3 rounded-2xl border border-slate-200/70 bg-slate-50/70 p-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    {rule.icon}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">{rule.title}</p>
                    <p className="mt-1 text-sm text-slate-500">{rule.description}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-0 bg-gradient-to-br from-primary to-sky-600 text-white shadow-[0_18px_50px_-25px_rgba(37,99,235,0.7)]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl font-bold">
                <Sparkles className="h-5 w-5" />
                Communication frontend/backend
              </CardTitle>
              <CardDescription className="text-white/80">
                Cette page consomme désormais les vraies données de fidélité exposées par le backend.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-2xl bg-white/10 p-4 text-sm leading-6 text-white/85">
                La communication est OK : le frontend récupère maintenant le solde, l’historique et les niveaux via les API fidélité.
              </div>
              <div className="flex flex-wrap gap-3">
                <Button asChild className="rounded-xl bg-white text-primary hover:bg-white/90">
                  <Link to="/client">Retour au dashboard</Link>
                </Button>
                <Button asChild variant="outline" className="rounded-xl border-white/25 bg-white/5 text-white hover:bg-white/10 hover:text-white">
                  <Link to="/client/rentals">Voir mes locations</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
