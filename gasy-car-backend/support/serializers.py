# serialisers.py
from rest_framework import serializers
# support/serializers.py
from rest_framework import serializers
from .models import SupportTicket, TicketMessage, IncidentReport


# serialisers
class SupportTicketSerializer(serializers.ModelSerializer):
    class Meta:
        model = SupportTicket
        fields = "__all__"
    
    
class TicketMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = TicketMessage
        fields = "__all__"



class TicketMessageSerializer(serializers.ModelSerializer):
    sender_email = serializers.EmailField(source="sender.email", read_only=True)

    class Meta:
        model = TicketMessage
        fields = "__all__"
        read_only_fields = ("id", "sender", "created_at", "updated_at")


class SupportTicketSerializer(serializers.ModelSerializer):
    messages = TicketMessageSerializer(many=True, read_only=True)

    class Meta:
        model = SupportTicket
        fields = "__all__"
        read_only_fields = ("id", "user", "created_at", "updated_at", "last_activity_at")



class IncidentReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = IncidentReport
        fields = "__all__"
        read_only_fields = ("id", "created_at", "updated_at", "resolved_at")
