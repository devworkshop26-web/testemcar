from decimal import Decimal
from django.utils import timezone
from vehicule.models import Vehicule, VehiclePricing
from reservations.models import Reservation

class PricingService:
    @staticmethod
    def calculate_amounts(
        vehicle: Vehicule,
        start_datetime,
        end_datetime,
        pricing_zone=Reservation.PricingZone.URBAIN,
        driving_mode=Reservation.DrivingMode.SELF_DRIVE,
        driver_source=Reservation.DriverSource.NONE
    ):
        """
        Calcule le montant de base, le montant chauffeur, et le total.
        Retourne un dict: {
            'base_amount': Decimal,
            'driver_amount': Decimal,
            'total_amount': Decimal,
            'days': int
        }
        """
        # 1. Calcul durée
        duration = end_datetime - start_datetime
        days = max(1, duration.days + (1 if duration.seconds > 0 else 0)) # Au moins 1 jour

        # 2. Trouver la grille tarifaire
        # 2. Trouver la grille tarifaire
        try:
            pricing = vehicle.pricing_grid.get(zone_type=pricing_zone)
            daily_rate = pricing.prix_jour
            # TODO: Apply discounts (remise_longue_duree_pourcent, etc.) here if logic requires it
            # For now, base calculation relies on daily_rate.
        except VehiclePricing.DoesNotExist:
             # If no pricing found for this zone, fail hard or default to another zone?
             # For now, let's assume URBAIN exists or fail.
             # Ideally we should log this.
             try:
                 pricing = vehicle.pricing_grid.get(zone_type=Reservation.PricingZone.URBAIN)
                 daily_rate = pricing.prix_jour
             except VehiclePricing.DoesNotExist:
                 daily_rate = Decimal("0.00") # Should act as blocking


        # 3. Calcul Base Amount
        base_amount = daily_rate * days

        # 4. Calcul Driver Amount
        driver_amount = Decimal("0.00")
        if driving_mode == Reservation.DrivingMode.WITH_DRIVER:
            # TODO: Remplacer par une vraie conf en DB ou Constante
            # Exemple: Prix chauffeur standard = 40 000 Ar / jour
            DRIVER_DAILY_RATE = Decimal("40000.00") 
            
            if driver_source == Reservation.DriverSource.ADMIN_POOL:
                 # Majoration pour pool admin ?
                 DRIVER_DAILY_RATE = Decimal("50000.00")
            
            driver_amount = DRIVER_DAILY_RATE * days

        return {
            "days": days,
            "base_amount": base_amount,
            "driver_amount": driver_amount,
            "total_amount": base_amount + driver_amount
        }
