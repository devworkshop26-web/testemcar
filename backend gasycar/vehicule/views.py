import uuid
from django.db import models
from django.db.models import Count, Q
from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import viewsets
from drf_yasg.utils import swagger_auto_schema
from rest_framework.decorators import api_view
# import get_object_or_404
from django.shortcuts import get_object_or_404
from rest_framework.parsers import JSONParser, MultiPartParser, FormParser
# import  parser_classes
from rest_framework.decorators import parser_classes
from rest_framework.decorators import action
from reservations.models import Reservation
from gasycar.utils import delete_file
from django.utils.dateparse import parse_datetime  # 🔥 AJOUT MANQUANT
from .serializers import VehiclePhotoUploadSerializer
from django.db import transaction
from rest_framework import serializers

# seralisers.py
from .serializers import FastCategorySerializer,MarqueSerializer, CategorySerializer, TransmissionSerializer,VehiclePhotoSerializer,VehiculeSearchSerializer, VehiculeListSerializer
from .serializers import FuelTypeSerializer, StatusSerializer,ModeleVehiculeSerializer,VehiculeSerializer,VehicleEquipmentsSerializer, VehicleAvailabilitySerializer, VehicleDocumentsSerializer, VehiculeCardSerializer, VehicleConditionReportSerializer
from users.serializers import UserProfileSerializer

# models
from .models import Marque, Category, Transmission,VehiclePhoto
from .models import FuelType, StatusVehicule,ModeleVehicule,Vehicule,VehicleEquipments, VehicleAvailability, VehicleDocuments, VehiclePricing, VehicleConditionReport
from users.models import User
from driver.models import Driver


# CRUD ViewSets with Swagger st


class MarqueViewSet(viewsets.ModelViewSet):
    queryset = Marque.objects.all().order_by("-created_at")
    serializer_class = MarqueSerializer

    # --- LIST ---
    @swagger_auto_schema(
        operation_description="Récupère la liste des marques",
        responses={200: MarqueSerializer(many=True)},
    )
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    # --- CREATE ---
    @swagger_auto_schema(
        operation_description="Crée une nouvelle marque",
        request_body=MarqueSerializer,
        responses={201: MarqueSerializer},
    )
    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)

    # --- RETRIEVE ---
    @swagger_auto_schema(
        operation_description="Récupère une marque par son ID",
        responses={200: MarqueSerializer},
    )
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)

    # --- UPDATE ---
    @swagger_auto_schema(
        operation_description="Met à jour une marque",
        request_body=MarqueSerializer,
        responses={200: MarqueSerializer},
    )
    def update(self, request, *args, **kwargs):
        return super().update(request, *args, **kwargs)

    # --- PARTIAL UPDATE ---
    @swagger_auto_schema(
        operation_description="Met à jour partiellement une marque",
        request_body=MarqueSerializer,
        responses={200: MarqueSerializer},
    )
    def partial_update(self, request, *args, **kwargs):
        return super().partial_update(request, *args, **kwargs)

    # --- DELETE ---
    @swagger_auto_schema(
        operation_description="Supprime une marque", responses={204: "Deleted"}
    )
    def destroy(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all().order_by("-created_at")
    serializer_class = CategorySerializer
    

    # Similar CRUD methods with swagger_auto_schema can be added here
    @swagger_auto_schema(
        operation_description="Récupère la liste des catégories",
        responses={200: CategorySerializer(many=True)},
    )
    def list(self, request, *args, **kwargs):
       self.serializer_class = FastCategorySerializer
       return super().list(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_description="Crée une nouvelle catégorie",
        request_body=CategorySerializer,
        responses={201: CategorySerializer},
    )
    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_description="Récupère une catégorie par son ID",
        responses={200: CategorySerializer},
    )
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_description="Met à jour une catégorie",
        request_body=CategorySerializer,
        responses={200: CategorySerializer},
    )
    def update(self, request, *args, **kwargs):
        return super().update(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_description="Met à jour partiellement une catégorie",
        request_body=CategorySerializer,
        responses={200: CategorySerializer},
    )
    def partial_update(self, request, *args, **kwargs):
        return super().partial_update(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_description="Supprime une catégorie", responses={204: "Deleted"}
    )
    def destroy(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)


class TransmissionViewSet(viewsets.ModelViewSet):
    queryset = Transmission.objects.all().order_by("-created_at")
    serializer_class = TransmissionSerializer

    # Similar CRUD methods with swagger_auto_schema can be added here
    @swagger_auto_schema(
        operation_description="Récupère la liste des transmissions",
        responses={200: TransmissionSerializer(many=True)},
    )
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_description="Crée une nouvelle transmission",
        request_body=TransmissionSerializer,
        responses={201: TransmissionSerializer},
    )
    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_description="Récupère une transmission par son ID",
        responses={200: TransmissionSerializer},
    )
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_description="Met à jour une transmission",
        request_body=TransmissionSerializer,
        responses={200: TransmissionSerializer},
    )
    def update(self, request, *args, **kwargs):
        return super().update(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_description="Met à jour partiellement une transmission",
        request_body=TransmissionSerializer,
        responses={200: TransmissionSerializer},
    )
    def partial_update(self, request, *args, **kwargs):
        return super().partial_update(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_description="Supprime une transmission", responses={204: "Deleted"}
    )
    def destroy(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)
    
    
class FuelTypeViewSet(viewsets.ModelViewSet):
    queryset = FuelType.objects.all().order_by("-created_at")
    serializer_class = FuelTypeSerializer

    # Similar CRUD methods with swagger_auto_schema can be added here
    @swagger_auto_schema(
        operation_description="Récupère la liste des types de carburant",
        responses={200: FuelTypeSerializer(many=True)},
    )
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_description="Crée un nouveau type de carburant",
        request_body=FuelTypeSerializer,
        responses={201: FuelTypeSerializer},
    )
    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_description="Récupère un type de carburant par son ID",
        responses={200: FuelTypeSerializer},
    )
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_description="Met à jour un type de carburant",
        request_body=FuelTypeSerializer,
        responses={200: FuelTypeSerializer},
    )
    def update(self, request, *args, **kwargs):
        return super().update(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_description="Met à jour partiellement un type de carburant",
        request_body=FuelTypeSerializer,
        responses={200: FuelTypeSerializer},
    )
    def partial_update(self, request, *args, **kwargs):
        return super().partial_update(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_description="Supprime un type de carburant", responses={204: "Deleted"}
    )
    def destroy(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)


class StatusViewSet(viewsets.ModelViewSet):
    queryset = StatusVehicule.objects.all().order_by("-created_at")
    serializer_class = StatusSerializer

    # Similar CRUD methods with swagger_auto_schema can be added here
    @swagger_auto_schema(
        operation_description="Récupère la liste des statuts",
        responses={200: StatusSerializer(many=True)},
    )
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_description="Crée un nouveau statut",
        request_body=StatusSerializer,
        responses={201: StatusSerializer},
    )
    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_description="Récupère un statut par son ID",
        responses={200: StatusSerializer},
    )
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_description="Met à jour un statut",
        request_body=StatusSerializer,
        responses={200: StatusSerializer},
    )
    def update(self, request, *args, **kwargs):
        return super().update(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_description="Met à jour partiellement un statut",
        request_body=StatusSerializer,
        responses={200: StatusSerializer},
    )
    def partial_update(self, request, *args, **kwargs):
        return super().partial_update(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_description="Supprime un statut", responses={204: "Deleted"}
    )
    def destroy(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)
    
    
class ModeleVehiculeViewSet(viewsets.ModelViewSet):
    queryset = ModeleVehicule.objects.all().order_by("-created_at")
    serializer_class = ModeleVehiculeSerializer

    # Similar CRUD methods with swagger_auto_schema can be added here
    @swagger_auto_schema(
        operation_description="Récupère la liste des modèles de véhicule",
        responses={200: ModeleVehiculeSerializer(many=True)},
    )
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_description="Crée un nouveau modèle de véhicule",
        request_body=ModeleVehiculeSerializer,
        responses={201: ModeleVehiculeSerializer},
    )
    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_description="Récupère un modèle de véhicule par son ID",
        responses={200: ModeleVehiculeSerializer},
    )
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_description="Met à jour un modèle de véhicule",
        request_body=ModeleVehiculeSerializer,
        responses={200: ModeleVehiculeSerializer},
    )
    def update(self, request, *args, **kwargs):
        return super().update(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_description="Met à jour partiellement un modèle de véhicule",
        request_body=ModeleVehiculeSerializer,
        responses={200: ModeleVehiculeSerializer},
    )
    def partial_update(self, request, *args, **kwargs):
        return super().partial_update(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_description="Supprime un modèle de véhicule", responses={204: "Deleted"}
    )
    def destroy(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)
    
    
# APIView for Vehicule
from rest_framework.parsers import MultiPartParser, FormParser

class VehiculeApiViewSet(viewsets.ModelViewSet):
    def get_serializer_class(self):
        if self.action == "list":
            return VehiculeCardSerializer
        return VehiculeSerializer

    def get_queryset(self):
        """
        Optimisation Expert :
        - LIST : Charge minimale via .only() et Prefetch ciblés.
        - DETAIL : Fetch complet pour l'édition/affichage.
        """
        base_qs = Vehicule.objects.all().annotate(_reservation_count=Count("reservations", distinct=True)).order_by("-created_at")

        if self.action == "retrieve" or self.action == "update" or self.action == "partial_update":
            return base_qs.select_related(
                "proprietaire", "marque", "modele", "categorie",
                "transmission", "type_carburant", "statut", "driver"
            ).prefetch_related(
                "photos", "equipements", "availabilities", "pricing_grid"
            )

        # Action LIST / SEARCH : Stratégie "Lean"
        return base_qs.select_related("marque", "modele").prefetch_related(
            models.Prefetch("photos", queryset=VehiclePhoto.objects.only("id", "vehicle", "image", "is_primary")),
            models.Prefetch("pricing_grid", queryset=VehiclePricing.objects.only("id", "vehicle", "zone_type", "prix_jour"))
        ).only(
            "id", "titre", "marque", "modele", "annee", "nombre_places",
            "note_moyenne", "nombre_locations", "est_certifie", "est_disponible", "est_sponsorise", "est_coup_de_coeur",
            "ville", "created_at"
        )

    # ✅🔥 OBLIGATOIRE POUR FORMData + IMAGES
    parser_classes = [JSONParser, MultiPartParser, FormParser]

    @staticmethod
    def _attach_reservation_count(items):
        for item in items:
            computed = getattr(item, "_reservation_count", None)
            if computed is not None:
                item.nombre_locations = int(computed)
        return items

    @swagger_auto_schema(
        operation_description="Récupère la liste des véhicules. Filtres: ?type_vehicule=UTILITAIRE ou TOURISME",
        responses={200: VehiculeListSerializer(many=True)},
    )
    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        type_vehicule = request.query_params.get("type_vehicule")
        if type_vehicule:
             queryset = queryset.filter(type_vehicule=type_vehicule)

        est_sponsorise = request.query_params.get("est_sponsorise")
        if est_sponsorise is not None:
            queryset = queryset.filter(est_sponsorise=str(est_sponsorise).lower() in ["1", "true", "yes"])

        est_disponible = request.query_params.get("est_disponible")
        if est_disponible is not None:
            queryset = queryset.filter(est_disponible=str(est_disponible).lower() in ["1", "true", "yes"])

        est_coup_de_coeur = request.query_params.get("est_coup_de_coeur")
        if est_coup_de_coeur is not None:
            queryset = queryset.filter(est_coup_de_coeur=str(est_coup_de_coeur).lower() in ["1", "true", "yes"])

        page = self.paginate_queryset(queryset)
        if page is not None:
             page = self._attach_reservation_count(page)
             serializer = self.get_serializer(page, many=True)
             return self.get_paginated_response(serializer.data)

        queryset = self._attach_reservation_count(queryset)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @swagger_auto_schema(
        operation_description="Crée un nouveau véhicule",
        request_body=VehiculeSerializer,
        responses={201: VehiculeSerializer},
    )
    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_description="Récupère un véhicule par son ID",
        responses={200: VehiculeSerializer},
    )
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_description="Met à jour un véhicule",
        request_body=VehiculeSerializer,
        responses={200: VehiculeSerializer},
    )
    def update(self, request, *args, **kwargs):
        # ✅ on garde partial pour éviter écrasement
        kwargs["partial"] = True
        return super().update(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_description="Met à jour partiellement un véhicule",
        request_body=VehiculeSerializer,
        responses={200: VehiculeSerializer},
    )
    def partial_update(self, request, *args, **kwargs):
        return super().partial_update(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_description="Supprime un véhicule", responses={204: "Deleted"}
    )
    def destroy(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)

    def perform_create(self, serializer):
        serializer.save(proprietaire=self.request.user)

    @swagger_auto_schema(
        operation_description="Assigne un chauffeur au véhicule",
        request_body=serializers.Serializer, # simple trigger with driver_id in URL or body
        responses={200: "Driver assigned successfully", 404: "Driver not found"}
    )
    @action(detail=True, methods=["post"])
    def assign_driver(self, request, pk=None):
        vehicule = self.get_object()
        driver_id = request.data.get("driver_id")
        if not driver_id:
            return Response({"error": "driver_id est requis"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            driver = Driver.objects.get(id=driver_id)
            # Optionnel: vérifier que le prestataire possède ce chauffeur
            if not request.user.is_staff and driver.owner != request.user:
                return Response({"error": "Vous n'avez pas la permission d'assigner ce chauffeur"}, status=status.HTTP_403_FORBIDDEN)
            
            vehicule.driver = driver
            vehicule.save()

            # Mettre à jour aussi le véhicule côté Driver model pour cohérence (si applicable)
            driver.vehicule = vehicule
            driver.save()
            
            return Response({"message": f"Chauffeur {driver.full_name} assigné avec succès"})
        except Driver.DoesNotExist:
            return Response({"error": "Chauffeur introuvable"}, status=status.HTTP_404_NOT_FOUND)

    @swagger_auto_schema(
        operation_description="Enlève le chauffeur du véhicule",
        responses={200: "Driver removed successfully"}
    )
    @action(detail=True, methods=["post"])
    def remove_driver(self, request, pk=None):
        vehicule = self.get_object()
        if vehicule.driver:
            driver = vehicule.driver
            vehicule.driver = None
            vehicule.save()
            
            # Unlink also in Driver model
            driver.vehicule = None
            driver.save()
            
            return Response({"message": "Chauffeur retiré avec succès"})
        return Response({"message": "Aucun chauffeur assigné à ce véhicule"})

    @action(detail=True, methods=["get", "put", "patch"], url_path="condition-report", permission_classes=[permissions.IsAuthenticated])
    def condition_report(self, request, pk=None):
        vehicle = self.get_object()
        user = request.user
        user_role = getattr(user, "role", None)

        is_owner_or_staff = vehicle.proprietaire_id == user.id or user_role in ["ADMIN", "SUPPORT"] or user.is_staff
        has_client_reservation = False

        if user_role == "CLIENT":
            has_client_reservation = Reservation.objects.filter(vehicle=vehicle, client=user).exists()

        if request.method == "GET":
            if not is_owner_or_staff and not has_client_reservation:
                return Response({"detail": "Vous n'avez pas la permission de consulter ce rapport."}, status=status.HTTP_403_FORBIDDEN)
        elif not is_owner_or_staff:
            return Response({"detail": "Vous n'avez pas la permission de modifier ce rapport."}, status=status.HTTP_403_FORBIDDEN)

        report, _ = VehicleConditionReport.objects.get_or_create(
            vehicle=vehicle,
            defaults={"created_by": user},
        )

        if request.method == "GET":
            serializer = VehicleConditionReportSerializer(report, context={"request": request})
            return Response(serializer.data, status=status.HTTP_200_OK)

        serializer = VehicleConditionReportSerializer(
            report,
            data=request.data,
            partial=(request.method == "PATCH"),
            context={"request": request},
        )
        serializer.is_valid(raise_exception=True)
        serializer.save(created_by=report.created_by or user)
        return Response(serializer.data, status=status.HTTP_200_OK)

  

# api view for VehicleEquipment
class VehicleEquipmentApiViewset(viewsets.ModelViewSet):
    queryset = VehicleEquipments.objects.all().order_by("-created_at")
    serializer_class = VehicleEquipmentsSerializer

# VehiclePhoto view 

class VehiclePhotoViewSet(viewsets.ModelViewSet):
    queryset = VehiclePhoto.objects.all().order_by("order")
    serializer_class = VehiclePhotoSerializer
    

    def create(self, request, *args, **kwargs):
        """
        Gère :
        - upload d'une seule photo
        - upload multiple (files[])
        """
        files = request.FILES.getlist("image")

        if len(files) > 1:
            # Création multiple
            photos = []
            vehicle_id = request.data.get("vehicle")

            for index, file in enumerate(files):
                photo = VehiclePhoto.objects.create(
                    vehicle_id=vehicle_id,
                    image=file,
                    caption=request.data.get("caption", ""),
                    order=request.data.get("order", index),
                )
                photos.append(photo)

            serializer = self.get_serializer(photos, many=True)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        # Création simple
        return super().create(request, *args, **kwargs)

    def perform_update(self, serializer):
        """
        Si une photo est définie comme primary, retirer le flag des autres.
        """
        instance = serializer.save()
        if instance.is_primary:
            VehiclePhoto.objects.filter(
                vehicle=instance.vehicle
            ).exclude(id=instance.id).update(is_primary=False)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.image:
            delete_file(instance.image.url)
        return super().destroy(request, *args, **kwargs)
            
            


class VehiculeSearchApiViewSet(viewsets.ModelViewSet):
    queryset = (
        Vehicule.objects.all()
        .select_related("proprietaire", "marque", "modele", "categorie", "transmission", "type_carburant", "statut")
        .prefetch_related("photos", "equipements", "availabilities", "pricing_grid")
        .order_by("-created_at")
    )
    serializer_class = VehiculeSerializer

    # ------------------------------------------------------------------
    # 1) Voitures les plus populaires (par favoris + note)
    # ------------------------------------------------------------------
    @action(detail=False, methods=["get"], url_path="sponsored")
    def sponsored(self, request):
        sponsored_qs = (
            self.get_queryset()
            .filter(est_sponsorise=True)
            .order_by("-nombre_favoris", "-note_moyenne", "-nombre_locations")
        )

        qs = sponsored_qs
        if not sponsored_qs.exists():
            qs = (
                self.get_queryset()
                .filter(est_disponible=True)
                .order_by("-nombre_favoris", "-note_moyenne", "-nombre_locations")
            )

        page = self.paginate_queryset(qs)
        if page is not None:
            serializer = VehiculeSearchSerializer(page, many=True, context={"request": request})
            return self.get_paginated_response(serializer.data)

        serializer = VehiculeSearchSerializer(qs, many=True, context={"request": request})
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=False, methods=["get"], url_path="popular")
    def popular(self, request):
        qs = (
            self.get_queryset()
            .filter(est_disponible=True)
            .order_by("-nombre_favoris", "-note_moyenne", "-nombre_locations")
        )
        
        page = self.paginate_queryset(qs)
        if page is not None:
            serializer = VehiculeSearchSerializer(page, many=True, context={"request": request})
            return self.get_paginated_response(serializer.data)

        serializer = VehiculeSearchSerializer(qs, many=True, context={"request": request})
        return Response(serializer.data, status=status.HTTP_200_OK)

    # ------------------------------------------------------------------
    # 2) Voitures "Coup de cœur"
    #    → certifiées + bien notées + un minimum de favoris
    # ------------------------------------------------------------------
    @action(detail=False, methods=["get"], url_path="coup-de-coeur")
    def coup_de_coeur(self, request):
        min_note = float(request.query_params.get("min_note", 4))
        min_favoris = int(request.query_params.get("min_favoris", 5))

        coups_de_coeur_qs = (
            self.get_queryset()
            .filter(est_coup_de_coeur=True, est_disponible=True)
            .order_by("-note_moyenne", "-nombre_favoris", "-nombre_locations")
        )

        qs = coups_de_coeur_qs
        if not coups_de_coeur_qs.exists():
            qs = (
                self.get_queryset()
                .filter(
                    est_certifie=True,
                    est_disponible=True,
                    note_moyenne__gte=min_note,
                    nombre_favoris__gte=min_favoris,
                )
                .order_by("-note_moyenne", "-nombre_favoris", "-nombre_locations")
            )

        page = self.paginate_queryset(qs)
        if page is not None:
            serializer = VehiculeSearchSerializer(page, many=True, context={"request": request})
            return self.get_paginated_response(serializer.data)

        serializer = VehiculeSearchSerializer(qs, many=True, context={"request": request})
        return Response(serializer.data, status=status.HTTP_200_OK)

    # ------------------------------------------------------------------
    # 3) Voitures les plus réservées (historiquement)
    #    → basé sur le nombre de réservations effectives
    # ------------------------------------------------------------------
    @action(detail=False, methods=["get"], url_path="most-booked")
    def most_booked(self, request):
        qs = (
            self.get_queryset()
            .annotate(
                reservations_count=Count(
                    "reservations",
                    filter=Q(
                        reservations__status__in=[
                            Reservation.Status.CONFIRMED,
                            Reservation.Status.IN_PROGRESS,
                            Reservation.Status.COMPLETED,
                        ]
                    ),
                )
            )
            .filter(est_disponible=True)
            .order_by("-reservations_count", "-nombre_locations", "-note_moyenne")
        )

        page = self.paginate_queryset(qs)
        if page is not None:
            serializer = VehiculeSearchSerializer(page, many=True, context={"request": request})
            return self.get_paginated_response(serializer.data)

        serializer = VehiculeSearchSerializer(qs, many=True, context={"request": request})
        return Response(serializer.data, status=status.HTTP_200_OK)

    # ------------------------------------------------------------------
    # 4) Recherche rapide de voiture
    #    Filtres : marque, modèle, catégorie, ville, prix, dates dispo
    # ------------------------------------------------------------------
    @swagger_auto_schema(
        operation_description=(
            "Recherche rapide de véhicules par filtres : marque, modèle, catégorie, ville, "
            "prix min/max, dates de location, etc.\n"
            "Les dates doivent être au format ISO 8601 : 2025-01-30T10:00:00Z"
        ),
   
        responses={200: VehiculeSearchSerializer(many=True)},
    )
    @action(detail=False, methods=["get"], url_path="search")
    def search(self, request):
        qs = (
            self.get_queryset()
            .filter(est_disponible=True)
        )

        marque_id = request.query_params.get("marque")
        modele_id = request.query_params.get("modele")
        categorie_id = request.query_params.get("categorie")
        ville = request.query_params.get("ville")
        min_price = request.query_params.get("min_price")
        max_price = request.query_params.get("max_price")
        start_date = request.query_params.get("start_date")
        end_date = request.query_params.get("end_date")
        type_vehicule = request.query_params.get("type_vehicule")

        if marque_id:
            try:
                uuid.UUID(str(marque_id))
                qs = qs.filter(marque_id=marque_id)
            except ValueError:
                qs = qs.filter(marque__nom__icontains=marque_id)

        if modele_id:
            try:
                uuid.UUID(str(modele_id))
                qs = qs.filter(modele_id=modele_id)
            except ValueError:
                qs = qs.filter(modele__label__icontains=modele_id)

        if categorie_id:
            try:
                uuid.UUID(str(categorie_id))
                qs = qs.filter(categorie_id=categorie_id)
            except ValueError:
                qs = qs.filter(categorie__nom__icontains=categorie_id)
            
        if type_vehicule:
            qs = qs.filter(type_vehicule=type_vehicule)

        if ville:
            qs = qs.filter(ville__icontains=ville)

        if min_price:
            qs = qs.filter(pricing_grid__zone_type="URBAIN", pricing_grid__prix_jour__gte=min_price)

        if max_price:
            qs = qs.filter(pricing_grid__zone_type="URBAIN", pricing_grid__prix_jour__lte=max_price)

        if start_date and end_date:
            start_dt = parse_datetime(start_date)
            end_dt = parse_datetime(end_date)

            if start_dt and end_dt and start_dt < end_dt:
                qs = qs.exclude(
                    reservations__status__in=[
                        Reservation.Status.CONFIRMED,
                        Reservation.Status.IN_PROGRESS,
                        Reservation.Status.COMPLETED,
                    ],
                    reservations__start_datetime__lt=end_dt,
                    reservations__end_datetime__gt=start_dt,
                )

        page = self.paginate_queryset(qs)
        if page is not None:
             serializer = VehiculeSearchSerializer(page, many=True, context={"request": request})
             return self.get_paginated_response(serializer.data)

        serializer = VehiculeSearchSerializer(qs, many=True, context={"request": request})
        return Response(serializer.data, status=status.HTTP_200_OK)
    

@api_view(["GET"])
def getVehculeClient(request, user_id):
    user = get_object_or_404(User, id=user_id)
    clients = User.objects.filter(
            reservations__vehicle__proprietaire=user
        ).distinct()

    serializer = UserProfileSerializer(clients, many=True)
    return Response(serializer.data)


@api_view(["GET"])
def getAllMyVehicles(request, user_id):
    from driver.models import Driver
    
    user = get_object_or_404(User, id=user_id)
    vehicule_data = (
        Vehicule.objects.filter(proprietaire=user).annotate(_reservation_count=Count("reservations", distinct=True))
        .select_related("marque", "modele", "transmission", "type_carburant")
        .prefetch_related(
            models.Prefetch("photos", queryset=VehiclePhoto.objects.only("id", "vehicle", "image", "is_primary")),
            models.Prefetch("pricing_grid", queryset=VehiclePricing.objects.only("id", "vehicle", "zone_type", "prix_jour")),
            models.Prefetch(
                "driver",
                queryset=Driver.objects.only("id", "first_name", "last_name", "phone_number", "experience_years", "profile_photo")
            )
        )
        .only(
            "id", "titre", "marque", "modele", "annee", "nombre_places", 
            "note_moyenne", "nombre_locations", "est_certifie", "est_disponible", 
            "ville", "zone", "created_at", "numero_immatriculation", 
            "transmission", "type_carburant", "kilometrage_actuel_km", 
            "devise", "driver"
        )
        .order_by("-created_at")
    )
    for vehicle in vehicule_data:
        computed = getattr(vehicle, "_reservation_count", None)
        if computed is not None:
            vehicle.nombre_locations = int(computed)

    serializer = VehiculeCardSerializer(vehicule_data, many=True, context={"request": request})
    return Response(serializer.data)


# get all vehicule by category
@api_view(["GET"])
def getVehiculeByCategory(request, category_id):
    category = get_object_or_404(Category, id=category_id)
    vehicule_data = (
        Vehicule.objects.filter(categorie=category)
        .select_related(
            "marque",
            "modele",
            "categorie",
            "transmission",
            "type_carburant",
            "statut",
            "proprietaire",
        )
        .prefetch_related("equipements", "photos", "availabilities", "pricing_grid")
        .order_by("-created_at")
    )

    serializer = VehiculeSerializer(
        vehicule_data, many=True, context={"request": request}
    )
    return Response(serializer.data)


class VehicleAvailabilityViewSet(viewsets.ModelViewSet):
    queryset = VehicleAvailability.objects.all()
    serializer_class = VehicleAvailabilitySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        vehicle_id = self.request.query_params.get("vehicle")
        if vehicle_id:
            return VehicleAvailability.objects.filter(vehicle_id=vehicle_id)
        return super().get_queryset()

class VehicleDocumentsViewSet(viewsets.ModelViewSet):
    queryset = VehicleDocuments.objects.all()
    serializer_class = VehicleDocumentsSerializer
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get_queryset(self):
        vehicle_id = self.request.query_params.get("vehicle")
        if vehicle_id:
            return VehicleDocuments.objects.filter(vehicle=vehicle_id)
        return super().get_queryset()
# ================================
# 🔥 AJOUT DE PHOTOS
# ================================
class VehiclePhotoUploadView(APIView):
    def post(self, request, vehicle_id):
        vehicle = get_object_or_404(Vehicule, id=vehicle_id)

        serializer = VehiclePhotoUploadSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        photos = serializer.validated_data["photos"]

        if vehicle.photos.count() + len(photos) > 5:
            return Response(
                {"detail": "Maximum 5 photos par véhicule"},
                status=status.HTTP_400_BAD_REQUEST
            )

        with transaction.atomic():
            base_order = vehicle.photos.count()
            for idx, photo in enumerate(photos):
                VehiclePhoto.objects.create(
                    vehicle=vehicle,
                    image=photo,
                    order=base_order + idx
                )

        return Response({"success": True}, status=status.HTTP_201_CREATED)


# ================================
# 🔥 SUPPRESSION PHOTO
# ================================
class VehiclePhotoDeleteView(APIView):
    def delete(self, request, photo_id):
        photo = get_object_or_404(VehiclePhoto, id=photo_id)

        if photo.image:
            try:
                delete_file(photo.image.url)
            except Exception:
                pass

        photo.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
