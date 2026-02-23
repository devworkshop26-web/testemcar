# django
from django.shortcuts import get_object_or_404
from rest_framework import viewsets, permissions, decorators, response, status

# DRF
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import action

# views.py
from notification.models import TicketNotification, Notification
from notification.serializers import TicketNotificationSerializer, NotificationSerializer


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
