import CancellationPolicyArticlePage from "./CancellationPolicyArticlePage";

type RefundsArticlePageProps = {
  title?: string;
};

export default function RefundsArticlePage({
  title = "Remboursements",
}: RefundsArticlePageProps) {
  return <CancellationPolicyArticlePage title={title} />;
}
