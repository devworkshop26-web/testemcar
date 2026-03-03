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
          "Dallas Love Field Airport (DAL) | Invités",
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
          "Éligibilité véhicule | Australie",
          "Éligibilité véhicule | UK",
          "Créer votre profil hôte",
          "Vérifier votre identité d’hôte",
          "Documents requis pour publier un véhicule",
          "Préparer votre première annonce",
          "Activer votre calendrier de disponibilité",
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
          "Activer les prix dynamiques",
          "Créer des tarifs week-end",
          "Appliquer des remises longues durées",
          "Ajuster les prix en haute saison",
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
          "Définir les heures de remise",
          "Configurer les préférences de réservation",
          "Paramétrer les exigences conducteur",
          "Configurer les délais de réponse",
          "Gérer la durée minimale de location",
          "Choisir les lieux de remise",
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
          "Délais de versement",
          "Télécharger vos relevés de paiement",
          "Comprendre les frais hôte",
          "Gérer votre méthode de paiement",
          "Comprendre votre revenu net",
          "Déclarer une transaction manquante",
          "Vérifier le statut d'un virement",
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
          "Accepter ou refuser une réservation",
          "Contacter un invité avant le départ",
          "Modifier une réservation confirmée",
          "Prolonger un voyage invité",
          "Gérer un retour en retard",
          "Répondre aux demandes de modification",
          "Valider les documents au départ",
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
          "Améliorer le taux d’acceptation",
          "Optimiser vos photos d’annonce",
          "Répondre aux avis invités",
          "Gérer plusieurs véhicules",
          "Améliorer la visibilité de vos annonces",
          "Optimiser les titres et descriptions",
          "Mettre à jour les équipements proposés",
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
          "Aéroport international d’Antananarivo | Hôtes",
          "Aéroport de Nosy Be | Hôtes",
          "Aéroport de Toamasina | Hôtes",
          "Politique de permis d'aéroport",
          "Frais de stationnement et livraison",
          "Points de rencontre autorisés",
          "Aéroport de Majunga | Hôtes",
          "Aéroport de Sainte-Marie | Hôtes",
          "Aéroport de Diego Suarez | Hôtes",
          "Aéroport de Fort-Dauphin | Hôtes",
          "Règles de badge d'accès aéroport",
          "Meilleures pratiques de livraison terminal",
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
          "Modifier votre adresse e-mail",
          "Configurer la double authentification",
          "Changer le mot de passe hôte",
          "Mettre à jour les coordonnées de facturation",
          "Gérer les accès de votre équipe",
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
          "Planifier la maintenance préventive",
          "Gérer les rappels constructeur",
          "Préparer le véhicule avant un voyage",
          "Checklist de sécurité avant départ",
          "Nettoyage recommandé entre locations",
          "Suivi du kilométrage du véhicule",
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
          "Déclarer un incident de sécurité",
          "Que faire en cas de vol du véhicule",
          "Contacter l'équipe sécurité",
          "Procédure en cas de comportement dangereux",
          "Signaler une utilisation non autorisée",
          "Protéger vos clés et documents",
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
          "Politique carburant | Hôtes",
          "Politique non-fumeur | Hôtes",
          "Politique animaux | Hôtes",
          "Politique kilométrage",
          "Politique sur les retards",
          "Politique sur les accessoires additionnels",
          "Politique de lavage en fin de trajet",
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
          "Comparer les plans de protection",
          "Franchise et responsabilité hôte",
          "Couverture des dommages matériels",
          "Protection contre le vol",
          "Exclusions de couverture",
          "Choisir le plan adapté à votre véhicule",
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
          "Évaluation des dommages par photo",
          "Délais de déclaration de sinistre",
          "Suivre le remboursement des réparations",
          "Documents requis pour un sinistre",
          "Étapes après un accident déclaré",
          "Contester une estimation de dommages",
          "Communication avec l'invité impliqué",
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
          "Compléter le formulaire fiscal | Hôtes US",
          "Recevoir un 1099-K",
          "Accéder au formulaire fiscal",
          "Déclarer vos revenus hôte",
          "Mettre à jour vos informations fiscales",
          "Télécharger l’historique des paiements",
          "Dates limites de déclaration fiscale",
          "Corriger un formulaire fiscal",
          "Guide de préparation des justificatifs",
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
    <main className="bg-[#f6f6f7] pb-20 text-[#121214]">
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

      <section className="mx-auto w-full max-w-6xl px-4 pt-12 sm:px-6 lg:px-8">
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
