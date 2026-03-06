# django
from django.shortcuts import get_object_or_404
from django.db.models.signals import post_save
from django.dispatch import receiver
from rest_framework import viewsets, permissions, decorators, response, status

# DRF
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import action

# Models
from users.models import User

# views.py
from notification.models import TicketNotification, Notification
from notification.serializers import TicketNotificationSerializer, NotificationSerializer




# post save signal to avoid duplicate OTP email on user creation
@receiver(post_save, sender=User)
def notify_user_creation(sender, instance, created, **kwargs):
    """
    Hook conservé pour d'éventuels traitements de notification.
    L'envoi OTP est géré uniquement dans les vues users
    (inscription + renvoi OTP) pour éviter les doublons d'emails.
    """
    if not created:
        return


class NotificationViewSet(viewsets.ModelViewSet):
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]
    http_method_names = ["get", "patch", "delete"]

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user).order_by("-created_at")

    @action(detail=False, methods=["post"])
    def mark_all_read(self, request):
        self.get_queryset().update(is_read=True)
        return Response({"status": "success"})
    
    @action(detail=True, methods=["patch"])
    def mark_read(self, request, pk=None):
        notification = self.get_object()
        notification.is_read = True
        notification.save()
        return Response(self.get_serializer(notification).data)


class TicketNotificationViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = TicketNotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return TicketNotification.objects.filter(user=self.request.user).order_by("-created_at")
