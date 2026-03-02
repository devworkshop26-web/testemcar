import {
  HelpArticleLayout,
  type HelpArticleAnchor,
} from "@/components/help-center/HelpArticleLayout";
import { TermsOfUseContent } from "@/components/help-center/TermsOfUseContent";

const articleAnchors: HelpArticleAnchor[] = [
  { id: "conditions-utilisation", label: "Conditions d’utilisation" },
  { id: "avertissement-important", label: "Avertissement important" },
  { id: "introduction", label: "Introduction" },
  { id: "nature-service", label: "Nature du service" },
  { id: "acceptation", label: "Acceptation des conditions" },
  { id: "modifications", label: "Modifications des conditions" },
  { id: "independance-langues", label: "Indépendance et langues applicables" },
  { id: "responsabilite-generale", label: "Responsabilité générale de Mcar" },
  { id: "admissibilite", label: "Admissibilité, inscription, vérification" },
  { id: "structure-financiere", label: "Structure financière" },
  {
    id: "annulation-modification-absence",
    label: "Politique d’annulation, modification et absence",
  },
  { id: "assurance-assistance", label: "Responsabilité, assurance et assistance" },
  { id: "usages-interdits", label: "Usages interdits" },
  { id: "limitation-responsabilite", label: "Limitation de responsabilité" },
  { id: "indemnisation", label: "Indemnisation par les utilisateurs" },
];

export default function MessagingHostArticlePage() {
  return (
    <HelpArticleLayout
      breadcrumbs={["Centre d'aide", "Voyageurs", "Planifier votre trajet"]}
      title="Messagerie avec votre hôte"
      intro="Contenu conforme aux Conditions d’utilisation Mcar (mise à jour du 26 Février 2026)."
      anchors={articleAnchors}
    >
      <TermsOfUseContent />
    </HelpArticleLayout>
  );
}
