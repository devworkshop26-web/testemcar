#  import drffrom rest_framework import viewsets
from drf_yasg.utils import swagger_auto_schema


# support/views.py
from rest_framework import viewsets, permissions, decorators, response, status
from .models import SupportTicket, TicketMessage,  IncidentReport
from .serializers import (
    SupportTicketSerializer,
    TicketMessageSerializer,
    IncidentReportSerializer,
)
# import permissions
from rest_framework.permissions import IsAuthenticated


class IsOwnerOrStaff(permissions.BasePermission):
    """
    Permission :
    - admin/support : peut voir tous les tickets
    - l'utilisateur normal : peut voir seulement ses tickets
    """

    def has_object_permission(self, request, view, obj):
        user = request.user

        if not user.is_authenticated:
            return False

        # Admin / staff
        if getattr(user, "role", None) in ["ADMIN", "SUPPORT"] or user.is_staff:
            return True

        # Le ticket lui appartient
        return obj.user_id == user.id


class SupportTicketViewSet(viewsets.ModelViewSet):
    """
    Gestion des tickets support :
    - CRUD complet
    - Résolution de ticket
    - Sécurité : owner + staff/admin
    """
    queryset = (
        SupportTicket.objects
        .select_related("user", "assigned_admin")
        .prefetch_related("messages")
        .all()
    )
    serializer_class = SupportTicketSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrStaff]

    # ✅ AJOUT : filtrer la LISTE selon le rôle (sinon list() renvoie tout)
    def get_queryset(self):
        if getattr(self, "swagger_fake_view", False):
            return super().get_queryset().none()

        qs = super().get_queryset()
        user = self.request.user

        if not user.is_authenticated:
            return qs.none()

        # Admin / staff => voit tout
        if getattr(user, "role", None) in ["ADMIN", "SUPPORT"] or user.is_staff:
            return qs

        # User normal => voit seulement ses tickets
        return qs.filter(user=user)

    # ==============================
    # CRUD avec Swagger
    # ==============================

    @swagger_auto_schema(operation_summary="Lister tous les tickets support accessibles")
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    @swagger_auto_schema(operation_summary="Obtenir les détails d'un ticket support")
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)

    @swagger_auto_schema(operation_summary="Créer un ticket support")
    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)

    def perform_create(self, serializer):
        """
        Associe automatiquement le ticket au user connecté.
        """
        serializer.save(user=self.request.user)

    @swagger_auto_schema(operation_summary="Mettre à jour un ticket support")
    def update(self, request, *args, **kwargs):
        return super().update(request, *args, **kwargs)

    @swagger_auto_schema(operation_summary="Mettre à jour partiellement un ticket support")
    def partial_update(self, request, *args, **kwargs):
        return super().partial_update(request, *args, **kwargs)

    @swagger_auto_schema(operation_summary="Supprimer un ticket support")
    def destroy(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)

    # ==============================
    # ACTION PERSONNALISÉE : Resolve
    # ==============================

    @swagger_auto_schema(
        operation_summary="Marquer un ticket comme résolu",
        operation_description="Change le statut du ticket en 'RESOLVED'.",
    )
    @decorators.action(detail=True, methods=["post"])
    def resolve(self, request, pk=None):
        ticket = self.get_object()

        ticket.status = SupportTicket.Status.RESOLVED
        ticket.save(update_fields=["status", "updated_at"])

        # Les signaux s'activent automatiquement (notifications + websocket)
        return response.Response(
            self.get_serializer(ticket).data,
            status=status.HTTP_200_OK
        )
    

# TicketMessage
class TicketMessagetViewSet(viewsets.ModelViewSet):
    queryset = TicketMessage.objects.all()
    serializer_class = TicketMessageSerializer
    permission_classes = [IsAuthenticated]

    # ✅ AJOUT OBLIGATOIRE POUR ÉVITER 500
    def perform_create(self, serializer):
        serializer.save(sender=self.request.user)

    @swagger_auto_schema(operation_summary="List all message ticket tickets")
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    @swagger_auto_schema(operation_summary="Retrieve a message ticket ticket by ID")
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)

    @swagger_auto_schema(operation_summary="Create a new message ticket ticket")
    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)

    @swagger_auto_schema(operation_summary="Update a message ticket ticket")
    def update(self, request, *args, **kwargs):
        return super().update(request, *args, **kwargs)

    @swagger_auto_schema(operation_summary="Partially update a message ticket ticket")
    def partial_update(self, request, *args, **kwargs):
        return super().partial_update(request, *args, **kwargs)

    @swagger_auto_schema(operation_summary="Delete a message ticket ticket")
    def destroy(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)





class TicketMessageViewSet(viewsets.ModelViewSet):
    queryset = TicketMessage.objects.select_related("ticket", "sender").all()
    serializer_class = TicketMessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(sender=self.request.user)



class IncidentReportViewSet(viewsets.ModelViewSet):
    queryset = IncidentReport.objects.select_related("reservation", "reported_by", "handled_by")
    serializer_class = IncidentReportSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(reported_by=self.request.user)

    @decorators.action(detail=True, methods=["post"])
    def resolve(self, request, pk=None):
        incident = self.get_object()
        incident.mark_resolved(user=request.user)
        return response.Response(self.get_serializer(incident).data)
