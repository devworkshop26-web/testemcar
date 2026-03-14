import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  CalendarCheck,
  CarFront,
  CheckCircle2,
  Clock3,
  FileText,
  MapPinned,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
  Wallet,
} from "lucide-react";

const benefits = [
  {
    icon: <Wallet className="h-6 w-6 text-emerald-600" />,
    title: "Générez des revenus",
    desc: "Monétisez votre véhicule quand vous ne l’utilisez pas et créez une source de revenu complémentaire.",
  },
  {
    icon: <ShieldCheck className="h-6 w-6 text-emerald-600" />,
    title: "Cadre plus rassurant",
    desc: "Profitez d’un processus plus clair pour publier, louer et gérer vos réservations.",
  },
  {
    icon: <Users className="h-6 w-6 text-emerald-600" />,
    title: "Touchez plus de clients",
    desc: "Exposez votre véhicule à des voyageurs et clients à la recherche d’une location fiable à Madagascar.",
  },
  {
    icon: <CalendarCheck className="h-6 w-6 text-emerald-600" />,
    title: "Gérez votre disponibilité",
    desc: "Choisissez les jours où votre véhicule est disponible et gardez le contrôle sur votre calendrier.",
  },
];

const steps = [
  {
    number: "01",
    icon: <CarFront className="h-6 w-6 text-white" />,
    title: "Créez votre compte",
    desc: "Inscrivez-vous en quelques minutes et complétez votre profil hôte.",
    color: "from-amber-500 to-orange-500",
  },
  {
    number: "02",
    icon: <FileText className="h-6 w-6 text-white" />,
    title: "Ajoutez votre véhicule",
    desc: "Publiez votre annonce avec photos, informations, prix et disponibilités.",
    color: "from-sky-500 to-blue-600",
  },
  {
    number: "03",
    icon: <BadgeCheck className="h-6 w-6 text-white" />,
    title: "Recevez des réservations",
    desc: "Validez les demandes, échangez avec les clients et louez votre véhicule sereinement.",
    color: "from-emerald-500 to-green-600",
  },
];

const trustPoints = [
  "Publication simple et rapide",
  "Gestion claire des réservations",
  "Visibilité auprès des voyageurs",
  "Processus plus professionnel",
  "Meilleure présentation de votre offre",
  "Expérience plus fluide pour vous et vos clients",
];

const faqItems = [
  {
    q: "Qui peut devenir hôte ?",
    a: "Toute personne disposant d’un véhicule conforme et des documents requis peut proposer son véhicule sur la plateforme.",
  },
  {
    q: "Combien coûte l’inscription ?",
    a: "L’inscription est simple. Vous pouvez ensuite compléter votre annonce et commencer à recevoir des demandes.",
  },
  {
    q: "Puis-je choisir mes disponibilités ?",
    a: "Oui. Vous gardez la main sur les jours de disponibilité, le prix et les conditions de votre véhicule.",
  },
];

const hostStats = [
  { value: "Simple", label: "Mise en ligne" },
  { value: "Flexible", label: "Disponibilités" },
  { value: "Visible", label: "Auprès des voyageurs" },
];

const BecomeOwner = () => {
  return (
    <main className="min-h-screen overflow-x-hidden bg-gradient-to-b from-white via-slate-50/60 to-white text-slate-900">
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=1920')",
          }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(13,27,42,0.96),rgba(13,27,42,0.88),rgba(8,47,73,0.72))]" />
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.20),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(56,189,248,0.22),transparent_30%)]" />
        <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] [background-size:44px_44px]" />

        <div className="absolute -top-20 -left-16 h-72 w-72 rounded-full bg-emerald-400/20 blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-sky-400/20 blur-3xl animate-pulse" />

        <div className="relative z-10 mx-auto grid min-h-[92vh] w-full max-w-[1380px] items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr,0.95fr] lg:px-10 xl:px-12">
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 backdrop-blur-md shadow-lg">
              {/* <Sparkles className="h-4 w-4 text-emerald-300" /> */}
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/95 sm:text-sm">
                Devenir hôte sur Madagasycar
              </span>
            </div>

            <h1 className="max-w-4xl text-4xl font-bold tracking-tight text-white drop-shadow-[0_4px_18px_rgba(0,0,0,0.45)] sm:text-5xl lg:text-6xl xl:text-7xl">
              Faites travailler
              <br />
              <span className="bg-gradient-to-r from-emerald-300 via-sky-300 to-blue-400 bg-clip-text text-transparent">
                votre véhicule
              </span>
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/90 drop-shadow-[0_2px_10px_rgba(0,0,0,0.35)] sm:text-lg lg:text-xl">
              Transformez votre voiture en opportunité. Publiez votre véhicule,
              touchez plus de voyageurs et générez des revenus grâce à une
              expérience plus moderne, plus claire et plus professionnelle.
            </p>

            <div className="mt-8 flex flex-wrap gap-3 sm:gap-4">
              <Link
                to="/register"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-[#0D1B2A] shadow-2xl transition-all duration-300 hover:-translate-y-0.5 hover:bg-slate-100 hover:shadow-white/10 sm:text-base"
              >
                Créer mon compte hôte
                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>

              <Link
                to="/comment-ca-marche"
                className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/10 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/15 sm:text-base"
              >
                Voir comment ça marche
              </Link>
            </div>

            <div className="mt-10 grid max-w-3xl grid-cols-1 gap-3 sm:grid-cols-3">
              {hostStats.map((item, index) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-white/10 bg-white/10 px-4 py-4 text-white shadow-lg backdrop-blur-md animate-in fade-in slide-in-from-bottom-4 duration-700"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="text-2xl font-bold">{item.value}</div>
                  <p className="mt-1 text-sm text-white/75">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Hero visual */}
          <div className="relative hidden lg:block animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
            <div className="relative mx-auto max-w-[520px]">
              <div className="absolute -left-8 top-12 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-white shadow-xl backdrop-blur-md">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/70">
                  Potentiel
                </p>
                <p className="mt-1 text-lg font-bold">Votre voiture devient un atout</p>
              </div>

              <div className="absolute -right-4 bottom-12 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-white shadow-xl backdrop-blur-md">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/70">
                  Flexibilité
                </p>
                <p className="mt-1 text-lg font-bold">Vous gardez le contrôle</p>
              </div>

              <div className="overflow-hidden rounded-[2.25rem] border border-white/15 bg-white/10 p-3 shadow-[0_30px_80px_rgba(0,0,0,0.35)] backdrop-blur-md">
                <div className="rounded-[1.75rem] bg-white shadow-2xl">
                  <div className="relative h-[360px] overflow-hidden rounded-t-[1.75rem]">
                    <img
                      src="https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&q=80&w=1200"
                      alt="Véhicule hôte"
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
                    <div className="absolute left-5 top-5 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-900 shadow">
                      Hôte premium
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-2xl font-bold text-slate-900">
                          Présentez votre voiture
                        </h3>
                        <p className="mt-1 text-sm text-slate-500">
                          Plus visible, plus professionnelle, plus convaincante.
                        </p>
                      </div>
                      <div className="rounded-2xl bg-emerald-50 px-3 py-2 text-emerald-700">
                        <Star className="h-5 w-5 fill-current" />
                      </div>
                    </div>

                    <div className="mt-6 grid grid-cols-3 gap-3">
                      <div className="rounded-2xl bg-slate-50 p-4 text-center">
                        <Wallet className="mx-auto h-5 w-5 text-emerald-600" />
                        <p className="mt-2 text-sm font-semibold text-slate-900">Revenus</p>
                      </div>
                      <div className="rounded-2xl bg-slate-50 p-4 text-center">
                        <CalendarCheck className="mx-auto h-5 w-5 text-sky-600" />
                        <p className="mt-2 text-sm font-semibold text-slate-900">Planning</p>
                      </div>
                      <div className="rounded-2xl bg-slate-50 p-4 text-center">
                        <Users className="mx-auto h-5 w-5 text-violet-600" />
                        <p className="mt-2 text-sm font-semibold text-slate-900">Visibilité</p>
                      </div>
                    </div>

                    <div className="mt-6 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 p-4 text-white">
                      <p className="text-xs uppercase tracking-[0.2em] text-white/60">
                        Madagasycar
                      </p>
                      <p className="mt-2 text-base font-semibold">
                        Une mise en avant plus moderne pour attirer les bons voyageurs.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="mx-auto -mt-12 w-full max-w-[1380px] px-4 sm:px-6 lg:px-10 xl:px-12">
        <div className="rounded-[2.25rem] border border-slate-200/80 bg-white/90 p-6 shadow-[0_20px_70px_rgba(15,23,42,0.08)] backdrop-blur sm:p-8 lg:p-10">
          <div className="mb-10 text-center">
            <span className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
              Pourquoi devenir hôte
            </span>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
              Une meilleure façon de rentabiliser votre voiture
            </h2>
            <p className="mt-3 mx-auto max-w-2xl text-base text-slate-500 sm:text-lg">
              Madagasycar vous aide à présenter votre véhicule avec plus de
              clarté et à toucher des clients dans un cadre plus professionnel.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {benefits.map((item, index) => (
              <div
                key={item.title}
                className="group relative overflow-hidden rounded-[1.85rem] border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl animate-in fade-in slide-in-from-bottom-4"
                style={{ animationDelay: `${index * 70}ms` }}
              >
                <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-emerald-400 via-sky-400 to-blue-500" />
                <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-emerald-50 transition-transform duration-500 group-hover:scale-125" />

                <div className="relative">
                  <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-50 to-sky-50 shadow-sm">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="mx-auto w-full max-w-[1380px] px-4 py-16 sm:px-6 sm:py-20 lg:px-10 xl:px-12">
        <div className="mb-12 text-center">
          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            Comment ça marche
          </span>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            Devenir hôte en 3 étapes
          </h2>
          <p className="mt-3 mx-auto max-w-2xl text-base text-slate-500 sm:text-lg">
            Commencez facilement et gardez le contrôle sur votre activité.
          </p>
        </div>

        <div className="relative grid gap-5 md:grid-cols-3">
          <div className="absolute left-[16.66%] right-[16.66%] top-7 hidden h-px bg-gradient-to-r from-amber-300 via-sky-300 to-emerald-300 md:block" />
          {steps.map((step, index) => (
            <div
              key={step.number}
              className="group relative rounded-[1.85rem] border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl animate-in fade-in slide-in-from-bottom-4"
              style={{ animationDelay: `${index * 90}ms` }}
            >
              <div className="mb-5 flex items-center justify-between">
                <div
                  className={`relative z-10 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${step.color} shadow-lg`}
                >
                  {step.icon}
                </div>
                <span className="text-sm font-bold tracking-[0.2em] text-slate-300">
                  {step.number}
                </span>
              </div>

              <h3 className="text-xl font-semibold text-slate-900">
                {step.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* TRUST SECTION */}
      <section className="relative overflow-hidden py-16 sm:py-20">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(13,27,42,0.98),rgba(8,47,73,0.95))]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.16),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.18),transparent_26%)]" />

        <div className="relative mx-auto w-full max-w-[1380px] px-4 sm:px-6 lg:px-10 xl:px-12">
          <div className="grid items-center gap-8 lg:grid-cols-[1.02fr,0.98fr]">
            <div className="text-white">
              <span className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300">
                Confiance & visibilité
              </span>
              <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                Présentez votre véhicule
                <br />
                de manière plus professionnelle
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/75 sm:text-lg">
                Avec Madagasycar, votre annonce s’intègre dans une plateforme
                pensée pour rassurer les voyageurs et faciliter la mise en
                relation.
              </p>

              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {trustPoints.map((point, index) => (
                  <div
                    key={point}
                    className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-4 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-4 duration-700"
                    style={{ animationDelay: `${index * 60}ms` }}
                  >
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-300" />
                    <span className="text-sm text-white/85 sm:text-base">{point}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute -left-4 -top-4 h-24 w-24 rounded-full bg-emerald-400/20 blur-2xl" />
              <div className="rounded-[2rem] border border-white/10 bg-white/95 p-6 shadow-[0_30px_80px_rgba(0,0,0,0.30)] sm:p-8">
                <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-emerald-700">
                  <Star className="h-4 w-4" />
                  <span className="text-sm font-semibold">Exemple de valeur</span>
                </div>

                <h3 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                  Votre voiture peut devenir un vrai atout
                </h3>
                <p className="mt-3 text-slate-600 leading-relaxed">
                  Si votre véhicule reste souvent stationné, vous pouvez le
                  proposer à la location et attirer des clients à la recherche
                  d’une solution pratique pour leurs déplacements à Madagascar.
                </p>

                <div className="mt-6 space-y-4">
                  <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                    <Clock3 className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium text-slate-900">Plus de flexibilité</p>
                      <p className="text-sm text-slate-500">
                        Vous choisissez les jours de location.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                    <MapPinned className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium text-slate-900">Plus de visibilité</p>
                      <p className="text-sm text-slate-500">
                        Votre annonce est vue par des voyageurs et clients.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                    <BadgeCheck className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium text-slate-900">Plus de crédibilité</p>
                      <p className="text-sm text-slate-500">
                        Votre offre s’intègre dans un environnement plus structuré.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 border-t border-slate-200 pt-5">
                  <Link
                    to="/register"
                    className="group inline-flex items-center gap-2 text-sm font-semibold text-primary transition hover:text-primary/80 sm:text-base"
                  >
                    Commencer maintenant
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ MINI */}
      <section className="mx-auto w-full max-w-[1380px] px-4 py-16 sm:px-6 sm:py-20 lg:px-10 xl:px-12">
        <div className="mb-12 text-center">
          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            Questions fréquentes
          </span>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            Avant de vous lancer
          </h2>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {faqItems.map((item, index) => (
            <div
              key={item.q}
              className="group rounded-[1.85rem] border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl animate-in fade-in slide-in-from-bottom-4"
              style={{ animationDelay: `${index * 80}ms` }}
            >
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-50 to-emerald-50 text-primary shadow-sm">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">{item.q}</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">
                {item.a}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="pb-20">
        <div className="mx-auto w-full max-w-[1380px] px-4 sm:px-6 lg:px-10 xl:px-12">
          <div className="relative overflow-hidden rounded-[2.25rem] bg-gradient-to-r from-primary via-sky-600 to-secondary px-6 py-12 text-white shadow-[0_30px_80px_rgba(37,99,235,0.28)] sm:px-8 lg:px-12">
            <div className="absolute inset-0 opacity-15 [background-image:linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] [background-size:42px_42px]" />
            <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute bottom-0 left-0 h-40 w-40 rounded-full bg-white/10 blur-3xl" />

            <div className="relative z-10 max-w-3xl">
              <span className="text-sm font-semibold uppercase tracking-[0.2em] text-white/85">
                Prêt à commencer ?
              </span>
              <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                Convaincu ? Inscrivez-vous et publiez votre véhicule
              </h2>
              <p className="mt-4 text-base leading-relaxed text-white/85 sm:text-lg">
                Rejoignez Madagasycar et transformez votre voiture en opportunité.
                Créez votre compte, ajoutez votre annonce et commencez à recevoir
                vos premières demandes.
              </p>

              <div className="mt-8 flex flex-wrap gap-3 sm:gap-4">
                <Link
                  to="/register"
                  className="group inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-[#0D1B2A] shadow-2xl transition-all duration-300 hover:-translate-y-0.5 hover:bg-slate-100 sm:text-base"
                >
                  S’inscrire maintenant
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>

                <Link
                  to="/faq"
                  className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/10 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/15 sm:text-base"
                >
                  Voir le centre d’aide
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default BecomeOwner;
