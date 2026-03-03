import { HelpArticleLayout } from "@/components/help-center/HelpArticleLayout";

const refundsAnchors = [
  { id: "principe-general", label: "Principe général" },
  { id: "annulation-voyageur", label: "Annulation par le voyageur" },
  { id: "annulation-hote", label: "Annulation par l’hôte" },
  {
    id: "responsabilite-assurance",
    label: "Responsabilité, assurance et assistance",
  },
  { id: "vols-accidents", label: "Vols et accidents" },
  { id: "incidents-litiges", label: "Procédure et litiges" },
  { id: "usages-interdits", label: "Usages interdits et déchéance" },
  {
    id: "limitation-responsabilite",
    label: "Limitation générale de responsabilité",
  },
];

export default function RefundsArticlePage() {
  return (
    <HelpArticleLayout
      breadcrumbs={["Centre d'aide", "Article"]}
      title="Remboursements"
      intro="Politique d’annulation, de modification et d’absence (no-show), ainsi que les règles de responsabilité, d’assurance et d’assistance applicables sur Mcar."
      anchors={refundsAnchors}
    >
      <section id="principe-general" className="space-y-4">
        <h2 className="text-3xl font-bold tracking-tight">
          Politique d’annulation, modification et absence
        </h2>
        <h3 className="text-2xl font-semibold tracking-tight">
          Principe général
        </h3>
        <p>Toute annulation doit être effectuée via la plateforme Mcar.</p>
        <p>Les remboursements portent exclusivement sur le prix de location.</p>
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
        <h2 className="text-3xl font-bold tracking-tight">
          Annulation par le voyageur
        </h2>

        <h3 className="text-2xl font-semibold tracking-tight">
          Annulation plus de 72 heures avant le début
        </h3>
        <p>
          Si l’annulation intervient plus de soixante-douze (72) heures avant
          l’heure prévue de début, le Voyageur reçoit le remboursement intégral
          du prix de location.
        </p>
        <p>Les frais mentionnés au principe général restent acquis à Mcar.</p>

        <h3 className="text-2xl font-semibold tracking-tight">
          Annulation entre 72 heures et 36 heures avant le début
        </h3>
        <p>
          Si l’annulation intervient entre soixante-douze (72) heures et
          trente-six (36) heures avant le début, le Voyageur reçoit
          soixante-quinze pour cent (75 %) du prix de location.
        </p>
        <p>Les frais Mcar ne sont pas remboursés.</p>

        <h3 className="text-2xl font-semibold tracking-tight">
          Annulation entre 36 heures et 24 heures avant le début
        </h3>
        <p>
          Si l’annulation intervient entre trente-six (36) heures et
          vingt-quatre (24) heures avant le début, le Voyageur reçoit cinquante
          pour cent (50 %) du prix de location.
        </p>
        <p>Les frais Mcar restent non remboursables.</p>

        <h3 className="text-2xl font-semibold tracking-tight">
          Annulation moins de 24 heures avant le début
        </h3>
        <p>
          Si l’annulation intervient moins de vingt-quatre (24) heures avant
          l’heure prévue, aucun remboursement du prix de location n’est garanti.
        </p>
        <p>Les frais Mcar restent acquis.</p>

        <h3 className="text-2xl font-semibold tracking-tight">
          Réservation effectuée moins de 24 heures avant le début
        </h3>
        <p>
          Si la réservation est effectuée moins de vingt-quatre (24) heures
          avant le début prévu, le Voyageur dispose d’un délai d’une (1) heure
          après la réservation pour annuler sans frais sur le prix de location.
        </p>
        <p>Les frais de transaction restent non remboursables.</p>

        <h3 className="text-2xl font-semibold tracking-tight">
          Circonstances exceptionnelles
        </h3>
        <p>
          Nonobstant les dispositions précédentes, Mcar peut, à sa seule
          appréciation, accorder un remboursement total ou partiel dans des
          situations exceptionnelles dûment justifiées.
        </p>
        <p>Sont notamment considérées comme circonstances exceptionnelles :</p>
        <ul className="list-disc space-y-2 pl-6">
          <li>hospitalisation ou urgence médicale grave ;</li>
          <li>décès d’un proche direct ;</li>
          <li>
            catastrophe naturelle affectant la zone de départ ou d’arrivée ;
          </li>
          <li>interdiction administrative de circulation ;</li>
          <li>
            annulation ou retard majeur de vol ou de transport empêchant
            objectivement la prise en charge du véhicule ;
          </li>
          <li>
            événements imprévisibles et indépendants de la volonté du Voyageur.
          </li>
        </ul>
        <p>Le Voyageur doit fournir tout justificatif pertinent.</p>
        <p>Mcar conserve un pouvoir d’appréciation discrétionnaire.</p>
        <p>
          Aucune circonstance invoquée ne garantit automatiquement un
          remboursement.
        </p>
        <p>Le remboursement peut être effectué :</p>
        <ul className="list-disc space-y-2 pl-6">
          <li>soit sur le moyen de paiement initial ;</li>
          <li>soit sous forme de crédit utilisable sur la plateforme.</li>
        </ul>

        <h3 className="text-2xl font-semibold tracking-tight">
          Absence du Voyageur (No-show)
        </h3>
        <p>Est considéré comme absence :</p>
        <ul className="list-disc space-y-2 pl-6">
          <li>
            la non-présentation dans les soixante (60) minutes suivant l’heure
            prévue ;
          </li>
          <li>la présentation sans permis valide ;</li>
          <li>l’envoi d’une personne non autorisée.</li>
        </ul>
        <p>Dans ce cas :</p>
        <ul className="list-disc space-y-2 pl-6">
          <li>
            <strong>Location de plus de deux (2) jours :</strong> le Voyageur
            est remboursé moins l’équivalent de deux (2) journées moyennes.
          </li>
          <li>
            <strong>Location de deux (2) jours ou moins :</strong> le Voyageur
            ne sera pas remboursé.
          </li>
        </ul>

        <h3 className="text-2xl font-semibold tracking-tight">
          Retours anticipés
        </h3>
        <p>Aucun remboursement n’est accordé pour un retour anticipé, sauf :</p>
        <ul className="list-disc space-y-2 pl-6">
          <li>
            si une modification officielle a été demandée via la plateforme ;
          </li>
          <li>et acceptée avant restitution.</li>
        </ul>
      </section>

      <section id="annulation-hote" className="space-y-4">
        <h2 className="text-3xl font-bold tracking-tight">
          Annulation par l’Hôte
        </h2>
        <p>
          Toute annulation par l’Hôte doit être effectuée via la plateforme.
        </p>
        <p>En cas d’annulation par l’Hôte :</p>
        <ul className="list-disc space-y-2 pl-6">
          <li>
            le Voyageur reçoit un remboursement intégral du prix de location ;
          </li>
          <li>
            les frais de service peuvent être remboursés au Voyageur ou
            convertis en crédit plateforme à la discrétion de Mcar.
          </li>
        </ul>
        <p>
          Les frais suivants restent acquis à Mcar et ne sont pas remboursables
          à l’Hôte :
        </p>
        <ul className="list-disc space-y-2 pl-6">
          <li>frais de service Mcar ;</li>
          <li>frais de traitement de paiement ;</li>
          <li>frais Mobile Money ;</li>
          <li>frais bancaires ;</li>
          <li>frais administratifs ;</li>
          <li>frais techniques de transaction.</li>
        </ul>

        <h3 className="text-2xl font-semibold tracking-tight">
          Pénalité financière
        </h3>
        <p>
          Sauf circonstance exceptionnelle validée par Mcar, l’Hôte est soumis
          aux pénalités suivantes :
        </p>
        <ul className="list-disc space-y-2 pl-6">
          <li>
            <strong>a) Annulation plus de 48 heures avant le début :</strong>{" "}
            pénalité administrative de 40 000 Ar ou 10 % de la location (le plus
            élevé).
          </li>
          <li>
            <strong>b) Annulation moins de 48 heures avant le début :</strong>{" "}
            pénalité de 20 %.
          </li>
          <li>
            <strong>c) Annulation moins de 24 heures avant le début :</strong>{" "}
            pénalité renforcée, impact sur classement, banni un mois de la
            plateforme et mention visible sur le profil (annulation dernière
            minute).
          </li>
        </ul>

        <h3 className="text-2xl font-semibold tracking-tight">
          Absence de l’Hôte (No-show Hôte)
        </h3>
        <p>Est considéré comme absence :</p>
        <ul className="list-disc space-y-2 pl-6">
          <li>
            la non-mise à disposition du véhicule dans les soixante (60) minutes
            suivant l’heure prévue ;
          </li>
          <li>véhicule non conforme empêchant la location ;</li>
          <li>refus injustifié de remettre le véhicule.</li>
        </ul>
        <p>Dans ce cas :</p>
        <ul className="list-disc space-y-2 pl-6">
          <li>remboursement intégral du Voyageur ;</li>
          <li>pénalité maximale ;</li>
          <li>possibilité de suspension immédiate.</li>
        </ul>

        <h3 className="text-2xl font-semibold tracking-tight">
          Annulations répétées
        </h3>
        <p>En cas d’annulations répétées ou abusives, Mcar peut :</p>
        <ul className="list-disc space-y-2 pl-6">
          <li>réduire la visibilité de l’annonce ;</li>
          <li>suspendre temporairement le compte ;</li>
          <li>retirer le véhicule ;</li>
          <li>résilier définitivement le compte.</li>
        </ul>

        <h3 className="text-2xl font-semibold tracking-tight">
          Circonstances exceptionnelles pour l’Hôte
        </h3>
        <p>Aucune pénalité ne sera appliquée en cas de :</p>
        <ul className="list-disc space-y-2 pl-6">
          <li>accident du véhicule ;</li>
          <li>hospitalisation ;</li>
          <li>événement de force majeure.</li>
        </ul>
        <p>Sous réserve de justificatif.</p>
        <p>Mcar conserve un pouvoir d’appréciation.</p>

        <h3 className="text-2xl font-semibold tracking-tight">
          Modalités d’exécution des pénalités
        </h3>
        <p>Les pénalités sont :</p>
        <ul className="list-disc space-y-2 pl-6">
          <li>automatiquement déduites du prochain versement dû à l’Hôte ;</li>
          <li>et, en cas de solde insuffisant, facturées immédiatement.</li>
        </ul>
        <p>En cas de non-paiement :</p>
        <ul className="list-disc space-y-2 pl-6">
          <li>suspension du compte ;</li>
          <li>blocage des annonces ;</li>
          <li>restriction des réservations ;</li>
          <li>résiliation possible.</li>
        </ul>
      </section>

      <section id="responsabilite-assurance" className="space-y-4">
        <h2 className="text-3xl font-bold tracking-tight">
          Responsabilité, assurance et assistance
        </h2>

        <h3 className="text-2xl font-semibold tracking-tight">
          Absence de qualité d’assureur
        </h3>
        <p>Mcar n’est pas une compagnie d’assurance.</p>
        <p>
          Mcar ne fournit aucune couverture d’assurance automobile,
          responsabilité civile ou dommage.
        </p>
        <p>Toute obligation d’assurance relève exclusivement :</p>
        <ul className="list-disc space-y-2 pl-6">
          <li>de l’Hôte ;</li>
          <li>du Voyageur ;</li>
          <li>ou d’un assureur tiers.</li>
        </ul>

        <h3 className="text-2xl font-semibold tracking-tight">
          Assurance obligatoire de l’Hôte
        </h3>
        <p>L’Hôte doit obligatoirement disposer :</p>
        <ul className="list-disc space-y-2 pl-6">
          <li>d’une assurance responsabilité civile automobile valide ;</li>
          <li>couvrant le véhicule mis en location ;</li>
          <li>couvrant l’usage autorisé du véhicule.</li>
        </ul>
        <p>L’Hôte est seul responsable :</p>
        <ul className="list-disc space-y-2 pl-6">
          <li>de l’étendue réelle de sa couverture ;</li>
          <li>des exclusions de garantie ;</li>
          <li>des franchises applicables.</li>
        </ul>
        <p>Le défaut d’assurance valide entraîne :</p>
        <ul className="list-disc space-y-2 pl-6">
          <li>suspension immédiate du véhicule ;</li>
          <li>suspension du compte.</li>
        </ul>

        <h3 className="text-2xl font-semibold tracking-tight">
          Assurance optionnelle proposée via Mcar
        </h3>
        <p>
          Mcar peut proposer, en partenariat avec un assureur tiers, une
          assurance optionnelle.
        </p>
        <p>Cette assurance :</p>
        <ul className="list-disc space-y-2 pl-6">
          <li>est souscrite directement auprès de l’assureur partenaire ;</li>
          <li>est régie par le contrat d’assurance distinct ;</li>
          <li>relève exclusivement de la responsabilité de l’assureur.</li>
        </ul>
        <p>Mcar agit uniquement comme intermédiaire de mise en relation.</p>
        <p>
          Mcar n’assume aucune obligation d’indemnisation au titre de cette
          assurance.
        </p>
        <p>
          Tout litige relatif à l’assurance relève exclusivement de l’assureur
          concerné.
        </p>

        <h3 className="text-2xl font-semibold tracking-tight">
          Responsabilité du Voyageur
        </h3>
        <p>
          Le Voyageur est responsable de tout dommage, perte, dégradation ou vol
          survenu pendant la période de location.
        </p>
        <p>Cette responsabilité inclut notamment :</p>
        <ul className="list-disc space-y-2 pl-6">
          <li>frais de réparation ;</li>
          <li>frais d’immobilisation ;</li>
          <li>frais administratifs ;</li>
          <li>pertes d’exploitation raisonnables.</li>
        </ul>

        <h3 className="text-2xl font-semibold tracking-tight">
          Protection Routière Mcar (service d’assistance optionnel)
        </h3>
        <p>Mcar peut proposer un service optionnel de Protection Routière.</p>
        <p>Ce service peut inclure :</p>
        <ul className="list-disc space-y-2 pl-6">
          <li>assistance téléphonique 24/7 au 034 05 910 50 ;</li>
          <li>organisation de dépannage ;</li>
          <li>coordination d’un véhicule de remplacement ;</li>
          <li>assistance logistique ;</li>
          <li>
            organisation d’hébergement temporaire en cas d’immobilisation
            majeure.
          </li>
        </ul>
        <p>Ce service constitue une assistance organisationnelle.</p>
        <p>Il ne constitue pas une assurance.</p>

        <h3 className="text-2xl font-semibold tracking-tight">
          Prise en charge des frais
        </h3>
        <p>
          Lorsque la Protection Routière est activée, Mcar peut, à sa discrétion
          :
        </p>
        <ul className="list-disc space-y-2 pl-6">
          <li>avancer certains frais nécessaires ;</li>
          <li>organiser une solution alternative ;</li>
          <li>accorder un hébergement temporaire.</li>
        </ul>
        <p>
          Les frais engagés peuvent être imputés à la partie responsable de
          l’incident, notamment :
        </p>
        <ul className="list-disc space-y-2 pl-6">
          <li>
            à l’Hôte en cas de panne mécanique imputable à un défaut d’entretien
            ;
          </li>
          <li>au Voyageur en cas de faute de conduite ou usage interdit.</li>
        </ul>
        <p>
          Mcar conserve un pouvoir d’appréciation quant à l’activation et à
          l’étendue de l’assistance.
        </p>
      </section>

      <section id="vols-accidents" className="space-y-4">
        <h2 className="text-3xl font-bold tracking-tight">Vols et accidents</h2>

        <h3 className="text-2xl font-semibold tracking-tight">
          Vol du véhicule
        </h3>
        <p>
          En cas de vol du véhicule pendant la période de location, le Voyageur
          doit :
        </p>
        <ul className="list-disc space-y-2 pl-6">
          <li>informer immédiatement les autorités compétentes ;</li>
          <li>déposer plainte ;</li>
          <li>informer l’Hôte et Mcar sans délai ;</li>
          <li>coopérer pleinement à toute enquête.</li>
        </ul>
        <p>
          Le Voyageur est financièrement responsable du vol lorsque celui-ci
          résulte :
        </p>
        <ul className="list-disc space-y-2 pl-6">
          <li>d’une négligence ;</li>
          <li>d’un usage interdit ;</li>
          <li>du non-respect des obligations contractuelles.</li>
        </ul>
        <p>
          Lorsque le vol survient sans faute démontrée du Voyageur, la prise en
          charge relève de l’assurance du véhicule.
        </p>
        <p>Mcar ne supporte aucune obligation d’indemnisation.</p>

        <h3 className="text-2xl font-semibold tracking-tight">
          Accident corporel
        </h3>
        <p>En cas d’accident entraînant des blessures corporelles :</p>
        <ul className="list-disc space-y-2 pl-6">
          <li>le conducteur est responsable selon le droit applicable ;</li>
          <li>
            l’assurance responsabilité civile du véhicule intervient
            prioritairement ;
          </li>
          <li>
            l’Hôte est responsable en tant que propriétaire selon les règles
            légales.
          </li>
        </ul>
        <p>Mcar n’assume aucune responsabilité pour les dommages corporels.</p>

        <h3 className="text-2xl font-semibold tracking-tight">
          Dommages matériels
        </h3>
        <p>
          Le Voyageur est responsable de tout dommage matériel survenu pendant
          la période de location.
        </p>
        <p>La preuve de l’état initial du véhicule repose sur :</p>
        <ul className="list-disc space-y-2 pl-6">
          <li>les photographies horodatées ;</li>
          <li>le constat contradictoire ;</li>
          <li>les échanges via la plateforme.</li>
        </ul>
        <p>
          En l’absence de preuve de l’état initial, toute contestation sera
          appréciée par Mcar à sa discrétion.
        </p>
        <p>Mcar peut :</p>
        <ul className="list-disc space-y-2 pl-6">
          <li>retenir tout ou partie du dépôt de garantie ;</li>
          <li>débiter le moyen de paiement enregistré ;</li>
          <li>suspendre le compte en cas de refus de paiement.</li>
        </ul>

        <h3 className="text-2xl font-semibold tracking-tight">
          Distinction selon le mode de location
        </h3>
        <h4 className="text-xl font-semibold tracking-tight">
          Location sans chauffeur
        </h4>
        <p>
          Le Voyageur assume la qualité de conducteur et supporte l’ensemble des
          responsabilités liées à la conduite du véhicule.
        </p>

        <h4 className="text-xl font-semibold tracking-tight">
          Location avec chauffeur
        </h4>
        <p>Lorsque le véhicule est mis à disposition avec chauffeur :</p>
        <ul className="list-disc space-y-2 pl-6">
          <li>le chauffeur agit pour le compte de l’Hôte ;</li>
          <li>
            la responsabilité liée à la conduite incombe au chauffeur et à
            l’Hôte ;
          </li>
          <li>
            le Voyageur ne peut être tenu responsable des fautes de conduite
            sauf participation active ou instruction fautive.
          </li>
        </ul>

        <h3 className="text-2xl font-semibold tracking-tight">
          Perte totale du véhicule
        </h3>
        <p>
          En cas de destruction totale ou perte irrécupérable du véhicule, la
          responsabilité financière est déterminée exclusivement entre l’Hôte et
          le Voyageur.
        </p>
        <p>
          La valeur applicable est celle retenue par l’assurance du véhicule ou,
          à défaut, la valeur de marché locale au moment du sinistre.
        </p>
        <p>Mcar n’assume aucune obligation d’indemnisation.</p>
        <p>
          Lorsque le Voyageur a souscrit une assurance optionnelle proposée via
          Mcar, les conditions du contrat d’assurance tiers s’appliquent
          exclusivement.
        </p>
      </section>

      <section id="incidents-litiges" className="space-y-4">
        <h2 className="text-3xl font-bold tracking-tight">
          Procédure en cas d’incident et règlement des litiges
        </h2>

        <h3 className="text-2xl font-semibold tracking-tight">
          Obligation de signalement
        </h3>
        <p>En cas d’accident, panne, vol ou dommage, les parties doivent :</p>
        <ol className="list-decimal space-y-2 pl-6">
          <li>assurer la sécurité des personnes ;</li>
          <li>contacter les autorités compétentes si nécessaire ;</li>
          <li>informer l’autre partie ;</li>
          <li>déclarer l’incident via la plateforme ;</li>
          <li>contacter le support au 034 05 910 50 si assistance requise.</li>
        </ol>

        <h3 className="text-2xl font-semibold tracking-tight">
          Collecte des preuves
        </h3>
        <p>
          Les parties sont responsables de la conservation des preuves,
          notamment :
        </p>
        <ul className="list-disc space-y-2 pl-6">
          <li>photographies ;</li>
          <li>constat amiable ;</li>
          <li>procès-verbal ;</li>
          <li>devis ou rapport d’assurance.</li>
        </ul>
        <p>
          L’absence de preuve peut affecter la capacité de la partie concernée à
          obtenir réparation.
        </p>

        <h3 className="text-2xl font-semibold tracking-tight">Rôle de Mcar</h3>
        <p>Mcar agit exclusivement en qualité d’intermédiaire technique.</p>
        <p>En cas d’incident, Mcar peut :</p>
        <ul className="list-disc space-y-2 pl-6">
          <li>transmettre les informations entre les parties ;</li>
          <li>suspendre temporairement les paiements ;</li>
          <li>
            exécuter les retenues ou débits conformément aux autorisations
            contractuelles.
          </li>
        </ul>
        <p>Mcar :</p>
        <ul className="list-disc space-y-2 pl-6">
          <li>ne réalise aucune expertise technique ;</li>
          <li>ne détermine pas la responsabilité civile ;</li>
          <li>ne tranche pas les litiges ;</li>
          <li>n’assume aucune obligation d’indemnisation.</li>
        </ul>

        <h3 className="text-2xl font-semibold tracking-tight">
          Règlement des litiges
        </h3>
        <p>
          Les litiges relatifs aux dommages, pertes ou vols sont réglés
          directement entre l’Hôte et le Voyageur ou par leurs assureurs
          respectifs.
        </p>
        <p>
          En cas d’absence d’accord, les juridictions compétentes sont seules
          habilitées à trancher.
        </p>
      </section>

      <section id="usages-interdits" className="space-y-4">
        <h2 className="text-3xl font-bold tracking-tight">
          Usages interdits et déchéance des droits
        </h2>

        <h3 className="text-2xl font-semibold tracking-tight">
          Principe général
        </h3>
        <p>Le véhicule doit être utilisé conformément :</p>
        <ul className="list-disc space-y-2 pl-6">
          <li>au Code de la Route malgache ;</li>
          <li>aux lois et règlements applicables ;</li>
          <li>aux présentes Conditions.</li>
        </ul>
        <p>
          Tout usage interdit entraîne la responsabilité exclusive de
          l’utilisateur concerné.
        </p>

        <h3 className="text-2xl font-semibold tracking-tight">
          Usages strictement interdits
        </h3>
        <p>Il est strictement interdit d’utiliser le véhicule pour :</p>
        <ul className="list-disc space-y-2 pl-6">
          <li>la conduite sous l’emprise d’alcool ou de stupéfiants ;</li>
          <li>le transport de substances illégales ;</li>
          <li>toute activité criminelle ;</li>
          <li>la participation à des courses ou compétitions ;</li>
          <li>l’apprentissage de la conduite ;</li>
          <li>le transport rémunéré non autorisé ;</li>
          <li>la sous-location ;</li>
          <li>le prêt à un tiers non déclaré ;</li>
          <li>la conduite par une personne non autorisée ;</li>
          <li>le remorquage non autorisé ;</li>
          <li>une utilisation hors du territoire autorisé ;</li>
          <li>toute surcharge excessive.</li>
        </ul>

        <h3 className="text-2xl font-semibold tracking-tight">
          Location sans chauffeur
        </h3>
        <p>Seul le Voyageur déclaré et autorisé peut conduire le véhicule.</p>
        <p>Toute conduite par un tiers non déclaré entraîne :</p>
        <ul className="list-disc space-y-2 pl-6">
          <li>déchéance de toute protection éventuelle ;</li>
          <li>responsabilité intégrale du Voyageur ;</li>
          <li>possibilité de suspension du compte.</li>
        </ul>

        <h3 className="text-2xl font-semibold tracking-tight">
          Location avec chauffeur
        </h3>
        <p>Le Voyageur ne peut :</p>
        <ul className="list-disc space-y-2 pl-6">
          <li>exiger une conduite dangereuse ;</li>
          <li>imposer un usage interdit ;</li>
          <li>demander une violation du Code de la Route.</li>
        </ul>
        <p>Toute instruction fautive engage la responsabilité du Voyageur.</p>

        <h3 className="text-2xl font-semibold tracking-tight">
          Déchéance automatique
        </h3>
        <p>En cas d’usage interdit :</p>
        <ul className="list-disc space-y-2 pl-6">
          <li>toute protection routière éventuelle devient inapplicable ;</li>
          <li>
            toute assurance optionnelle peut être déclarée inopérante selon ses
            conditions ;
          </li>
          <li>
            la responsabilité financière devient illimitée à l’égard des
            dommages causés.
          </li>
        </ul>

        <h3 className="text-2xl font-semibold tracking-tight">
          Récupération du véhicule
        </h3>
        <p>En cas d’usage interdit ou de violation grave :</p>
        <ul className="list-disc space-y-2 pl-6">
          <li>
            L’Hôte peut, conformément à la loi, demander la restitution
            immédiate du véhicule ;
          </li>
          <li>
            Mcar peut suspendre le compte, bloquer l’accès et retenir les
            paiements.
          </li>
        </ul>

        <h3 className="text-2xl font-semibold tracking-tight">
          Sanctions contractuelles
        </h3>
        <p>Tout usage interdit peut entraîner :</p>
        <ul className="list-disc space-y-2 pl-6">
          <li>suspension temporaire ;</li>
          <li>suppression de l’annonce ;</li>
          <li>résiliation définitive du compte ;</li>
          <li>application d’une clause pénale.</li>
        </ul>
      </section>

      <section id="limitation-responsabilite" className="space-y-4">
        <h2 className="text-3xl font-bold tracking-tight">
          Limitation générale de responsabilité
        </h2>

        <h3 className="text-2xl font-semibold tracking-tight">
          Nature des services
        </h3>
        <p>Mcar fournit un service de mise en relation numérique.</p>
        <p>Mcar ne fournit pas :</p>
        <ul className="list-disc space-y-2 pl-6">
          <li>de service de location en son nom ;</li>
          <li>de service de transport ;</li>
          <li>de service d’assurance ;</li>
          <li>de service d’expertise automobile.</li>
        </ul>
        <p>
          Toute prestation liée à l’usage du véhicule relève exclusivement de
          l’Hôte et du Voyageur.
        </p>

        <h3 className="text-2xl font-semibold tracking-tight">
          Absence de responsabilité sur l’exécution du contrat
        </h3>
        <p>
          Le contrat de location est conclu directement entre l’Hôte et le
          Voyageur.
        </p>
        <p>Mcar n’est pas responsable :</p>
        <ul className="list-disc space-y-2 pl-6">
          <li>de la délivrance du véhicule ;</li>
          <li>de l’état mécanique ;</li>
          <li>du respect des engagements contractuels entre les parties ;</li>
          <li>des infractions routières ;</li>
          <li>des dommages corporels ou matériels ;</li>
          <li>des pertes financières résultant de la location.</li>
        </ul>

        <h3 className="text-2xl font-semibold tracking-tight">
          Limitation financière
        </h3>
        <p>Dans la limite autorisée par la législation malgache applicable :</p>
        <p>
          La responsabilité totale de Mcar, toutes causes confondues, est
          limitée au montant total des frais de service perçus par Mcar au titre
          de la transaction concernée.
        </p>
        <p>Mcar ne peut être tenue responsable :</p>
        <ul className="list-disc space-y-2 pl-6">
          <li>des pertes indirectes ;</li>
          <li>du manque à gagner ;</li>
          <li>des pertes d’exploitation ;</li>
          <li>des dommages immatériels.</li>
        </ul>

        <h3 className="text-2xl font-semibold tracking-tight">Force majeure</h3>
        <p>
          Mcar ne peut être tenue responsable en cas d’événement indépendant de
          sa volonté, notamment :
        </p>
        <ul className="list-disc space-y-2 pl-6">
          <li>catastrophe naturelle ;</li>
          <li>trouble civil ;</li>
          <li>coupure d’électricité ou d’Internet ;</li>
          <li>cyberattaque ;</li>
          <li>décision administrative ;</li>
          <li>événement imprévisible et irrésistible.</li>
        </ul>

        <h3 className="text-2xl font-semibold tracking-tight">
          Indemnisation par les utilisateurs
        </h3>
        <p>
          Les utilisateurs s’engagent à indemniser Mcar contre toute
          réclamation, perte, dommage ou procédure résultant :
        </p>
        <ul className="list-disc space-y-2 pl-6">
          <li>d’une violation des présentes Conditions ;</li>
          <li>d’un usage interdit ;</li>
          <li>d’une fausse déclaration ;</li>
          <li>d’un contournement de la plateforme.</li>
        </ul>
      </section>
    </HelpArticleLayout>
  );
}
