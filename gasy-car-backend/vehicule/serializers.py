import json
import ast
from users.serializers import UserProfileSerializer
from rest_framework import serializers
from django.db import transaction

# models
from .models import (
    Marque,
    Category,
    Transmission,
    FuelType,
    StatusVehicule,
    ModeleVehicule,
    Vehicule,
    VehiclePhoto,
    VehicleEquipments,
    VehicleAvailability,
    VehiclePricing,
    VehicleDocuments,
    VehicleConditionReport,
)
from driver.models import Driver
from driver.serializers import DriverReadSerializer
from gasycar.utils import delete_file


class FormDataListField(serializers.ListField):
    """
    Custom ListField that supports retrieving lists from FormData (QueryDict)
    via `getlist`. Also attempts to parse JSON-stringified lists if a single string is received.
    """
    def get_value(self, dictionary):
        if hasattr(dictionary, "getlist"):
            vals = dictionary.getlist(self.field_name)
            # Handle case where list is sent as a single JSON string (e.g. "['id1', 'id2']")
            if len(vals) == 1 and isinstance(vals[0], str):
                s = vals[0].strip()
                try:
                    return json.loads(s)
                except json.JSONDecodeError:
                    pass
                try:
                     if s.startswith('[') and s.endswith(']'):
                         return ast.literal_eval(s)
                except:
                    pass
            return vals
        return super().get_value(dictionary)

class MultiFileField(FormDataListField):
    """
    Supporte FormData: formData.append("new_photos", file) plusieurs fois
    """
    child = serializers.ImageField()


class VehicleDocumentsSerializer(serializers.ModelSerializer):
    class Meta:
        model = VehicleDocuments
        fields = "__all__"

class VehiclePhotoSerializer(serializers.ModelSerializer):
    class Meta:
        model = VehiclePhoto
        fields = ["id", "image", "caption", "order", "is_primary"]


# ============================================================
# 🔒 SERIALIZER ÉDITION (INFOS UNIQUEMENT — PHOTOS IGNORÉES)
# ============================================================
class VehiculeEditSerializer(serializers.ModelSerializer):
    photos = VehiclePhotoSerializer(many=True, read_only=True)

    # ✅ champs attendus depuis le frontend
    existing_photos = serializers.ListField(
        child=serializers.CharField(),  # id uuid/string
        required=False,
        write_only=True
    )
    new_photos = MultiFileField(required=False, write_only=True)

    class Meta:
        model = Vehicule
        # ⚠️ adapte si ton serializer a plus/moins de champs
        fields = "__all__"

    def validate(self, attrs):
        # 🔒 EN MODE ÉDITION : ON IGNORE TOTALEMENT LES PHOTOS
        attrs.pop("existing_photos", None)
        attrs.pop("new_photos", None)
        return attrs

    @transaction.atomic
    def update(self, instance, validated_data):
        # 🔥 CORRECTION DÉFINITIVE
        # on ignore totalement toute logique photo
        validated_data.pop("existing_photos", None)
        validated_data.pop("new_photos", None)

        # update normal
        return super().update(instance, validated_data)


# ============================================================
# serialisers
class VehiclePricingSerializer(serializers.ModelSerializer):
    class Meta:
        model = VehiclePricing
        fields = [
            "id", "zone_type", 
            "prix_jour", "prix_heure", "prix_mois", "prix_par_semaine",
            "remise_par_heure", "remise_par_jour", "remise_par_mois", "remise_longue_duree_pourcent"
        ]

class FastVehiclePricingSerializer(serializers.ModelSerializer):
    """Serializer minimaliste pour les listes"""
    class Meta:
        model = VehiclePricing
        fields = ["zone_type", "prix_jour"]

class MarqueSerializer(serializers.ModelSerializer):
    class Meta:
        model = Marque
        fields = ["id", "nom", "created_at", "updated_at"]


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = [
            "id",
            "nom",
            "parent",
        ]


class FastCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "nom", "parent"]


class TransmissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transmission
        fields = ["id", "nom", "created_at", "updated_at"]


class FuelTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = FuelType
        fields = ["id", "nom", "created_at", "updated_at"]


class StatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = StatusVehicule
        fields = ["id", "nom", "created_at", "updated_at"]


class ModeleVehiculeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ModeleVehicule
        fields = ["id", "label", "created_at", "updated_at"]


# VehicleEquipments serailizer
class VehicleEquipmentsSerializer(serializers.ModelSerializer):
    class Meta:
        model = VehicleEquipments
        fields = "__all__"


class VehiclePhotoSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = VehiclePhoto
        fields = "__all__"

    def update(self, instance, validated_data):
        if "image" in validated_data and instance.image:
            delete_file(instance.image.url)
        return super().update(instance, validated_data)

    def get_image_url(self, obj):
        request = self.context.get("request")
        if obj.image and hasattr(obj.image, "url"):
            url = obj.image.url
            if request:
                return request.build_absolute_uri(url)
            return url
        return None


class VehicleAvailabilitySerializer(serializers.ModelSerializer):
    class Meta:
        model = VehicleAvailability
        fields = "__all__"


class VehicleConditionReportSerializer(serializers.ModelSerializer):
    ALLOWED_VIEWS = {
        "left",
        "right",
        "front",
        "rear",
        "top",
        "bottom",
        "interior-front",
        "interior-rear",
    }
    ALLOWED_LEVELS = {"léger", "moyen", "important"}

    class Meta:
        model = VehicleConditionReport
        fields = [
            "id",
            "vehicle",
            "created_by",
            "view_notes",
            "saved_view_timestamps",
            "points",
            "custom_photos_by_view",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_by", "created_at", "updated_at", "vehicle"]

    def validate_points(self, value):
        if value is None:
            return []
        if not isinstance(value, list):
            raise serializers.ValidationError("Le champ points doit être une liste.")

        normalized_points = []
        for index, point in enumerate(value, start=1):
            if not isinstance(point, dict):
                raise serializers.ValidationError(f"Le point #{index} est invalide.")

            view = point.get("view")
            if view not in self.ALLOWED_VIEWS:
                raise serializers.ValidationError(
                    f"Le point #{index} contient une vue invalide: {view}."
                )

            level = point.get("level") or "léger"
            if level not in self.ALLOWED_LEVELS:
                raise serializers.ValidationError(
                    f"Le point #{index} contient un niveau invalide: {level}."
                )

            try:
                x = float(point.get("x", 0))
                y = float(point.get("y", 0))
            except (TypeError, ValueError):
                raise serializers.ValidationError(
                    f"Le point #{index} contient des coordonnées invalides."
                )

            if x < 0 or x > 100 or y < 0 or y > 100:
                raise serializers.ValidationError(
                    f"Le point #{index} doit avoir des coordonnées entre 0 et 100."
                )

            normalized_points.append(
                {
                    "id": str(point.get("id") or ""),
                    "view": view,
                    "x": x,
                    "y": y,
                    "level": level,
                    "description": str(point.get("description") or ""),
                }
            )

        return normalized_points




# ============================================================
# 🔥 SERIALIZER PRINCIPAL — UTILISÉ PAR LES VIEWS
# ============================================================
class VehiculeSerializer(serializers.ModelSerializer):
    # Pour écrire → accepte une liste d'IDs
    equipements = FormDataListField(
        child=serializers.PrimaryKeyRelatedField(queryset=VehicleEquipments.objects.all()),
        required=False,
        write_only=True
    )
    
    # [NEW] Chauffeur attitré
    driver = serializers.PrimaryKeyRelatedField(
        queryset=Driver.objects.all(), required=False, allow_null=True
    )

    # Pour lire → retourne les données complètes
    equipements_details = VehicleEquipmentsSerializer(
        many=True, source="equipements", read_only=True
    )

    # Données du propriétaire
    proprietaire_data = UserProfileSerializer(source="proprietaire", read_only=True)

    # Détails des FK
    marque_data = MarqueSerializer(source="marque", read_only=True)
    categorie_data = CategorySerializer(source="categorie", read_only=True)
    transmission_data = TransmissionSerializer(source="transmission", read_only=True)
    type_carburant_data = FuelTypeSerializer(source="type_carburant", read_only=True)
    statut_data = StatusSerializer(source="statut", read_only=True)
    modele_data = ModeleVehiculeSerializer(source="modele", read_only=True)
    driver_data = DriverReadSerializer(source="driver", read_only=True)
    photos = VehiclePhotoSerializer(many=True, read_only=True)
    documents = VehicleDocumentsSerializer(many=True, read_only=True)
    availabilities = VehicleAvailabilitySerializer(many=True, read_only=True)
    pricing_grid = VehiclePricingSerializer(many=True, read_only=True)

    # [NEW] Photo principale (URL absolue)
    photo_principale = serializers.SerializerMethodField()

    # Writable fields for default/Urban pricing (Backward Compatibility)
    prix_jour = serializers.DecimalField(max_digits=10, decimal_places=2, required=False, write_only=True)
    prix_heure = serializers.DecimalField(max_digits=10, decimal_places=2, required=False, write_only=True, allow_null=True)
    prix_mois = serializers.DecimalField(max_digits=10, decimal_places=2, required=False, write_only=True, allow_null=True)
    prix_par_semaine = serializers.DecimalField(max_digits=10, decimal_places=2, required=False, write_only=True, allow_null=True)
    
    remise_par_heure = serializers.DecimalField(max_digits=5, decimal_places=2, required=False, write_only=True, allow_null=True)
    remise_par_jour = serializers.DecimalField(max_digits=5, decimal_places=2, required=False, write_only=True, allow_null=True)
    remise_par_mois = serializers.DecimalField(max_digits=5, decimal_places=2, required=False, write_only=True, allow_null=True)
    remise_longue_duree_pourcent = serializers.DecimalField(max_digits=5, decimal_places=2, required=False, write_only=True, allow_null=True)

    # Writable fields for PROVINCE pricing
    province_prix_jour = serializers.DecimalField(max_digits=10, decimal_places=2, required=False, write_only=True, allow_null=True)
    province_prix_heure = serializers.DecimalField(max_digits=10, decimal_places=2, required=False, write_only=True, allow_null=True)
    province_prix_mois = serializers.DecimalField(max_digits=10, decimal_places=2, required=False, write_only=True, allow_null=True)
    province_prix_par_semaine = serializers.DecimalField(max_digits=10, decimal_places=2, required=False, write_only=True, allow_null=True)
    
    province_remise_par_heure = serializers.DecimalField(max_digits=5, decimal_places=2, required=False, write_only=True, allow_null=True)
    province_remise_par_jour = serializers.DecimalField(max_digits=5, decimal_places=2, required=False, write_only=True, allow_null=True)
    province_remise_par_mois = serializers.DecimalField(max_digits=5, decimal_places=2, required=False, write_only=True, allow_null=True)
    province_remise_longue_duree_pourcent = serializers.DecimalField(max_digits=5, decimal_places=2, required=False, write_only=True, allow_null=True)

    # PHOTOS UPLOAD (Write Only, Multiple Files)
    uploaded_photos = FormDataListField(
        child=serializers.ImageField(max_length=1000000, allow_empty_file=False, use_url=False),
        write_only=True,
        required=False
    )

    class Meta:
        model = Vehicule
        fields = "__all__"
        
    def to_representation(self, instance):
        ret = super().to_representation(instance)
        
        # Inject URBAIN pricing into the response for backward compatibility
        # If URBAIN not found, fallback to the first available pricing to avoid breaking UI that expects a price
        pricing = instance.pricing_grid.filter(zone_type="URBAIN").first()
        if not pricing:
            pricing = instance.pricing_grid.first()
            
        if pricing:
            ret['prix_jour'] = pricing.prix_jour
            ret['prix_heure'] = pricing.prix_heure
            ret['prix_mois'] = pricing.prix_mois
            ret['prix_par_semaine'] = pricing.prix_par_semaine
            ret['remise_par_heure'] = pricing.remise_par_heure
            ret['remise_par_jour'] = pricing.remise_par_jour
            ret['remise_par_mois'] = pricing.remise_par_mois
            ret['remise_longue_duree_pourcent'] = pricing.remise_longue_duree_pourcent
        else:
            # Ensure fields exist even if null to match TS interface
            ret['prix_jour'] = None
            ret['prix_heure'] = None
            ret['prix_mois'] = None
            ret['prix_par_semaine'] = None
            ret['remise_par_heure'] = None
            ret['remise_par_jour'] = None
            ret['remise_par_mois'] = None
            ret['remise_longue_duree_pourcent'] = None

        # Inject PROVINCE pricing
        province_pricing = instance.pricing_grid.filter(zone_type="PROVINCE").first()
        if province_pricing:
            ret['province_prix_jour'] = province_pricing.prix_jour
            ret['province_prix_heure'] = province_pricing.prix_heure
            ret['province_prix_mois'] = province_pricing.prix_mois
            ret['province_prix_par_semaine'] = province_pricing.prix_par_semaine
            ret['province_remise_par_heure'] = province_pricing.remise_par_heure
            ret['province_remise_par_jour'] = province_pricing.remise_par_jour
            ret['province_remise_par_mois'] = province_pricing.remise_par_mois
            ret['province_remise_longue_duree_pourcent'] = province_pricing.remise_longue_duree_pourcent
        else:
            ret['province_prix_jour'] = None
            ret['province_prix_heure'] = None
            ret['province_prix_mois'] = None
            ret['province_prix_par_semaine'] = None
            ret['province_remise_par_heure'] = None
            ret['province_remise_par_jour'] = None
            ret['province_remise_par_mois'] = None
            ret['province_remise_longue_duree_pourcent'] = None
            
        return ret

    def get_photo_principale(self, obj):
        request = self.context.get("request")
        # Utiliser le cache du prefetch
        photos = getattr(obj, "_prefetched_objects_cache", {}).get("photos", None)
        if photos is None:
            photos = obj.photos.all()
            
        if not photos:
            return None
            
        target_photo = next((p for p in photos if p.is_primary), photos[0])
            
        if target_photo and target_photo.image:
            url = target_photo.image.url
            if request:
                return request.build_absolute_uri(url)
            return url
        return None

    @transaction.atomic
    def create(self, validated_data):
        # Extract flat pricing fields
        pricing_data = {}
        province_pricing_data = {}
        
        # Helper to extract pricing fields
        pricing_fields = [
            'prix_jour', 'prix_heure', 'prix_mois', 'prix_par_semaine',
            'remise_par_heure', 'remise_par_jour', 'remise_par_mois', 'remise_longue_duree_pourcent'
        ]
        
        for field in pricing_fields:
            if field in validated_data:
                pricing_data[field] = validated_data.pop(field)
                
        # Helper to extract province pricing fields
        province_fields = [
            'province_prix_jour', 'province_prix_heure', 'province_prix_mois', 'province_prix_par_semaine',
            'province_remise_par_heure', 'province_remise_par_jour', 'province_remise_par_mois', 'province_remise_longue_duree_pourcent'
        ]
        
        for field in province_fields:
            if field in validated_data:
                # Remove 'province_' prefix key mapping
                clean_key = field.replace('province_', '')
                province_pricing_data[clean_key] = validated_data.pop(field)
        
        # Extract photos
        uploaded_photos = validated_data.pop('uploaded_photos', [])
        
        # Extract equipements (IDs list)
        equipements = validated_data.pop('equipements', None)

        # Create vehicle
        vehicule = super().create(validated_data)
        
        # Set equipments (M2M)
        if equipements is not None:
             vehicule.equipements.set(equipements)
        
        # Create Photos
        for photo in uploaded_photos:
            VehiclePhoto.objects.create(vehicle=vehicule, image=photo)
            
        # Create URBAIN pricing (default)
        if pricing_data:
            VehiclePricing.objects.create(
                vehicle=vehicule,
                zone_type="URBAIN",
                **pricing_data
            )
            
        # Create PROVINCE pricing (if provided)
        if province_pricing_data:
            VehiclePricing.objects.create(
                vehicle=vehicule,
                zone_type="PROVINCE",
                **province_pricing_data
            )
            
        return vehicule

    @transaction.atomic
    def update(self, instance, validated_data):
        # Extract pricing fields for URBAIN
        pricing_update = {}
        fields = ['prix_jour', 'prix_heure', 'prix_mois', 'prix_par_semaine', 
                  'remise_par_heure', 'remise_par_jour', 'remise_par_mois', 'remise_longue_duree_pourcent']
        
        for field in fields:
            if field in validated_data:
                pricing_update[field] = validated_data.pop(field)
        
        # Extract pricing fields for PROVINCE
        province_pricing_update = {}
        province_fields = [
            'province_prix_jour', 'province_prix_heure', 'province_prix_mois', 'province_prix_par_semaine',
            'province_remise_par_heure', 'province_remise_par_jour', 'province_remise_par_mois', 'province_remise_longue_duree_pourcent'
        ]
        for field in province_fields:
            if field in validated_data:
                clean_key = field.replace('province_', '')
                province_pricing_update[clean_key] = validated_data.pop(field)
                
        # Extract photos (to append)
        uploaded_photos = validated_data.pop('uploaded_photos', [])
        
        # Extract equipements (IDs list)
        equipements = validated_data.pop('equipements', None)

        # Update Vehicle
        instance = super().update(instance, validated_data)
        
        # Add new Photos
        for photo in uploaded_photos:
            VehiclePhoto.objects.create(vehicle=instance, image=photo)
            
        # Update/Create URBAIN pricing
        if pricing_update:
            VehiclePricing.objects.update_or_create(
                vehicle=instance,
                zone_type="URBAIN",
                defaults=pricing_update
            )
        
        # Update/Create PROVINCE pricing
        if province_pricing_update:
            VehiclePricing.objects.update_or_create(
                vehicle=instance,
                zone_type="PROVINCE",
                defaults=province_pricing_update
            )
            
        # Update equipments
        if equipements is not None:
             instance.equipements.set(equipements)
            
        return instance


class VehiclePhotoSearchSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = VehiclePhoto
        fields = ["id", "image_url", "is_primary", "caption", "order"]

    def get_image_url(self, obj):
        request = self.context.get("request")
        if obj.image and hasattr(obj.image, "url"):
            url = obj.image.url
            if request:
                return request.build_absolute_uri(url)
            return url
        return None




class VehiculeCardSerializer(serializers.ModelSerializer):
    """Serializer ultra-léger pour l'affichage en grille"""
    marque_nom = serializers.CharField(source="marque.nom", read_only=True)
    modele_label = serializers.CharField(source="modele.label", read_only=True)
    driver_name = serializers.CharField(source="driver.first_name", read_only=True)
    driver_last_name = serializers.CharField(source="driver.last_name", read_only=True)
    transmission_nom = serializers.CharField(source="transmission.nom", read_only=True)
    type_carburant_nom = serializers.CharField(source="type_carburant.nom", read_only=True)
    
    # On utilise SerializerMethodField intelligemment avec le cache prefetch
    prix_jour = serializers.SerializerMethodField()
    province_prix_jour = serializers.SerializerMethodField()
    photo_principale = serializers.SerializerMethodField()
    driver_photo = serializers.SerializerMethodField()

    class Meta:
        model = Vehicule
        fields = [
            "id", "titre", "marque_nom", "modele_label", "annee",
            "nombre_places", "note_moyenne", "nombre_locations",
            "prix_jour", "province_prix_jour", "photo_principale", "est_certifie", "est_disponible", "est_coup_de_coeur",
            "ville", "created_at", "driver_name", "driver_last_name", "numero_immatriculation",
            "transmission_nom", "type_carburant_nom", "kilometrage_actuel_km", "driver_photo"
        ]

    def get_prix_jour(self, obj):
        pricings = getattr(obj, "_prefetched_objects_cache", {}).get("pricing_grid", obj.pricing_grid.all())
        for p in pricings:
            if p.zone_type == "URBAIN": return p.prix_jour
        return pricings[0].prix_jour if pricings else None

    def get_province_prix_jour(self, obj):
        pricings = getattr(obj, "_prefetched_objects_cache", {}).get("pricing_grid", obj.pricing_grid.all())
        for p in pricings:
            if p.zone_type == "PROVINCE":
                return p.prix_jour
        return None

    def get_photo_principale(self, obj):
        request = self.context.get("request")
        photos = getattr(obj, "_prefetched_objects_cache", {}).get("photos", obj.photos.all())
        if not photos: return None
        target = next((p for p in photos if p.is_primary), photos[0])
        return request.build_absolute_uri(target.image.url) if request and target.image else target.image.url if target.image else None

    def get_driver_photo(self, obj):
        request = self.context.get("request")
        if obj.driver and obj.driver.profile_photo:
            url = obj.driver.profile_photo.url
            if request:
                return request.build_absolute_uri(url)
            return url
        return None


# ============================================================
# 🔥 SERIALIZER LÉGER (LIST)
# ============================================================
class VehiculeListSerializer(serializers.ModelSerializer):
    marque_nom = serializers.CharField(source="marque.nom", read_only=True)
    modele_label = serializers.CharField(source="modele.label", read_only=True)
    categorie_nom = serializers.CharField(source="categorie.nom", read_only=True)
    transmission_nom = serializers.CharField(source="transmission.nom", read_only=True)
    type_carburant_nom = serializers.CharField(source="type_carburant.nom", read_only=True)

    # Computed fields
    prix_jour = serializers.SerializerMethodField()
    photo_principale = serializers.SerializerMethodField()
    
    # Equipements (summary)
    equipements_count = serializers.IntegerField(source="equipements.count", read_only=True)
    equipements_labels = serializers.SerializerMethodField()

    class Meta:
        model = Vehicule
        fields = [
            "id",
            "titre",
            "marque_nom",
            "modele_label",
            "categorie_nom",
            "annee",
            "nombre_places",
            "type_vehicule",
            "ville",
            "zone",
            "est_certifie",
            "est_coup_de_coeur",
            "statut",
            
            # Key metrics
            "note_moyenne",
            "nombre_locations",
            "nombre_favoris",
            
            # Pricing & Currency
            "prix_jour",
            "devise",
            
            # Visuals
            "photo_principale",
            "numero_immatriculation",
            # Extra info for cards
            "equipements_count",
            "equipements_labels",
            "transmission_nom",
            "type_carburant_nom",
        ]

    def get_prix_jour(self, obj):
        # 1. Utiliser le cache du prefetch si disponible
        pricings = getattr(obj, "_prefetched_objects_cache", {}).get("pricing_grid", None)
        if pricings is None:
            pricings = obj.pricing_grid.all()
        
        # fallback safe
        for p in pricings:
            if p.zone_type == "URBAIN":
                return p.prix_jour
        return pricings[0].prix_jour if pricings else None

    def get_photo_principale(self, obj):
        request = self.context.get("request")
        # Utiliser le cache du prefetch
        photos = getattr(obj, "_prefetched_objects_cache", {}).get("photos", None)
        if photos is None:
            photos = obj.photos.all()
            
        if not photos:
            return None
            
        target_photo = next((p for p in photos if p.is_primary), photos[0])
            
        if target_photo and target_photo.image:
            url = target_photo.image.url
            if request:
                return request.build_absolute_uri(url)
            return url
        return None

    def get_equipements_labels(self, obj):
        # Utiliser le cache du prefetch
        equipements = getattr(obj, "_prefetched_objects_cache", {}).get("equipements", None)
        if equipements is None:
            equipements = obj.equipements.all()
        return [eq.label for eq in list(equipements)[:3]]


# ============================================================
# SEARCH SERIALIZER (Sera remplacé ou hérite de List)
# ============================================================
class VehiculeSearchSerializer(VehiculeListSerializer):
    # Pour la recherche, on garde la même structure que la liste
    pass

# ================================
# 🔥 SERIALIZER UPLOAD PHOTOS
# ================================
class VehiclePhotoUploadSerializer(serializers.Serializer):
    photos = serializers.ListField(
        child=serializers.ImageField(),
        allow_empty=False
    )
