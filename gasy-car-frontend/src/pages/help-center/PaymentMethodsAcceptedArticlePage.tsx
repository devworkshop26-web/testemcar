import RefundsArticlePage from "./RefundsArticlePage";

type PaymentMethodsAcceptedArticlePageProps = {
  title?: string;
};

export default function PaymentMethodsAcceptedArticlePage({
  title = "Méthodes de paiement acceptées",
}: PaymentMethodsAcceptedArticlePageProps) {
  return <RefundsArticlePage title={title} />;
}
