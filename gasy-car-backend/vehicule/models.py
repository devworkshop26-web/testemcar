import uuid
from django.db import models
from users.models import User


class Marque(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    nom = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.nom


class Category(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    nom = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    parent = models.ForeignKey(
        "self",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="sous_categories",
        verbose_name="Catégorie parente",
    )

    class Meta:
        verbose_name = "Catégorie de véhicule"
        verbose_name_plural = "Catégories de véhicules"
        ordering = ["nom"]


class Transmission(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    nom = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.nom


class FuelType(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    nom = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.nom


class StatusVehicule(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    nom = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.nom


class VehicleEquipments(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    code = models.CharField(max_length=50, unique=True)
    label = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True, verbose_name="Prix par jour (Ar)")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.label


class ModeleVehicule(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    label = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.label


class Vehicule(models.Model):

    class VehiculeType(models.TextChoices):
        TOURISME = "TOURISME", "Véhicule de tourisme"
        UTILITAIRE = "UTILITAIRE", "Véhicule utilitaire"



    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    proprietaire = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="vehicules",
        verbose_name="Propriétaire",
    )
    
    driver = models.ForeignKey(
        "driver.Driver",
        on_delete=models.SET_NULL,
        related_name="assigned_vehicles",
        verbose_name="Chauffeur attitré",
        null=True,
        blank=True,
    )

    # Identité
    titre = models.CharField("Titre d'annonce", max_length=255, db_index=True)
    marque = models.ForeignKey(
        Marque,
        on_delete=models.SET_NULL,
        related_name="vehicules",
        verbose_name="Marque",
        null=True,
        blank=True,
    )
    modele = models.ForeignKey(
        ModeleVehicule,
        on_delete=models.SET_NULL,
        related_name="vehicules",
        verbose_name="Modèle",
        null=True,
        blank=True,
    )
    annee = models.PositiveIntegerField("Année")
    numero_immatriculation = models.CharField(
        "Numéro d'immatriculation", max_length=50, blank=True
    )
    numero_serie = models.CharField("Numéro de série (VIN)", max_length=100, blank=True)

    # Catégorie / type
    categorie = models.ForeignKey(
        Category,
        on_delete=models.SET_NULL,
        related_name="vehicules",
        verbose_name="Catégorie",
        null=True,
        blank=True,
    )
    transmission = models.ForeignKey(
        Transmission,
        on_delete=models.SET_NULL,
        related_name="vehicules",
        verbose_name="Boîte de vitesse",
        null=True,
        blank=True,
    )
    type_carburant = models.ForeignKey(
        FuelType,
        on_delete=models.SET_NULL,
        related_name="vehicules",
        verbose_name="Type de carburant",
        null=True,
        blank=True,
    )
    statut = models.ForeignKey(  # ✅ UN SEUL CHAMP STATUT
        StatusVehicule,
        on_delete=models.SET_NULL,
        related_name="vehicules",
        verbose_name="Statut",
        null=True,
        blank=True,
       
    )

    type_vehicule = models.CharField(
        "Type de véhicule",
        max_length=20,
        choices=VehiculeType.choices,
        default=VehiculeType.TOURISME,
        db_index=True,
    )

    # Caractéristiques principales
    nombre_places = models.PositiveIntegerField("Nombre de places", default=5)
    nombre_portes = models.PositiveIntegerField("Nombre de portes", default=4)
    couleur = models.CharField(max_length=50, blank=True)
    kilometrage_actuel_km = models.PositiveIntegerField(
        "Kilométrage actuel (km)", default=0
    )
    volume_coffre_litres = models.PositiveIntegerField(
        "Volume du coffre (L)", blank=True, null=True
    )
    # Localisation
    adresse_localisation = models.TextField("Adresse de localisation")
    ville = models.CharField(max_length=100, blank=True, db_index=True)
    zone = models.CharField(max_length=100, blank=True, help_text="Zone / quartier")

    # Tarification
    devise = models.CharField(max_length=10, default="MGA")
    montant_caution = models.DecimalField(
        "Montant de la caution", max_digits=10, decimal_places=2
    )


    # Statut & qualité
    est_certifie = models.BooleanField("Véhicule certifié", default=False)
    est_sponsorise = models.BooleanField("Véhicule sponsorisé", default=False, db_index=True)
    est_coup_de_coeur = models.BooleanField("Véhicule coup de cœur", default=False, db_index=True)
    est_disponible = models.BooleanField("Disponible à la location", default=True, db_index=True)

    # Réputation
    note_moyenne = models.DecimalField(
        "Note moyenne",
        max_digits=4,
        decimal_places=2,
        null=True,
        blank=True,
    )
    nombre_locations = models.PositiveIntegerField("Nombre de locations", default=0)
    nombre_favoris = models.PositiveIntegerField(
        "Nombre d'ajouts en favoris", default=0
    )

    # Texte
    description = models.TextField(blank=True)
    conditions_particulieres = models.TextField("Conditions particulières", blank=True)
    # 🔥 Ajout important → plusieurs équipements
    equipements = models.ManyToManyField(
        VehicleEquipments, related_name="vehicules", blank=True
    )
    valide = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        if self.marque and self.modele:
            return f"{self.marque.nom} {self.modele.label} ({self.annee}) - {self.proprietaire}"
        return f"{self.titre} - {self.proprietaire}"



class VehicleConditionReport(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    vehicle = models.OneToOneField(
        Vehicule,
        on_delete=models.CASCADE,
        related_name="condition_report",
        verbose_name="Rapport d'état des lieux",
    )
    created_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="vehicle_condition_reports",
    )
    view_notes = models.JSONField(default=dict, blank=True)
    saved_view_timestamps = models.JSONField(default=dict, blank=True)
    points = models.JSONField(default=list, blank=True)
    custom_photos_by_view = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Rapport d'état véhicule"
        verbose_name_plural = "Rapports d'état véhicules"

    def __str__(self):
        return f"Rapport état - {self.vehicle.titre}"


class VehiclePricing(models.Model):
    class ZoneType(models.TextChoices):
        URBAIN = "URBAIN", "Zone Urbaine"
        PROVINCE = "PROVINCE", "Province / Hors-ville"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    vehicle = models.ForeignKey(
        Vehicule,
        on_delete=models.CASCADE,
        related_name="pricing_grid",
        verbose_name="Véhicule"
    )
    zone_type = models.CharField(
        max_length=20,
        choices=ZoneType.choices,
        default=ZoneType.URBAIN
    )

    # Tarification spécifique
    prix_jour = models.DecimalField("Prix par jour", max_digits=10, decimal_places=2)
    prix_heure = models.DecimalField(
        "Prix par heure",
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True,
    )
    prix_mois = models.DecimalField(
        "Prix par mois",
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True,
    )
    prix_par_semaine = models.DecimalField(
        "Prix par semaine",
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True,
    )
    
    # Remises
    remise_par_heure = models.DecimalField(
        "Remise par heure (%)",
        max_digits=5,
        decimal_places=2,
        null=True,
        blank=True,
    )
    remise_par_jour = models.DecimalField(
        "Remise par jour (%)",
        max_digits=5,
        decimal_places=2,
        null=True,
        blank=True,
    )
    remise_par_mois = models.DecimalField(
        "Remise par mois (%)",
        max_digits=5,
        decimal_places=2,
        null=True,
        blank=True,
    )
    remise_longue_duree_pourcent = models.DecimalField(
        "Remise longue durée (%)",
        max_digits=5,
        decimal_places=2,
        null=True,
        blank=True,
        help_text="Exemple : 10.00 = -10% pour les longues durées",
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Grille Tarifaire"
        verbose_name_plural = "Grilles Tarifaires"
        unique_together = ("vehicle", "zone_type")  # Un tarif par zone par véhicule

    def __str__(self):
        return f"{self.vehicle} - {self.zone_type} - {self.prix_jour}"


class VehiclePhoto(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    vehicle = models.ForeignKey(
        Vehicule, on_delete=models.CASCADE, related_name="photos"
    )
    image = models.ImageField(upload_to="vehicles/photos/")
    is_primary = models.BooleanField(default=False)
    caption = models.CharField(max_length=255, blank=True)
    order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Photo {self.vehicle} ({self.id})"


class VehicleAvailability(models.Model):
    class AvailabilityType(models.TextChoices):
        AVAILABLE = "AVAILABLE", "Disponible"  # rarement utilisé
        BLOCKED = "BLOCKED", "Indisponible manuelle"
        MAINTENANCE = "MAINTENANCE", "Maintenance / Réparation"
        RESERVED = "RESERVED", "Réservé automatiquement"

  
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    vehicle = models.ForeignKey(
        "Vehicule",
        on_delete=models.CASCADE,
        related_name="availabilities"
    )

    start_date = models.DateField()
    end_date = models.DateField()

    type = models.CharField(
        max_length=20,
        choices=AvailabilityType.choices,
        default=AvailabilityType.BLOCKED,
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    description = models.TextField(blank=True, null=True)

    class Meta:
        verbose_name = "Disponibilité véhicule"
        verbose_name_plural = "Disponibilités véhicule"
        ordering = ["start_date"]

    def __str__(self):
        return f"{self.vehicle} - {self.type} du {self.start_date} au {self.end_date}"

    # ❗ Empêche les chevauchements
    def clean(self):
        from django.core.exceptions import ValidationError
        if self.end_date < self.start_date:
            raise ValidationError("La date de fin doit être supérieure à la date de début.")

        overlapping = VehicleAvailability.objects.filter(
            vehicle=self.vehicle,
            start_date__lte=self.end_date,
            end_date__gte=self.start_date,
        ).exclude(id=self.id)

        if overlapping.exists():
            raise ValidationError("Il existe déjà une période de disponibilité pour ces dates.")

    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)



def vehicle_doc_upload_path(instance, filename):
    # Ex: vehicles/docs/<vehicle_id>/carte_grise/monfichier.pdf
    return f"vehicles/docs/{instance.vehicle_id}/{filename}"

class VehicleDocuments(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    vehicle = models.ForeignKey(
        Vehicule, on_delete=models.CASCADE, related_name="documents"
    )
    carte_grise = models.FileField(upload_to=vehicle_doc_upload_path, null=True, blank=True)
    visite_technique = models.FileField(upload_to=vehicle_doc_upload_path, null=True, blank=True)
    assurance = models.FileField(upload_to=vehicle_doc_upload_path, null=True, blank=True)
    is_valide = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Documents {self.vehicle} ({self.id})"
