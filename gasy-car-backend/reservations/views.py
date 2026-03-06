#  import drf
from decimal import Decimal
from rest_framework import permissions, decorators, response, status

from django.db.models import Count, Sum, Value
from django.db.models.functions import Coalesce, TruncDate, TruncMonth
from django.db.models import Count
from django.utils.timezone import now, timedelta
from rest_framework.decorators import action
from django.db import transaction
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.template.loader import render_to_string
from django.utils.crypto import get_random_string
from django.http import HttpResponseForbidden

# DRF
from rest_framework import status, viewsets
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from rest_framework.views import APIView
from drf_yasg.utils import swagger_auto_schema
from rest_framework.decorators import (
    authentication_classes,
    permission_classes,
    api_view,
)

from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth.decorators import login_required

from django.urls import reverse
from django.core.mail import send_mail
from gasycar.utils import send_email_notification
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.models import AnonymousUser
from smsapp.helpsms import send_sms_befiana


# models
from users.models import User
from vehicule.models import Vehicule
from modepayment.models import ModePayment


# import serializers
from .serializers import (
    DailyIncomeSerializer,
    ReservationSerializer,
    ReservationServiceSerializer,
    ReservationStatisticsSerializer,
    ReservationPaymentSerializer,
    ReservationPricingConfigSerializer,
)

# import models
from .models import Reservation, ReservationService, ReservationPayment, ReservationPricingConfig
from .forms import ReservationPaymentForm
from driver.models import Driver


from rest_framework_simplejwt.authentication import JWTAuthentication


def authenticate_request(request):
    """
    Authentifie une requête Django à partir du token Bearer dans l’URL ou dans l’Authorization header.
    """
    jwt_auth = JWTAuthentication()

    # 1. Chercher token dans l'URL
    token_param = request.GET.get("token")
    if token_param:
        request.META["HTTP_AUTHORIZATION"] = f"Bearer {token_param}"

    try:
        user_auth_tuple = jwt_auth.authenticate(request)
        if user_auth_tuple:
            return user_auth_tuple[0]
    except Exception:
        pass

    return None


class IsOwnerOrStaff(permissions.BasePermission):
    """
    Autorise si l'utilisateur est staff (is_staff) ou s'il est le client lié à la réservation.
    """

    def has_object_permission(self, request, view, obj):
        # obj est une instance de ReservationPayment
        if request.user and request.user.is_staff:
            return True
        reservation = getattr(obj, "reservation", None)
        user_id = getattr(request.user, "id", None)
        if not reservation or not user_id:
            return False
        if getattr(reservation, "client_id", None) == user_id:
            return True
        return getattr(reservation.vehicle, "proprietaire_id", None) == user_id

    def has_permission(self, request, view):
        # pour list/create on laisse passer et on filtrera dans get_queryset / perform_create
        return request.user and request.user.is_authenticated


class ReservationPaymentViewSet(viewsets.ModelViewSet):
    """
    ViewSet pour ReservationPayment.
    - Les clients peuvent lister/voir leurs paiements.
    - Le staff peut voir / modifier / valider.
    """

    queryset = ReservationPayment.objects.select_related(
        "reservation", "reservation__client", "mode", "processed_by"
    ).all()
    serializer_class = ReservationPaymentSerializer
    permission_classes = [IsOwnerOrStaff]

    # def get_queryset(self):
    #     user = self.request.user
    #     qs = super().get_queryset()
    #     # if user.is_staff:
    #     #     return qs
    #     # les utilisateurs normaux ne voient que leurs propres paiements
    #     return qs.filter(reservation__client=user)

    # @transaction.atomic
    # def perform_create(self, serializer):
    #     """
    #     Creation sécurisée d'un ReservationPayment.
    #     - Vérifie que la reservation existe et appartient à l'utilisateur (sauf staff).
    #     - Accepte un mode de paiement optionnel.
    #     """
    #     user = self.request.user
    #     reservation = serializer.validated_data.get("reservation")

    #     # sécurité : seul le client propriétaire (ou staff) peut créer le paiement pour cette reservation
    #     if not user.is_staff and reservation.client_id != user.id:
    #         raise exceptions.PermissionDenied(
    #             "Vous n'êtes pas autorisé à créer un paiement pour cette réservation."
    #         )

        # créer l'enregistrement (processed_by laissé à None : la validation peut être faite par le staff via update)
        # serializer.save()

    def create(self, request, *args, **kwargs):
        """
        Override pour accepter aussi la logique quand le frontend
        envoie 'mode' qui n'existe pas — on retourne une erreur claire.
        """
        # Serializer va vérifier existence des PKs (PrimaryKeyRelatedField).
        return super().create(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        """
        Limiter qui peut changer le status / processed_by:
        - Seul le staff peut marquer VALIDATED / REJECTED / REFUNDED ou définir processed_by.
        """
        # user = request.user
        # if not user.is_staff:
        #     # si un utilisateur normal essaie de modifier status/processed_by -> interdit
        #     forbidden_fields = {"status", "processed_by"}
        #     if any(f in request.data for f in forbidden_fields):
        #         raise exceptions.PermissionDenied(
        #             "Seul le personnel peut modifier le statut ou le champ processed_by."
        #         )
        return super().update(request, *args, **kwargs)


class ReservationPricingConfigAPIView(APIView):
    """Expose et met à jour la configuration globale de tarification réservation."""

    authentication_classes = [JWTAuthentication, TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        config = ReservationPricingConfig.get_solo()
        serializer = ReservationPricingConfigSerializer(config)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def patch(self, request, format=None):
        user = request.user
        if getattr(user, "role", None) != "ADMIN" and not user.is_superuser:
            return Response(
                {"detail": "Seul un administrateur peut modifier cette configuration."},
                status=status.HTTP_403_FORBIDDEN,
            )

        config = ReservationPricingConfig.get_solo()
        serializer = ReservationPricingConfigSerializer(config, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)


def user_can_pay_reservation(user, reservation):
    if not user or not getattr(user, "is_authenticated", False):
        return False
    if user.is_staff:
        return True
    if reservation.client_id == user.id:
        return True
    return reservation.vehicle.proprietaire_id == user.id


# reservation APIView
class ReservationViewSet(viewsets.ModelViewSet):
    queryset = Reservation.objects.with_relations()
    serializer_class = ReservationSerializer

    @swagger_auto_schema(operation_description="Retrieve a list of reservations")
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    @swagger_auto_schema(operation_description="Create a new reservation")
    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)

    @swagger_auto_schema(operation_description="Retrieve a reservation by ID")
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)

    @swagger_auto_schema(operation_description="Update a reservation by ID")
    def update(self, request, *args, **kwargs):
        return super().update(request, *args, **kwargs)

    @swagger_auto_schema(operation_description="Partially update a reservation by ID")
    def partial_update(self, request, *args, **kwargs):
        return super().partial_update(request, *args, **kwargs)

    @swagger_auto_schema(operation_description="Delete a reservation by ID")
    def destroy(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)

    @action(detail=False, methods=["post"], url_path="delete-all")
    def delete_all(self, request):
        current_user = request.user

        if not getattr(current_user, "is_authenticated", False):
            return Response(
                {"detail": "Authentification requise."},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        if getattr(current_user, "role", None) != "ADMIN" and not current_user.is_superuser:
            return Response(
                {"detail": "Accès réservé aux administrateurs."},
                status=status.HTTP_403_FORBIDDEN,
            )

        password = request.data.get("password")
        if not password:
            return Response(
                {"detail": "Le mot de passe administrateur est requis."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not current_user.check_password(password):
            return Response(
                {"detail": "Mot de passe administrateur invalide."},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        reservations_qs = Reservation.objects.all()
        reservation_count = reservations_qs.count()

        if reservation_count == 0:
            return Response(
                {"message": "Aucune réservation à supprimer.", "deleted_count": 0},
                status=status.HTTP_200_OK,
            )

        with transaction.atomic():
            reservations_qs.delete()

        return Response(
            {
                "message": "Toutes les réservations et preuves de paiement liées ont été supprimées.",
                "deleted_count": reservation_count,
            },
            status=status.HTTP_200_OK,
        )

    @action(detail=True, methods=['post'], permission_classes=[IsAdminUser])
    def assign_driver(self, request, pk=None):
        """
        Permet à l'admin d'assigner un chauffeur (du pool admin ou autre) à une réservation.
        """
        from .pricing_service import PricingService

        reservation = self.get_object()
        driver_id = request.data.get('driver_id')
        
        if not driver_id:
            return Response({"error": "driver_id is required"}, status=status.HTTP_400_BAD_REQUEST)
            
        try:
            driver = Driver.objects.get(id=driver_id)
        except Driver.DoesNotExist:
            return Response({"error": "Driver not found"}, status=status.HTTP_404_NOT_FOUND)

        # Update reservation
        reservation.driver = driver
        reservation.driver_source = Reservation.DriverSource.ADMIN_POOL # Force Source to Admin Pool if assigned by Admin manually
        reservation.with_chauffeur = True
        reservation.driving_mode = Reservation.DrivingMode.WITH_DRIVER

        pricing_result = PricingService.calculate_amounts(
            vehicle=reservation.vehicle,
            start_datetime=reservation.start_datetime,
            end_datetime=reservation.end_datetime,
            pricing_zone=reservation.pricing_zone,
            driving_mode=reservation.driving_mode,
            driver_source=reservation.driver_source,
        )

        reservation.total_days = pricing_result['days']
        reservation.base_amount = pricing_result['base_amount']
        reservation.options_amount = pricing_result['driver_amount']
        reservation.total_amount = pricing_result['total_amount']

        reservation.save()

        chauffeur_service, _ = ReservationService.objects.get_or_create(
            reservation=reservation,
            service_type=ReservationService.ServiceType.CHAUFFEUR,
            defaults={
                "service_name": "Chauffeur Pro",
                "price": pricing_result['driver_amount'] / pricing_result['days'],
                "quantity": pricing_result['days'],
            },
        )
        chauffeur_service.service_name = "Chauffeur Pro"
        chauffeur_service.price = pricing_result['driver_amount'] / pricing_result['days']
        chauffeur_service.quantity = pricing_result['days']
        chauffeur_service.save()

        return Response(ReservationSerializer(reservation).data)


# api view pour recuperer les reservations d'un utilisateur
class UserReservationsAPIView(APIView):
    @swagger_auto_schema(
        operation_description="Retrieve reservations for a specific user"
    )
    def get(self, request, user_id, format=None):
        reservations = Reservation.objects.with_relations().filter(client__id=user_id)
        serializer = ReservationSerializer(reservations, many=True, context={'request': request})
        return Response(serializer.data)


# api view pour recuperer les reservations d'un vehicule
class VehicleReservationsAPIView(APIView):
    @swagger_auto_schema(
        operation_description="Retrieve reservations for a specific vehicle"
    )
    def get(self, request, vehicle_id, format=None):
        reservations = Reservation.objects.with_relations().filter(
            vehicle__id=vehicle_id
        )
        serializer = ReservationSerializer(reservations, many=True)
        return Response(serializer.data)


# api view pour recuperer les reservations par status
class StatusReservationsAPIView(APIView):
    @swagger_auto_schema(operation_description="Retrieve reservations by status")
    def get(self, request, status, format=None):
        reservations = Reservation.objects.with_relations().filter(status=status)
        serializer = ReservationSerializer(reservations, many=True)
        return Response(serializer.data)


# api view pour recuperer les reservations actives (PENDING, CONFIRMED, IN_PROGRESS)
class ActiveReservationsAPIView(APIView):
    @swagger_auto_schema(operation_description="Retrieve active reservations")
    def get(self, request, format=None):
        active_statuses = [
            Reservation.Status.PENDING,
            Reservation.Status.CONFIRMED,
            Reservation.Status.IN_PROGRESS,
        ]
        reservations = Reservation.objects.with_relations().filter(
            status__in=active_statuses
        )
        serializer = ReservationSerializer(reservations, many=True)
        return Response(serializer.data)


# api view pour recuperer les reservations terminees (COMPLETED, CANCELLED)
class CompletedReservationsAPIView(APIView):
    @swagger_auto_schema(operation_description="Retrieve completed reservations")
    def get(self, request, format=None):
        completed_statuses = [
            Reservation.Status.COMPLETED,
            Reservation.Status.CANCELLED,
        ]
        reservations = Reservation.objects.with_relations().filter(
            status__in=completed_statuses
        )
        serializer = ReservationSerializer(reservations, many=True)
        return Response(serializer.data)


# api view pour recuperer les reservations par date de creation
class DateRangeReservationsAPIView(APIView):
    @swagger_auto_schema(
        operation_description="Retrieve reservations within a date range"
    )
    def get(self, request, start_date, end_date, format=None):
        reservations = Reservation.objects.filter(
            created_at__date__gte=start_date, created_at__date__lte=end_date
        )
        serializer = ReservationSerializer(reservations, many=True)
        return Response(serializer.data)


# api view pour recuperer le nombre total de reservations
class TotalReservationsCountAPIView(APIView):
    @swagger_auto_schema(operation_description="Retrieve total count of reservations")
    def get(self, request, format=None):
        total_count = Reservation.objects.count()
        return Response({"total_reservations": total_count})


# api view pour recuperer le montant total des reservations
class TotalReservationsAmountAPIView(APIView):
    @swagger_auto_schema(
        operation_description="Retrieve total amount of all reservations"
    )
    def get(self, request, format=None):
        total_amount = (
            Reservation.objects.aggregate(Sum("total_amount"))["total_amount__sum"] or 0
        )
        return Response({"total_reservations_amount": total_amount})


class ReservationStatisticsAPIView(APIView):
    """Return aggregated reservation metrics for administrators."""

    permission_classes = [IsAdminUser]

    @swagger_auto_schema(
        operation_description="Retrieve aggregated reservation statistics for the admin dashboard"
    )
    def get(self, request, format=None):
        aggregates = Reservation.objects.aggregate(
            total_reservations=Count("id"),
            total_amount_sum=Coalesce(Sum("total_amount"), Value(Decimal("0"))),
        )

        status_counts = {choice[0]: 0 for choice in Reservation.Status.choices}
        for status_data in Reservation.objects.values("status").annotate(
            count=Count("id")
        ):
            status_counts[status_data["status"]] = status_data["count"]

        monthly_stats_qs = (
            Reservation.objects.annotate(month=TruncMonth("created_at"))
            .values("month")
            .annotate(count=Count("id"))
            .order_by("month")
        )
        monthly_stats = [
            {"month": entry["month"].strftime("%Y-%m"), "count": entry["count"]}
            for entry in monthly_stats_qs
            if entry["month"] is not None
        ]

        serializer = ReservationStatisticsSerializer(
            data={
                "total_reservations": aggregates["total_reservations"],
                "total_amount_sum": aggregates["total_amount_sum"],
                "by_status": status_counts,
                "reservations_per_month": monthly_stats,
            }
        )
        serializer.is_valid(raise_exception=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


# api view pour recuperer les reservations avec chauffeur
class ChauffeurReservationsAPIView(APIView):
    @swagger_auto_schema(operation_description="Retrieve reservations with chauffeur")
    def get(self, request, format=None):
        reservations = Reservation.objects.filter(with_chauffeur=True)
        serializer = ReservationSerializer(reservations, many=True)
        return Response(serializer.data)


# api view pour recuperer les reservations sans chauffeur
class WithoutChauffeurReservationsAPIView(APIView):
    @swagger_auto_schema(
        operation_description="Retrieve reservations without chauffeur"
    )
    def get(self, request, format=None):
        reservations = Reservation.objects.filter(with_chauffeur=False)
        serializer = ReservationSerializer(reservations, many=True)
        return Response(serializer.data)


# api view pour recuperer les reservations par lieu de prise en charge
class PickupLocationReservationsAPIView(APIView):
    @swagger_auto_schema(
        operation_description="Retrieve reservations by pickup location"
    )
    def get(self, request, pickup_location, format=None):
        reservations = Reservation.objects.with_relations().filter(
            pickup_location__icontains=pickup_location
        )
        serializer = ReservationSerializer(reservations, many=True)
        return Response(serializer.data)


# api view pour recuperer les reservations par lieu de retour
class DropoffLocationReservationsAPIView(APIView):
    @swagger_auto_schema(
        operation_description="Retrieve reservations by dropoff location"
    )
    def get(self, request, dropoff_location, format=None):
        reservations = Reservation.objects.with_relations().filter(
            dropoff_location__icontains=dropoff_location
        )
        serializer = ReservationSerializer(reservations, many=True)
        return Response(serializer.data)


# api view pour recuperer les reservations par montant total minimum
class MinTotalAmountReservationsAPIView(APIView):
    @swagger_auto_schema(
        operation_description="Retrieve reservations with minimum total amount"
    )
    def get(self, request, min_amount, format=None):
        reservations = Reservation.objects.with_relations().filter(
            total_amount__gte=min_amount
        )
        serializer = ReservationSerializer(reservations, many=True)
        return Response(serializer.data)


# api view pour recuperer les reservations par montant total maximum
class MaxTotalAmountReservationsAPIView(APIView):
    @swagger_auto_schema(
        operation_description="Retrieve reservations with maximum total amount"
    )
    def get(self, request, max_amount, format=None):
        reservations = Reservation.objects.with_relations().filter(
            total_amount__lte=max_amount
        )
        serializer = ReservationSerializer(reservations, many=True)
        return Response(serializer.data)


# api view pour recuperer les reservations par nombre de jours minimum
class MinTotalDaysReservationsAPIView(APIView):
    @swagger_auto_schema(
        operation_description="Retrieve reservations with minimum total days"
    )
    def get(self, request, min_days, format=None):
        reservations = Reservation.objects.with_relations().filter(
            total_days__gte=min_days
        )
        serializer = ReservationSerializer(reservations, many=True)
        return Response(serializer.data)


# api view ReservationService
class ReservationServiceViewSet(viewsets.ModelViewSet):
    queryset = ReservationService.objects.with_relations()
    serializer_class = ReservationServiceSerializer

    @swagger_auto_schema(
        operation_description="Retrieve a list of reservation services"
    )
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    @swagger_auto_schema(operation_description="Create a new reservation service")
    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)

    @swagger_auto_schema(operation_description="Retrieve a reservation service by ID")
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)

    @swagger_auto_schema(operation_description="Update a reservation service by ID")
    def update(self, request, *args, **kwargs):
        return super().update(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_description="Partially update a reservation service by ID"
    )
    def partial_update(self, request, *args, **kwargs):
        return super().partial_update(request, *args, **kwargs)

    @swagger_auto_schema(operation_description="Delete a reservation service by ID")
    def destroy(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)


# api view pour recupere ReservationService par reservation
class ReservationServiceByReservationAPIView(APIView):
    @swagger_auto_schema(
        operation_description="Retrieve reservation services for a specific reservation"
    )
    def get(self, request, reservation_id, format=None):
        services = ReservationService.objects.with_relations().filter(
            reservation__id=reservation_id
        )
        serializer = ReservationServiceSerializer(services, many=True)
        return Response(serializer.data)


# api view pour recupere ReservationService par type de service
class ReservationServiceByTypeAPIView(APIView):
    @swagger_auto_schema(
        operation_description="Retrieve reservation services by service type"
    )
    def get(self, request, service_type, format=None):
        services = ReservationService.objects.with_relations().filter(
            service_type=service_type
        )
        serializer = ReservationServiceSerializer(services, many=True)
        return Response(serializer.data)


# api view pour recupere ReservationService par nom de service
class ReservationServiceByNameAPIView(APIView):
    @swagger_auto_schema(
        operation_description="Retrieve reservation services by service name"
    )
    def get(self, request, service_name, format=None):
        services = ReservationService.objects.with_relations().filter(
            service_name__icontains=service_name
        )
        serializer = ReservationServiceSerializer(services, many=True)
        return Response(serializer.data)


# api view pour recupere ReservationService par fourchette de prix
class ReservationServiceByPriceRangeAPIView(APIView):
    @swagger_auto_schema(
        operation_description="Retrieve reservation services within a price range"
    )
    def get(self, request, min_price, max_price, format=None):
        services = ReservationService.objects.with_relations().filter(
            price__gte=min_price, price__lte=max_price
        )
        serializer = ReservationServiceSerializer(services, many=True)
        return Response(serializer.data)


# api view pour recupere ReservationService par quantite minimum
class ReservationServiceByMinQuantityAPIView(APIView):
    @swagger_auto_schema(
        operation_description="Retrieve reservation services with minimum quantity"
    )
    def get(self, request, min_quantity, format=None):
        services = ReservationService.objects.with_relations().filter(
            quantity__gte=min_quantity
        )
        serializer = ReservationServiceSerializer(services, many=True)
        return Response(serializer.data)


# api view pour recupere ReservationService par quantite maximum
class ReservationServiceByMaxQuantityAPIView(APIView):
    @swagger_auto_schema(
        operation_description="Retrieve reservation services with maximum quantity"
    )
    def get(self, request, max_quantity, format=None):
        services = ReservationService.objects.with_relations().filter(
            quantity__lte=max_quantity
        )
        serializer = ReservationServiceSerializer(services, many=True)
        return Response(serializer.data)


class DailyIncomeAPIView(APIView):
    """Return the daily income aggregated from reservations' total amounts."""

    permission_classes = [IsAdminUser]

    @swagger_auto_schema(
        operation_description="Retrieve daily income based on reservation totals"
    )
    def get(self, request, format=None):
        daily_income_qs = (
            Reservation.objects.annotate(date=TruncDate("created_at"))
            .values("date")
            .annotate(total_income=Coalesce(Sum("total_amount"), Value(Decimal("0"))))
            .order_by("date")
        )
        serializer = DailyIncomeSerializer(daily_income_qs, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class ReservationStatsViewSet(viewsets.ViewSet):

    # 📊 1) Stats du jour (24h)

    @action(detail=False, methods=["get"])
    def day(self, request):
        today = now().date()

        data = (
            Reservation.objects.filter(created_at__date=today)
            .extra(select={"hour": "EXTRACT(HOUR FROM created_at)"})
            .values("hour")
            .annotate(total=Count("id"))
            .order_by("hour")
        )

        # Format pour Recharts
        graph = [{"hour": int(d["hour"]), "total": d["total"]} for d in data]

        return Response(graph)

    # 📊 2) Stats de la semaine
    @action(detail=False, methods=["get"])
    def week(self, request):
        today = now().date()
        start_week = today - timedelta(days=today.weekday())

        data = (
            Reservation.objects.filter(created_at__date__gte=start_week)
            .extra(select={"day": "TO_CHAR(created_at, 'Day')"})
            .values("day")
            .annotate(total=Count("id"))
            .order_by("day")
        )

        graph = [{"day": d["day"].strip(), "total": d["total"]} for d in data]

        return Response(graph)

    # 📊 3) Stats du mois
    @action(detail=False, methods=["get"])
    def month(self, request):
        today = now().date()

        data = (
            Reservation.objects.filter(created_at__month=today.month)
            .extra(select={"day": "EXTRACT(DAY FROM created_at)"})
            .values("day")
            .annotate(total=Count("id"))
            .order_by("day")
        )

        graph = [{"day": int(d["day"]), "total": d["total"]} for d in data]

        return Response(graph)


class OwnerVehicleReservationsAPIView(APIView):
    """
    Récupère toutes les réservations faites par des clients
    sur les véhicules appartenant à un propriétaire (prestataire).
    """

    @swagger_auto_schema(
        operation_description=(
            "Récupère les réservations des clients qui ont réservé "
            "un véhicule appartenant à cet utilisateur (propriétaire)."
        ),
        responses={200: ReservationSerializer(many=True)},
    )
    def get(self, request, owner_id):
        # Vérifier que l’utilisateur existe
        owner = get_object_or_404(User, id=owner_id)

        # Chercher tous les véhicules de l'utilisateur
        vehicles = Vehicule.objects.filter(proprietaire=owner)

        # Récupérer toutes les réservations sur ces véhicules
        reservations = Reservation.objects.with_relations().filter(vehicle__in=vehicles)

        serializer = ReservationSerializer(
            reservations, many=True, context={"request": request}
        )

        return Response(serializer.data, status=status.HTTP_200_OK)


# methode de payment de resrvation send in email et phone
#  Vue qui affiche la template
def reservation_payment_page(request, reservation_id, payment_id):
    user = authenticate_request(request)
    if not user:
        return render(request, "403.html", status=403)

    reservation = get_object_or_404(Reservation, id=reservation_id)
    payment_mode = get_object_or_404(ModePayment, id=payment_id)

    # Sécurité : seul le client, le prestataire propriétaire ou staff peut voir la page
    if not user_can_pay_reservation(user, reservation):
        return render(request, "403.html", status=403)

    # Récupérer les paramètres de l’URL
    payment_ref = request.GET.get("ref")
    payment_token = request.GET.get("paytok")
     # 🔥 NOUVEAU : récupérer le JWT token dans l’URL
    jwt_token = request.GET.get("token")

    return render(
        request,
        "ReservationPaymentPage.html",
        {
            "reservation": reservation,
            "payment_modes": [payment_mode],  # 🔥 IMPORTANT : liste pour le template
            "hidden_payment_id": str(payment_mode.id),  # 🔥 IMPORTANT : liste pour le template
            "hidden_reservation_id": str(reservation.id),
            "payment_reference": payment_ref,
            "payment_token": payment_token,
            "jwt_token": jwt_token,
        },
    )



# Vue qui reçoit le POST du formulaire (multipart/form-data)
def submit_reservation_payment(request):

    # 1. 🔐 Récupération du token transmis par le formulaire
    token = request.POST.get("auth_token")

    if token:
        request.META["HTTP_AUTHORIZATION"] = f"Bearer {token}"

    user = authenticate_request(request)
    if not user:
        print("=====Authentification invalide========================")
        return render(request, "payment_error.html", {"message": "Authentification invalide"}, status=403)

    if request.method != "POST":
        return redirect("/")

    # 2. Charger les données du POST
    form = ReservationPaymentForm(request.POST, request.FILES)

    reservation_id = request.POST.get("reservation")
    payment_id = request.POST.get("payment_id")  # 🔥 Nouveau !
    payment_mode = get_object_or_404(ModePayment, id=payment_id)

    # reservation = get_object_or_404(Reservation, id=reservation_id)
    reservation = get_object_or_404(
        Reservation.objects.select_related("client", "vehicle"),
        id=reservation_id
    )

    # 3. 🔐 Sécurité utilisateur
    if not user_can_pay_reservation(user, reservation):
        return render(request, "payment_error.html", {"message": "Accès non autorisé"}, status=403)

    # 4. Validation
    if form.is_valid():

        # Vérifier si un paiement existe déjà
        if hasattr(reservation, "payment"):
            return render(request, "payment_error.html", {
                "message": "Un paiement est déjà enregistré pour cette réservation."
            })

        # 5. Créer le paiement
        payment = form.save(commit=False)
        payment.reservation = reservation
        payment.mode = payment_mode
        payment.status = ReservationPayment.PaymentStatus.PENDING
        payment.save()
        
        # redirection
        

        context = {
        "reservation": reservation,
        "payment": payment,
        }

        return render(request, "booking_detail.html", context)

    # → Si formulaire invalide ou erreur image
    return render(request, "payment_error.html", {
        "message": "Le formulaire contient des erreurs.",
        "errors": form.errors,
    })




@api_view(["POST"])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def send_link_payment(request):
    methode_id = request.data.get("methode_payment")
    reservation_id = request.data.get("reservation_id")

    methode_payment = get_object_or_404(ModePayment, id=methode_id)
    reservation = get_object_or_404(Reservation, id=reservation_id)

    if not user_can_pay_reservation(request.user, reservation):
        return Response({"detail": "Non autorisé"}, status=403)

    # Token JWT utilisé dans le lien
    token = str(request.auth)

    # Génération automatique d'une référence de paiement
    ref_prefix = methode_payment.operateur[:4].upper()
    payment_reference = f"REF-{ref_prefix}-{get_random_string(8).upper()}"

    # URL de paiement
    payment_url = request.build_absolute_uri(
        f"/api/bookings/{reservation.id}/and/{methode_payment.id}/payment/?token={token}&ref={payment_reference}"
    )

    # Préparation email HTML
    email_context = {
        "client_name": reservation.client.first_name or reservation.client.email,
        "payment_url": payment_url,
        "payment_mode_name": methode_payment.name,
        "payment_mode_number": methode_payment.numero,
        "payment_reference": payment_reference,
        "payment_id": methode_payment.id,
        
    }


    html_message = render_to_string("payment_link_email.html", email_context)

    subject = "Lien de confirmation de paiement"
    recipient = reservation.client.email

    try:
        send_email_notification(html_message, recipient, subject, is_html=True)
    except Exception as e:
        return Response({"detail": "Erreur envoi e-mail", "error": str(e)}, status=500)
    
    # sms
    try:
        message = f"Bonjour {reservation.client.first_name}, veuillez confirmer votre paiement de la réservation {reservation.reference} via ce lien : {payment_url}"
        # phone number
        full_phone = reservation.client.phone
        phone_client = ""
        if full_phone:
            if full_phone.startswith('+261'):
                phone_client = full_phone.replace('+261', '', 1)
            else:
                phone_client = full_phone.lstrip('+')
        # send sms
        send_sms_befiana(phone_client, message)
    except Exception as e:
        return Response({"detail": "Erreur envoi sms", "error": str(e)}, status=500)

    return Response({"detail": "Lien envoyé avec succès"})


# def booking_detail(request, reservation_id):
#     # 🔥 Authentification via token ou session
#     user = authenticate_request(request)
#     if not user:
#         return HttpResponseForbidden("Accès refusé")

#     reservation = get_object_or_404(
#         Reservation.objects.select_related("client", "vehicle"),
#         id=reservation_id
#     )

#     # 🔥 Sécurité : seul le client propriétaire ou staff peut accéder
#     if not user.is_staff and reservation.client_id != user.id:
#         return HttpResponseForbidden("Accès non autorisé")

#     # Paiement associé, si existant
#     payment = getattr(reservation, "payment", None)

#     context = {
#         "reservation": reservation,
#         "payment": payment,
#     }

#     return render(request, "booking_detail.html", context)
