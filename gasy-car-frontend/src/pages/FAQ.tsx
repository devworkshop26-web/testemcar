import { Input } from "@/components/ui/input";
import {
  Banknote,
  Bookmark,
  BusFront,
  CalendarCheck,
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

  return (
    <main className="bg-[#f6f6f7] pb-20 text-[#121214]">
      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex w-full max-w-6xl flex-col px-4 pb-12 pt-16 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl">
            Centre d'aide ici
          </h1>
          <p className="mt-3 text-lg text-gray-600">
            Que pouvons-nous faire pour vous ?
          </p>

          <div className="mt-8 max-w-xl">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Rechercher des articles"
                className="h-12 rounded-md border-gray-300 bg-white pl-10"
              />
            </div>
          </div>

          <div className="mt-10 flex gap-8 border-b border-gray-200 text-sm font-semibold uppercase tracking-wider text-gray-500">
            <button
              type="button"
              onClick={() => {
                setActiveTab("guests");
                setExpandedSections([]);
              }}
              className={`border-b-2 pb-3 transition ${
                activeTab === "guests"
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent hover:text-gray-700"
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
              className={`border-b-2 pb-3 transition ${
                activeTab === "hosts"
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent hover:text-gray-700"
              }`}
            >
              Hôtes
            </button>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 pt-12 sm:px-6 lg:px-8">
        <div className="rounded-xl bg-[#efebff] p-6 sm:p-8">
          <div className="mb-6 flex items-center gap-3 text-indigo-600">
            <Bookmark className="h-7 w-7" />
            <h2 className="text-3xl font-bold text-[#151522]">Articles mis en avant</h2>
          </div>

          <div className="grid gap-x-8 gap-y-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredFeatured.map((article) => (
              <Link
                key={article}
                to={buildHelpArticleRoute(article)}
                className="border-b border-gray-300 pb-3 text-sm font-medium text-gray-700 hover:text-indigo-600"
              >
                {article}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto mt-12 grid w-full max-w-6xl gap-10 px-4 sm:px-6 md:grid-cols-2 lg:grid-cols-3 lg:px-8">
        {filteredSections.map((section) => (
          <article key={section.title} className="space-y-4">
            <div className="flex items-center gap-3 text-indigo-600">
              {section.icon}
              <h3 className="text-3xl font-bold leading-tight text-[#1a1a27]">
                {section.title}
              </h3>
            </div>
            {(() => {
              const shouldShowToggle = section.links.length > 3;
              const isExpanded = expandedSections.includes(section.title);
              const visibleLinks = isExpanded ? section.links : section.links.slice(0, 3);

              return (
                <>
                  <ul className="space-y-3">
                    {visibleLinks.map((link) => (
                      <li key={link}>
                        <Link
                          to={buildHelpArticleRoute(link)}
                          className="block border-b border-gray-300 pb-3 text-sm font-medium text-gray-700 hover:text-indigo-600"
                        >
                          {link}
                        </Link>
                      </li>
                    ))}
                  </ul>

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
                      className="text-sm font-semibold text-indigo-600 hover:text-indigo-500"
                    >
                      {isExpanded ? "Voir moins" : section.moreLabel}
                    </button>
                  ) : (
                    <Link
                      to={buildHelpCategoryRoute(section.moreLabel)}
                      className="text-sm font-semibold text-indigo-600 hover:text-indigo-500"
                    >
                      {section.moreLabel}
                    </Link>
                  )}
                </>
              );
            })()}
          </article>
        ))}
      </section>
    </main>
  );
};

export default FAQ;
