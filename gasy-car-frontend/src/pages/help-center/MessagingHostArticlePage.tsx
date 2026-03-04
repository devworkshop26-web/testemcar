import {
  HelpArticleLayout,
  type HelpArticleAnchor,
} from "@/components/help-center/HelpArticleLayout";

const articleAnchors: HelpArticleAnchor[] = [
  { id: "avant-reservation", label: "Avant réservation" },
  { id: "apres-reservation", label: "Après réservation" },
  { id: "preuve-echanges", label: "Preuve des échanges" },
  { id: "bonnes-pratiques", label: "Bonnes pratiques" },
];

export default function MessagingHostArticlePage() {
  return (
    <HelpArticleLayout
      breadcrumbs={["Centre d'aide", "Voyageurs", "Planifier votre trajet"]}
      title="Messagerie avec votre hôte"
      intro="Informations de communication alignées avec les Conditions d'utilisation Mcar."
      anchors={articleAnchors}
    >
      <section id="avant-reservation">
        <h2>Avant réservation</h2>
        <p>
          Vérifiez les informations de l’annonce. Les accords verbaux ou hors
          plateforme n’ont pas de valeur contractuelle.
        </p>
      </section>

      <section id="apres-reservation">
        <h2>Après réservation</h2>
        <p>
          Utilisez la messagerie intégrée pour tout échange important (prise en
          charge, documents, modifications).
        </p>
      </section>

      <section id="preuve-echanges">
        <h2>Preuve des échanges</h2>
        <p>
          En cas d’incident ou litige, les échanges réalisés sur la plateforme
          peuvent servir de référence de suivi.
        </p>
      </section>

      <section id="bonnes-pratiques">
        <h2>Bonnes pratiques</h2>
        <ul>
          <li>Ne partagez pas vos paiements hors plateforme.</li>
          <li>Confirmez les détails de réservation par écrit sur Mcar.</li>
          <li>Conservez photos et preuves d’état du véhicule.</li>
        </ul>
      </section>
    </HelpArticleLayout>
  );
}
