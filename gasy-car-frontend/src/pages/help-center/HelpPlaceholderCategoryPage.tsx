import { HelpArticleLayout } from "@/components/help-center/HelpArticleLayout";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMemo } from "react";
import { useParams, useSearchParams } from "react-router-dom";

type RouteParams = {
  slug?: string;
};

function formatFallbackTitle(slug: string): string {
  return slug
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export default function HelpPlaceholderCategoryPage() {
  const { slug = "categorie" } = useParams<RouteParams>();
  const [searchParams] = useSearchParams();

  const title = useMemo(() => {
    const queryTitle = searchParams.get("title");
    return queryTitle && queryTitle.trim().length > 0
      ? queryTitle
      : formatFallbackTitle(slug);
  }, [searchParams, slug]);

  return (
    <HelpArticleLayout
      breadcrumbs={["Centre d'aide", "Catégorie"]}
      title={title}
      intro="Page catégorie créée pour permettre le routage de tous les liens “Voir les X articles”."
      anchors={[{ id: "statut-categorie", label: "Statut de la catégorie" }]}
    >
      <section id="statut-categorie">
        <Card>
          <CardHeader>
            <Badge className="w-fit" variant="secondary">
              Route active
            </Badge>
            <CardTitle className="mt-3">Catégorie connectée</CardTitle>
          </CardHeader>
          <CardContent>
            Cette catégorie dispose maintenant d’une route dédiée et réutilisable. Vous pourrez y
            injecter les articles complets progressivement.
          </CardContent>
        </Card>
      </section>
    </HelpArticleLayout>
  );
}
