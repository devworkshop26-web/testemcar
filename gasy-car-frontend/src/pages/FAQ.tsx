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
  Banknote,
  CalendarCheck,
  ClipboardList,
  Plane,
  Settings,
  Wrench,
  Siren,
  Receipt,
} from "lucide-react";
import { type ReactNode, useMemo, useState } from "react";

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
      { title: "Premiers pas", icon: <BusFront className="h-6 w-6" />, links: ["Réserver une voiture", "Découvrir Mcar", "Location mensuelle"], moreLabel: "Voir les 16 articles" },
      { title: "Planifier votre trajet", icon: <Bookmark className="h-6 w-6" />, links: ["Vérification avant départ", "Sélectionner la prise en charge", "Ajouter un conducteur"], moreLabel: "Voir les 17 articles" },
      { title: "Paiement de votre location", icon: <CircleDollarSign className="h-6 w-6" />, links: ["Paiement de votre trajet", "Remboursements", "Factures impayées"], moreLabel: "Voir les 28 articles" },
      { title: "Changer ou annuler un voyage", icon: <FileText className="h-6 w-6" />, links: ["Annulation hôte", "Étendre une location", "Voyages annulés"], moreLabel: "Voir les 11 articles" },
      { title: "Responsabilités invité", icon: <Handshake className="h-6 w-6" />, links: ["Révision d'un voyage", "Politique de chargeback", "Dommages pneus"], moreLabel: "Voir les 13 articles" },
      { title: "Gestion des incidents", icon: <TriangleAlert className="h-6 w-6" />, links: ["Signaler un véhicule", "Assistance routière", "Urgence en voyage"], moreLabel: "Voir les 10 articles" },
      { title: "Gérer votre compte", icon: <User className="h-6 w-6" />, links: ["Connexion impossible", "Modifier votre nom", "Mettre à jour votre permis"], moreLabel: "Voir les 9 articles" },
      { title: "Assurance et protection", icon: <Shield className="h-6 w-6" />, links: ["Contacter les sinistres", "Assurance personnelle", "Couverture carte bancaire"], moreLabel: "Voir les 14 articles" },
      { title: "Tarifs et politiques véhicule", icon: <CreditCard className="h-6 w-6" />, links: ["Politique carburant", "Politique nettoyage", "Politique non-fumeur"], moreLabel: "Voir les 10 articles" },
    ],
  },
  hosts: {
    featuredArticles: [
      "Getting started | Hosts",
      "Canceling a trip with your guest",
      "Airports with delivery permits | US hosts",
      "Airports with delivery permits | Canada hosts",
      "Airport permit policy",
      "All-Star Host program",
      "Vehicle eligibility | US",
      "Vehicle eligibility | Australia",
      "Vehicle eligibility | Canada",
      "Vehicle eligibility | UK",
      "Checking in a guest and checking out",
      "Numéros d’assistance routière",
    ],
    sections: [
      { title: "Getting started", icon: <BusFront className="h-6 w-6" />, links: ["Listing a vehicle | US", "Vehicle eligibility | US", "Listing a vehicle | Canada"], moreLabel: "Show all 29 articles" },
      { title: "Pricing your vehicle", icon: <Banknote className="h-6 w-6" />, links: ["Pricing your vehicle", "Offering discounts", "Using the calendar"], moreLabel: "Show all 4 articles" },
      { title: "Settings and options", icon: <Settings className="h-6 w-6" />, links: ["Snoozing or unlisting vehicle", "Managing availability", "Offering delivery"], moreLabel: "Show all 12 articles" },
      { title: "Getting paid", icon: <CircleDollarSign className="h-6 w-6" />, links: ["Wrong or missing earnings", "Charging a guest for tickets", "Requesting reimbursement"], moreLabel: "Show all 24 articles" },
      { title: "Managing bookings and trips", icon: <CalendarCheck className="h-6 w-6" />, links: ["Checking in a guest and checking out", "Confirming a license | US Hosts", "Vehicle swaps | Hosts"], moreLabel: "Show all 21 articles" },
      { title: "Managing your vehicle listing", icon: <ClipboardList className="h-6 w-6" />, links: ["Relisting a vehicle", "Power Host program | US", "All-Star Host program"], moreLabel: "Show all 20 articles" },
      { title: "Arranging airport delivery", icon: <Plane className="h-6 w-6" />, links: ["Airport delivery restrictions", "Abilene Regional Airport (ABI) | Hosts", "Albuquerque International Sunport (ABQ) | Hosts"], moreLabel: "Show all 100 articles" },
      { title: "Managing your account", icon: <User className="h-6 w-6" />, links: ["Resolving issues logging in | Hosts", "Preventing and reporting fraud | Host", "Updating a preferred first name or business name on your account | Hosts"], moreLabel: "Show all 11 articles" },
      { title: "Canceling trips", icon: <FileText className="h-6 w-6" />, links: ["Guest no-shows", "Extenuating circumstances policy | Hosts", "Canceling a trip with your guest"], moreLabel: "Show all 5 articles" },
      { title: "Maintaining your vehicle", icon: <Wrench className="h-6 w-6" />, links: ["Annual safety inspections", "Vehicle misrepresentation policy", "Submit an annual safety inspection"], moreLabel: "Show all 7 articles" },
      { title: "Taking safety measures", icon: <Siren className="h-6 w-6" />, links: ["Resolve a safety recall", "Roadside assistance | US hosts", "Roadside assistance | Canada hosts"], moreLabel: "Show all 10 articles" },
      { title: "Vehicle policies", icon: <CreditCard className="h-6 w-6" />, links: ["Additional usage policy | Hosts", "Violation fees | Hosts", "Cleaning policy | Hosts"], moreLabel: "Show all 18 articles" },
      { title: "Understanding and choosing protection", icon: <Shield className="h-6 w-6" />, links: ["Insurance and protection plan requirements | Hosts", "Protection plans – In detail | US hosts", "Protection plans – In brief | US hosts"], moreLabel: "Show all 12 articles" },
      { title: "Managing vehicle damage", icon: <TriangleAlert className="h-6 w-6" />, links: ["Claims dashboard | Hosts", "Reporting damage | Hosts", "Resolve damage directly with your guest"], moreLabel: "Show all 22 articles" },
      { title: "Taxes", icon: <Receipt className="h-6 w-6" />, links: ["Completing the tax information form | US hosts", "Receiving a 1099-K", "Accessing the tax information form"], moreLabel: "Show all 10 articles" },
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
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl">Help Center</h1>
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
              <h3 className="text-3xl font-bold leading-tight text-[#1a1a27]">{section.title}</h3>
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
