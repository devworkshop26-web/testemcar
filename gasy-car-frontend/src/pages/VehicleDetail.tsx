import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Star,
  MapPin,
  Users,
  Fuel,
  Settings,
  Shield,
  Calendar,
  Gauge,
  DoorOpen,
  Box,
  AlertCircle,
  ChevronLeft,
  Heart,
  Share2,
  Sparkles,
  MessageCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import CharacteristicsGrid from "@/components/vehicule/CharacteristicsGrid";
import OwnerCard from "@/components/vehicule/OwnerCard";
import RatingBar from "@/components/vehicule/RatingBar";
import ReviewCard from "@/components/vehicule/ReviewCard";
import ReviewForm from "@/components/vehicule/ReviewForm";
import VehicleAvailabilityCalendar from "@/components/vehicule/VehicleAvailabilityCalendar";
import ChauffeurCard from "@/components/vehicule/ChauffeurCard";

// 🔥 API hooks
import { useVehiculeQuery } from "@/useQuery/vehiculeUseQuery";
import { useCurentuser } from "@/useQuery/authUseQuery";
import { useReservationAction } from "@/hooks/useReservationAction";
import { useOwnerReviews, useCreateReview, useReviewEligibility } from "@/hooks/useReviews";
import { CreateReviewPayload } from "@/types/reveiewType";
import { useToast } from "@/hooks/use-toast";

// ======================================================
// 🎯 STATIC MOCK UNTIL BACKEND IS READY
// ======================================================
const mockRatings = {
  cleanliness: 4.9,
  communication: 4.8,
  value: 4.6,
  accuracy: 4.9,
  comfort: 4.7,
};

// ======================================================
// ⭐ Final Component
// ======================================================
const VehicleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: vehicle, isLoading } = useVehiculeQuery(id);
  const { user } = useCurentuser();
  const { data: reviews, isLoading: isLoadingReviews } = useOwnerReviews(vehicle?.proprietaire_data?.id);
  const { data: pendingReservations, isLoading: isLoadingEligibility } = useReviewEligibility(vehicle?.id);
  const { mutate: submitReview, isPending: isSubmittingReview } = useCreateReview();

  const [selectedImage, setSelectedImage] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  // SCROLL TO TOP ON MOUNT
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);



  // ======================================================
  // GALLERY USING REAL BACKEND DATA
  // ======================================================
  const photos = useMemo(() => {
    if (!vehicle?.photos?.length) return [];
    return [...vehicle.photos].sort((a, b) => {
      if (a.is_primary === b.is_primary) {
        return (a.order ?? 0) - (b.order ?? 0);
      }
      return a.is_primary ? -1 : 1;
    });
  }, [vehicle?.photos]);

  const safeIndex = photos.length > selectedImage ? selectedImage : 0;
  const mainPhoto = photos[safeIndex];

  // ======================================================
  // CHARACTERISTICS FROM API
  // ======================================================
  const characteristics = useMemo(() => {
    if (!vehicle) return [];
    return [
      { icon: Users, label: "Places", value: vehicle.nombre_places || "N/A" },
      { icon: Settings, label: "Transmission", value: vehicle.transmission_data?.nom || "N/A" },
      { icon: Fuel, label: "Carburant", value: vehicle.type_carburant_data?.nom || "N/A" },
      { icon: Gauge, label: "Kilométrage", value: `${vehicle.kilometrage_actuel_km?.toLocaleString()} km` },
      { icon: DoorOpen, label: "Portes", value: vehicle.nombre_portes },
      { icon: Box, label: "Coffre", value: `${vehicle.volume_coffre_litres} L` },
      { icon: Shield, label: "Couleur", value: vehicle.couleur },
      { icon: Calendar, label: "Année", value: vehicle.annee },
    ];
  }, [vehicle]);

  // ======================================================
  // REDIRECTION LOGIN OR RESERVATION
  // ======================================================
  const { handleReserve: reserveAction } = useReservationAction();

  const handleReserve = () => {
    if (id) reserveAction(id);
  };

  const handleReviewSubmit = (rating: number, comment: string) => {
    const mostRecentReservation = pendingReservations && pendingReservations.length > 0
      ? pendingReservations[0]
      : null;

    const reviewData: CreateReviewPayload = {
      author: user?.id,
      target: vehicle?.proprietaire_data?.id,
      review_type: "CLIENT_TO_OWNER" as const,
      rating,
      comment,
      ...(mostRecentReservation?.id && { reservation: mostRecentReservation.id }),
    };

    submitReview(reviewData, {
      onSuccess: () => {
        toast({
          title: "successfully",
          description: `Review submitted successfully.`,
        });
      },
      onError: (error) => {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Vous avez déjà laissé un avis pour cette réservation ou cet utilisateur.",
        });
      },
    });
  };

  // ======================================================
  // LOADING / NOT FOUND
  // ======================================================
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Chargement...
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Véhicule introuvable.
      </div>
    );
  }

  const displayMarque = vehicle.marque_data?.nom || "Marque inconnue";
  const displayModele = vehicle.modele_data?.label || "";
  const formattedPrice = Number(vehicle.prix_jour || 0).toLocaleString();


  // ======================================================
  // RENDER UI
  // ======================================================
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 py-6 max-w-7xl">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="gap-2 text-muted-foreground hover:text-foreground"
          >
            <ChevronLeft className="w-4 h-4" />
            Retour
          </Button>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => setIsLiked(!isLiked)}>
              <Heart className={`w-5 h-5 ${isLiked ? "fill-red-500 text-red-500" : ""}`} />
            </Button>

            <Button variant="ghost" size="icon">
              <Share2 className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* TITLE */}
        <header className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <h1 className="text-3xl font-bold">
              {vehicle.annee} {displayMarque} {displayModele}
            </h1>

            {vehicle.categorie_data && (
              <Badge
                variant="outline"
                className="text-sm font-medium font-poppins px-4 py-2 rounded-md"
              >
                {vehicle.categorie_data.nom}
              </Badge>

            )}
          </div>

          <div className="flex items-center gap-6 text-sm text-muted-foreground mt-3">
            <div className="flex items-center gap-1.5">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span className="font-semibold text-foreground">{vehicle.note_moyenne}</span>
              <span>({vehicle.nombre_locations} locations)</span>
            </div>

            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4" />
              {vehicle.ville} • {vehicle.zone}
            </div>
          </div>
        </header>

        {/* ======================================================
            🔥 GALLERY (MODIFIED: FIXED HEIGHTS)
        ====================================================== */}
        <section className="mb-8">
          <div className="w-full">

            {/* MAIN IMAGE – HAUTEUR FIXE IMPOSÉE */}
            <div className="w-full h-[300px] sm:h-[400px] lg:h-[500px] rounded-2xl overflow-hidden bg-muted mb-4">
              <img
                src={mainPhoto?.image}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                alt="Main Vehicle"
              />
            </div>

            {/* THUMBNAILS EN BAS — 5 PAR LIGNE AVEC HAUTEUR FIXE */}
            <div className="grid grid-cols-5 gap-2">
              {photos.slice(0, 5).map((photo, idx) => (
                <button
                  key={photo.id}
                  onClick={() => setSelectedImage(idx)}
                  className={`
                    h-20 sm:h-28 w-full rounded-xl overflow-hidden cursor-pointer transition-all
                    ${selectedImage === idx
                      ? "ring-2 ring-primary ring-offset-2 opacity-100"
                      : "opacity-60 hover:opacity-100"}
                  `}
                >
                  <img
                    src={photo.image}
                    className="w-full h-full object-cover"
                    alt={`Thumbnail ${idx}`}
                  />
                </button>
              ))}
            </div>

          </div>
        </section>

        {/* MAIN CONTENT */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* LEFT */}
          <div className="lg:col-span-2 space-y-6">

            {/* OWNER & REVIEWS TABS */}
            <Tabs defaultValue="owner" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="owner" className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Propriétaire
                </TabsTrigger>
                <TabsTrigger value="reviews" className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4" />
                  Avis ({reviews ? reviews.length : 0})
                </TabsTrigger>
              </TabsList>

              {/* TAB: OWNER */}
              <TabsContent value="owner">
                <Card>
                  <CardContent className="p-5">
                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-primary" />
                      Propriétaire du véhicule
                    </h2>

                    {vehicle.proprietaire_data ? (
                      <OwnerCard
                        firstName={vehicle.proprietaire_data.first_name}
                        lastName={vehicle.proprietaire_data.last_name}
                        photoUrl={vehicle.proprietaire_data.image}
                        rating={Number(vehicle.note_moyenne || 0)}
                        totalRentals={vehicle.nombre_locations}
                        isVerified
                      />
                    ) : (
                      <p className="text-muted-foreground italic">Informations propriétaire indisponibles</p>
                    )}
                  </CardContent>
                </Card>

                {/* CHAUFFEUR ASSIGNÉ */}
                {vehicle.driver_data && (
                  <Card className="mt-6 border-none shadow-sm bg-primary/5">
                    <CardContent className="p-5">
                      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Users className="w-5 h-5 text-primary" />
                        Chauffeur assigné
                      </h2>
                      <ChauffeurCard
                        firstName={vehicle.driver_data.first_name}
                        lastName={vehicle.driver_data.last_name}
                        photoUrl={vehicle.driver_data.profile_photo || ""}
                        experience={vehicle.driver_data.experience_years}
                        phone={vehicle.driver_data.phone_number}
                        className="bg-white border-none shadow-none"
                      />
                    </CardContent>
                  </Card>
                )}

                {/* CARACTÉRISTIQUES */}
                <Card className="mt-6">
                  <CardContent className="p-5">
                    <h2 className="text-lg font-semibold mb-4">Caractéristiques</h2>
                    <CharacteristicsGrid items={characteristics} />
                  </CardContent>
                </Card>

                {/* DESCRIPTION */}
                <Card className="mt-6">
                  <CardContent className="p-5">
                    <h2 className="text-lg font-semibold mb-3">Description</h2>
                    <p className="text-muted-foreground">{vehicle.description}</p>

                    {vehicle.conditions_particulieres && (
                      <div className="mt-4 p-3 bg-amber-50 rounded-lg border">
                        <h3 className="text-sm font-semibold text-amber-700 flex items-center gap-2 mb-1">
                          <AlertCircle className="w-4 h-4" />
                          Conditions particulières
                        </h3>

                        <p className="text-xs text-amber-600">
                          {vehicle.conditions_particulieres}
                        </p>
                      </div>
                    )}

                    {vehicle.equipements_details && vehicle.equipements_details.length > 0 && (
                      <>
                        <Separator className="my-4" />
                        <h3 className="text-sm font-semibold mb-3">Équipements</h3>
                        <div className="flex flex-wrap gap-2">
                          {vehicle.equipements_details.map((feature: any, idx: number) => (
                            <Badge key={idx} variant="outline" className="text-xs font-normal">
                              {feature.label ?? feature.code}
                            </Badge>
                          ))}
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>

                {/* LOCALISATION */}
                <Card className="mt-6">
                  <CardContent className="p-5">
                    <h2 className="text-lg font-semibold mb-3">Localisation</h2>

                    <div className="flex items-start gap-3 text-sm">
                      <MapPin className="w-5 h-5 text-primary" />

                      <div>
                        {/* <p className="font-medium">{vehicle.adresse_localisation}</p> */}
                        <p className="text-muted-foreground">
                          {vehicle.ville} • {vehicle.zone}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* CALENDRIER DISPONIBILITÉ */}
                <Card className="mt-6">
                  <CardContent className="p-5">
                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-primary" />
                      Disponibilités
                    </h2>
                    {id && <VehicleAvailabilityCalendar vehicleId={id} availabilities={vehicle.availabilities} />}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* TAB: REVIEWS */}
              <TabsContent value="reviews">
                <Card>
                  <CardContent className="p-5">
                    {/* Rating Overview */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-6 mb-6">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-primary font-bold text-xl uppercase">
                          {vehicle.proprietaire_data?.first_name?.[0] || "?"}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <Star className="w-6 h-6 fill-amber-400 text-amber-400" />
                            <span className="text-3xl font-bold">{vehicle.note_moyenne || "0.0"}</span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {vehicle.nombre_locations} avis
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Rating Bars (Mock for now as backend doesn't provide breakdown yet) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                      <RatingBar label="Propreté" value={mockRatings.cleanliness} />
                      <RatingBar label="Communication" value={mockRatings.communication} />
                      <RatingBar label="Rapport qualité/prix" value={mockRatings.value} />
                      <RatingBar label="Exactitude" value={mockRatings.accuracy} />
                      <RatingBar label="Confort" value={mockRatings.comfort} className="sm:col-span-2 sm:max-w-[calc(50%-0.375rem)]" />
                    </div>

                    <Separator className="my-6" />

                    {/* Reviews List */}
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <MessageCircle className="w-5 h-5 text-primary" />
                      Tous les avis
                    </h3>

                    <div className="space-y-6">
                      {isLoadingReviews ? (
                        <div className="text-center py-4 text-muted-foreground">Chargement des avis...</div>
                      ) : Array.isArray(reviews) && reviews.length > 0 ? (
                        reviews.map((review: any) => (
                          <ReviewCard
                            key={review.id}
                            firstName={review.author_details?.first_name || "Utilisateur"}
                            lastName={review.author_details?.last_name || ""}
                            photoUrl={review.author_details?.image}
                            rating={review.rating}
                            date={new Date(review.created_at).toLocaleDateString()}
                            comment={review.comment}
                          />
                        ))
                      ) : (
                        <div className="text-center py-4 text-muted-foreground">Aucun avis pour le moment.</div>
                      )}
                    </div>

                    <Separator className="my-6" />

                    {/* Review Form */}
                    <h3 className="text-lg font-semibold mb-4">Laisser un avis</h3>
                    {!user ? (
                      <div className="p-4 bg-muted/50 rounded-lg text-center">
                        <p className="text-muted-foreground mb-2">
                          Vous devez être connecté pour laisser un avis.
                        </p>
                        <Button variant="outline" onClick={() => navigate("/login")}>
                          Se connecter
                        </Button>
                      </div>
                    ) : (
                      <div>
                        {pendingReservations && pendingReservations.length > 0 && (
                          <div className="mb-3 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                            <p className="text-xs text-green-700 dark:text-green-400">
                              ✓ Vous avez loué ce véhicule - Votre avis sera marqué comme vérifié
                            </p>
                          </div>
                        )}
                        <ReviewForm onSubmit={handleReviewSubmit} />
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>


          {/* RIGHT PANEL — BOOKING */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6 shadow-xl">
              <CardContent className="p-6">

                <div className="text-3xl font-semibold font-poppins">
                  {formattedPrice} {vehicle.devise}
                  <span className="text-sm text-muted-foreground font-medium font-poppins"> / jour</span>
                </div>

                <Separator className="my-4" />


                {/* PRIX DÉTAILLÉS */}
                <div className="space-y-2.5 text-sm mb-5">
                  {vehicle.prix_heure && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">À l'heure</span>
                      <span className="font-medium font-poppins">
                        {Number(vehicle.prix_heure).toLocaleString()} {vehicle.devise}
                      </span>
                    </div>
                  )}

                  {vehicle.prix_jour && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">À la journée</span>
                      <span className="font-medium font-poppins">
                        {Number(vehicle.prix_jour).toLocaleString()} {vehicle.devise}
                      </span>
                    </div>
                  )}

                  {vehicle.prix_mois && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Au mois</span>
                      <span className="font-medium font-poppins">
                        {Number(vehicle.prix_mois).toLocaleString()} {vehicle.devise}
                      </span>
                    </div>
                  )}

                  {vehicle.prix_par_semaine && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">À la semaine</span>
                      <span className="font-medium font-poppins">
                        {Number(vehicle.prix_par_semaine).toLocaleString()} {vehicle.devise}
                      </span>
                    </div>
                  )}

                  {(vehicle.remise_par_heure || vehicle.remise_par_jour || vehicle.remise_par_mois) && (
                    <div className="mt-3 pt-3 border-t border-dashed space-y-1">
                      <p className="text-xs font-semibold text-green-600 mb-2">Remises disponibles :</p>
                      {vehicle.remise_par_heure && (
                        <div className="flex justify-between text-xs text-green-700">
                          <span>Sur tarif horaire</span>
                          <span className="font-bold">-{Number(vehicle.remise_par_heure)}%</span>
                        </div>
                      )}
                      {vehicle.remise_par_jour && (
                        <div className="flex justify-between text-xs text-green-700">
                          <span>Sur tarif journalier</span>
                          <span className="font-bold">-{Number(vehicle.remise_par_jour)}%</span>
                        </div>
                      )}
                      {vehicle.remise_par_mois && (
                        <div className="flex justify-between text-xs text-green-700">
                          <span>Sur tarif mensuel</span>
                          <span className="font-bold">-{Number(vehicle.remise_par_mois)}%</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <Button
                  className="w-full py-6 rounded-xl text-base font-medium font-poppins"
                  onClick={handleReserve}
                >
                  Réserver ce véhicule
                </Button>

                <Separator className="my-5" />

                {vehicle.proprietaire_data && (
                  <OwnerCard
                    firstName={vehicle.proprietaire_data.first_name}
                    lastName={vehicle.proprietaire_data.last_name}
                    photoUrl={vehicle.proprietaire_data.image}
                    rating={Number(vehicle.note_moyenne || 0)}
                    totalRentals={vehicle.nombre_locations}
                    isVerified
                  />
                )}
              </CardContent>
            </Card>
          </div>

        </div>

      </div>
    </div>
  );
};

export default VehicleDetail;