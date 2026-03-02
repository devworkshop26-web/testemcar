import { Input } from "@/components/ui/input";
import {
  Bookmark,
  BusFront,
  CircleDollarSign,
  CreditCard,
  FileText,
  Handshake,
  Search,
  Shield,
  TriangleAlert,
  User,
} from "lucide-react";
import { type ReactNode, useMemo, useState } from "react";

type ArticleSection = {
  title: string;
  icon: ReactNode;
  links: string[];
  moreLabel: string;
};

const featuredArticles = [
  "Messagerie avec votre hôte",
  "Annuler un voyage avec votre hôte",
  "Remboursements",
  "Prise en charge et retour",
  "Méthodes de paiement acceptées",
  "Admissibilité du conducteur",
  "Coût d'un voyage",
  "Prolonger un voyage",
  "Numéros d'assistance routière",
];

const articleSections: ArticleSection[] = [
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
    links: ["Révision d'un voyage", "Politique de chargeback", "Dommages pneus"],
    moreLabel: "Voir les 13 articles",
  },
  {
    title: "Gestion des incidents",
    icon: <TriangleAlert className="h-6 w-6" />,
    links: ["Signaler un véhicule", "Assistance routière", "Urgence en voyage"],
    moreLabel: "Voir les 10 articles",
  },
  {
    title: "Gérer votre compte",
    icon: <User className="h-6 w-6" />,
    links: ["Connexion impossible", "Modifier votre nom", "Mettre à jour votre permis"],
    moreLabel: "Voir les 9 articles",
  },
  {
    title: "Assurance et protection",
    icon: <Shield className="h-6 w-6" />,
    links: ["Contacter les sinistres", "Assurance personnelle", "Couverture carte bancaire"],
    moreLabel: "Voir les 14 articles",
  },
  {
    title: "Tarifs et politiques véhicule",
    icon: <CreditCard className="h-6 w-6" />,
    links: ["Politique carburant", "Politique nettoyage", "Politique non-fumeur"],
    moreLabel: "Voir les 10 articles",
  },
];

const FAQ = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"guests" | "hosts">("guests");

  const filteredFeatured = useMemo(
    () =>
      featuredArticles.filter((article) =>
        article.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    [searchTerm],
  );

  const filteredSections = useMemo(
    () =>
      articleSections
        .map((section) => ({
          ...section,
          links: section.links.filter((link) =>
            link.toLowerCase().includes(searchTerm.toLowerCase()),
          ),
        }))
        .filter((section) => section.links.length > 0 || searchTerm.length === 0),
    [searchTerm],
  );

  return (
    <main className="bg-[#f6f6f7] pb-20 text-[#121214]">
      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex w-full max-w-6xl flex-col px-4 pb-12 pt-16 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl">
            Help Center
          </h1>
          <p className="mt-3 text-lg text-gray-600">What can we do for you?</p>

          <div className="mt-8 max-w-xl">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search articles"
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
              Guests
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
              Hosts
            </button>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 pt-12 sm:px-6 lg:px-8">
        <div className="rounded-xl bg-[#efebff] p-6 sm:p-8">
          <div className="mb-6 flex items-center gap-3 text-indigo-600">
            <Bookmark className="h-7 w-7" />
            <h2 className="text-3xl font-bold text-[#151522]">Featured Articles</h2>
          </div>

          <div className="grid gap-x-8 gap-y-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredFeatured.map((article) => (
              <a
                key={article}
                href="#"
                className="border-b border-gray-300 pb-3 text-sm font-medium text-gray-700 hover:text-indigo-600"
              >
                {article}
              </a>
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
                  <a
                    href="#"
                    className="block border-b border-gray-300 pb-3 text-sm font-medium text-gray-700 hover:text-indigo-600"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
            <a href="#" className="text-sm font-semibold text-indigo-600 hover:text-indigo-500">
              {section.moreLabel}
            </a>
          </article>
        ))}
      </section>
    </main>
  );
};

export default FAQ;
