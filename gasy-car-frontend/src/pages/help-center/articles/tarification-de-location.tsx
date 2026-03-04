import { HelpArticlePageTemplate } from "@/components/help-center/HelpArticlePageTemplate";

type ArticleProps = {
  title?: string;
};

export default function TarificationDeLocationArticle({ title = "Tarification de location" }: ArticleProps) {
  return (
    <HelpArticlePageTemplate
      title={title}
      intro="Contenu basé exclusivement sur les Conditions d’utilisation Madagasycar (mise à jour du 26 Février 2026)."
      sections={[
        { id: "regles-principales", title: "Règles principales", paragraphs: ["Cet article s’applique uniquement aux locations organisées sur la plateforme Madagasycar.", "Les utilisateurs doivent respecter les CGU, les lois malgaches en vigueur et les obligations contractuelles définies sur la plateforme."], },
        { id: "points-cles", title: "Points clés", bullets: ["Mcar agit comme intermédiaire technique et mandataire d’encaissement.", "Les transactions et modifications doivent être effectuées via la plateforme.", "En cas d’incident ou de litige, les preuves (photos, échanges, documents) doivent être conservées."], },
        { id: "responsabilites", title: "Responsabilités et limites", paragraphs: ["La responsabilité de Mcar est limitée conformément aux CGU et à la législation malgache applicable.", "Les responsabilités opérationnelles liées au véhicule, à la conduite et aux dommages incombent à l’Hôte et/ou au Voyageur selon le mode de location."], },
      ]}
    />
  );
}
