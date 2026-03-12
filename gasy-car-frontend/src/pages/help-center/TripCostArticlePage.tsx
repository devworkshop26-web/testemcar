import { HelpArticleLayout } from "@/components/help-center/HelpArticleLayout";

type TripCostArticlePageProps = {
  title?: string;
};

const anchors = [
  { id: "frais", label: "Composants du coût" },
  { id: "caution", label: "Caution / Dépôt" },
  { id: "taxes", label: "Taxes et devise" },
  { id: "ajustements", label: "Ajustements post-location" },
];

export default function TripCostArticlePage({
  title = "Coût d'un voyage",
}: TripCostArticlePageProps) {
  return (
    <HelpArticleLayout
      breadcrumbs={["Centre d'aide", "Article"]}
      title={title}
      intro="Résumé des éléments financiers de réservation selon les CGU Mcar."
      anchors={anchors}
    >
      <section id="frais">
        <h2>Composants du coût</h2>
        <p>Le montant total peut inclure :</p>
        <ul>
          <li>prix de location ;</li>
          <li>frais de service plateforme ;</li>
          <li>frais de traitement de paiement ;</li>
          <li>frais administratifs et options additionnelles.</li>
        </ul>
      </section>
      <section id="caution">
        <h2>Caution / Dépôt de garantie</h2>
        <p>
          Le dépôt de garantie peut être autorisé sur votre moyen de paiement et
          conservé pendant la location.
        </p>
      </section>
      <section id="taxes">
        <h2>Taxes et devise</h2>
        <p>
          Chaque utilisateur reste responsable de ses obligations fiscales. Les
          montants peuvent être arrondis et la devise dépend du contexte de
          transaction.
        </p>
      </section>
      <section id="ajustements">
        <h2>Ajustements post-location</h2>
        <p>
          Des ajustements peuvent être appliqués pour retard, dommages,
          recouvrement ou autres coûts contractuels justifiés.
        </p>
      </section>
    </HelpArticleLayout>
  );
}
