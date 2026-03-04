import { HelpArticleLayout } from "@/components/help-center/HelpArticleLayout";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMemo } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import DriverEligibilityArticlePage from "./DriverEligibilityArticlePage";
import PaymentMethodsAcceptedArticlePage from "./PaymentMethodsAcceptedArticlePage";
import PickupReturnArticlePage from "./PickupReturnArticlePage";
import RefundsArticlePage from "./RefundsArticlePage";
import RoadsideAssistanceArticlePage from "./RoadsideAssistanceArticlePage";
import TripCostArticlePage from "./TripCostArticlePage";
import TripExtensionArticlePage from "./TripExtensionArticlePage";

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

export default function HelpPlaceholderArticlePage() {
  const { slug = "article" } = useParams<RouteParams>();
  const [searchParams] = useSearchParams();

  const title = useMemo(() => {
    const queryTitle = searchParams.get("title");
    return queryTitle && queryTitle.trim().length > 0
      ? queryTitle
      : formatFallbackTitle(slug);
  }, [searchParams, slug]);

  const contentBySlug: Record<string, JSX.Element> = {
    remboursements: <RefundsArticlePage title={title} />,
    "prise-en-charge-et-retour": <PickupReturnArticlePage title={title} />,
    "prise-en-charge-et-retour-a-l-aeroport-invites": (
      <PickupReturnArticlePage title={title} />
    ),
    "methodes-de-paiement-acceptees": (
      <PaymentMethodsAcceptedArticlePage title={title} />
    ),
    "admissibilite-du-conducteur": <DriverEligibilityArticlePage title={title} />,
    "cout-d-un-voyage": <TripCostArticlePage title={title} />,
    "prolonger-un-voyage": <TripExtensionArticlePage title={title} />,
    "numeros-d-assistance-routiere": (
      <RoadsideAssistanceArticlePage title={title} />
    ),
  };

  if (contentBySlug[slug]) {
    return contentBySlug[slug];
  }

  return (
    <HelpArticleLayout
      breadcrumbs={["Centre d'aide", "Article"]}
      title={title}
      intro="Cette page est prête et réutilisable avec shadcn. Le contenu détaillé sera ajouté prochainement."
      anchors={[{ id: "statut-article", label: "Statut de l’article" }]}
    >
      <section id="statut-article">
        <Card>
          <CardHeader>
            <Badge className="w-fit" variant="secondary">
              En préparation
            </Badge>
            <CardTitle className="mt-3">
              Contenu en cours de finalisation
            </CardTitle>
          </CardHeader>
          <CardContent>
            Cet article a bien sa route dédiée. Vous pouvez maintenant relier
            tous les liens du centre d’aide vers une page cohérente et
            réutilisable.
          </CardContent>
        </Card>
      </section>
    </HelpArticleLayout>
  );
}
