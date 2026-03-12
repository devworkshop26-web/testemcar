import { HelpArticleLayout } from "@/components/help-center/HelpArticleLayout";

type DriverEligibilityArticlePageProps = {
  title?: string;
};

const anchors = [
  { id: "conditions-generales", label: "Conditions générales" },
  { id: "verification", label: "Vérification" },
  { id: "compte-unique", label: "Compte unique" },
];

export default function DriverEligibilityArticlePage({
  title = "Admissibilité du conducteur",
}: DriverEligibilityArticlePageProps) {
  return (
    <HelpArticleLayout
      breadcrumbs={["Centre d'aide", "Article"]}
      title={title}
      intro="Conditions d’admissibilité Voyageur prévues par les CGU Mcar."
      anchors={anchors}
    >
      <section id="conditions-generales">
        <h2>Conditions générales d’admissibilité</h2>
        <ul>
          <li>Âge minimum : 18 ans.</li>
          <li>Permis valide et reconnu à Madagascar.</li>
          <li>Absence de suspension administrative ou judiciaire.</li>
          <li>Moyen de paiement valide et informations exactes.</li>
        </ul>
      </section>

      <section id="verification">
        <h2>Vérification de l’identité et du permis</h2>
        <p>Le Voyageur peut devoir fournir :</p>
        <ul>
          <li>copie lisible du permis ;</li>
          <li>CIN ou passeport ;</li>
          <li>photo de vérification ;</li>
          <li>certificat de résidence (si requis).</li>
        </ul>
      </section>

      <section id="compte-unique">
        <h2>Compte unique et sanctions</h2>
        <p>
          Chaque utilisateur ne peut posséder qu’un seul compte. Multi-comptes,
          prêt de compte et contournement après suspension sont interdits.
        </p>
        <p>
          En cas de fraude : suspension immédiate, gel des fonds et sanctions
          contractuelles possibles.
        </p>
      </section>
    </HelpArticleLayout>
  );
}
