import type { HelpArticleSection } from "@/components/help-center/HelpArticlePageTemplate";

function normalize(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function toLookupKey(value: string): string {
  return normalize(value)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function includesOne(text: string, keywords: string[]): boolean {
  return keywords.some((keyword) => text.includes(keyword));
}

const legalReminder = [
  "Dernière mise à jour des CGU: 26 Février 2026.",
  "Mcar agit comme intermédiaire technique, opérateur de plateforme et mandataire d’encaissement.",
  "Toute réservation, modification, annulation et paiement lié à une location doit être réalisé via la plateforme.",
];

const exactArticleContent: Record<string, { rules: string[]; keyPoints: string[] }> = {
  "remboursements": {
    rules: [
      "Le remboursement du prix de location dépend de la fenêtre d'annulation (72h+, 72h-36h, 36h-24h, moins de 24h).",
      "Les frais de service Mcar, frais de paiement et frais techniques restent non remboursables.",
      "Un remboursement exceptionnel peut être accordé à la discrétion de Mcar sur justificatif (urgence médicale, catastrophe, etc.).",
    ],
    keyPoints: [
      "Un no-show ou un retour anticipé n’ouvre pas automatiquement droit à remboursement.",
      "Les remboursements sont effectués sur le moyen initial ou en crédit plateforme.",
      "Les conditions d’annulation de l’Hôte sont distinctes et peuvent déclencher des pénalités.",
    ],
  },
  "annuler-un-voyage-avec-votre-hote": {
    rules: [
      "Toute annulation doit être faite depuis la plateforme Mcar, pas par accord externe.",
      "Plus l’annulation est tardive, plus le montant remboursable du prix de location diminue.",
      "Une réservation créée moins de 24h avant départ peut être annulée sans frais sur le prix dans l’heure suivant la réservation.",
    ],
    keyPoints: [
      "Les frais de traitement et frais de service restent généralement acquis.",
      "Les circonstances exceptionnelles nécessitent des preuves justificatives.",
      "Un maintien non autorisé du véhicule peut générer pénalité et débit automatique.",
    ],
  },
  "admissibilite-du-conducteur": {
    rules: [
      "Le Voyageur doit être majeur, juridiquement capable et titulaire d’un permis valide reconnu à Madagascar.",
      "Le permis doit rester valide pendant toute la durée de la location.",
      "Une pièce d’identité valide et un moyen de paiement actif sont requis pour réserver.",
    ],
    keyPoints: [
      "Mcar peut exiger des vérifications complémentaires (photo, cohérence des données, contrôle anti-fraude).",
      "Un seul compte utilisateur est autorisé.",
      "Les informations du compte doivent rester exactes et à jour.",
    ],
  },
  "methodes-de-paiement-acceptees": {
    rules: [
      "Le paiement est traité par Mcar et ses prestataires autorisés via les moyens disponibles sur la plateforme.",
      "L’utilisateur autorise les opérations nécessaires: autorisation, prélèvement, régularisation et ajustement post-location.",
      "Tout paiement hors plateforme est interdit et constitue un contournement contractuel.",
    ],
    keyPoints: [
      "Le paiement à Mcar vaut paiement libératoire envers l’Hôte.",
      "Les données de paiement peuvent être conservées selon les règles contractuelles et légales.",
      "Les impayés peuvent entraîner suspension de compte et recouvrement.",
    ],
  },
  "cout-d-un-voyage": {
    rules: [
      "Le montant total inclut le prix de location et les frais applicables affichés avant validation.",
      "Des ajustements peuvent intervenir après location (retard, dommages, régularisation).",
      "Le dépôt de garantie peut être autorisé en complément lorsque requis.",
    ],
    keyPoints: [
      "Les frais de service plateforme sont distincts du prix reversé à l’Hôte.",
      "Des frais administratifs ou techniques peuvent s’appliquer selon le contexte.",
      "Les promotions ne sont pas convertibles en espèces.",
    ],
  },
  "depot-de-garantie": {
    rules: [
      "Le dépôt de garantie peut être exigé par l’Hôte et autorisé sur le moyen de paiement du Voyageur.",
      "Il peut être retenu partiellement ou totalement en cas de dommage ou manquement justifié.",
      "La restitution intervient en l’absence de litige après la période de sécurité prévue.",
    ],
    keyPoints: [
      "Les preuves d’état du véhicule (photos, constat) sont essentielles.",
      "Mcar peut suspendre le versement en cas de contestation.",
      "Le refus de paiement peut entraîner suspension de compte.",
    ],
  },
  "prolonger-un-voyage": {
    rules: [
      "Toute extension doit être demandée et validée dans la plateforme avant la fin prévue.",
      "Si le véhicule est déjà réservé ensuite, l’extension est refusée sauf accord explicite.",
      "Conserver le véhicule sans autorisation déclenche des pénalités et frais supplémentaires.",
    ],
    keyPoints: [
      "Le tarif journalier peut être majoré en cas de maintien non autorisé.",
      "Mcar peut compenser le Voyageur suivant et refacturer les coûts à la partie fautive.",
      "Toujours documenter les échanges dans la messagerie Mcar.",
    ],
  },
  "numeros-d-assistance-routiere": {
    rules: [
      "Le service de Protection Routière Mcar est une assistance organisationnelle et non une assurance.",
      "Le support est joignable 24/7 au 034 05 910 50 lorsqu’une assistance est requise.",
      "En cas d’incident, il faut d’abord sécuriser les personnes puis déclarer via la plateforme.",
    ],
    keyPoints: [
      "Mcar peut organiser dépannage, remplacement ou hébergement temporaire selon le cas.",
      "Les coûts avancés peuvent être imputés à la partie responsable.",
      "Conservez toujours les preuves d’incident (photos, PV, constat, devis).",
    ],
  },
  "prise-en-charge-et-retour": {
    rules: [
      "La remise et le retour du véhicule doivent respecter les conditions confirmées dans la réservation.",
      "L’état du véhicule doit être documenté au départ et au retour (photos, km, carburant).",
      "Un retard ou une non-présentation peut être qualifié de no-show selon les délais CGU.",
    ],
    keyPoints: [
      "L’absence de preuve peut limiter la contestation en cas de dommage.",
      "Les échanges clés doivent rester dans la messagerie de la plateforme.",
      "Les accords verbaux externes n’ont pas de valeur contractuelle.",
    ],
  },
  "usages-interdits": {
    rules: [
      "Il est interdit de conduire sous alcool/stupéfiants, sous-louer, prêter à un tiers non autorisé ou commettre un usage illégal.",
      "En location sans chauffeur, seul le conducteur autorisé peut conduire.",
      "Toute violation peut entraîner déchéance de protection, suspension de compte et responsabilité financière illimitée.",
    ],
    keyPoints: [
      "L’Hôte peut demander restitution immédiate en cas de violation grave.",
      "Mcar peut bloquer l’accès et retenir les paiements.",
      "Des sanctions contractuelles et judiciaires peuvent être engagées.",
    ],
  },
  "assurance-obligatoire-de-l-hote": {
    rules: [
      "L’Hôte doit maintenir une assurance responsabilité civile automobile valide couvrant l’usage en location.",
      "Mcar n’est pas assureur et ne remplace pas les obligations de couverture de l’Hôte.",
      "Le défaut d’assurance peut entraîner suspension immédiate du véhicule et du compte.",
    ],
    keyPoints: [
      "L’Hôte reste responsable des franchises et exclusions de son contrat.",
      "Une assurance optionnelle partenaire reste régie par le contrat de l’assureur tiers.",
      "Tout litige d’indemnisation relève de l’assureur et des parties concernées.",
    ],
  },
};

export function buildHelpArticleSections(title: string): HelpArticleSection[] {
  const normalizedTitle = normalize(title);
  const lookupKey = toLookupKey(title);

  const rules: string[] = [];
  const keyPoints: string[] = [];
  const limits: string[] = [
    "Mcar ne fournit pas de service de location en son nom, n’est pas transporteur et n’est pas assureur.",
    "Les responsabilités de conduite, d’état du véhicule, de conformité documentaire et d’assurance incombent aux utilisateurs selon leur rôle.",
    "La responsabilité financière globale de Mcar est limitée aux frais de service perçus sur la transaction concernée, dans la limite de la loi applicable.",
  ];

  const exactMatch = exactArticleContent[lookupKey];
  if (exactMatch) {
    rules.push(...exactMatch.rules);
    keyPoints.push(...exactMatch.keyPoints);
  }

  if (includesOne(normalizedTitle, ["annulation", "remboursement", "no-show", "absence", "modifier une reservation", "prolonger"])) {
    rules.push(
      "Les annulations et modifications se font exclusivement via la plateforme Mcar.",
      "Les remboursements du prix de location dépendent du délai (plus de 72h, 72h-36h, 36h-24h, moins de 24h), alors que les frais de service et de transaction restent généralement non remboursables.",
      "En cas de no-show, de restitution anticipée ou de maintien non autorisé du véhicule, des pénalités contractuelles peuvent être appliquées.",
    );
    keyPoints.push(
      "L’Hôte qui annule peut subir des pénalités financières, une baisse de visibilité et une suspension.",
      "Le Voyageur qui annule tardivement peut perdre tout ou partie du prix de location.",
      "Mcar peut accorder un traitement exceptionnel sur justificatifs (force majeure, urgence grave, etc.).",
    );
  }

  if (includesOne(normalizedTitle, ["paiement", "versement", "cout", "tarification", "depot", "garantie", "promotion", "credit", "taxe", "factures impayees", "recouvrement", "amendes", "peages"])) {
    rules.push(
      "Le paiement effectué à Mcar vaut paiement libératoire envers l’Hôte dans le cadre du mandat d’encaissement.",
      "Les fonds peuvent être conservés au minimum 24h après le début de location, puis plus longtemps en cas de litige ou suspicion d’irrégularité.",
      "Les paiements hors plateforme sont interdits et constituent un contournement sanctionnable.",
    );
    keyPoints.push(
      "Mcar peut prélever automatiquement les montants dus autorisés contractuellement (frais, dommages, pénalités, régularisations).",
      "Les frais de recouvrement peuvent être imputés au débiteur en cas d’impayé.",
      "Les promotions et crédits ne sont ni transférables ni convertibles en espèces.",
    );
  }

  if (includesOne(normalizedTitle, ["admissibilite", "conducteur", "verification", "compte", "mot de passe", "securite", "fraude", "documents", "publier", "hote", "chauffeur", "vehicule"])) {
    rules.push(
      "L’accès est réservé aux personnes juridiquement capables et les informations du compte doivent être exactes, complètes et à jour.",
      "Le Voyageur doit disposer d’un permis valide reconnu à Madagascar, d’une pièce d’identité et d’un moyen de paiement valide.",
      "L’Hôte doit fournir des documents valides du véhicule (carte grise, assurance, contrôle technique si requis) et garantir leur mise à jour.",
    );
    keyPoints.push(
      "Un seul compte est autorisé par utilisateur: les multi-comptes peuvent entraîner suspension et gel des fonds.",
      "En cas de faux document ou fausse déclaration, Mcar peut suspendre le compte et signaler aux autorités compétentes.",
      "Pour l’option avec chauffeur, l’Hôte reste juridiquement responsable du service et de la conformité réglementaire.",
    );
  }

  if (includesOne(normalizedTitle, ["incident", "accident", "vol", "dommage", "assurance", "assistance", "panne", "route", "code de la route", "usage interdit"])) {
    rules.push(
      "En cas d’accident, panne, vol ou dommage: sécuriser les personnes, alerter les autorités si nécessaire, puis déclarer l’incident via la plateforme.",
      "Les parties doivent conserver les preuves (photos, constat, procès-verbal, devis/rapport d’assurance).",
      "Le véhicule ne doit jamais être utilisé pour des usages interdits (alcool/stupéfiants, activité illégale, sous-location, conduite non autorisée, etc.).",
    );
    keyPoints.push(
      "Mcar peut coordonner l’assistance routière optionnelle, mais ce service ne constitue pas une assurance.",
      "L’Hôte doit maintenir une assurance responsabilité civile valide; le Voyageur est responsable des dommages causés pendant la location selon les CGU.",
      "Les litiges de responsabilité civile et d’indemnisation sont traités entre utilisateurs et/ou leurs assureurs, puis par les juridictions compétentes si nécessaire.",
    );
  }

  if (includesOne(normalizedTitle, ["prise en charge", "retour", "aeroport", "livraison", "check-in", "check-out", "disponibilite", "reserver", "messagerie"])) {
    rules.push(
      "La remise et la restitution du véhicule doivent respecter les informations confirmées sur la plateforme (horaires, lieu, identité, documents).",
      "Avant départ et au retour, les parties doivent documenter l’état du véhicule (photos extérieures/intérieures, kilométrage, carburant).",
      "Toute extension doit être demandée via la plateforme et dépend de la disponibilité réelle du véhicule.",
    );
    keyPoints.push(
      "La messagerie Mcar doit être utilisée pour conserver une trace des échanges importants.",
      "En cas d’indisponibilité, Mcar peut proposer une alternative ou un crédit selon le contexte.",
      "Les accords verbaux externes n’ont pas de valeur contractuelle.",
    );
  }

  if (rules.length === 0) {
    rules.push(
      "Cet article applique les Conditions d’utilisation Madagasycar en vigueur.",
      "Les utilisateurs doivent respecter les lois malgaches et leurs obligations contractuelles selon leur rôle.",
      "Toute opération contractuelle liée à une location doit être gérée dans l’interface Mcar.",
    );
  }

  if (keyPoints.length === 0) {
    keyPoints.push(
      "Conservez toutes les preuves et communications liées à la réservation.",
      "Évitez tout paiement ou accord hors plateforme.",
      "En cas de litige, les juridictions compétentes tranchent selon les CGU et la loi applicable.",
    );
  }

  return [
    {
      id: "cadre-contractuel",
      title: "Cadre contractuel applicable",
      paragraphs: legalReminder,
    },
    {
      id: "regles-pour-cet-article",
      title: "Règles clés pour ce sujet",
      bullets: rules,
    },
    {
      id: "points-d-attention",
      title: "Points d’attention",
      bullets: [...keyPoints.slice(0, 3), ...limits],
    },
  ];
}
