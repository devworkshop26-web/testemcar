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
        links: ["Réserver une voiture", "Découvrir Mcar", "Location mensuelle"],
        allLinks: [
          "Réserver une voiture",
          "Découvrir Mcar",
          "Location mensuelle",
          "Conditions d'âge minimum",
          "Créer un compte voyageur",
          "Vérifier votre identité",
          "Choisir un véhicule adapté",
        ],
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
        allLinks: [
          "Vérification avant départ",
          "Sélectionner la prise en charge",
          "Ajouter un conducteur",
          "Messagerie avec votre hôte",
          "Retour anticipé et check-out",
          "Retard de prise en charge",
          "Conduite hors zone autorisée",
        ],
        moreLabel: "Voir les 17 articles",
      },
      {
        title: "Paiement de votre location",
        icon: <CircleDollarSign className="h-6 w-6" />,
        links: ["Paiement de votre trajet", "Remboursements", "Factures impayées"],
        allLinks: [
          "Paiement de votre trajet",
          "Remboursements",
          "Factures impayées",
          "Moyens de paiement acceptés",
          "Demander un remboursement à l’hôte",
          "Crédits voyage",
          "Frais et taxes applicables",
        ],
        moreLabel: "Voir les 28 articles",
      },
      {
        title: "Changer ou annuler un voyage",
        icon: <FileText className="h-6 w-6" />,
        links: ["Annulation hôte", "Étendre une location", "Voyages annulés"],
        allLinks: [
          "Annulation hôte",
          "Étendre une location",
          "Voyages annulés",
          "Modifier lieu de prise en charge",
          "Raccourcir un voyage",
          "Reporter un voyage",
          "Annuler un voyage avec votre hôte",
        ],
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
        allLinks: [
          "Révision d'un voyage",
          "Politique de chargeback",
          "Dommages pneus",
          "Respect des règles du véhicule",
          "Que faire en cas de contravention",
          "Utilisation autorisée du véhicule",
          "Objets perdus après un voyage",
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
        allLinks: [
          "Signaler un véhicule",
          "Assistance routière",
          "Urgence en voyage",
          "Accident pendant une location",
          "Véhicule en panne",
          "Contacter l'assistance 24/7",
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
        allLinks: [
          "Connexion impossible",
          "Modifier votre nom",
          "Mettre à jour votre permis",
          "Mettre à jour votre e-mail",
          "Supprimer votre compte",
          "Gérer les préférences de notification",
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
        allLinks: [
          "Contacter les sinistres",
          "Assurance personnelle",
          "Couverture carte bancaire",
          "Comparer les plans de protection",
          "Franchise et responsabilité",
          "Ce que couvre la protection",
          "Réclamation après incident",
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
        allLinks: [
          "Politique carburant",
          "Politique nettoyage",
          "Politique non-fumeur",
          "Frais pour retard de retour",
          "Frais de kilométrage supplémentaire",
          "Politique animaux de compagnie",
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
        allLinks: [
          "Publier un véhicule | US",
          "Éligibilité véhicule | US",
          "Publier un véhicule | Canada",
          "Éligibilité véhicule | Australie",
          "Éligibilité véhicule | UK",
          "Créer votre profil hôte",
          "Vérifier votre identité d’hôte",
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
        allLinks: [
          "Définir le prix de votre véhicule",
          "Proposer des remises",
          "Utiliser le calendrier",
          "Activer les prix dynamiques",
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
        allLinks: [
          "Mettre en pause ou dépublier un véhicule",
          "Gérer la disponibilité",
          "Proposer la livraison",
          "Définir les heures de remise",
          "Configurer les préférences de réservation",
          "Paramétrer les exigences conducteur",
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
        allLinks: [
          "Gains manquants ou incorrects",
          "Facturer un invité pour des contraventions",
          "Demander un remboursement",
          "Délais de versement",
          "Télécharger vos relevés de paiement",
          "Comprendre les frais hôte",
          "Gérer votre méthode de paiement",
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
        allLinks: [
          "Check-in d'un invité et check-out",
          "Confirmer un permis | Hôtes US",
          "Échange de véhicule | Hôtes",
          "Accepter ou refuser une réservation",
          "Contacter un invité avant le départ",
          "Modifier une réservation confirmée",
          "Prolonger un voyage invité",
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
        allLinks: [
          "Republier un véhicule",
          "Programme Power Host | US",
          "Programme Hôte All-Star",
          "Améliorer le taux d’acceptation",
          "Optimiser vos photos d’annonce",
          "Répondre aux avis invités",
          "Gérer plusieurs véhicules",
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
        allLinks: [
          "Restrictions de livraison aéroport",
          "Abilene Regional Airport (ABI) | Hôtes",
          "Albuquerque International Sunport (ABQ) | Hôtes",
          "Appleton International Airport (ATW) | Hôtes",
          "Aéroport international d’Antananarivo | Hôtes",
          "Aéroport de Nosy Be | Hôtes",
          "Aéroport de Toamasina | Hôtes",
          "Politique de permis d'aéroport",
          "Frais de stationnement et livraison",
          "Points de rencontre autorisés",
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
        allLinks: [
          "Résoudre les problèmes de connexion | Hôtes",
          "Prévenir et signaler la fraude | Hôte",
          "Mettre à jour un prénom préféré ou un nom d'entreprise | Hôtes",
          "Modifier votre adresse e-mail",
          "Configurer la double authentification",
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
        allLinks: [
          "Absence de l'invité",
          "Politique de circonstances exceptionnelles | Hôtes",
          "Annuler un voyage avec votre invité",
          "Annulation par l’hôte : conséquences",
          "Éviter les annulations récurrentes",
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
        allLinks: [
          "Inspections de sécurité annuelles",
          "Politique de mauvaise représentation du véhicule",
          "Soumettre une inspection annuelle",
          "Planifier la maintenance préventive",
          "Gérer les rappels constructeur",
          "Préparer le véhicule avant un voyage",
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
        allLinks: [
          "Résoudre un rappel de sécurité",
          "Assistance routière | Hôtes US",
          "Assistance routière | Hôtes Canada",
          "Déclarer un incident de sécurité",
          "Que faire en cas de vol du véhicule",
          "Contacter l'équipe sécurité",
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
        allLinks: [
          "Politique d'utilisation additionnelle | Hôtes",
          "Frais de violation | Hôtes",
          "Politique de nettoyage | Hôtes",
          "Politique carburant | Hôtes",
          "Politique non-fumeur | Hôtes",
          "Politique animaux | Hôtes",
          "Politique kilométrage",
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
        allLinks: [
          "Exigences d'assurance et de plan de protection | Hôtes",
          "Plans de protection – En détail | Hôtes US",
          "Plans de protection – En bref | Hôtes US",
          "Comparer les plans de protection",
          "Franchise et responsabilité hôte",
          "Couverture des dommages matériels",
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
        allLinks: [
          "Tableau de bord des sinistres | Hôtes",
          "Signaler des dommages | Hôtes",
          "Résoudre un dommage directement avec votre invité",
          "Évaluation des dommages par photo",
          "Délais de déclaration de sinistre",
          "Suivre le remboursement des réparations",
          "Documents requis pour un sinistre",
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
        allLinks: [
          "Compléter le formulaire fiscal | Hôtes US",
          "Recevoir un 1099-K",
          "Accéder au formulaire fiscal",
          "Déclarer vos revenus hôte",
          "Mettre à jour vos informations fiscales",
          "Télécharger l’historique des paiements",
        ],
        moreLabel: "Voir les 10 articles",
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
              onClick={() => { setActiveTab("guests"); setExpandedSections([]); }}
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
              onClick={() => { setActiveTab("hosts"); setExpandedSections([]); }}
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
