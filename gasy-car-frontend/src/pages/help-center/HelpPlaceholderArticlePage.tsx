import { HelpArticleLayout } from "@/components/help-center/HelpArticleLayout";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMemo } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { slugifyHelpLabel } from "@/components/help-center/helpRoutes";
import CancellationPolicyArticlePage from "./CancellationPolicyArticlePage";
import PaymentMethodsAcceptedArticlePage from "./PaymentMethodsAcceptedArticlePage";
import RefundsArticlePage from "./RefundsArticlePage";

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

  const normalizedSlug = useMemo(() => slugifyHelpLabel(slug), [slug]);

  const title = useMemo(() => {
    const queryTitle = searchParams.get("title");
    return queryTitle && queryTitle.trim().length > 0
      ? queryTitle
      : formatFallbackTitle(slug);
  }, [searchParams, slug]);

  const refundsArticleSlugs = new Set([
    "remboursements",
    "prise-en-charge-et-retour",
    "prise-en-charge-et-retour-a-l-aeroport-invites",
  ]);
  const isRefundsArticle = refundsArticleSlugs.has(normalizedSlug);

  const assistancePolicySlugs = new Set(["numeros-d-assistance-routiere"]);
  const isAssistancePolicyArticle = assistancePolicySlugs.has(normalizedSlug);

  const assistancePolicySlugs = new Set(["numeros-d-assistance-routiere"]);
  const isAssistancePolicyArticle = assistancePolicySlugs.has(slug);

  const paymentMethodsSlugs = new Set(["methodes-de-paiement-acceptees"]);
  const isPaymentMethodsArticle = paymentMethodsSlugs.has(normalizedSlug);

  if (isRefundsArticle) {
    return <RefundsArticlePage title={title} />;
  }

  if (isAssistancePolicyArticle) {
    return <CancellationPolicyArticlePage title={title} />;
  }

  if (isPaymentMethodsArticle) {
    return <PaymentMethodsAcceptedArticlePage title={title} />;
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
