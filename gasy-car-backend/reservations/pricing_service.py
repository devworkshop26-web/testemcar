from decimal import Decimal

from vehicule.models import Vehicule
from reservations.models import Reservation, ReservationPricingConfig


class PricingService:
    @staticmethod
    def calculate_amounts(
        vehicle: Vehicule,
        start_datetime,
        end_datetime,
        pricing_zone=Reservation.PricingZone.URBAIN,
        driving_mode=Reservation.DrivingMode.SELF_DRIVE,
        driver_source=Reservation.DriverSource.NONE,
        equipments=None,
    ):
        equipments = equipments or []

        if end_datetime <= start_datetime:
            raise ValueError("La date de fin doit être supérieure à la date de début.")

        duration = end_datetime - start_datetime
        days = max(1, duration.days + (1 if duration.seconds > 0 else 0))

        pricing = vehicle.pricing_grid.filter(zone_type=pricing_zone).first()
        if not pricing:
            pricing = vehicle.pricing_grid.filter(
                zone_type=Reservation.PricingZone.URBAIN
            ).first()

        if not pricing or pricing.prix_jour is None:
            raise ValueError(
                "Aucune grille tarifaire valide n'est configurée pour ce véhicule."
            )

        daily_rate = pricing.prix_jour

        if days >= 30 and pricing.remise_longue_duree_pourcent:
            discount = pricing.remise_longue_duree_pourcent / Decimal("100")
            daily_rate = daily_rate * (Decimal("1.00") - discount)

        base_amount = daily_rate * days

        driver_amount = Decimal("0.00")
        driver_unit_amount = Decimal("0.00")
        if driving_mode == Reservation.DrivingMode.WITH_DRIVER:
            driver_unit_amount = Decimal("40000.00")
            if driver_source == Reservation.DriverSource.ADMIN_POOL:
                driver_unit_amount = Decimal("50000.00")
            driver_amount = driver_unit_amount * days

        equipment_amount = sum(
            (Decimal(eq.price or 0) * days for eq in equipments),
            Decimal("0.00"),
        )

        service_fee = ReservationPricingConfig.get_solo().service_fee
        options_amount = driver_amount + equipment_amount
        total_amount = base_amount + options_amount + service_fee

        return {
            "days": days,
            "base_amount": base_amount,
            "driver_amount": driver_amount,
            "driver_unit_amount": driver_unit_amount,
            "equipment_amount": equipment_amount,
            "options_amount": options_amount,
            "service_fee": service_fee,
            "total_amount": total_amount,
        }