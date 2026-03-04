import { HelpArticlePageTemplate } from "@/components/help-center/HelpArticlePageTemplate";
import { buildHelpArticleSections } from "./articleContent";

type ArticleProps = {
  title?: string;
};

export default function PriseEnChargeAeroportAntananarivoArticle({ title = "Prise en charge aéroport Antananarivo" }: ArticleProps) {
  return (
    <HelpArticlePageTemplate
      title={title}
      intro="Contenu basé exclusivement sur les Conditions d’utilisation Madagasycar (mise à jour du 26 Février 2026)."
      sections={buildHelpArticleSections(title)}
    />
  );
}
