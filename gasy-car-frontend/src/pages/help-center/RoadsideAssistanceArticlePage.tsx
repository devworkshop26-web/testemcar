import { HelpArticleLayout } from "@/components/help-center/HelpArticleLayout";

type RoadsideAssistanceArticlePageProps = {
  title?: string;
};

const anchors = [
  { id: "service", label: "Protection Routière" },
  { id: "contact", label: "Contact assistance" },
  { id: "prise-charge", label: "Prise en charge des frais" },
  { id: "incident", label: "Procédure incident" },
];

export default function RoadsideAssistanceArticlePage({
  title = "Numéros d'assistance routière",
}: RoadsideAssistanceArticlePageProps) {
  return (
    <HelpArticleLayout
      breadcrumbs={["Centre d'aide", "Article"]}
      title={title}
      intro="Assistance organisationnelle disponible pendant un incident de location."
      anchors={anchors}
    >
      <section id="service">
        <h2>Protection Routière Mcar</h2>
        <p>
          Ce service est optionnel et organisationnel. Il ne constitue pas une
          assurance.
        </p>
      </section>
      <section id="contact">
        <h2>Contact assistance</h2>
        <p>
          En cas d’accident, panne, vol ou immobilisation, contactez le support
          au <strong>034 05 910 50</strong>.
        </p>
      </section>
      <section id="prise-charge">
        <h2>Prise en charge des frais</h2>
        <p>
          Mcar peut avancer certains frais puis les imputer à la partie
          responsable (ex. défaut d’entretien côté Hôte ou faute de conduite
          côté Voyageur).
        </p>
      </section>
      <section id="incident">
        <h2>Procédure en cas d’incident</h2>
        <ul>
          <li>Sécuriser les personnes.</li>
          <li>Contacter les autorités si nécessaire.</li>
          <li>Informer l’autre partie et déclarer via la plateforme.</li>
          <li>Conserver preuves et documents (photos, PV, constat).</li>
        </ul>
      </section>
    </HelpArticleLayout>
  );
}
