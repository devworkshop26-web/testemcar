import type { HelpArticleSection } from "@/components/help-center/HelpArticlePageTemplate";

function normalize(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function includesOne(text: string, keywords: string[]): boolean {
  return keywords.some((keyword) => text.includes(keyword));
}

const legalReminder = [
  "Dernière mise à jour des CGU: 26 Février 2026.",
  "Mcar agit comme intermédiaire technique, opérateur de plateforme et mandataire d’encaissement.",
  "Toute réservation, modification, annulation et paiement lié à une location doit être réalisé via la plateforme.",
];

export function buildHelpArticleSections(title: string): HelpArticleSection[] {
  const normalizedTitle = normalize(title);

  const rules: string[] = [];
  const keyPoints: string[] = [];
  const limits: string[] = [
    "Mcar ne fournit pas de service de location en son nom, n’est pas transporteur et n’est pas assureur.",
    "Les responsabilités de conduite, d’état du véhicule, de conformité documentaire et d’assurance incombent aux utilisateurs selon leur rôle.",
    "La responsabilité financière globale de Mcar est limitée aux frais de service perçus sur la transaction concernée, dans la limite de la loi applicable.",
  ];

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
