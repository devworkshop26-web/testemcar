from rest_framework import serializers
from .models import Driver



class DriverReadSerializer(serializers.ModelSerializer):
    # licenses field removed as it's now part of the model
    full_name = serializers.SerializerMethodField()
    owner_name = serializers.SerializerMethodField()

    class Meta:
        model = Driver
        fields = "__all__"

    def get_full_name(self, obj):
        return f"{obj.first_name} {obj.last_name}"
    
    def get_owner_name(self, obj):
        if obj.owner:
            return obj.owner.full_name
        return None

class DriverWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Driver
        fields = "__all__"
        read_only_fields = ("id", "created_at", "updated_at", "owner")
    
    def validate_user(self, value):
        # Allow null user
        if value is None:
            return None
        # Check if user already has a driver profile (except current instance)
        if Driver.objects.filter(user=value).exclude(pk=self.instance.pk if self.instance else None).exists():
            raise serializers.ValidationError("Cet utilisateur est déjà associé à un chauffeur.")
        return value
