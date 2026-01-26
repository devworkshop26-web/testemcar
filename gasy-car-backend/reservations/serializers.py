# serializers.py
from rest_framework import serializers

from .models import Reservation, ReservationService,ReservationPayment
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

    def create(self, validated_data):
        from .pricing_service import PricingService
        
        # 1. Extract non-model data or handle defaults
        driving_mode = validated_data.get('driving_mode', Reservation.DrivingMode.SELF_DRIVE)
        pricing_zone = validated_data.get('pricing_zone', Reservation.PricingZone.URBAIN)
        
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

