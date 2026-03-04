import MethodesDePaiementAccepteesArticle from "./articles/methodes-de-paiement-acceptees";

type PaymentMethodsAcceptedArticlePageProps = {
  title?: string;
};

export default function PaymentMethodsAcceptedArticlePage({
  title,
}: PaymentMethodsAcceptedArticlePageProps) {
  return <MethodesDePaiementAccepteesArticle title={title} />;
}
