import { HelpArticleLayout } from "@/components/help-center/HelpArticleLayout";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMemo } from "react";
import { useParams, useSearchParams } from "react-router-dom";

type RouteParams = {
  slug?: string;
};

type ArticleComponent = {
  default: React.ComponentType<{ title?: string }>;
};

const articleModules = import.meta.glob("./articles/*.tsx", {
  eager: true,
}) as Record<string, ArticleComponent>;

const articleBySlug = Object.entries(articleModules).reduce<Record<string, React.ComponentType<{ title?: string }>>>(
  (acc, [path, module]) => {
    const fileName = path.split("/").pop()?.replace(".tsx", "");
    if (fileName) {
      acc[fileName] = module.default;
    }
    return acc;
  },
  {},
);

function formatFallbackTitle(slug: string): string {
  return slug
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export default function HelpPlaceholderArticlePage() {
  const { slug = "article" } = useParams<RouteParams>();
  const [searchParams] = useSearchParams();

  const title = useMemo(() => {
    const queryTitle = searchParams.get("title");
    return queryTitle && queryTitle.trim().length > 0
      ? queryTitle
      : formatFallbackTitle(slug);
  }, [searchParams, slug]);

  const ArticlePage = articleBySlug[slug];
  if (ArticlePage) {
    return <ArticlePage title={title} />;
  }

  return (
    <HelpArticleLayout
      breadcrumbs={["Centre d'aide", "Article"]}
      title={title}
      intro="Cet article n'est pas encore publié dans le centre d'aide Madagasycar."
      anchors={[{ id: "statut-article", label: "Statut de l’article" }]}
    >
      <section id="statut-article">
        <Card>
          <CardHeader>
            <Badge className="w-fit" variant="secondary">
              En préparation
            </Badge>
            <CardTitle className="mt-3">Publication prochaine</CardTitle>
          </CardHeader>
          <CardContent>
            Le lien est bien configuré. Le contenu détaillé sera publié dans son
            fichier d’article dédié.
          </CardContent>
        </Card>
      </section>
    </HelpArticleLayout>
  );
}
