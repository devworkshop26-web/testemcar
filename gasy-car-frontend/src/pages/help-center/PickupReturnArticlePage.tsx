import { HelpArticleLayout } from "@/components/help-center/HelpArticleLayout";

type PickupReturnArticlePageProps = {
  title?: string;
};

const anchors = [
  { id: "etat-vehicule", label: "État du véhicule" },
  { id: "preuve", label: "Preuves" },
  { id: "retour-anticipe", label: "Retour anticipé" },
];

export default function PickupReturnArticlePage({
  title = "Prise en charge et retour",
}: PickupReturnArticlePageProps) {
  return (
    <HelpArticleLayout
      breadcrumbs={["Centre d'aide", "Article"]}
      title={title}
      intro="Obligations de prise en charge et de restitution prévues par les conditions Mcar."
      anchors={anchors}
    >
      <section id="etat-vehicule">
        <h2>État du véhicule avant départ</h2>
        <p>
          L’Hôte et le Voyageur doivent vérifier l’état intérieur/extérieur,
          kilométrage et carburant avant le début de la location.
        </p>
      </section>
      <section id="preuve">
        <h2>Conservation des preuves</h2>
        <p>
          Les photos horodatées et échanges via la plateforme servent de base en
          cas de contestation sur les dommages.
        </p>
      </section>
      <section id="retour-anticipe">
        <h2>Retour anticipé</h2>
        <p>
          Aucun remboursement n’est accordé pour retour anticipé, sauf
          modification officielle demandée et acceptée via la plateforme.
        </p>
      </section>
    </HelpArticleLayout>
  );
}
