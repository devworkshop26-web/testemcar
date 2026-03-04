import { HelpArticleLayout } from "@/components/help-center/HelpArticleLayout";

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
  title = "Méthodes de paiement acceptées",
}: PaymentMethodsAcceptedArticlePageProps) {
  return (
    <HelpArticleLayout
      breadcrumbs={["Centre d'aide", "Article"]}
      title={title}
      intro="Règles de paiement applicables sur Mcar, conformes aux Conditions d'utilisation (26 Février 2026)."
      anchors={anchors}
    >
      <section id="paiements-via-plateforme">
        <h2>Paiements via la plateforme</h2>
        <p>
          Toute transaction liée à une réservation initiée sur Mcar doit être
          effectuée exclusivement via la plateforme.
        </p>
        <ul>
          <li>Le paiement est autorisé avant confirmation de réservation.</li>
          <li>Le paiement à Mcar vaut paiement libératoire envers l’Hôte.</li>
          <li>
            Mcar agit comme mandataire d’encaissement et peut retenir des frais
            de service.
          </li>
        </ul>
      </section>

      <section id="autorisation-paiement">
        <h2>Autorisation de paiement et ajustements</h2>
        <p>
          En ajoutant un moyen de paiement, l’utilisateur autorise Mcar et ses
          prestataires à enregistrer les données et à prélever tout montant dû.
        </p>
        <ul>
          <li>frais de location ;</li>
          <li>dépôt de garantie ;</li>
          <li>frais administratifs et dommages ;</li>
          <li>frais de recouvrement et ajustements post-location.</li>
        </ul>
      </section>

      <section id="interdictions">
        <h2>Interdictions et anti-contournement</h2>
        <p>
          Les paiements en espèces, virements directs, moyens externes ou
          services payants hors plateforme sont interdits.
        </p>
        <p>
          En cas de contournement, Mcar peut suspendre le compte et appliquer
          une indemnité contractuelle.
        </p>
      </section>

      <section id="promotions">
        <h2>Promotions, crédits et remboursements</h2>
        <p>
          Les promotions et crédits ne sont pas transférables ni convertibles en
          espèces et peuvent être retirés en cas d’usage abusif.
        </p>
        <p>
          Quand un remboursement ne peut pas être renvoyé sur le moyen initial,
          Mcar peut émettre un crédit plateforme.
        </p>
      </section>
    </HelpArticleLayout>
  );
}
