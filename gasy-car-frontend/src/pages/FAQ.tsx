import { Input } from "@/components/ui/input";
import {
  Banknote,
  Bookmark,
  BusFront,
  CalendarCheck,
  ChevronDown,
  CircleDollarSign,
  ClipboardList,
  CreditCard,
  FileText,
  Handshake,
  Plane,
  Receipt,
  Search,
  Settings,
  Shield,
  Siren,
  Sparkles,
  TriangleAlert,
  User,
  Wrench,
} from "lucide-react";
import { type ReactNode, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  buildHelpArticleRoute,
  buildHelpCategoryRoute,
} from "@/components/help-center/helpRoutes";

type ArticleSection = {
  title: string;
  icon: ReactNode;
  links: string[];
  moreLabel: string;
  allLinks?: string[];
};

type HelpCenterContent = {
  featuredArticles: string[];
  sections: ArticleSection[];
};

const helpCenterByTab: Record<"guests" | "hosts", HelpCenterContent> = {
  guests: {
    featuredArticles: [
      "Messagerie avec votre hôte",
      "Annuler un voyage avec votre hôte",
      "Remboursements",
      "Prise en charge et retour",
      "Méthodes de paiement acceptées",
      "Admissibilité du conducteur",
      "Coût d'un voyage",
      "Prolonger un voyage",
      "Numéros d'assistance routière",
    ],
    sections: [
      {
        title: "Premiers pas",
        icon: <BusFront className="h-6 w-6" />,
        links: [
          "Réserver une voiture",
          "Admissibilité du conducteur",
          "Vérification d'identité",
        ],
        allLinks: [
          "Réserver une voiture",
          "Admissibilité du conducteur",
          "Vérification d'identité",
          "Compte unique utilisateur",
          "Où Mcar opère",
        ],
        moreLabel: "Voir les 5 articles",
      },
      {
        title: "Planifier votre trajet",
        icon: <Bookmark className="h-6 w-6" />,
        links: [
          "Vérification avant départ",
          "Prise en charge et retour",
          "Ajouter un conducteur",
        ],
        allLinks: [
          "Vérification avant départ",
          "Prise en charge et retour",
          "Ajouter un conducteur",
          "Utilisation avec chauffeur",
          "Messagerie avec votre hôte",
        ],
        moreLabel: "Voir les 5 articles",
      },
      {
        title: "Paiement de votre location",
        icon: <CircleDollarSign className="h-6 w-6" />,
        links: [
          "Méthodes de paiement acceptées",
          "Coût d'un voyage",
          "Dépôt de garantie",
        ],
        allLinks: [
          "Méthodes de paiement acceptées",
          "Coût d'un voyage",
          "Dépôt de garantie",
          "Factures impayées",
          "Promotions et crédits",
          "Remboursements",
        ],
        moreLabel: "Voir les 6 articles",
      },
      {
        title: "Changer ou annuler un voyage",
        icon: <FileText className="h-6 w-6" />,
        links: [
          "Annuler un voyage avec votre hôte",
          "Modifier une réservation",
          "Prolonger un voyage",
        ],
        allLinks: [
          "Annuler un voyage avec votre hôte",
          "Modifier une réservation",
          "Prolonger un voyage",
          "Absence du voyageur (No-show)",
          "Circonstances exceptionnelles",
        ],
        moreLabel: "Voir les 5 articles",
      },
      {
        title: "Organisation de la livraison aéroport",
        icon: <Plane className="h-6 w-6" />,
        links: [
          "Prise en charge aéroport Antananarivo",
          "Prise en charge aéroport Nosy Be",
          "Prise en charge aéroport Toamasina",
        ],
        moreLabel: "Voir les 3 articles",
      },
      {
        title: "Comprendre les responsabilités de l'invité",
        icon: <Handshake className="h-6 w-6" />,
        links: [
          "Respect du code de la route",
          "Amendes et péages",
          "Carburant et recharge",
        ],
        allLinks: [
          "Respect du code de la route",
          "Amendes et péages",
          "Carburant et recharge",
          "Objets oubliés",
          "Usages interdits",
        ],
        moreLabel: "Voir les 5 articles",
      },
      {
        title: "Gestion des incidents",
        icon: <TriangleAlert className="h-6 w-6" />,
        links: [
          "Numéros d'assistance routière",
          "Procédure en cas d'incident",
          "Vol ou accident",
        ],
        allLinks: [
          "Numéros d'assistance routière",
          "Procédure en cas d'incident",
          "Vol ou accident",
          "Véhicule en panne",
        ],
        moreLabel: "Voir les 4 articles",
      },
      {
        title: "Gérer votre compte",
        icon: <User className="h-6 w-6" />,
        links: [
          "Réinitialiser le mot de passe",
          "Modifier email et téléphone",
          "Suspension de compte",
        ],
        allLinks: [
          "Réinitialiser le mot de passe",
          "Modifier email et téléphone",
          "Suspension de compte",
          "Prévention de fraude",
        ],
        moreLabel: "Voir les 4 articles",
      },
    ],
  },
  hosts: {
    featuredArticles: [
      "Démarrer en tant qu'hôte",
      "Publier un véhicule",
      "Documents obligatoires du véhicule",
      "Assurance obligatoire de l’hôte",
      "Gestion des réservations",
      "Annulation par l’hôte",
      "Paiements et versements",
      "Maintenance obligatoire",
      "Gestion des dommages véhicule",
    ],
    sections: [
      {
        title: "Premiers pas",
        icon: <BusFront className="h-6 w-6" />,
        links: [
          "Démarrer en tant qu'hôte",
          "Publier un véhicule",
          "Documents obligatoires du véhicule",
        ],
        allLinks: [
          "Démarrer en tant qu'hôte",
          "Publier un véhicule",
          "Documents obligatoires du véhicule",
          "Assurance obligatoire de l’hôte",
        ],
        moreLabel: "Voir les 4 articles",
      },
      {
        title: "Tarifer votre véhicule",
        icon: <Banknote className="h-6 w-6" />,
        links: [
          "Tarification de location",
          "Remises et promotions hôte",
          "Paiements et versements",
        ],
        allLinks: [
          "Tarification de location",
          "Remises et promotions hôte",
          "Paiements et versements",
          "Taxes de l’hôte",
        ],
        moreLabel: "Voir les 4 articles",
      },
      {
        title: "Paramètres et options",
        icon: <Settings className="h-6 w-6" />,
        links: [
          "Disponibilité du véhicule",
          "Livraison du véhicule",
          "Gestion des réservations",
        ],
        allLinks: [
          "Disponibilité du véhicule",
          "Livraison du véhicule",
          "Gestion des réservations",
          "Check-in et check-out",
        ],
        moreLabel: "Voir les 4 articles",
      },
      {
        title: "Recevoir des paiements",
        icon: <CircleDollarSign className="h-6 w-6" />,
        links: [
          "Paiements et versements",
          "Refus de paiement et recouvrement",
          "Taxes de l’hôte",
        ],
        allLinks: [
          "Paiements et versements",
          "Refus de paiement et recouvrement",
          "Taxes de l’hôte",
          "Gestion des dommages véhicule",
        ],
        moreLabel: "Voir les 4 articles",
      },
      {
        title: "Gérer les réservations et voyages",
        icon: <CalendarCheck className="h-6 w-6" />,
        links: [
          "Gestion des réservations",
          "Check-in et check-out",
          "Annulation par l’hôte",
        ],
        allLinks: [
          "Gestion des réservations",
          "Check-in et check-out",
          "Annulation par l’hôte",
          "Prolonger un voyage",
        ],
        moreLabel: "Voir les 4 articles",
      },
      {
        title: "Gérer votre annonce véhicule",
        icon: <ClipboardList className="h-6 w-6" />,
        links: [
          "Publier un véhicule",
          "Maintenance obligatoire",
          "Disponibilité du véhicule",
        ],
        allLinks: [
          "Publier un véhicule",
          "Maintenance obligatoire",
          "Disponibilité du véhicule",
          "Sanctions et résiliation du compte",
        ],
        moreLabel: "Voir les 4 articles",
      },
      {
        title: "Prendre des mesures de sécurité",
        icon: <Siren className="h-6 w-6" />,
        links: [
          "Assurance obligatoire de l’hôte",
          "Procédure en cas d'incident",
          "Numéros d'assistance routière",
        ],
        allLinks: [
          "Assurance obligatoire de l’hôte",
          "Procédure en cas d'incident",
          "Numéros d'assistance routière",
          "Usages interdits",
        ],
        moreLabel: "Voir les 4 articles",
      },
      {
        title: "Politiques véhicule",
        icon: <CreditCard className="h-6 w-6" />,
        links: [
          "Usages interdits",
          "Gestion des dommages véhicule",
          "Maintenance obligatoire",
        ],
        allLinks: [
          "Usages interdits",
          "Gestion des dommages véhicule",
          "Maintenance obligatoire",
          "Vol ou accident",
        ],
        moreLabel: "Voir les 4 articles",
      },
      {
        title: "Comprendre et choisir la protection",
        icon: <Shield className="h-6 w-6" />,
        links: [
          "Assurance obligatoire de l’hôte",
          "Gestion des dommages véhicule",
          "Vol ou accident",
        ],
        moreLabel: "Voir les 3 articles",
      },
      {
        title: "Gérer les dommages véhicule",
        icon: <Wrench className="h-6 w-6" />,
        links: [
          "Gestion des dommages véhicule",
          "Procédure en cas d'incident",
          "Refus de paiement et recouvrement",
        ],
        moreLabel: "Voir les 3 articles",
      },
      {
        title: "Taxes",
        icon: <Receipt className="h-6 w-6" />,
        links: ["Taxes de l’hôte", "Paiements et versements", "Coût d'un voyage"],
        moreLabel: "Voir les 3 articles",
      },
    ],
  },
};

const FAQ = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"guests" | "hosts">("guests");
  const [expandedSections, setExpandedSections] = useState<string[]>([]);

  const activeContent = helpCenterByTab[activeTab];

  const filteredFeatured = useMemo(
    () =>
      activeContent.featuredArticles.filter((article) =>
        article.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    [activeContent.featuredArticles, searchTerm],
  );

  const filteredSections = useMemo(
    () =>
      activeContent.sections
        .map((section) => {
          const sourceLinks = section.allLinks ?? section.links;
          const filteredLinks = sourceLinks.filter((link) =>
            link.toLowerCase().includes(searchTerm.toLowerCase()),
          );

          return {
            ...section,
            links: filteredLinks,
          };
        })
        .filter((section) => section.links.length > 0 || searchTerm.length === 0),
    [activeContent.sections, searchTerm],
  );

  const stats = useMemo(
    () => [
      {
        label: "Articles utiles",
        value: activeContent.featuredArticles.length,
      },
      {
        label: "Catégories",
        value: activeContent.sections.length,
      },
      {
        label: "Recherche rapide",
        value: searchTerm ? "Active" : "Prête",
      },
    ],
    [activeContent.featuredArticles.length, activeContent.sections.length, searchTerm],
  );

  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-slate-50/60 to-white text-[#121214]">
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1489824904134-891ab64532f1?auto=format&fit=crop&q=80&w=1920')",
          }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(13,27,42,0.96),rgba(13,27,42,0.88),rgba(8,47,73,0.82))]" />
        <div className="absolute inset-0 bg-black/35" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/20 to-black/20" />
        <div className="absolute -top-20 -left-16 h-72 w-72 rounded-full bg-emerald-400/20 blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-sky-400/20 blur-3xl animate-pulse" />

        <div className="relative mx-auto flex w-full max-w-7xl flex-col px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <div className="max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-700 rounded-[2rem] bg-black/20 backdrop-blur-[2px] px-4 py-6 sm:px-6 sm:py-8">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 backdrop-blur-md shadow-lg">
              {/* <Sparkles className="h-4 w-4 text-emerald-300" /> */}
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/95 sm:text-sm">
                Support & assistance
              </span>
            </div>

            <h1 className="text-4xl font-bold tracking-tight text-white drop-shadow-[0_4px_18px_rgba(0,0,0,0.45)] sm:text-5xl lg:text-6xl">
              Centre d&apos;aide{" "}
              <span className="bg-gradient-to-r from-emerald-300 via-sky-300 to-blue-400 bg-clip-text text-transparent">
                Mcar
              </span>
            </h1>

            <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/90 drop-shadow-[0_2px_10px_rgba(0,0,0,0.35)] sm:text-lg lg:text-xl">
              Trouvez rapidement les réponses pour vos réservations, paiements,
              incidents, comptes et publications de véhicules.
            </p>

            <div className="mt-8 max-w-2xl">
              <div className="rounded-[1.75rem] border border-white/10 bg-white/10 p-3 shadow-2xl backdrop-blur-md">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/55" />
                  <Input
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Rechercher des articles"
                    className="h-14 rounded-2xl border-white/10 bg-white/95 pl-11 text-[15px] shadow-none placeholder:text-slate-400 focus-visible:ring-0"
                  />
                </div>
              </div>
            </div>

            <div className="mt-8 grid max-w-3xl grid-cols-1 gap-3 sm:grid-cols-3">
              {stats.map((item, index) => (
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

            <div className="mt-8 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => {
                  setActiveTab("guests");
                  setExpandedSections([]);
                }}
                className={`rounded-full px-5 py-3 text-sm font-semibold transition-all duration-300 ${
                  activeTab === "guests"
                    ? "bg-white text-[#0D1B2A] shadow-lg"
                    : "border border-white/15 bg-white/10 text-white hover:bg-white/15"
                }`}
              >
                Voyageurs
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab("hosts");
                  setExpandedSections([]);
                }}
                className={`rounded-full px-5 py-3 text-sm font-semibold transition-all duration-300 ${
                  activeTab === "hosts"
                    ? "bg-white text-[#0D1B2A] shadow-lg"
                    : "border border-white/15 bg-white/10 text-white hover:bg-white/15"
                }`}
              >
                Hôtes
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED */}
      <section className="mx-auto -mt-8 w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl sm:p-8">
          <div className="mb-6 flex items-center gap-3 text-primary">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
              <Bookmark className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                Articles mis en avant
              </h2>
              <p className="text-sm text-slate-500">
                Les sujets les plus consultés du moment
              </p>
            </div>
          </div>

          {filteredFeatured.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {filteredFeatured.map((article, index) => (
                <Link
                  key={article}
                  to={buildHelpArticleRoute(article)}
                  className="group rounded-2xl border border-slate-200 bg-slate-50/70 p-4 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:bg-white hover:shadow-lg animate-in fade-in slide-in-from-bottom-4"
                  style={{ animationDelay: `${index * 60}ms` }}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Bookmark className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 transition-colors group-hover:text-primary">
                        {article}
                      </h3>
                      <p className="mt-1 text-sm text-slate-500">
                        Accéder rapidement à cet article d’aide.
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center text-slate-500">
              Aucun article mis en avant ne correspond à votre recherche.
            </div>
          )}
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="mx-auto mt-10 w-full max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mb-8">
          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            Parcourir par thème
          </span>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Catégories d’assistance
          </h2>
          <p className="mt-3 max-w-2xl text-base text-slate-500">
            Explorez les sujets les plus importants selon votre profil et trouvez
            vos réponses plus rapidement.
          </p>
        </div>

        {filteredSections.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filteredSections.map((section, index) => {
              const shouldShowToggle = section.links.length > 3;
              const isExpanded = expandedSections.includes(section.title);
              const visibleLinks = isExpanded ? section.links : section.links.slice(0, 3);

              return (
                <article
                  key={section.title}
                  className="group rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl animate-in fade-in slide-in-from-bottom-4"
                  style={{ animationDelay: `${index * 70}ms` }}
                >
                  <div className="mb-5 flex items-start gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-105">
                      {section.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold leading-tight text-slate-900">
                        {section.title}
                      </h3>
                      <p className="mt-1 text-sm text-slate-500">
                        {section.links.length} article
                        {section.links.length > 1 ? "s" : ""} disponible
                        {section.links.length > 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>

                  <ul className="space-y-3">
                    {visibleLinks.map((link) => (
                      <li key={link}>
                        <Link
                          to={buildHelpArticleRoute(link)}
                          className="block rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-3 text-sm font-medium text-slate-700 transition-all duration-200 hover:border-primary/20 hover:bg-primary/5 hover:text-primary"
                        >
                          {link}
                        </Link>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-5 border-t border-slate-100 pt-4">
                    {shouldShowToggle ? (
                      <button
                        type="button"
                        onClick={() =>
                          setExpandedSections((current) =>
                            current.includes(section.title)
                              ? current.filter((title) => title !== section.title)
                              : [...current, section.title],
                          )
                        }
                        className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition hover:text-primary/80"
                      >
                        {isExpanded ? "Voir moins" : section.moreLabel}
                        <ChevronDown
                          className={`h-4 w-4 transition-transform duration-300 ${
                            isExpanded ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                    ) : (
                      <Link
                        to={buildHelpCategoryRoute(section.moreLabel)}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition hover:text-primary/80"
                      >
                        {section.moreLabel}
                        <ChevronDown className="h-4 w-4 -rotate-90" />
                      </Link>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="rounded-[2rem] border border-slate-200 bg-white px-6 py-14 text-center shadow-sm">
            <h3 className="text-2xl font-semibold text-slate-900">
              Aucun résultat trouvé
            </h3>
            <p className="mt-2 text-slate-500">
              Essayez un autre mot-clé pour trouver l’article d’aide recherché.
            </p>
          </div>
        )}
      </section>
    </main>
  );
};

export default FAQ;