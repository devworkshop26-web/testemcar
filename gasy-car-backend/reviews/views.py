#  import drf
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db import IntegrityError
from rest_framework.exceptions import ValidationError

# models
from .models import Review

# serialzier
from .serializers import ReviewSerializer

# view set


class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.select_related("author", "target", "reservation")
    serializer_class = ReviewSerializer
    permission_classes = [IsAuthenticated]
    
     # ============================================================
    # ❤️ SÉCURITÉ : Empêcher crash si contrainte d’unicité échoue
    # ============================================================
    def perform_create(self, serializer):
        try:
            serializer.save(author=self.request.user)
        except IntegrityError:
            raise ValidationError({
                "detail": "Vous avez déjà laissé un avis pour cette réservation ou cet utilisateur."
            })

    def perform_update(self, serializer):
        try:
            serializer.save()
        except IntegrityError:
            raise ValidationError({
                "detail": "Impossible de modifier : une contrainte d’unicité empêche cette action."
            })

    # ============================================================
    # 🔥 1) Reviews liés à une réservation
    # GET /reviews/reservation/<reservation_id>/
    # ============================================================
    @action(detail=False, methods=["get"], url_path=r"reservation/(?P<reservation_id>[0-9a-f-]+)")
    def by_reservation(self, request, reservation_id):
        reviews = Review.objects.filter(reservation_id=reservation_id)
        serializer = self.get_serializer(reviews, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=["get"], url_path=r"vehicle/(?P<vehicle_id>[0-9a-f-]+)")
    def by_vehicle(self, request, vehicle_id):
        reviews = Review.objects.filter(reservation__vehicle_id=vehicle_id)
        serializer = self.get_serializer(reviews, many=True)
        return Response(serializer.data)

    # ============================================================
    # 🔥 2) Reviews écrits PAR un user
    # GET /reviews/user/<user_id>/written/
    # ============================================================
    @action(detail=False, methods=["get"], url_path=r"user/(?P<user_id>[0-9a-f-]+)/written")
    def written_by_user(self, request, user_id):
        reviews = Review.objects.filter(author_id=user_id)
        serializer = self.get_serializer(reviews, many=True)
        return Response(serializer.data)

    # ============================================================
    # 🔥 3) Reviews reçus PAR un user
    # GET /reviews/user/<user_id>/received/
    # ============================================================
    @action(detail=False, methods=["get"], url_path=r"user/(?P<user_id>[0-9a-f-]+)/received")
    def received_by_user(self, request, user_id):
        reviews = Review.objects.filter(target_id=user_id)
        serializer = self.get_serializer(reviews, many=True)
        return Response(serializer.data)
    # ============================================================
    # ?? 4) R�servations en attente d'avis (pour un v�hicule donn�)
    # GET /reviews/pending/?vehicle_id=...
    # ============================================================
    @action(detail=False, methods=["get"], url_path="pending")
    def pending(self, request):
        vehicle_id = request.query_params.get("vehicle_id")
        if not vehicle_id:
            return Response({"detail": "vehicle_id is required"}, status=400)

        from reservations.models import Reservation

        # On cherche les r�servations termin�es de ce client pour ce v�hicule
        # pour lesquelles il n'a PAS encore laiss� d'avis.
        reservations = Reservation.objects.filter(
            client=request.user,
            vehicle_id=vehicle_id,
            status__in=[Reservation.Status.CONFIRMED, Reservation.Status.COMPLETED]
        ).exclude(
            reviews__author=request.user
        ).order_by("-end_datetime")

        data = [
            {
                "id": str(r.id),
                "start_date": r.start_datetime,
                "end_date": r.end_datetime,
                "total_amount": str(r.total_amount)
            }
            for r in reservations
        ]
        return Response(data)
