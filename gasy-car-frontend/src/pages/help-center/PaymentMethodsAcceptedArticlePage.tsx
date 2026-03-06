import MethodesDePaiementAccepteesArticle from "./articles/methodes-de-paiement-acceptees";

type PaymentMethodsAcceptedArticlePageProps = {
  title?: string;
};

const anchors = [
  { id: "paiements-via-plateforme", label: "Paiements via la plateforme" },
  { id: "autorisation-paiement", label: "Autorisation de paiement" },
  { id: "interdictions", label: "Interdictions" },
  { id: "promotions", label: "Promotions et crédits" },
];

export default function PaymentMethodsAcceptedArticlePage({
  title,
}: PaymentMethodsAcceptedArticlePageProps) {
  return <MethodesDePaiementAccepteesArticle title={title} />;
}
