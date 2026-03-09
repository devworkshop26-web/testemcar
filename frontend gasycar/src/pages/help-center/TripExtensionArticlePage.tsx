import { HelpArticleLayout } from "@/components/help-center/HelpArticleLayout";

type TripExtensionArticlePageProps = {
  title?: string;
};

const anchors = [
  { id: "demande", label: "Demande d'extension" },
  { id: "indisponibilite", label: "Véhicule déjà réservé" },
  { id: "retard", label: "Maintien non autorisé" },
];

export default function TripExtensionArticlePage({
  title = "Prolonger un voyage",
}: TripExtensionArticlePageProps) {
  return (
    <HelpArticleLayout
      breadcrumbs={["Centre d'aide", "Article"]}
      title={title}
      intro="Règles d’extension et de dépassement de durée de location."
      anchors={anchors}
    >
      <section id="demande">
        <h2>Demande d'extension</h2>
        <p>
          Toute extension doit être effectuée sur la plateforme Mcar. Les accords
          verbaux externes ne sont pas valables contractuellement.
        </p>
      </section>
      <section id="indisponibilite">
        <h2>Véhicule déjà réservé</h2>
        <p>
          Si le véhicule est déjà réservé par un autre Voyageur, l’extension est
          automatiquement refusée, sauf accord explicite du Voyageur suivant.
        </p>
      </section>
      <section id="retard">
        <h2>Maintien non autorisé du véhicule</h2>
        <ul>
          <li>tarif journalier majoré ;</li>
          <li>pénalité contractuelle ;</li>
          <li>frais de relogement / indemnisation du Voyageur suivant.</li>
        </ul>
      </section>
    </HelpArticleLayout>
  );
}
