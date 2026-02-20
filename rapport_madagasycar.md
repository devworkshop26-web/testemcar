# Rapport de synthèse — MalagasyCar

## 1) Présentation du projet
MalagasyCar est une plateforme web de location de véhicules qui connecte plusieurs profils métier autour d’un même parcours de réservation : administration, support, clients et prestataires. L’objectif principal est de centraliser la gestion des comptes, du parc automobile, des réservations, des paiements et de la relation utilisateur.

## 2) Partie backend (API)
Le backend repose sur Django, Django REST Framework et JWT pour l’authentification. L’architecture est organisée en modules métier (utilisateurs, véhicules, réservations, support, avis, paiements, notifications, marketing, prestataires, conducteurs et SMS), ce qui facilite la maintenance et l’évolution de la plateforme.

Points clés de la partie backend :
- Gestion des rôles : ADMIN, SUPPORT, CLIENT, PRESTATAIRE.
- API centralisée avec documentation Swagger/Redoc.
- Gestion du cycle complet de réservation.
- Gestion des tickets support et des notifications.
- Intégration de services transverses : paiements, avis, messagerie et contenus marketing.

## 3) Partie frontend (interface web)
Le frontend est développé avec React, TypeScript et Vite. L’interface est structurée par routeurs de rôles et des espaces dédiés.

Points clés de la partie frontend :
- Espace Admin : pilotage global, utilisateurs, flotte, paramètres, réservations, analytics.
- Espace Support : suivi des clients, tickets, réservations et flotte.
- Espace Client : recherche de véhicules, réservations, favoris, paramètres et tickets.
- Espace Prestataire : tableau de bord, flotte, disponibilités, réservations, finances, conducteurs et support.

## 4) Organisation fonctionnelle par rôle
- **Admin** : supervision complète de la plateforme et gouvernance des données.
- **Support** : assistance opérationnelle et traitement des demandes.
- **Client** : consultation des offres et réservation des véhicules.
- **Prestataire** : publication et gestion des véhicules, suivi d’activité et revenus.

## 5) Conclusion
Le travail réalisé met en place une base solide et cohérente pour une plateforme multi-acteurs de location automobile. La séparation claire entre backend métier et frontend par rôle permet une évolution progressive, une meilleure lisibilité du projet et une expérience adaptée à chaque type d’utilisateur.
