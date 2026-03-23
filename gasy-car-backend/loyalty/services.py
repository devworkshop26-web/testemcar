from __future__ import annotations

from dataclasses import dataclass
from typing import Iterable

from django.db import IntegrityError
from django.db.models import Sum
from django.db.models.functions import Coalesce
from django.utils import timezone

from reservations.models import Reservation
from reviews.models import Review
from users.models import User

from .models import LoyaltyTransaction


@dataclass(frozen=True)
class LoyaltyTierDefinition:
    name: str
    min_points: int
    max_points: int | None
    perks: list[str]
    helper: str


LOYALTY_TIERS: list[LoyaltyTierDefinition] = [
    LoyaltyTierDefinition(
        name="Bronze",
        min_points=0,
        max_points=299,
        perks=["Accès au programme", "Historique des points"],
        helper="Premiers avantages visibles dans votre espace client.",
    ),
    LoyaltyTierDefinition(
        name="Silver",
        min_points=300,
        max_points=799,
        perks=["Bonus ponctuels", "Offres fidélité"],
        helper="Le client commence à débloquer des bonus ciblés.",
    ),
    LoyaltyTierDefinition(
        name="Gold",
        min_points=800,
        max_points=1499,
        perks=["-10% sur certaines locations", "Avantages exclusifs", "Priorité promo"],
        helper="Accès aux offres fidélité et aux bonus sur les prochaines réservations.",
    ),
    LoyaltyTierDefinition(
        name="Platinum",
        min_points=1500,
        max_points=None,
        perks=["Privilèges premium", "Bonus majorés", "Accès anticipé aux offres"],
        helper="Palier premium pour les meilleurs clients.",
    ),
]


class LoyaltyService:
    RESERVATION_COMPLETED_POINTS = 180
    REVIEW_POSTED_POINTS = 25
    PROFILE_COMPLETED_POINTS = 40

    @classmethod
    def sync_user_loyalty(cls, user: User) -> None:
        """
        Synchronise la fidélité à partir des modules déjà existants.

        Le but est de brancher la fonctionnalité sans supprimer ou casser les
        flux backend actuels : on détecte les réservations terminées, les avis
        rédigés et l'état du profil, puis on crée les transactions manquantes.
        """
        if getattr(user, "role", None) != "CLIENT":
            return

        cls._sync_completed_reservations(user)
        cls._sync_reviews(user)
        cls._sync_profile_completion(user)

    @classmethod
    def _sync_completed_reservations(cls, user: User) -> None:
        reservations = Reservation.objects.filter(
            client=user,
            status=Reservation.Status.COMPLETED,
        ).select_related("vehicle")

        for reservation in reservations:
            cls._create_transaction_if_missing(
                user=user,
                transaction_type=LoyaltyTransaction.TransactionType.RESERVATION_COMPLETED,
                status=LoyaltyTransaction.Status.EARNED,
                source_type=LoyaltyTransaction.SourceType.RESERVATION,
                source_id=str(reservation.id),
                label=f"Location terminée · {reservation.vehicle.titre}",
                description="Points accordés après une location finalisée avec succès.",
                points=cls.RESERVATION_COMPLETED_POINTS,
                metadata={
                    "reservation_id": str(reservation.id),
                    "vehicle_id": str(reservation.vehicle_id),
                    "vehicle_title": reservation.vehicle.titre,
                    "reservation_reference": reservation.reference,
                    "completed_at": reservation.updated_at.isoformat() if reservation.updated_at else None,
                },
            )

    @classmethod
    def _sync_reviews(cls, user: User) -> None:
        reviews = Review.objects.filter(author=user).select_related("reservation")

        for review in reviews:
            status = (
                LoyaltyTransaction.Status.PENDING
                if review.moderation_status == Review.ModerationStatus.PENDING
                else LoyaltyTransaction.Status.EARNED
                if review.moderation_status == Review.ModerationStatus.APPROVED
                else LoyaltyTransaction.Status.CANCELLED
            )
            points = cls.REVIEW_POSTED_POINTS if status != LoyaltyTransaction.Status.CANCELLED else 0
            description = (
                "Bonus fidélité après publication d’un retour client utile."
                if status != LoyaltyTransaction.Status.CANCELLED
                else "Avis refusé par la modération, aucun point crédité."
            )

            transaction, created = LoyaltyTransaction.objects.get_or_create(
                user=user,
                source_type=LoyaltyTransaction.SourceType.REVIEW,
                source_id=str(review.id),
                transaction_type=LoyaltyTransaction.TransactionType.REVIEW_POSTED,
                defaults={
                    "status": status,
                    "label": "Avis vérifié publié",
                    "description": description,
                    "points": points,
                    "metadata": {
                        "review_id": str(review.id),
                        "reservation_id": str(review.reservation_id) if review.reservation_id else None,
                        "moderation_status": review.moderation_status,
                    },
                },
            )

            if not created:
                transaction.status = status
                transaction.points = points
                transaction.description = description
                transaction.metadata = {
                    **(transaction.metadata or {}),
                    "review_id": str(review.id),
                    "reservation_id": str(review.reservation_id) if review.reservation_id else None,
                    "moderation_status": review.moderation_status,
                }
                transaction.save(update_fields=["status", "points", "description", "metadata", "updated_at"])

    @classmethod
    def _sync_profile_completion(cls, user: User) -> None:
        if not cls._is_profile_complete(user):
            return

        cls._create_transaction_if_missing(
            user=user,
            transaction_type=LoyaltyTransaction.TransactionType.PROFILE_COMPLETED,
            status=LoyaltyTransaction.Status.EARNED,
            source_type=LoyaltyTransaction.SourceType.PROFILE,
            source_id=str(user.id),
            label="Profil complété",
            description="Bonus accordé après validation d’un profil client complet.",
            points=cls.PROFILE_COMPLETED_POINTS,
            metadata={"user_id": str(user.id)},
        )

    @staticmethod
    def _is_profile_complete(user: User) -> bool:
        required_values = [
            user.first_name,
            user.last_name,
            user.phone,
            user.address,
            user.cin_number,
            user.date_of_birth,
            user.cin_photo_recto,
            user.cin_photo_verso,
            user.permis_conduire_recto or user.permis_conduire,
            user.permis_conduire_verso or user.permis_conduire,
            user.residence_certificate,
        ]
        return all(bool(value) for value in required_values)

    @staticmethod
    def _create_transaction_if_missing(**kwargs) -> None:
        try:
            LoyaltyTransaction.objects.create(**kwargs)
        except IntegrityError:
            return

    @classmethod
    def get_available_points(cls, user: User) -> int:
        cls.sync_user_loyalty(user)
        balance = LoyaltyTransaction.objects.filter(
            user=user,
            status__in=[LoyaltyTransaction.Status.EARNED, LoyaltyTransaction.Status.REDEEMED],
        ).aggregate(total=Coalesce(Sum("points"), 0))["total"]
        return int(balance or 0)

    @classmethod
    def get_current_tier(cls, points: int) -> LoyaltyTierDefinition:
        for tier in reversed(LOYALTY_TIERS):
            max_points = tier.max_points
            if points >= tier.min_points and (max_points is None or points <= max_points):
                return tier
        return LOYALTY_TIERS[0]

    @classmethod
    def get_next_tier(cls, points: int) -> LoyaltyTierDefinition | None:
        current = cls.get_current_tier(points)
        current_index = next((index for index, tier in enumerate(LOYALTY_TIERS) if tier.name == current.name), 0)
        if current_index >= len(LOYALTY_TIERS) - 1:
            return None
        return LOYALTY_TIERS[current_index + 1]

    @classmethod
    def get_summary(cls, user: User) -> dict:
        points = cls.get_available_points(user)
        current_tier = cls.get_current_tier(points)
        next_tier = cls.get_next_tier(points)
        member_since = timezone.localtime(user.date_joined).date()

        if next_tier is None:
            progress = 100
            points_to_next_tier = 0
            next_tier_name = current_tier.name
            next_tier_label = "Niveau maximum atteint"
        else:
            tier_span = max(next_tier.min_points - current_tier.min_points, 1)
            progress = min(max(((points - current_tier.min_points) / tier_span) * 100, 0), 100)
            points_to_next_tier = max(next_tier.min_points - points, 0)
            next_tier_name = next_tier.name
            next_tier_label = f"{points_to_next_tier} pts"

        return {
            "title": "Mes points fidélité",
            "subtitle": "Suivez votre progression, découvrez vos avantages et visualisez les récompenses disponibles dans votre espace client.",
            "points": points,
            "next_tier_label": next_tier_name,
            "points_to_next_tier": points_to_next_tier,
            "progress": round(progress),
            "member_since": member_since.isoformat(),
            "discount_label": "-10% sur certaines locations" if points >= 800 else "Offres fidélité selon votre niveau",
            "current_tier": current_tier.name,
            "current_tier_helper": current_tier.helper,
            "next_tier_display": next_tier_label,
        }

    @classmethod
    def serialize_tiers(cls, points: int) -> list[dict]:
        current_tier = cls.get_current_tier(points)
        tiers = []
        for tier in LOYALTY_TIERS:
            threshold_label = (
                f"{tier.min_points}+ points"
                if tier.max_points is None
                else f"{tier.min_points} à {tier.max_points} points"
            )
            tiers.append(
                {
                    "name": tier.name,
                    "threshold_label": threshold_label,
                    "active": tier.name == current_tier.name,
                    "perks": tier.perks,
                    "helper": tier.helper,
                }
            )
        return tiers

    @classmethod
    def get_history(cls, user: User) -> list[LoyaltyTransaction]:
        cls.sync_user_loyalty(user)
        return list(LoyaltyTransaction.objects.filter(user=user).order_by("-created_at", "-updated_at"))
