import {
  HelpArticleLayout,
  type HelpArticleAnchor,
} from "@/components/help-center/HelpArticleLayout";

const articleAnchors: HelpArticleAnchor[] = [
  { id: "annulation-voyageur", label: "Annulation Voyageur" },
  { id: "annulation-hote", label: "Annulation Hôte" },
  { id: "no-show", label: "Absence (No-show)" },
  { id: "circonstances", label: "Circonstances exceptionnelles" },
];

export default function CancelTripHostArticlePage() {
  return (
    <HelpArticleLayout
      breadcrumbs={["Centre d'aide", "Voyageurs", "Changer ou annuler un voyage"]}
      title="Annuler un voyage avec votre hôte"
      intro="Résumé des règles d'annulation et de modification prévues dans les CGU Mcar."
      anchors={articleAnchors}
    >
      <section id="annulation-voyageur">
        <h2>Annulation par le Voyageur</h2>
        <ul>
          <li>+72h : remboursement intégral du prix de location.</li>
          <li>72h à 36h : 75% du prix de location.</li>
          <li>36h à 24h : 50% du prix de location.</li>
          <li>-24h : remboursement non garanti.</li>
        </ul>
        <p>Les frais de service/transaction restent non remboursables.</p>
      </section>

      <section id="annulation-hote">
        <h2>Annulation par l’Hôte</h2>
        <p>
          Le Voyageur reçoit un remboursement intégral du prix de location.
          L’Hôte peut subir des pénalités selon le délai d’annulation.
        </p>
      </section>

      <section id="no-show">
        <h2>Absence (No-show)</h2>
        <p>
          L’absence s’applique en cas de non-présentation dans les 60 minutes,
          permis invalide ou personne non autorisée.
        </p>
      </section>

      <section id="circonstances">
        <h2>Circonstances exceptionnelles</h2>
        <p>
          Mcar peut accorder un remboursement total ou partiel sous justificatif
          (hospitalisation, catastrophe, interdiction administrative, etc.).
        </p>
      </section>
    </HelpArticleLayout>
  );
}
