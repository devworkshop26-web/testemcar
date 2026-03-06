from rest_framework import serializers
from .models import Prestataire


class PrestataireSerializer(serializers.ModelSerializer):
    class Meta:
        model = Prestataire
        fields = "__all__"
        read_only_fields = (
            "id",
            "user",
            "status",
            "validated_by",
            "created_at",
            "updated_at",
        )
