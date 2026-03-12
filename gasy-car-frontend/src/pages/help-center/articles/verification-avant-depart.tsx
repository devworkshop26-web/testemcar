import { HelpArticlePageTemplate } from "@/components/help-center/HelpArticlePageTemplate";
import { buildHelpArticleSections } from "./articleContent";

type ArticleProps = {
  title?: string;
};

export default function VerificationAvantDepartArticle({ title = "Vérification avant départ" }: ArticleProps) {
  return (
    <HelpArticlePageTemplate
      title={title}
      intro="Contenu basé exclusivement sur les Conditions d’utilisation Madagasycar (mise à jour du 26 Février 2026)."
      sections={buildHelpArticleSections(title)}
    />
  );
}
