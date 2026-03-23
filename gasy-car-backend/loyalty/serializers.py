from rest_framework import serializers

from .models import LoyaltyTransaction
from .services import LoyaltyService


class LoyaltyTransactionSerializer(serializers.ModelSerializer):
    display_status = serializers.SerializerMethodField()

    class Meta:
        model = LoyaltyTransaction
        fields = (
            "id",
            "label",
            "description",
            "points",
            "status",
            "display_status",
            "created_at",
            "metadata",
        )

    def get_display_status(self, obj):
        mapping = {
            LoyaltyTransaction.Status.EARNED: "earned",
            LoyaltyTransaction.Status.PENDING: "pending",
            LoyaltyTransaction.Status.REDEEMED: "redeemed",
            LoyaltyTransaction.Status.CANCELLED: "cancelled",
        }
        status = obj.get("status") if isinstance(obj, dict) else obj.status
        return mapping.get(status, "earned")


class LoyaltySummarySerializer(serializers.Serializer):
    title = serializers.CharField()
    subtitle = serializers.CharField()
    points = serializers.IntegerField()
    next_tier_label = serializers.CharField()
    points_to_next_tier = serializers.IntegerField()
    progress = serializers.IntegerField()
    member_since = serializers.DateField()
    discount_label = serializers.CharField()
    current_tier = serializers.CharField()
    current_tier_helper = serializers.CharField()
    next_tier_display = serializers.CharField()
    tiers = serializers.ListField(child=serializers.DictField(), read_only=True)
    history = serializers.ListField(child=serializers.DictField(), read_only=True)
    stats = serializers.ListField(child=serializers.DictField(), read_only=True)
    benefits = serializers.ListField(child=serializers.DictField(), read_only=True)
    actions = serializers.ListField(child=serializers.DictField(), read_only=True)

    @classmethod
    def build_payload(cls, user):
        summary = LoyaltyService.get_summary(user)
        points = summary["points"]
        history = LoyaltyService.get_history(user)

        return {
            **summary,
            "stats": [
                {
                    "label": "Niveau actuel",
                    "value": summary["current_tier"],
                    "helper": summary["current_tier_helper"],
                },
                {
                    "label": "Points disponibles",
                    "value": str(summary["points"]),
                    "helper": "Solde synchronisé depuis les réservations, avis et le profil client.",
                },
                {
                    "label": "Prochain palier",
                    "value": summary["next_tier_display"],
                    "helper": f"Encore {summary['points_to_next_tier']} points pour atteindre {summary['next_tier_label']}." if summary["points_to_next_tier"] > 0 else "Le niveau maximum est déjà atteint.",
                },
            ],
            "benefits": [
                {
                    "title": "Réductions sur les locations",
                    "description": "Transformez vos points en avantages lors de vos prochaines réservations.",
                    "icon": "gift",
                },
                {
                    "title": "Bonus confiance",
                    "description": "Les clients réguliers débloquent des offres fidélité ciblées.",
                    "icon": "shield-check",
                },
                {
                    "title": "Récompenses d’engagement",
                    "description": "Les avis, locations terminées et actions de fidélité renforcent la progression.",
                    "icon": "star",
                },
                {
                    "title": "Expérience évolutive",
                    "description": "Le frontend est maintenant connecté au backend et prêt à évoluer.",
                    "icon": "sparkles",
                },
            ],
            "tiers": LoyaltyService.serialize_tiers(points),
            "history": LoyaltyTransactionSerializer(history, many=True).data,
            "actions": [
                {"label": "Voir mes locations", "href": "/client/rentals", "variant": "outline"},
                {"label": "Parrainer un ami", "href": "/client/loyalty"},
            ],
        }
