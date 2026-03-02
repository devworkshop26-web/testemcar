import {
  HelpArticleLayout,
  type HelpArticleAnchor,
} from "@/components/help-center/HelpArticleLayout";

const articleAnchors: HelpArticleAnchor[] = [
  { id: "conditions-utilisation", label: "Conditions d’utilisation" },
  { id: "avertissement-important", label: "Avertissement important" },
  { id: "introduction", label: "Introduction" },
  { id: "responsabilite-generale", label: "Responsabilité générale de Mcar" },
  { id: "admissibilite", label: "Admissibilité et vérification" },
  { id: "structure-financiere", label: "Structure financière" },
  {
    id: "annulation-modification",
    label: "Politique d’annulation, modification et absence",
  },
  { id: "responsabilite-assurance", label: "Responsabilité, assurance et assistance" },
  { id: "usages-interdits", label: "Usages interdits" },
  { id: "limitation-responsabilite", label: "Limitation de responsabilité" },
];

export default function MessagingHostArticlePage() {
  return (
    <HelpArticleLayout
      breadcrumbs={["Centre d'aide", "Voyageurs", "Planifier votre trajet"]}
      title="Messagerie avec votre hôte"
      intro="Retrouvez ici les conditions d’utilisation Mcar à afficher sur la page article. Dernière mise à jour : 26 Février 2026."
      anchors={articleAnchors}
    >
      <section id="conditions-utilisation">
        <h2>Conditions d’utilisation</h2>
        <p>
          VEUILLEZ LIRE ATTENTIVEMENT LES PRÉSENTES CONDITIONS D'UTILISATION, CAR ELLES
          CONTIENNENT DES INFORMATIONS IMPORTANTES PORTANT SUR VOS DROITS LÉGAUX, RECOURS ET
          OBLIGATIONS.
        </p>
      </section>

      <section id="avertissement-important">
        <h3>Avertissement important</h3>
        <p>
          ELLES CONSTITUENT UN CONTRAT JURIDIQUEMENT CONTRAIGNANT ENTRE VOUS ET MADAGASYCAR
          (MCAR). En accédant à la plateforme, en créant un compte ou en effectuant une réservation,
          vous acceptez sans réserve les présentes Conditions.
        </p>
      </section>

      <section id="introduction">
        <h3>Introduction</h3>
        <p>
          Madagasycar, également désignée « Mcar », fournit un service numérique de mise en relation
          entre Hôtes et Voyageurs pour des véhicules motorisés sur le territoire de Madagascar.
        </p>
        <ul>
          <li>Mcar agit comme opérateur de plateforme numérique.</li>
          <li>Mcar agit comme intermédiaire technique de mise en relation.</li>
          <li>Mcar agit comme mandataire d’encaissement des paiements.</li>
        </ul>
      </section>

      <section id="responsabilite-generale">
        <h3>Responsabilité générale de Mcar</h3>
        <p>
          Les services sont fournis « en l’état ». Mcar ne garantit pas la disponibilité continue,
          l’absence d’erreurs techniques, ni l’exactitude absolue des informations publiées par les
          utilisateurs.
        </p>
      </section>

      <section id="admissibilite">
        <h3>Admissibilité, inscription, vérification</h3>
        <p>
          L’accès est réservé aux personnes juridiquement capables au sens du Code civil malgache.
          L’utilisateur doit fournir des informations exactes, complètes et à jour.
        </p>
        <ul>
          <li>Voyageur : permis valide, identité vérifiable, moyen de paiement valide.</li>
          <li>Hôte : propriété/mandat du véhicule, documents obligatoires, assurance valide.</li>
        </ul>
      </section>

      <section id="structure-financiere">
        <h3>Structure financière</h3>
        <p>
          Mcar n’est pas propriétaire des véhicules et n’est pas loueur. Le contrat de location est
          conclu directement entre l’Hôte et le Voyageur. Mcar encaisse les paiements en qualité de
          mandataire et reverse le solde à l’Hôte après la période de sécurité.
        </p>
      </section>

      <section id="annulation-modification">
        <h3>Politique d’annulation, modification et absence</h3>
        <p>
          Toute annulation doit être réalisée via la plateforme Mcar. Les remboursements dépendent du
          délai avant le début de la réservation et les frais de service/transaction peuvent rester non
          remboursables.
        </p>
      </section>

      <section id="responsabilite-assurance">
        <h3>Responsabilité, assurance et assistance</h3>
        <p>
          Mcar n’est pas une compagnie d’assurance. Les obligations d’assurance relèvent des
          utilisateurs ou d’un assureur tiers. En cas d’incident, les parties doivent déclarer les faits
          et conserver les preuves.
        </p>
      </section>

      <section id="usages-interdits">
        <h3>Usages interdits et déchéance des droits</h3>
        <ul>
          <li>Conduite sous alcool/stupéfiants.</li>
          <li>Transport de substances illégales ou activité criminelle.</li>
          <li>Sous-location, prêt à un tiers non déclaré, usage hors territoire autorisé.</li>
          <li>Participation à des courses, remorquage non autorisé.</li>
        </ul>
      </section>

      <section id="limitation-responsabilite">
        <h3>Limitation générale de responsabilité</h3>
        <p>
          Dans la limite de la législation malgache applicable, la responsabilité totale de Mcar est
          limitée au montant des frais de service perçus au titre de la transaction concernée.
        </p>
      </section>
    </HelpArticleLayout>
  );
}
