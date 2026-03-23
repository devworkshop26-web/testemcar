import uuid

from django.conf import settings
from django.db import models


class LoyaltyTransaction(models.Model):
    """
    Historique métier de la fidélité.

    On stocke chaque mouvement de points pour pouvoir alimenter le frontend
    avec un vrai solde et un vrai historique, sans supprimer ou modifier les
    autres modules déjà présents dans le backend.
    """

    class TransactionType(models.TextChoices):
        RESERVATION_COMPLETED = "RESERVATION_COMPLETED", "Location terminée"
        REVIEW_POSTED = "REVIEW_POSTED", "Avis vérifié publié"
        PROFILE_COMPLETED = "PROFILE_COMPLETED", "Profil complété"
        REFERRAL_PENDING = "REFERRAL_PENDING", "Parrainage en attente"
        REDEEMED = "REDEEMED", "Points utilisés"
        MANUAL = "MANUAL", "Ajustement manuel"

    class Status(models.TextChoices):
        EARNED = "EARNED", "Gagné"
        PENDING = "PENDING", "En attente"
        REDEEMED = "REDEEMED", "Utilisé"
        CANCELLED = "CANCELLED", "Annulé"

    class SourceType(models.TextChoices):
        RESERVATION = "RESERVATION", "Réservation"
        REVIEW = "REVIEW", "Avis"
        PROFILE = "PROFILE", "Profil"
        REFERRAL = "REFERRAL", "Parrainage"
        MANUAL = "MANUAL", "Manuel"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="loyalty_transactions",
    )
    transaction_type = models.CharField(max_length=40, choices=TransactionType.choices)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.EARNED)
    source_type = models.CharField(max_length=20, choices=SourceType.choices, default=SourceType.MANUAL)
    source_id = models.CharField(max_length=64, blank=True, default="")
    label = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    points = models.IntegerField(default=0)
    metadata = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "loyalty_transactions"
        ordering = ("-created_at", "-updated_at")
        constraints = [
            models.UniqueConstraint(
                fields=["user", "source_type", "source_id", "transaction_type"],
                name="unique_loyalty_event_per_source",
            )
        ]

    def __str__(self):
        return f"{self.user_id} - {self.transaction_type} ({self.points})"
