# serializers.py
from rest_framework import serializers
from rest_framework.exceptions import ValidationError
import uuid
from typing import Optional

from .models import Reservation, ReservationService,ReservationPayment, ReservationPricingConfig
from users.serializers import UserProfileSerializer
from vehicule.serializers import VehiculeSerializer, VehicleEquipmentsSerializer
from modepayment.models import ModePayment
from modepayment.serializers import ModePaymentSerializer
from users.models import User
from driver.models import Driver
from driver.serializers import DriverReadSerializer

class ReservationPaymentSerializer(serializers.ModelSerializer):
    
     # accepter l'UUID de la reservation et l'id du mode de paiement depuis le frontend
    reservation = serializers.PrimaryKeyRelatedField(
        queryset=Reservation.objects.all()
    )
    mode = serializers.PrimaryKeyRelatedField(
        queryset=ModePayment.objects.all(), allow_null=True, required=False
    )
    processed_by = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(), required=False, allow_null=True
    )
    
    # Add nested mode data for reading
    mode_data = ModePaymentSerializer(source='mode', read_only=True)
    
    class Meta:
        model = ReservationPayment
        fields = "__all__"
        read_only_fields = ("id", "created_at", "updated_at")

    def validate_reservation(self, value: Reservation):
        # Vérifier qu'il n'y a pas déjà un paiement lié (OneToOne)
        if hasattr(value, "payment"):
            raise serializers.ValidationError("Cette réservation a déjà un enregistrement de paiement.")
        return value

    def create(self, validated_data):
        # On ne set pas processed_by automatiquement ici (sera fait par staff via update)
        return super().create(validated_data)



class ReservationSerializer(serializers.ModelSerializer):
    client = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(), required=False, allow_null=True
    )
    client_data = UserProfileSerializer(source="client", read_only=True)
    vehicle_data = VehiculeSerializer(source="vehicle", read_only=True)
    payment = ReservationPaymentSerializer(read_only=True)
    
    driver = serializers.PrimaryKeyRelatedField(
        queryset=Driver.objects.all(), required=False, allow_null=True
    )
    # Add nested driver data for reading
    driver_data = DriverReadSerializer(source='driver', read_only=True)
    
    # Add nested equipments data for reading
    equipments_data = VehicleEquipmentsSerializer(source='equipments', many=True, read_only=True)
    
    # Add nested services data for reading
    services_data = serializers.SerializerMethodField()
    
    # [NEW] Fields for input
    driving_mode = serializers.ChoiceField(choices=Reservation.DrivingMode.choices, required=False)
    pricing_zone = serializers.ChoiceField(choices=Reservation.PricingZone.choices, required=False)
    guest_email = serializers.EmailField(write_only=True, required=False, allow_blank=True)
    guest_phone = serializers.CharField(write_only=True, required=False, allow_blank=True)
    guest_first_name = serializers.CharField(write_only=True, required=False, allow_blank=True)
    guest_last_name = serializers.CharField(write_only=True, required=False, allow_blank=True)

    class Meta:
        model = Reservation
        fields = "__all__"
        read_only_fields = (
            "id", "reference", "created_at", "updated_at", 
            "base_amount", "options_amount", "total_amount", "driver_source", "driver"
        ) # Make amounts and driver read-only to prevent client tampering
    
    def get_services_data(self, obj):
        """Get all services related to this reservation."""
        services = obj.services.all()
        return ReservationServiceSerializer(services, many=True).data

    def validate(self, attrs):
        if self.instance is None:
            has_client = attrs.get("client") is not None
            has_guest = any(
                attrs.get(field)
                for field in ("guest_email", "guest_phone", "guest_first_name", "guest_last_name")
            )
            if not has_client and not has_guest:
                raise ValidationError(
                    {"client": "Un client existant ou des informations invité sont requis."}
                )

        vehicle = attrs.get("vehicle") or getattr(self.instance, "vehicle", None)
        start_datetime = attrs.get("start_datetime") or getattr(self.instance, "start_datetime", None)
        end_datetime = attrs.get("end_datetime") or getattr(self.instance, "end_datetime", None)

        if vehicle and start_datetime and end_datetime:
            overlapping_reservations = Reservation.objects.filter(
                vehicle=vehicle,
                status__in=[
                    Reservation.Status.PENDING,
                    Reservation.Status.CONFIRMED,
                    Reservation.Status.IN_PROGRESS,
                ],
                start_datetime__lt=end_datetime,
                end_datetime__gt=start_datetime,
            )
            if self.instance:
                overlapping_reservations = overlapping_reservations.exclude(id=self.instance.id)

            if overlapping_reservations.exists():
                raise ValidationError(
                    {"start_datetime": "Ce véhicule est déjà réservé sur ces dates."}
                )

        return attrs

    def _get_or_create_guest_client(
        self,
        guest_email: Optional[str],
        guest_phone: Optional[str],
        guest_first_name: Optional[str],
        guest_last_name: Optional[str],
    ) -> User:
        normalized_email = guest_email.strip() if guest_email else ""
        normalized_phone = guest_phone.strip() if guest_phone else ""

        user = None
        if normalized_email:
            user = User.objects.filter(email__iexact=normalized_email).first()
        if not user and normalized_phone:
            user = User.objects.filter(phone=normalized_phone).first()

        if user:
            return user

        email = normalized_email or f"guest-{uuid.uuid4()}@guest.local"
        password = User.objects.make_random_password()
        return User.objects.create_user(
            email=email,
            password=password,
            first_name=guest_first_name or "",
            last_name=guest_last_name or "",
            phone=normalized_phone or None,
            role="CLIENT",
            email_verified=True,
        )

    def create(self, validated_data):
        from .pricing_service import PricingService
        
        # 1. Extract non-model data or handle defaults
        driving_mode = validated_data.get('driving_mode', Reservation.DrivingMode.SELF_DRIVE)
        pricing_zone = validated_data.get('pricing_zone', Reservation.PricingZone.URBAIN)
        
        guest_email = validated_data.pop("guest_email", None)
        guest_phone = validated_data.pop("guest_phone", None)
        guest_first_name = validated_data.pop("guest_first_name", None)
        guest_last_name = validated_data.pop("guest_last_name", None)

        if not validated_data.get("client"):
            validated_data["client"] = self._get_or_create_guest_client(
                guest_email=guest_email,
                guest_phone=guest_phone,
                guest_first_name=guest_first_name,
                guest_last_name=guest_last_name,
            )

        vehicle = validated_data['vehicle']
        start_datetime = validated_data['start_datetime']
        end_datetime = validated_data['end_datetime']

        # 2. Determine Driver Source & Assign Driver
        driver_source = Reservation.DriverSource.NONE
        assigned_driver = None
        with_chauffeur = False

        if driving_mode == Reservation.DrivingMode.WITH_DRIVER:
            with_chauffeur = True
            if vehicle.driver:
                # Driver Provided by Owner
                driver_source = Reservation.DriverSource.PROVIDER
                assigned_driver = vehicle.driver
            else:
                # Driver from Admin Pool
                driver_source = Reservation.DriverSource.ADMIN_POOL
                assigned_driver = None # Will be assigned by admin later

        # 3. Calculate Pricing
        pricing_result = PricingService.calculate_amounts(
            vehicle=vehicle,
            start_datetime=start_datetime,
            end_datetime=end_datetime,
            pricing_zone=pricing_zone,
            driving_mode=driving_mode,
            driver_source=driver_source
        )

        # 4. Override validated_data
        validated_data['driver'] = assigned_driver
        validated_data['driver_source'] = driver_source
        validated_data['driving_mode'] = driving_mode
        validated_data['pricing_zone'] = pricing_zone
        validated_data['with_chauffeur'] = with_chauffeur
        
        validated_data['base_amount'] = pricing_result['base_amount']
        # For now, we overwrite options_amount, but ideally we should add to it if other options exist
        # But since we don't have other options input yet, this is safe. 
        # Actually, let's just properly set amounts.
        # Note: driver_amount is usually part of 'options_amount' or separate service.
        # If we want to store it in options_amount:
        validated_data['options_amount'] = pricing_result['driver_amount'] 
        validated_data['total_amount'] = pricing_result['total_amount']
        
        # 5. Create Reservation
        reservation = super().create(validated_data)

        # 6. Create Driver Service Line if applicable
        if pricing_result['driver_amount'] > 0:
            ReservationService.objects.create(
                reservation=reservation,
                service_type=ReservationService.ServiceType.CHAUFFEUR,
                service_name="Chauffeur Pro",
                price=pricing_result['driver_amount'] / pricing_result['days'], # Store daily or total? Model says 'price'. Usually unit price.
                quantity=pricing_result['days']
            )

        return reservation



class ReservationServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReservationService
        fields = "__all__"


class ReservationPricingConfigSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReservationPricingConfig
        fields = ["service_fee", "created_at", "updated_at"]
        read_only_fields = ["created_at", "updated_at"]


class MonthlyReservationStatisticSerializer(serializers.Serializer):
    """Serialize monthly reservation counts."""

    month = serializers.CharField()
    count = serializers.IntegerField()


class ReservationStatisticsSerializer(serializers.Serializer):
    """Serialize aggregated reservation statistics for admin reporting."""

    total_reservations = serializers.IntegerField()
    total_amount_sum = serializers.DecimalField(max_digits=12, decimal_places=2)
    by_status = serializers.DictField(child=serializers.IntegerField())
    reservations_per_month = MonthlyReservationStatisticSerializer(many=True)


class DailyIncomeSerializer(serializers.Serializer):
    """Serialize daily income aggregates based on reservation total amounts."""

    date = serializers.DateField()
    total_income = serializers.DecimalField(max_digits=12, decimal_places=2)

