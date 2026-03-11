import { Input } from "@/components/ui/input";
import {
  Banknote,
  Bookmark,
  BusFront,
  CalendarCheck,
  CircleDollarSign,
  ClipboardList,
  CreditCard,
  FileText,
  Handshake,
  Plane,
  Receipt,
  Search,
  Settings,
  Shield,
  Siren,
  TriangleAlert,
  User,
  Wrench,
} from "lucide-react";
import { type ReactNode, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  buildHelpArticleRoute,
  buildHelpCategoryRoute,
} from "@/components/help-center/helpRoutes";

type ArticleSection = {
  title: string;
  icon: ReactNode;
  links: string[];
  moreLabel: string;
  allLinks?: string[];
};

type HelpCenterContent = {
  featuredArticles: string[];
  sections: ArticleSection[];
};

const helpCenterByTab: Record<"guests" | "hosts", HelpCenterContent> = {
  guests: {
    featuredArticles: [
      "Messagerie avec votre hôte",
      "Annuler un voyage avec votre hôte",
      "Remboursements",
      "Prise en charge et retour",
      "Méthodes de paiement acceptées",
      "Admissibilité du conducteur",
      "Coût d'un voyage",
      "Prolonger un voyage",
      "Numéros d'assistance routière",
    ],
    sections: [
      {
        title: "Premiers pas",
        icon: <BusFront className="h-6 w-6" />,
        links: [
          "Réserver une voiture",
          "Découvrir Mcar",
          "Location mensuelle",
        ],
        allLinks: [
          "Réserver une voiture | États-Unis",
          "Découvrir Mcar | Invités",
          "Réserver une voiture | Canada",
          "Réserver une voiture | Australie",
          "Réserver une voiture | France",
          "Réserver une voiture | Royaume-Uni",
          "Permis temporaires",
          "Photos supplémentaires de vérification",
          "Admissibilité du conducteur",
          "Voyages réservés sur Uber | Invités US",
          "Permis de conduire international",
          "Où Mcar opère",
          "Contacter l'assistance — Vérification | US",
          "Contacter l'assistance — Vérification | Canada",
          "Trouver un véhicule pour votre trajet",
          "Langues disponibles sur Mcar | Invités",
        ],
        moreLabel: "Voir les 16 articles",
      },
      {
        title: "Planifier votre trajet",
        icon: <Bookmark className="h-6 w-6" />,
        links: [
          "Vérification avant départ",
          "Sélectionner la prise en charge",
          "Ajouter un conducteur",
        ],
        allLinks: [
          "Vérification avant départ",
          "Sélectionner la prise en charge et le retour",
          "Ajouter un conducteur à un trajet",
          "Messagerie avec votre hôte",
          "Distance de conduite incluse dans un trajet",
          "Retourner un véhicule et effectuer le check-out",
          "Absence à la prise en charge",
          "Conduite transfrontalière",
          "Ajouter des extras à un trajet",
          "Contrat d'autopartage | Invités",
          "Voyager dans l'UE depuis le Royaume-Uni | Invités",
          "Preuve de couverture du véhicule",
          "Véhicules électriques",
          "Véhicules accessibles en fauteuil roulant | Invité",
          "Informations aéroport US | Invités",
          "Informations aéroport Canada | Invités",
          "Prise en charge et retour à l'aéroport | Invités",
        ],
        moreLabel: "Voir les 17 articles",
      },
      {
        title: "Paiement de votre location",
        icon: <CircleDollarSign className="h-6 w-6" />,
        links: [
          "Paiement de votre trajet",
          "Remboursements",
          "Factures impayées",
        ],
        allLinks: [
          "Paiement de votre trajet",
          "Remboursements",
          "Payer une facture ou un solde impayé",
          "Moyens de paiement acceptés par Mcar",
          "Paiement échelonné avec Affirm, Afterpay ou Klarna | Invités US",
          "Contester une facture de votre hôte",
          "Dépôt de garantie | US",
          "Dépôt de garantie | Canada",
          "Dépôt de garantie | Australie",
          "Dépôt de garantie | France",
          "Dépôt de garantie | UK",
          "Coût d'un voyage",
          "Ajouter un moyen de paiement",
          "Demander un remboursement à votre hôte",
          "FAQ carte cadeau Mcar",
          "Utiliser une carte cadeau Mcar",
          "Payer le stationnement",
          "Promotions et remises",
          "Politique de transaction hors plateforme | Invités",
          "Taxe de vente | Invités US",
          "Crédit voyage",
          "Tarification des trajets",
          "Acheter une carte cadeau Mcar",
          "Conditions des promotions",
          "Taxe de vente Québec | Invités",
          "Taxe sur la valeur ajoutée (TVA) | Invités",
          "Consulter le reçu de votre trajet",
          "Partenariat Mcar avec Citibank et American Airlines | Invités US",
        ],
        moreLabel: "Voir les 28 articles",
      },
      {
        title: "Changer ou annuler un voyage",
        icon: <FileText className="h-6 w-6" />,
        links: [
          "Absence de l'hôte",
          "Étendre un voyage",
          "Voyages annulés",
        ],
        allLinks: [
          "Absence de l'hôte",
          "Étendre un voyage",
          "Voyages annulés",
          "Modifier le lieu de prise en charge ou de retour",
          "Raccourcir ou terminer un voyage plus tôt",
          "Reprogrammer un voyage annulé",
          "Annuler un voyage avec votre hôte",
          "Retards ou annulations de voyage",
          "Politique de circonstances exceptionnelles | Invités",
          "Ajouter ou mettre à jour un plan de protection",
          "Demandes d'échange de véhicule | Invités",
        ],
        moreLabel: "Voir les 11 articles",
      },
      {
        title: "Organisation de la livraison aéroport",
        icon: <Plane className="h-6 w-6" />,
        links: [
          "Abilene Regional Airport (ABI) | Invités",
          "Albuquerque International Sunport (ABQ) | Invités",
          "Appleton International Airport (ATW) | Invités",
        ],
        allLinks: [
          "Abilene Regional Airport (ABI) | Invités",
          "Albuquerque International Sunport (ABQ) | Invités",
          "Appleton International Airport (ATW) | Invités",
          "Asheville Regional Airport (AVL) | Invités",
          "Augusta Regional Airport (AGS) | Invités",
          "Baltimore Washington International Airport (BWI) | Invités",
          "Bill and Hillary Clinton National Airport (LIT) | Invités",
          "Blue Grass Airport (LEX) | Invités",
          "Boston Logan International Airport (BOS) | Invités",
          "Bozeman Yellowstone International Airport (BZN) | Invités",
          "Buchanan Field Airport (CCR) | Invités",
          "Buffalo Niagara International Airport (BUF) | Invités",
          "Byron Airport (C83) | Invités",
          "Canyonlands Regional Airport (CNY) | Invités",
          "Charleston International Airport (CHS) | Invités",
          "Charlotte Douglas International Airport (CLT) | Invités",
          "Charlottetown Airport (YYG) | Invités",
          "Chattanooga Airport (CHA) | Invités",
          "Cherry Capital Airport (TVC) | Invités",
          "Cincinnati Northern Kentucky International Airport (CVG) | Invités",
          "Colorado Springs Airport (COS) | Invités",
          "Dallas Love Field Airport (DAL) | Inv ités",
          "Deer Lake Regional Airport (YDF) | Invités",
          "Denver International Airport (DEN) | Invités",
          "Destin-Fort Walton Beach Airport (VPS) | Invités",
          "Detroit Metropolitan Wayne County International Airport (DTW) | Invités",
          "Eagle County Regional Airport (EGE) | Invités",
          "Eastern Iowa Airport (CID) | Invités",
          "Eugene Airport (EUG) | Invités",
          "Gander International Airport (YQX) | Invités",
          "Gerald R. Ford International Airport (GRR) | Invités",
          "Glacier Park International Airport (FCA) | Invités",
          "Grand Junction Regional Airport (GJT) | Invités",
          "Great Falls International Airport (GTF) | Invités",
          "Green Bay Austin Straubel International Airport (GRB) | Invités",
          "Greenville-Spartanburg International Airport (GSP) | Invités",
          "Gulf Shores International Airport (JKA) | Invités",
          "Gulfport-Biloxi International Airport (GPT) | Invités",
          "Halifax Stanfield International Airport (YHZ) | Invités",
          "Harrisburg International Airport (MDT) | Invités",
          "Helena Regional Airport (HLN) | Invités",
          "Huntsville International Airport (HSV) | Invités",
          "Indianapolis International Airport (IND) | Invités",
          "Jackson Hole Airport (JAC) | Invités",
          "John Wayne Airport (SNA) | Invités",
          "Juneau International Airport (JNU) | Invités",
          "Kansas City International Airport (MCI) | Invités",
          "Lihue Airport (LIH) | Invités",
          "Los Angeles International Airport (LAX) | Invités",
          "Louisville Muhammad Ali International Airport (SDF) | Invités",
          "McGhee Tyson Airport (TYS) | Invités",
          "Miami International Airport (MIA) | Invités",
          "Milwaukee Mitchell International Airport (MKE) | Invités",
          "Minneapolis–St. Paul International Airport (MSP) | Invités",
          "Missoula International Airport (MSO) | Invités",
          "Nashville International Airport (BNA) | Invités",
          "Norfolk International Airport (ORF) | Invités",
          "Melbourne-Orlando International Airport (MLB) | Invités",
          "Monterey Regional Airport (MRY) | Invités",
          "Montrose Regional Airport (MTJ) | Invités",
          "Niagara Falls International Airport (IAG) | Invités",
          "Northwest Florida Beaches International Airport (ECP) | Invités",
          "Ontario International Airport (ONT) | Invités",
          "Orlando International Airport (MCO) | Invités",
          "Orlando Sanford International Airport (SFB) | Invités",
          "Palm Springs International Airport (PSP) | Invités",
          "Pensacola International Airport (PNS) | Invités",
          "Philadelphia International Airport (PHL) | Invités",
          "Phoenix-Mesa Gateway Airport (AZA) | Invités",
          "Phoenix Sky Harbor International Airport (PHX) | Invités",
          "Piedmont Triad International Airport (GSO) | Invités",
          "Plattsburgh International Airport (PBG) | Invités",
          "Portland International Airport (PDX) | Invités",
          "Punta Gorda Airport (PGD) | Invités",
          "Raleigh-Durham International Airport (RDU) | Invités",
          "Rapid City Regional Airport (RAP) | Invités",
          "Reno-Tahoe International Airport (RNO) | Invités",
          "Richmond International Airport (RIC) | Invités",
          "Rogue Valley International Medford Airport (MFR) | Invités",
          "Ronald Reagan Washington National Airport (DCA) | Invités",
          "Sacramento International Airport (SMF) | Invités",
          "Salt Lake City International Airport (SLC) | Invités",
          "San Francisco International Airport (SFO) | Invités",
          "San Jose Mineta International Airport (SJC) | Invités",
          "Sarasota Bradenton Airport (SRQ) | Invités",
          "Savannah/Hilton Head International Airport (SAV) | Invités",
          "Southwest Florida International Airport (RSW) | Invités",
          "St. John's International Airport (YYT) | Invités",
          "St. Pete-Clearwater International Airport (PIE) | Invités",
          "Tallahassee International Airport (TLH) | Invités",
          "Tampa International Airport (TPA) | Invités",
          "Toronto Pearson International Airport (YYZ) | Invités",
          "Tucson International Airport (TUS) | Invités",
          "Tulsa International Airport (TUL) | Invités",
          "Washington Dulles International Airport (IAD) | Invités",
          "Wichita Dwight D. Eisenhower National Airport (ICT) | Invités",
          "Wilmington International Airport (ILM) | Invités",
          "Yampa Valley Regional Airport (HDN) | Invités",
          "Yellowstone Airport (WYS) | Invités",
          "Yellowstone Regional Airport (COD) | Invités",
        ],
        moreLabel: "Voir les 100 articles",
      },
      {
        title: "Comprendre les responsabilités de l'invité",
        icon: <Handshake className="h-6 w-6" />,
        links: [
          "Évaluer un voyage | Invités",
          "Politique de contestation de paiement | Invité",
          "Dommages pneu | Invités",
        ],
        allLinks: [
          "Évaluer un voyage | Invités",
          "Politique de contestation de paiement | Invité",
          "Dommages pneu | Invités",
          "Paiement du carburant ou de la recharge EV",
          "Lever les restrictions de compte après un chargeback",
          "Péages",
          "Contraventions",
          "Guide des photos de trajet | Invités",
          "Supprimer un avis | Invités",
          "Stationnement en voirie",
          "Transfert de responsabilité d'amende",
          "Payer des frais de voyage | Invités UK",
          "Conditions supplémentaires pour les trajets mensuels",
        ],
        allLinks: [
          "Révision d'un voyage",
          "Politique de chargeback",
          "Dommages pneus",
          "Respect des règles du véhicule",
          "Que faire en cas de contravention",
          "Utilisation autorisée du véhicule",
          "Objets perdus après un voyage",
          "Règles d'utilisation du véhicule",
          "Gestion des amendes et péages",
          "Comportement attendu durant le trajet",
        ],
        moreLabel: "Voir les 13 articles",
      },
      {
        title: "Gestion des incidents",
        icon: <TriangleAlert className="h-6 w-6" />,
        links: [
          "Signaler un véhicule non sûr ou insatisfaisant",
          "Numéros d'assistance routière",
          "Assistance routière | Invités US",
        ],
        allLinks: [
          "Signaler un véhicule non sûr ou insatisfaisant",
          "Numéros d'assistance routière",
          "Assistance routière | Invités US",
          "Assistance routière | Invités Canada",
          "Assistance routière | Invités Australie",
          "Assistance routière | Invités UK",
          "Assistance routière | Invités France",
          "Poursuite du voyage | Invités UK",
          "Assistance dépannage fournie par l'hôte | Invités UK",
          "Entretien du véhicule pour trajets mensuels | Invités",
        ],
        allLinks: [
          "Signaler un véhicule",
          "Assistance routière",
          "Urgence en voyage",
          "Accident pendant une location",
          "Véhicule en panne",
          "Contacter l'assistance 24/7",
          "Constat amiable après accident",
          "Assistance en cas de crevaison",
          "Sécurité des passagers",
        ],
        moreLabel: "Voir les 10 articles",
      },
      {
        title: "Gérer votre compte",
        icon: <User className="h-6 w-6" />,
        links: [
          "Résoudre les problèmes de connexion | Invités",
          "Mettre à jour le prénom préféré | Invités",
          "Mettre à jour un permis | Invités",
        ],
        allLinks: [
          "Résoudre les problèmes de connexion | Invités",
          "Mettre à jour le prénom préféré | Invités",
          "Mettre à jour un permis | Invités",
          "Prévenir et signaler la fraude | Invité",
          "Modifier l'adresse e-mail | Invités",
          "Fermer votre compte",
          "Modifier le numéro de téléphone",
          "Activer/Désactiver les SMS | Invités",
          "Vérifier votre numéro de téléphone",
        ],
        allLinks: [
          "Connexion impossible",
          "Modifier votre nom",
          "Mettre à jour votre permis",
          "Mettre à jour votre e-mail",
          "Supprimer votre compte",
          "Gérer les préférences de notification",
          "Activer la vérification en deux étapes",
          "Mettre à jour votre numéro de téléphone",
          "Consulter l'historique de connexion",
        ],
        moreLabel: "Voir les 9 articles",
      },
      {
        title: "Résoudre les problèmes de compte",
        icon: <Settings className="h-6 w-6" />,
        links: [
          "Problèmes de confiance et sécurité",
          "Comptes multiples ou liés",
          "Violations de politique",
        ],
        allLinks: [
          "Problèmes de confiance et sécurité",
          "Comptes multiples ou liés",
          "Violations de politique",
          "Consulter l'historique des messages avec l'assistance",
          "Résoudre les problèmes de réservation d'un véhicule",
        ],
        moreLabel: "Voir les 5 articles",
      },
      {
        title: "Politiques d'utilisation du véhicule",
        icon: <CreditCard className="h-6 w-6" />,
        links: [
          "Politique d'utilisation additionnelle | Invités",
          "Politique de nettoyage | Invités",
          "Politique non-fumeur | Invités",
        ],
        allLinks: [
          "Politique d'utilisation additionnelle | Invités",
          "Politique de nettoyage | Invités",
          "Politique non-fumeur | Invités",
          "Politique des usages interdits",
          "Politique de suivi et technologies véhicule | Invités",
          "Politique des usages professionnels",
          "Signaler un problème de stationnement hôte",
          "Politique animaux d'assistance et animaux | Invités",
          "Politique des usages commerciaux",
          "Recours sur l'historique de conduite | Invités UK",
        ],
        moreLabel: "Voir les 10 articles",
      },
      {
        title: "Comprendre et choisir la protection",
        icon: <Shield className="h-6 w-6" />,
        links: [
          "Contacter les sinistres | Invités",
          "Assurance personnelle | Invités",
          "Assurance via carte bancaire",
        ],
        allLinks: [
          "Contacter les sinistres | Invités",
          "Assurance personnelle | Invités",
          "Assurance ou couverture via carte bancaire",
          "Comprendre l'assurance et votre contrat de dommages | Invités US",
          "Plans de protection — En bref | Invités US",
          "Plans de protection — En détail | Invités US",
          "Plans de protection — En bref | Invités France",
          "Plans de protection — En détail | Invités France",
          "Comprendre l'assurance et votre couverture des dommages | Invités Canada",
          "Plans de protection — En bref | Invités Canada",
          "Plans de protection — En détail | Invités Canada",
          "Plans de protection | Invités UK",
          "Assurance responsabilité civile tierce | Invités UK",
          "Choisir un plan de protection | Invités Australie",
        ],
        allLinks: [
          "Contacter les sinistres",
          "Assurance personnelle",
          "Couverture carte bancaire",
          "Comparer les plans de protection",
          "Franchise et responsabilité",
          "Ce que couvre la protection",
          "Réclamation après incident",
          "Déclarer un sinistre rapidement",
          "Délai de traitement d'un dossier",
          "Pièces justificatives à fournir",
        ],
        moreLabel: "Voir les 14 articles",
      },
      {
        title: "Gérer les dommages véhicule",
        icon: <TriangleAlert className="h-6 w-6" />,
        links: [
          "Signaler des dommages | Invités",
          "Résoudre un dommage avec votre hôte",
          "Plans de paiement pour réclamations de dommages",
        ],
        allLinks: [
          "Signaler des dommages | Invités",
          "Résoudre un dommage avec votre hôte",
          "Plans de paiement pour réclamations de dommages",
          "Frais de réclamation dommages | Invités",
          "Gérer une réclamation de dommages via Mcar | Invités US",
          "Gérer une réclamation de dommages via Mcar | Invités Australie",
          "Gérer une réclamation de dommages via Mcar | Invités Canada",
          "Gérer une réclamation de dommages via Mcar | Invités UK",
          "Procédure de plainte — Invités UK",
          "Politique de plaintes Mcar Australie",
        ],
        allLinks: [
          "Politique carburant",
          "Politique nettoyage",
          "Politique non-fumeur",
          "Frais pour retard de retour",
          "Frais de kilométrage supplémentaire",
          "Politique animaux de compagnie",
          "Politique sièges enfants",
          "Frais en cas de véhicule rendu sale",
          "Règles de restitution du plein",
        ],
        moreLabel: "Voir les 10 articles",
      },
    ],
  },
  hosts: {
    featuredArticles: [
      "Démarrer en tant qu'hôte",
      "Annuler un voyage avec votre invité",
      "Aéroports avec permis de livraison | Hôtes US",
      "Aéroports avec permis de livraison | Hôtes Canada",
      "Politique de permis d'aéroport",
      "Programme Hôte All-Star",
      "Éligibilité véhicule | US",
      "Éligibilité véhicule | Australie",
      "Éligibilité véhicule | Canada",
      "Éligibilité véhicule | UK",
      "Check-in d'un invité et check-out",
      "Numéros d'assistance routière",
    ],
    sections: [
      {
        title: "Premiers pas",
        icon: <BusFront className="h-6 w-6" />,
        links: [
          "Publier un véhicule | US",
          "Éligibilité véhicule | US",
          "Publier un véhicule | Canada",
        ],
        allLinks: [
          "Publier un véhicule | US",
          "Éligibilité véhicule | US",
          "Publier un véhicule | Canada",
          "Éligibilité véhicule | Canada",
          "Publier un véhicule | France",
          "Éligibilité véhicule | France",
          "Éligibilité véhicule | Australie",
          "Éligibilité véhicule | UK",
          "Démarrer | Hôtes",
          "Partager votre voiture | Hôtes US",
          "Partager votre voiture | Hôtes France",
          "Partager votre voiture | Hôtes Canada",
          "Partager votre voiture | Hôtes Australie",
          "Partager votre voiture | Hôtes UK",
          "Réglementation du car sharing | Hôtes US",
          "Véhicules classiques et spéciaux | US",
          "Mises à jour récentes | Hôtes",
          "Guide photo pour les annonces",
          "Admissibilité Deluxe et Super Deluxe",
          "Véhicules accessibles en fauteuil roulant | Hôte",
          "Financement du véhicule et assurance hors trajet | Hôtes US",
          "Nouveautés et prochaines évolutions sur Turo",
          "Camions box | Hôtes US et Canada",
          "Discuter avec le support Turo Australie",
          "Acheter une carte cadeau Turo",
          "FAQ carte cadeau Turo",
          "Langues disponibles sur Turo | Hôtes",
        ],
        moreLabel: "Voir les 29 articles",
      },
      {
        title: "Tarifer votre véhicule",
        icon: <Banknote className="h-6 w-6" />,
        links: [
          "Définir le prix de votre véhicule",
          "Proposer des remises",
          "Utiliser le calendrier",
        ],
        allLinks: [
          "Définir le prix de votre véhicule",
          "Proposer des remises",
          "Utiliser le calendrier",
          "Conditions des codes promo hôte",
        ],
        moreLabel: "Voir les 4 articles",
      },
      {
        title: "Paramètres et options",
        icon: <Settings className="h-6 w-6" />,
        links: [
          "Mettre en pause ou dépublier un véhicule",
          "Gérer la disponibilité",
          "Proposer la livraison",
        ],
        allLinks: [
          "Mettre en pause ou dépublier un véhicule",
          "Gérer la disponibilité",
          "Proposer la livraison",
          "Proposer des Extras",
          "Définir les limites de distance",
          "Réservations de trajets",
          "Caractéristiques du véhicule | Hôtes US et Canada",
          "Définir les préférences de trajet",
          "Rendre une annonce indisponible",
          "Activer les notifications de l'app Turo",
          "Aéroports avec permis de livraison | Hôtes Canada",
          "Aéroports avec permis de livraison | Hôtes US",
        ],
        moreLabel: "Voir les 12 articles",
      },
      {
        title: "Recevoir des paiements",
        icon: <CircleDollarSign className="h-6 w-6" />,
        links: [
          "Gains manquants ou incorrects",
          "Facturer un invité pour des contraventions",
          "Demander un remboursement",
        ],
        allLinks: [
          "Gains manquants ou incorrects",
          "Facturer un invité pour des contraventions",
          "Demander un remboursement",
          "Facturer un invité pour des péages",
          "Politique de facture de remboursement et rapport de dommages",
          "Rembourser un invité",
          "Facturer le ravitaillement carburant ou recharge EV",
          "Transférer la responsabilité des contraventions",
          "Configurer ou modifier vos coordonnées bancaires",
          "Configurer un compte pour être payé",
          "Signaler un incident de tabagisme",
          "Lier votre compte à une agence de péage | Hôtes US",
          "Facturer les frais de stationnement",
          "Paiement | Hôtes US",
          "Consulter vos gains",
          "Gains et part hôte",
          "Signaler un incident de propreté",
          "Facturer les kilomètres supplémentaires",
          "Frais de déplacement | Hôtes UK",
          "Facturer des frais de déplacement | Hôtes UK",
          "Mises en fourrière",
          "Discuter avec le support – Facturation | US",
          "Paiement | Hôtes hors US",
          "Lier votre compte Tesla",
        ],
        moreLabel: "Voir les 24 articles",
      },
      {
        title: "Gérer les réservations et voyages",
        icon: <CalendarCheck className="h-6 w-6" />,
        links: [
          "Check-in d'un invité et check-out",
          "Confirmer un permis | Hôtes US",
          "Échange de véhicule | Hôtes",
        ],
        allLinks: [
          "Check-in d'un invité et check-out",
          "Confirmer un permis | Hôtes US",
          "Échange de véhicule | Hôtes",
          "Demandes pour prolonger ou raccourcir un trajet",
          "Conducteurs additionnels sur un trajet",
          "Signaler un retour tardif",
          "Demandes de modification d'un trajet",
          "Demandes de changement du lieu de prise en charge/dépôt",
          "Messagerie avec votre invité",
          "Signaler un invité pour excès de vitesse",
          "Technologie d'accès à distance au véhicule",
          "Gérer les messages planifiés",
          "Guide des photos de trajet | Hôtes",
          "Consulter le contrat de car sharing | Hôtes",
          "Inspection pré-trajet | Hôtes Tasmanie",
          "Voyager dans l'UE depuis le Royaume-Uni | Hôtes",
          "Devenir co-hôte",
          "Confirmer un permis | Hôtes Australie",
          "Confirmer un permis | Hôtes Canada",
          "Confirmer un permis | Hôtes UK",
          "Confirmer un permis | Hôtes France",
        ],
        moreLabel: "Voir les 21 articles",
      },
      {
        title: "Gérer votre annonce véhicule",
        icon: <ClipboardList className="h-6 w-6" />,
        links: [
          "Republier un véhicule",
          "Programme Power Host | US",
          "Programme Hôte All-Star",
        ],
        allLinks: [
          "Republier un véhicule",
          "Programme Power Host | US",
          "Programme Hôte All-Star",
          "Trouver votre véhicule dans la recherche",
          "Rédiger et répondre aux avis | Hôtes",
          "Supprimer un avis | Hôtes",
          "Guide pour un véhicule cinq étoiles",
          "Standards de qualité véhicule",
          "Mode Hôte",
          "Créer une équipe d'hébergement",
          "Gérer une équipe d'hébergement",
          "Permissions pour les équipes d'hébergement",
          "Supprimer un véhicule",
          "Mettre à jour un plan de protection véhicule",
          "Améliorer la visibilité du véhicule dans la recherche",
          "Programme Power Host | Canada",
          "Programme Power Host | Australie",
          "Programme Power Host | UK",
          "Discuter avec le support – Qualité véhicule | US",
          "Modifier le numéro de plaque",
        ],
        moreLabel: "Voir les 20 articles",
      },
      {
        title: "Organiser la livraison aéroport",
        icon: <Plane className="h-6 w-6" />,
        links: [
          "Restrictions de livraison aéroport",
          "Abilene Regional Airport (ABI) | Hôtes",
          "Albuquerque International Sunport (ABQ) | Hôtes",
        ],
        allLinks: [
          "Restrictions de livraison aéroport",
          "Abilene Regional Airport (ABI) | Hôtes",
          "Albuquerque International Sunport (ABQ) | Hôtes",
          "Appleton International Airport (ATW) | Hôtes",
          "Asheville Regional Airport (AVL) | Hôtes",
          "Augusta Regional Airport (AGS) | Hôtes",
          "Baltimore Washington International Airport (BWI) | Hôtes",
          "Bill and Hillary Clinton National Airport (LIT) | Hôtes",
          "Blue Grass Airport (LEX) | Hôtes",
          "Boston Logan International Airport (BOS) | Hôtes",
          "Bozeman Yellowstone International Airport (BZN) | Hôtes",
          "Buchanan Field Airport (CCR) | Hôtes",
          "Buffalo Niagara International Airport (BUF) | Hôtes",
          "Byron Airport (C83) | Hôtes",
          "Canyonlands Regional Airport (CNY) | Hôtes",
          "Charlotte Douglas International Airport (CLT) | Hôtes",
          "Chattanooga Airport (CHA) | Hôtes",
          "Charleston International Airport (CHS) | Hôtes",
          "Charlottetown Airport (YYG) | Hôtes",
          "Cherry Capital Airport (TVC) | Hôtes",
          "Cincinnati Northern Kentucky International Airport (CVG) | Hôtes",
          "Colorado Springs Airport (COS) | Hôtes",
          "Dallas Love Field Airport (DAL) | Hôtes",
          "Deer Lake Regional Airport (YDF) | Hôtes",
          "Denver International Airport (DEN) | Hôtes",
          "Destin-Fort Walton Beach Airport (VPS) | Hôtes",
          "Detroit Metropolitan Wayne County International Airport (DTW) | Hôtes",
          "Eagle County Regional Airport (EGE) | Hôtes",
          "Eastern Iowa Airport (CID) | Hôtes",
          "Eugene Airport (EUG) | Hôtes",
          "Gander International Airport (YQX) | Hôtes",
          "Gerald R. Ford International Airport (GRR) | Hôtes",
          "Grand Junction Regional Airport (GJT) | Hôtes",
          "Great Falls International Airport (GTF) | Hôtes",
          "Green Bay Austin Straubel International Airport (GRB) | Hôtes",
          "Greenville-Spartanburg International Airport (GSP) | Hôtes",
          "Glacier Park International Airport (FCA) | Hôtes",
          "Gulf Shores International Airport (JKA) | Hôtes",
          "Gulfport-Biloxi International Airport (GPT) | Hôtes",
          "Halifax Stanfield International Airport (YHZ) | Hôtes",
          "Harrisburg International Airport (MDT) | Hôtes",
          "Helena Regional Airport (HLN) | Hôtes",
          "Huntsville International Airport (HSV) | Hôtes",
          "Indianapolis International Airport (IND) | Hôtes",
          "Jackson Hole Airport (JAC) | Hôtes",
          "John Wayne Airport (SNA) | Hôtes",
          "Juneau International Airport (JNU) | Hôtes",
          "Kansas City International Airport (MCI) | Hôtes",
          "Lihue Airport (LIH) | Hôtes",
          "Los Angeles International Airport (LAX) | Hôtes",
          "Louisville Muhammad Ali International Airport (SDF) | Hôtes",
          "McGhee Tyson Airport (TYS) | Hôtes",
          "Melbourne-Orlando International Airport (MLB) | Hôtes",
          "Miami International Airport (MIA) | Hôtes",
          "Milwaukee Mitchell International Airport (MKE) | Hôtes",
          "Minneapolis–St. Paul International Airport (MSP) | Hôtes",
          "Missoula International Airport (MSO) | Hôtes",
          "Monterey Regional Airport (MRY) | Hôtes",
          "Montrose Regional Airport (MTJ) | Hôtes",
          "Nashville International Airport (BNA) | Hôtes",
          "Niagara Falls International Airport (IAG) | Hôtes",
          "Norfolk International Airport (ORF) | Hôtes",
          "Northwest Florida Beaches International Airport (ECP) | Hôtes",
          "Ontario International Airport (ONT) | Hôtes",
          "Orlando International Airport (MCO) | Hôtes",
          "Orlando Sanford International Airport (SFB) | Hôtes",
          "Palm Springs International Airport (PSP) | Hôtes",
          "Pensacola International Airport (PNS) | Hôtes",
          "Philadelphia International Airport (PHL) | Hôtes",
          "Phoenix-Mesa Gateway Airport (AZA) | Hôtes",
          "Phoenix Sky Harbor International Airport (PHX) | Hôtes",
          "Piedmont Triad International Airport (GSO) | Hôtes",
          "Plattsburgh International Airport (PBG) | Hôtes",
          "Portland International Airport (PDX) | Hôtes",
          "Punta Gorda Airport (PGD) | Hôtes",
          "Raleigh-Durham International Airport (RDU) | Hôtes",
          "Rapid City Regional Airport (RAP) | Hôtes",
          "Reno-Tahoe International Airport (RNO) | Hôtes",
          "Richmond International Airport (RIC) | Hôtes",
          "Rogue Valley International Medford Airport (MFR) | Hôtes",
          "Ronald Reagan Washington National Airport (DCA) | Hôtes",
          "Sacramento International Airport (SMF) | Hôtes",
          "Salt Lake City International Airport (SLC) | Hôtes",
          "San Francisco International Airport (SFO) | Hôtes",
          "San Jose Mineta International Airport (SJC) | Hôtes",
          "Sarasota Bradenton Airport (SRQ) | Hôtes",
          "Savannah/Hilton Head International Airport (SAV) | Hôtes",
          "Southwest Florida International Airport (RSW) | Hôtes",
          "St. John's International Airport (YYT) | Hôtes",
          "St. Pete-Clearwater International Airport (PIE) | Hôtes",
          "Tallahassee International Airport (TLH) | Hôtes",
          "Tampa International Airport (TPA) | Hôtes",
          "Tucson International Airport (TUS) | Hôtes",
          "Tulsa International Airport (TUL) | Hôtes",
          "Washington Dulles International Airport (IAD) | Hôtes",
          "Wichita Dwight D. Eisenhower National Airport (ICT) | Hôtes",
          "Wilmington International Airport (ILM) | Hôtes",
          "Yampa Valley Regional Airport (HDN) | Hôtes",
          "Yellowstone Airport (WYS) | Hôtes",
          "Yellowstone Regional Airport (COD) | Hôtes",
          "Politique de permis d'aéroport",
          "Frais de stationnement et livraison",
        ],
        moreLabel: "Voir les 100 articles",
      },
      {
        title: "Gérer votre compte",
        icon: <User className="h-6 w-6" />,
        links: [
          "Résoudre les problèmes de connexion | Hôtes",
          "Prévenir et signaler la fraude | Hôte",
          "Mettre à jour un prénom préféré ou un nom d'entreprise | Hôtes",
        ],
        allLinks: [
          "Résoudre les problèmes de connexion | Hôtes",
          "Prévenir et signaler la fraude | Hôte",
          "Mettre à jour un prénom préféré ou un nom d'entreprise | Hôtes",
          "Clôture de compte | Hôtes",
          "Fermer votre compte",
          "Mettre à jour un permis | Hôtes",
          "Changer de numéro de téléphone",
          "Ajouter une LLC au compte",
          "Gérer les SMS (opt-in/opt-out) | Hôtes",
          "Voir l'historique des messages avec le support",
          "Modifier l'adresse e-mail | Hôtes",
        ],
        moreLabel: "Voir les 11 articles",
      },
      {
        title: "Annuler des voyages",
        icon: <FileText className="h-6 w-6" />,
        links: [
          "Absence de l'invité",
          "Politique de circonstances exceptionnelles | Hôtes",
          "Annuler un voyage avec votre invité",
        ],
        allLinks: [
          "Absence de l'invité",
          "Politique de circonstances exceptionnelles | Hôtes",
          "Annuler un voyage avec votre invité",
          "Annulation par l’hôte : conséquences",
          "Éviter les annulations récurrentes",
          "Comment annuler sans pénalité",
          "Prévenir les invités à temps",
          "Conséquences sur votre classement hôte",
        ],
        moreLabel: "Voir les 5 articles",
      },
      {
        title: "Entretenir votre véhicule",
        icon: <Wrench className="h-6 w-6" />,
        links: [
          "Inspections de sécurité annuelles",
          "Politique de mauvaise représentation du véhicule",
          "Soumettre une inspection annuelle",
        ],
        allLinks: [
          "Inspections de sécurité annuelles",
          "Politique de mauvaise représentation du véhicule",
          "Soumettre une inspection annuelle",
          "Maintenance véhicule pour les trajets mensuels | Hôtes",
          "Exigences de maintenance",
          "Dégâts de pneu crevé | Hôtes",
          "Mauvaise représentation matérielle",
        ],
        moreLabel: "Voir les 7 articles",
      },
      {
        title: "Prendre des mesures de sécurité",
        icon: <Siren className="h-6 w-6" />,
        links: [
          "Résoudre un rappel de sécurité",
          "Assistance routière | Hôtes US",
          "Assistance routière | Hôtes Canada",
        ],
        allLinks: [
          "Résoudre un rappel de sécurité",
          "Assistance routière | Hôtes US",
          "Assistance routière | Hôtes Canada",
          "Assistance routière | Hôtes Australie",
          "Assistance routière | Hôtes UK",
          "Rappels de sécurité | Hôtes US",
          "Documents requis dans le véhicule | Hôtes",
          "Assistance routière | Hôtes France",
          "Couverture dépannage personnelle | Hôtes UK",
          "Numéros d'assistance routière",
        ],
        moreLabel: "Voir les 10 articles",
      },
      {
        title: "Politiques véhicule",
        icon: <CreditCard className="h-6 w-6" />,
        links: [
          "Politique d'utilisation additionnelle | Hôtes",
          "Frais de violation | Hôtes",
          "Politique de nettoyage | Hôtes",
        ],
        allLinks: [
          "Politique d'utilisation additionnelle | Hôtes",
          "Frais de violation | Hôtes",
          "Politique de nettoyage | Hôtes",
          "Politique non-fumeur | Hôtes",
          "Auto-récupération du véhicule | Hôtes US et Canada",
          "Politique de permis aéroport",
          "Titres de véhicule non éligibles",
          "Politique transaction marché gris | Hôtes",
          "Politique de mauvaise localisation du véhicule",
          "Usure normale",
          "Politique animaux et chien d'assistance | Hôtes",
          "Politique bon voisinage",
          "Politique tracker | Hôtes France",
          "Réparation embrayage",
          "Sécurité hivernale et pneus neige | Hôtes",
          "Couverture pièces de rechange et clés",
          "Politique tracker actif | Hôtes UK",
          "Politique tracking et technologie véhicule | Hôtes",
        ],
        moreLabel: "Voir les 18 articles",
      },
      {
        title: "Comprendre et choisir la protection",
        icon: <Shield className="h-6 w-6" />,
        links: [
          "Exigences d'assurance et de plan de protection | Hôtes",
          "Plans de protection – En détail | Hôtes US",
          "Plans de protection – En bref | Hôtes US",
        ],
        allLinks: [
          "Exigences d'assurance et de plan de protection | Hôtes",
          "Plans de protection – En détail | Hôtes US",
          "Plans de protection – En bref | Hôtes US",
          "Plans de protection – En détail | Hôtes Canada",
          "Plans de protection – En bref | Hôtes Canada",
          "Choisir un plan de protection | Hôtes Australie",
          "Plans de protection – En détail | Hôtes UK",
          "Plans de protection – En bref | Hôtes UK",
          "Valeur réelle en espèces (ACV) du véhicule",
          "Plans de protection – En détail | Hôtes France",
          "Plans de protection – En bref | Hôtes France",
          "Assurance responsabilité civile tiers | Hôtes UK",
        ],
        moreLabel: "Voir les 12 articles",
      },
      {
        title: "Gérer les dommages véhicule",
        icon: <TriangleAlert className="h-6 w-6" />,
        links: [
          "Tableau de bord des sinistres | Hôtes",
          "Signaler des dommages | Hôtes",
          "Résoudre un dommage directement avec votre invité",
        ],
        allLinks: [
          "Tableau de bord des sinistres | Hôtes",
          "Signaler des dommages | Hôtes",
          "Résoudre un dommage directement avec votre invité",
          "Contacter l'équipe sinistres | Hôtes",
          "Résoudre les dommages via une réclamation | Hôtes US",
          "Véhicules de remplacement",
          "Résoudre les dommages via une réclamation | Hôtes Canada",
          "Résoudre les dommages via une réclamation | Hôtes Australie",
          "Résoudre les dommages via une réclamation | Hôtes UK",
          "Résoudre les dommages via une réclamation | Hôtes France",
          "Collaborer avec l'assureur personnel de votre invité",
          "Résoudre une réclamation via une assurance invité/tiers",
          "Power Hosts et réclamations de dommages | US",
          "Prendre des photos de dommages",
          "Perte de revenus d'hébergement",
          "Réclamations sur véhicule avec dommages antérieurs",
          "Supplément de dommages | Hôtes US et Canada",
          "Dépréciation du véhicule",
          "Politique de plaintes Turo Australia Proprietary Limited",
          "Procédure de plainte | Hôtes UK",
          "Paiement complémentaire | Hôtes Australie",
          "Véhicules de courtoisie",
        ],
        moreLabel: "Voir les 22 articles",
      },
      {
        title: "Taxes",
        icon: <Receipt className="h-6 w-6" />,
        links: [
          "Compléter le formulaire fiscal | Hôtes US",
          "Recevoir un 1099-K",
          "Accéder au formulaire fiscal",
        ],
        allLinks: [
          "Remplir le formulaire d'informations fiscales | Hôtes US",
          "Recevoir un formulaire 1099-K",
          "Accéder au formulaire d'informations fiscales",
          "Taxe de vente | Hôtes",
          "Remplir le formulaire d'informations fiscales | Hôtes Canada",
          "Fiscalité au Canada | Hôtes",
          "Fiscalité en Australie | Hôtes",
          "Remplir le formulaire d'informations fiscales | Hôtes Australie",
          "Taxe sur la valeur ajoutée (TVA) | Hôtes France",
          "Taxe sur la valeur ajoutée (TVA) | Hôtes UK",
        ],
        moreLabel: "Voir les 10 articles",
      },
    ],
  },
};

const FAQ = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"guests" | "hosts">("guests");
  const [expandedSections, setExpandedSections] = useState<string[]>([]);

  const activeContent = helpCenterByTab[activeTab];

  const filteredFeatured = useMemo(
    () =>
      activeContent.featuredArticles.filter((article) =>
        article.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    [activeContent.featuredArticles, searchTerm],
  );

  const filteredSections = useMemo(
    () =>
      activeContent.sections
        .map((section) => {
          const sourceLinks = section.allLinks ?? section.links;
          const filteredLinks = sourceLinks.filter((link) =>
            link.toLowerCase().includes(searchTerm.toLowerCase()),
          );

          return {
            ...section,
            links: filteredLinks,
          };
        })
        .filter((section) => section.links.length > 0 || searchTerm.length === 0),
    [activeContent.sections, searchTerm],
  );

  return (
    <main className="bg-[#ffffff] pb-20 text-[#121214]">
      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex w-full max-w-6xl flex-col px-4 pb-12 pt-16 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl">
            Centre d'aide
          </h1>
          <p className="mt-3 text-lg text-gray-600">
            Que pouvons-nous faire pour vous ?
          </p>

          <div className="mt-8 max-w-xl">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Rechercher des articles"
                className="h-12 rounded-md border-gray-300 bg-white pl-10"
              />
            </div>
          </div>

          <div className="mt-10 flex gap-8 border-b border-gray-200 text-sm font-semibold uppercase tracking-wider text-gray-500">
            <button
              type="button"
              onClick={() => { setActiveTab("guests"); setExpandedSections([]); }}
              className={`border-b-2 pb-3 transition ${
                activeTab === "guests"
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent hover:text-gray-700"
              }`}
            >
              Voyageurs
            </button>
            <button
              type="button"
              onClick={() => { setActiveTab("hosts"); setExpandedSections([]); }}
              className={`border-b-2 pb-3 transition ${
                activeTab === "hosts"
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent hover:text-gray-700"
              }`}
            >
              Hôtes
            </button>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 pt-12 sm:px-6 lg:px-8 bg-white">
        <div className="rounded-xl bg-[#efebff] p-6 sm:p-8">
          <div className="mb-6 flex items-center gap-3 text-indigo-600">
            <Bookmark className="h-7 w-7" />
            <h2 className="text-3xl font-bold text-[#151522]">Articles mis en avant</h2>
          </div>

          <div className="grid gap-x-8 gap-y-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredFeatured.map((article) => (
              <Link
                key={article}
                to={buildHelpArticleRoute(article)}
                className="border-b border-gray-300 pb-3 text-sm font-medium text-gray-700 hover:text-indigo-600"
              >
                {article}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto mt-12 grid w-full max-w-6xl gap-10 px-4 sm:px-6 md:grid-cols-2 lg:grid-cols-3 lg:px-8">
        {filteredSections.map((section) => (
          <article key={section.title} className="space-y-4">
            <div className="flex items-center gap-3 text-indigo-600">
              {section.icon}
              <h3 className="text-3xl font-bold leading-tight text-[#1a1a27]">
                {section.title}
              </h3>
            </div>
            {(() => {
              const shouldShowToggle = section.links.length > 3;
              const isExpanded = expandedSections.includes(section.title);
              const visibleLinks = isExpanded ? section.links : section.links.slice(0, 3);

              return (
                <>
                  <ul className="space-y-3">
                    {visibleLinks.map((link) => (
                      <li key={link}>
                        <Link
                          to={buildHelpArticleRoute(link)}
                          className="block border-b border-gray-300 pb-3 text-sm font-medium text-gray-700 hover:text-indigo-600"
                        >
                          {link}
                        </Link>
                      </li>
                    ))}
                  </ul>

                  {shouldShowToggle ? (
                    <button
                      type="button"
                      onClick={() =>
                        setExpandedSections((current) =>
                          current.includes(section.title)
                            ? current.filter((title) => title !== section.title)
                            : [...current, section.title],
                        )
                      }
                      className="text-sm font-semibold text-indigo-600 hover:text-indigo-500"
                    >
                      {isExpanded ? "Voir moins" : section.moreLabel}
                    </button>
                  ) : (
                    <Link
                      to={buildHelpCategoryRoute(section.moreLabel)}
                      className="text-sm font-semibold text-indigo-600 hover:text-indigo-500"
                    >
                      {section.moreLabel}
                    </Link>
                  )}
                </>
              );
            })()}
          </article>
        ))}
      </section>
    </main>
  );
};

export default FAQ;
