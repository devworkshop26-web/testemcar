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
import

 {
  buildHelpArticleRoute,
  buildHelpCategoryRoute,
} from "@/components/help-center/helpRoutes";

type ArticleSection = {
  title: string;
  icon: ReactNode;
  links: string[];
  moreLabel: string;
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
        links: ["Réserver une voiture", "Découvrir Mcar", "Location mensuelle"],
        moreLabel: "Voir les 16 articles",
      },
      {
        title: "Planifier votre trajet",
        icon: <Bookmark className="h-6 w-6" />,
        links: [
          "Vérification avant départ",
          "Sélectionner la prise en charge",
          "Ajouter un conducteur",
        ],
        moreLabel: "Voir les 17 articles",
      },
      {
        title: "Paiement de votre location",
        icon: <CircleDollarSign className="h-6 w-6" />,
        links: ["Paiement de votre trajet", "Remboursements", "Factures impayées"],
        moreLabel: "Voir les 28 articles",
      },
      {
        title: "Changer ou annuler un voyage",
        icon: <FileText className="h-6 w-6" />,
        links: ["Annulation hôte", "Étendre une location", "Voyages annulés"],
        moreLabel: "Voir les 11 articles",
      },
      {
        title: "Responsabilités invité",
        icon: <Handshake className="h-6 w-6" />,
        links: [
          "Révision d'un voyage",
          "Politique de chargeback",
          "Dommages pneus",
        ],
        moreLabel: "Voir les 13 articles",
      },
      {
        title: "Gestion des incidents",
        icon: <TriangleAlert className="h-6 w-6" />,
        links: [
          "Signaler un véhicule",
          "Assistance routière",
          "Urgence en voyage",
        ],
        moreLabel: "Voir les 10 articles",
      },
      {
        title: "Gérer votre compte",
        icon: <User className="h-6 w-6" />,
        links: [
          "Connexion impossible",
          "Modifier votre nom",
          "Mettre à jour votre permis",
        ],
        moreLabel: "Voir les 9 articles",
      },
      {
        title: "Assurance et protection",
        icon: <Shield className="h-6 w-6" />,
        links: [
          "Contacter les sinistres",
          "Assurance personnelle",
          "Couverture carte bancaire",
        ],
        moreLabel: "Voir les 14 articles",
      },
      {
        title: "Tarifs et politiques véhicule",
        icon: <CreditCard className="h-6 w-6" />,
        links: [
          "Politique carburant",
          "Politique nettoyage",
          "Politique non-fumeur",
        ],
        moreLabel: "Voir les 10 articles",
      },
    ],
  },
  hosts: {
    featuredArticles: [
      "Démarrer en tant qu'hôte",
      "Annuler un voyage avec votre invité",
      "Aéroports avec permis de livraison | Hôtes US",
      "Aéroports avec permis de livraison | Hôtes Canada",
      "Politique de permis d'aéroport",
      "Programme Hôte All-Star",
      "Éligibilité véhicule | US",
      "Éligibilité véhicule | Australie",
      "Éligibilité véhicule | Canada",
      "Éligibilité véhicule | UK",
      "Check-in d'un invité et check-out",
      "Numéros d'assistance routière",
    ],
    sections: [
      {
        title: "Premiers pas",
        icon: <BusFront className="h-6 w-6" />,
        links: [
          "Publier un véhicule | US",
          "Éligibilité véhicule | US",
          "Publier un véhicule | Canada",
        ],
        moreLabel: "Voir les 29 articles",
      },
      {
        title: "Tarifer votre véhicule",
        icon: <Banknote className="h-6 w-6" />,
        links: [
          "Définir le prix de votre véhicule",
          "Proposer des remises",
          "Utiliser le calendrier",
        ],
        moreLabel: "Voir les 4 articles",
      },
      {
        title: "Paramètres et options",
        icon: <Settings className="h-6 w-6" />,
        links: [
          "Mettre en pause ou dépublier un véhicule",
          "Gérer la disponibilité",
          "Proposer la livraison",
        ],
        moreLabel: "Voir les 12 articles",
      },
      {
        title: "Recevoir des paiements",
        icon: <CircleDollarSign className="h-6 w-6" />,
        links: [
          "Gains manquants ou incorrects",
          "Facturer un invité pour des contraventions",
          "Demander un remboursement",
        ],
        moreLabel: "Voir les 24 articles",
      },
      {
        title: "Gérer les réservations et voyages",
        icon: <CalendarCheck className="h-6 w-6" />,
        links: [
          "Check-in d'un invité et check-out",
          "Confirmer un permis | Hôtes US",
          "Échange de véhicule | Hôtes",
        ],
        moreLabel: "Voir les 21 articles",
      },
      {
        title: "Gérer votre annonce véhicule",
        icon: <ClipboardList className="h-6 w-6" />,
        links: [
          "Republier un véhicule",
          "Programme Power Host | US",
          "Programme Hôte All-Star",
        ],
        moreLabel: "Voir les 20 articles",
      },
      {
        title: "Organiser la livraison aéroport",
        icon: <Plane className="h-6 w-6" />,
        links: [
          "Restrictions de livraison aéroport",
          "Abilene Regional Airport (ABI) | Hôtes",
          "Albuquerque International Sunport (ABQ) | Hôtes",
        ],
        moreLabel: "Voir les 100 articles",
      },
      {
        title: "Gérer votre compte",
        icon: <User className="h-6 w-6" />,
        links: [
          "Résoudre les problèmes de connexion | Hôtes",
          "Prévenir et signaler la fraude | Hôte",
          "Mettre à jour un prénom préféré ou un nom d'entreprise | Hôtes",
        ],
        moreLabel: "Voir les 11 articles",
      },
      {
        title: "Annuler des voyages",
        icon: <FileText className="h-6 w-6" />,
        links: [
          "Absence de l'invité",
          "Politique de circonstances exceptionnelles | Hôtes",
          "Annuler un voyage avec votre invité",
        ],
        moreLabel: "Voir les 5 articles",
      },
      {
        title: "Entretenir votre véhicule",
        icon: <Wrench className="h-6 w-6" />,
        links: [
          "Inspections de sécurité annuelles",
          "Politique de mauvaise représentation du véhicule",
          "Soumettre une inspection annuelle",
        ],
        moreLabel: "Voir les 7 articles",
      },
      {
        title: "Prendre des mesures de sécurité",
        icon: <Siren className="h-6 w-6" />,
        links: [
          "Résoudre un rappel de sécurité",
          "Assistance routière | Hôtes US",
          "Assistance routière | Hôtes Canada",
        ],
        moreLabel: "Voir les 10 articles",
      },
      {
        title: "Politiques véhicule",
        icon: <CreditCard className="h-6 w-6" />,
        links: [
          "Politique d'utilisation additionnelle | Hôtes",
          "Frais de violation | Hôtes",
          "Politique de nettoyage | Hôtes",
        ],
        moreLabel: "Voir les 18 articles",
      },
      {
        title: "Comprendre et choisir la protection",
        icon: <Shield className="h-6 w-6" />,
        links: [
          "Exigences d'assurance et de plan de protection | Hôtes",
          "Plans de protection – En détail | Hôtes US",
          "Plans de protection – En bref | Hôtes US",
        ],
        moreLabel: "Voir les 12 articles",
      },
      {
        title: "Gérer les dommages véhicule",
        icon: <TriangleAlert className="h-6 w-6" />,
        links: [
          "Tableau de bord des sinistres | Hôtes",
          "Signaler des dommages | Hôtes",
          "Résoudre un dommage directement avec votre invité",
        ],
        moreLabel: "Voir les 22 articles",
      },
      {
        title: "Taxes",
        icon: <Receipt className="h-6 w-6" />,
        links: [
          "Compléter le formulaire fiscal | Hôtes US",
          "Recevoir un 1099-K",
          "Accéder au formulaire fiscal",
        ],
        moreLabel: "Voir les 10 articles",
      },
    ],
  },
};

const FAQ = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"guests" | "hosts">("guests");

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
        .map((section) => ({
          ...section,
          links: section.links.filter((link) =>
            link.toLowerCase().includes(searchTerm.toLowerCase()),
          ),
        }))
        .filter((section) => section.links.length > 0 || searchTerm.length === 0),
    [activeContent.sections, searchTerm],
  );

  return (
    <main className="bg-[#f6f6f7] pb-20 text-[#121214]">
      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex w-full max-w-6xl flex-col px-4 pb-12 pt-16 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl">
            Centre d'aide
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
              onClick={() => setActiveTab("guests")}
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
              onClick={() => setActiveTab("hosts")}
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
            <ul className="space-y-3">
              {section.links.map((link) => (
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
            <Link
              to={buildHelpCategoryRoute(section.moreLabel)}
              className="text-sm font-semibold text-indigo-600 hover:text-indigo-500"
            >
              {section.moreLabel}
            </Link>
          </article>
        ))}
      </section>
    </main>
  );
};

export default FAQ;
