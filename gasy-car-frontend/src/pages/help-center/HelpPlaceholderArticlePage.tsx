import { HelpArticleLayout } from "@/components/help-center/HelpArticleLayout";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMemo } from "react";
import { useParams, useSearchParams } from "react-router-dom";

type RouteParams = {
  slug?: string;
};

function formatFallbackTitle(slug: string): string {
  return slug
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

const refundsAnchors = [
  { id: "politique-annulation", label: "Politique d’annulation" },
  { id: "annulation-voyageur", label: "Annulation par le voyageur" },
  { id: "annulation-hote", label: "Annulation par l’hôte" },
  { id: "responsabilite-assurance", label: "Responsabilité & assurance" },
  { id: "incidents-usages", label: "Incidents et usages interdits" },
  { id: "limitation-responsabilite", label: "Limitation de responsabilité" },
];

export default function HelpPlaceholderArticlePage() {
  const { slug = "article" } = useParams<RouteParams>();
  const [searchParams] = useSearchParams();

  const title = useMemo(() => {
    const queryTitle = searchParams.get("title");
    return queryTitle && queryTitle.trim().length > 0
      ? queryTitle
      : formatFallbackTitle(slug);
  }, [searchParams, slug]);

  const isRefundsArticle = slug === "remboursements";

  if (isRefundsArticle) {
    return (
      <HelpArticleLayout
        breadcrumbs={["Centre d'aide", "Article"]}
        title="Remboursements"
        intro="Consultez les règles d’annulation, de remboursement, d’absence (no-show), et les dispositions relatives aux responsabilités, assurances et incidents sur Mcar."
        anchors={refundsAnchors}
      >
        <section id="politique-annulation" className="space-y-4">
          <h2 className="text-3xl font-bold tracking-tight">Politique d’annulation, modification et absence</h2>
          <p>
            Toute annulation doit être effectuée via la plateforme Mcar. Les remboursements portent
            exclusivement sur le prix de location.
          </p>
          <p>Les frais suivants ne sont pas remboursables :</p>
          <ul className="list-disc space-y-2 pl-6">
            <li>frais de service Mcar ;</li>
            <li>frais de traitement de paiement ;</li>
            <li>frais Mobile Money ;</li>
            <li>frais bancaires ;</li>
            <li>frais administratifs ;</li>
            <li>frais techniques de transaction.</li>
          </ul>
        </section>

        <section id="annulation-voyageur" className="space-y-4">
          <h2 className="text-3xl font-bold tracking-tight">Annulation par le voyageur</h2>
          <h3 className="text-2xl font-semibold tracking-tight">Barème de remboursement</h3>
          <ul className="list-disc space-y-2 pl-6">
            <li>
              <strong>Plus de 72 heures avant le début :</strong> remboursement intégral du prix de
              location (hors frais Mcar et frais de transaction).
            </li>
            <li>
              <strong>Entre 72 heures et 36 heures :</strong> remboursement de 75 % du prix de
              location.
            </li>
            <li>
              <strong>Entre 36 heures et 24 heures :</strong> remboursement de 50 % du prix de
              location.
            </li>
            <li>
              <strong>Moins de 24 heures :</strong> aucun remboursement du prix de location garanti.
            </li>
            <li>
              <strong>Réservation faite moins de 24 heures avant le début :</strong> annulation sans
              frais sur le prix de location dans un délai d’1 heure après réservation.
            </li>
          </ul>
          <p>Les frais de transaction restent non remboursables dans tous les cas.</p>

          <h3 className="text-2xl font-semibold tracking-tight">Circonstances exceptionnelles</h3>
          <p>
            Mcar peut, à sa seule appréciation, accorder un remboursement total ou partiel dans des
            situations exceptionnelles dûment justifiées.
          </p>
          <ul className="list-disc space-y-2 pl-6">
            <li>hospitalisation ou urgence médicale grave ;</li>
            <li>décès d’un proche direct ;</li>
            <li>catastrophe naturelle affectant la zone de départ ou d’arrivée ;</li>
            <li>interdiction administrative de circulation ;</li>
            <li>annulation ou retard majeur de vol ou de transport ;</li>
            <li>événement imprévisible indépendant de la volonté du voyageur.</li>
          </ul>
          <p>
            Un justificatif peut être exigé. L’acceptation n’est jamais automatique. Le remboursement
            peut être effectué sur le moyen de paiement initial ou sous forme de crédit plateforme.
          </p>

          <h3 className="text-2xl font-semibold tracking-tight">Absence du voyageur (no-show)</h3>
          <p>Est considéré comme absence :</p>
          <ul className="list-disc space-y-2 pl-6">
            <li>non-présentation dans les 60 minutes suivant l’heure prévue ;</li>
            <li>présentation sans permis valide ;</li>
            <li>envoi d’une personne non autorisée.</li>
          </ul>
          <ul className="list-disc space-y-2 pl-6">
            <li>
              <strong>Location de plus de 2 jours :</strong> remboursement diminué de l’équivalent de 2
              journées moyennes.
            </li>
            <li>
              <strong>Location de 2 jours ou moins :</strong> aucun remboursement.
            </li>
          </ul>

          <h3 className="text-2xl font-semibold tracking-tight">Retours anticipés</h3>
          <p>
            Aucun remboursement n’est accordé pour un retour anticipé, sauf en cas de modification
            officielle demandée via la plateforme et acceptée avant restitution.
          </p>
        </section>

        <section id="annulation-hote" className="space-y-4">
          <h2 className="text-3xl font-bold tracking-tight">Annulation par l’hôte</h2>
          <p>Toute annulation par l’hôte doit être effectuée via la plateforme Mcar.</p>
          <ul className="list-disc space-y-2 pl-6">
            <li>Le voyageur reçoit un remboursement intégral du prix de location.</li>
            <li>
              Les frais de service peuvent être remboursés au voyageur ou convertis en crédit
              plateforme, à la discrétion de Mcar.
            </li>
          </ul>
          <p>
            Les frais de service Mcar, traitement de paiement, Mobile Money, bancaires,
            administratifs et techniques restent acquis à Mcar et ne sont pas remboursables à l’hôte.
          </p>

          <h3 className="text-2xl font-semibold tracking-tight">Pénalités financières hôte</h3>
          <ul className="list-disc space-y-2 pl-6">
            <li>
              <strong>Annulation plus de 48 h avant le début :</strong> pénalité administrative de
              40 000 Ar ou 10 % de la location (le montant le plus élevé).
            </li>
            <li>
              <strong>Annulation moins de 48 h avant le début :</strong> pénalité de 20 %.
            </li>
            <li>
              <strong>Annulation moins de 24 h avant le début :</strong> pénalité renforcée, impact
              sur le classement, bannissement temporaire et mention visible sur le profil.
            </li>
          </ul>

          <h3 className="text-2xl font-semibold tracking-tight">Absence de l’hôte (no-show hôte)</h3>
          <ul className="list-disc space-y-2 pl-6">
            <li>non-mise à disposition du véhicule dans les 60 minutes suivant l’heure prévue ;</li>
            <li>véhicule non conforme empêchant la location ;</li>
            <li>refus injustifié de remise du véhicule.</li>
          </ul>
          <p>
            Dans ce cas : remboursement intégral du voyageur, pénalité maximale et possibilité de
            suspension immédiate.
          </p>

          <h3 className="text-2xl font-semibold tracking-tight">Annulations répétées</h3>
          <p>Mcar peut réduire la visibilité d’une annonce, suspendre le compte, retirer le véhicule ou résilier définitivement le compte.</p>
          <p>
            Aucune pénalité n’est appliquée en cas d’accident du véhicule, hospitalisation ou force
            majeure, sous réserve de justificatifs.
          </p>
          <p>
            Les pénalités sont automatiquement déduites du prochain versement dû à l’hôte ou
            facturées immédiatement si le solde est insuffisant.
          </p>
        </section>

        <section id="responsabilite-assurance" className="space-y-4">
          <h2 className="text-3xl font-bold tracking-tight">Responsabilité, assurance et assistance</h2>
          <p>
            Mcar n’est pas une compagnie d’assurance et ne fournit aucune couverture automobile,
            responsabilité civile ou dommage.
          </p>
          <p>
            L’hôte doit disposer d’une assurance responsabilité civile automobile valide couvrant le
            véhicule et son usage autorisé.
          </p>
          <p>
            Mcar peut proposer une assurance optionnelle via un assureur tiers. Cette assurance est
            régie par un contrat distinct avec l’assureur partenaire.
          </p>
          <p>
            Le voyageur est responsable des dommages, pertes, dégradations ou vols survenus pendant
            la période de location, incluant notamment les frais de réparation, immobilisation,
            administratifs et pertes d’exploitation raisonnables.
          </p>
          <p>
            Mcar peut proposer une Protection Routière optionnelle (assistance 24/7, dépannage,
            coordination logistique), qui constitue un service d’assistance et non une assurance.
          </p>
        </section>

        <section id="incidents-usages" className="space-y-4">
          <h2 className="text-3xl font-bold tracking-tight">Incidents, litiges et usages interdits</h2>
          <h3 className="text-2xl font-semibold tracking-tight">Vols et accidents</h3>
          <p>
            En cas de vol ou d’accident, les parties doivent signaler immédiatement l’incident,
            préserver les preuves (photos, constat, procès-verbal, devis) et déclarer l’événement via
            la plateforme.
          </p>
          <p>
            Mcar agit comme intermédiaire technique et n’effectue pas d’expertise, ne tranche pas la
            responsabilité civile et n’assume aucune obligation d’indemnisation.
          </p>

          <h3 className="text-2xl font-semibold tracking-tight">Usages strictement interdits</h3>
          <ul className="list-disc space-y-2 pl-6">
            <li>conduite sous alcool ou stupéfiants ;</li>
            <li>transport de substances illégales ;</li>
            <li>activité criminelle ;</li>
            <li>course/compétition ;</li>
            <li>sous-location, prêt à un tiers non déclaré ;</li>
            <li>conduite par personne non autorisée ;</li>
            <li>utilisation hors territoire autorisé ou surcharge excessive.</li>
          </ul>
          <p>
            Tout usage interdit entraîne la déchéance des protections éventuelles et peut conduire à
            une responsabilité financière illimitée ainsi qu’à des sanctions contractuelles
            (suspension, suppression d’annonce, résiliation du compte).
          </p>
        </section>

        <section id="limitation-responsabilite" className="space-y-4">
          <h2 className="text-3xl font-bold tracking-tight">Limitation générale de responsabilité</h2>
          <p>
            Mcar fournit un service de mise en relation numérique entre hôtes et voyageurs. Le contrat
            de location est conclu directement entre ces parties.
          </p>
          <p>
            Dans la limite autorisée par la législation malgache, la responsabilité totale de Mcar est
            limitée au montant des frais de service perçus sur la transaction concernée.
          </p>
          <p>
            Mcar n’est pas responsable des pertes indirectes, manque à gagner, pertes d’exploitation
            et dommages immatériels, ni des cas de force majeure (catastrophe naturelle, troubles
            civils, coupure réseau, cyberattaque, décision administrative, etc.).
          </p>
          <p>
            Les utilisateurs s’engagent à indemniser Mcar en cas de réclamation liée à une violation
            des présentes conditions, usage interdit, fausse déclaration ou contournement de la
            plateforme.
          </p>
        </section>
      </HelpArticleLayout>
    );
  }

  return (
    <HelpArticleLayout
      breadcrumbs={["Centre d'aide", "Article"]}
      title={title}
      intro="Cette page est prête et réutilisable avec shadcn. Le contenu détaillé sera ajouté prochainement."
      anchors={[{ id: "statut-article", label: "Statut de l’article" }]}
    >
      <section id="statut-article">
        <Card>
          <CardHeader>
            <Badge className="w-fit" variant="secondary">
              En préparation
            </Badge>
            <CardTitle className="mt-3">Contenu en cours de finalisation</CardTitle>
          </CardHeader>
          <CardContent>
            Cet article a bien sa route dédiée. Vous pouvez maintenant relier tous les liens du centre
            d’aide vers une page cohérente et réutilisable.
          </CardContent>
        </Card>
      </section>
    </HelpArticleLayout>
  );
}
