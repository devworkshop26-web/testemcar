import { useMemo, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, X, Eye } from "lucide-react";
import {
  useReservationTransitionMutation,
  useAllReservationOfMyvehiculeQuery,
  useCreateReservationMutation,
  useReservationPricingConfigQuery,
} from "@/useQuery/reservationsUseQuery";
import { useCurentuser } from "@/useQuery/authUseQuery";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import {
  useOwnerClientsQuery,
  useOwnerVehiculesQuery,
} from "@/useQuery/vehiculeUseQuery";
import { Reservation } from "@/types/reservationsType";

const BookingsView = () => {
  const { user } = useCurentuser();
  const navigate = useNavigate();

  const { data: allReservations = [], isLoading: isLoadingReservations } =
    useAllReservationOfMyvehiculeQuery(user?.id);

  const { data: pricingConfig } = useReservationPricingConfigQuery();
  const { data: ownerClients = [] } = useOwnerClientsQuery(user?.id);
  const { data: ownerVehicles = [] } = useOwnerVehiculesQuery(user?.id);

  const createReservationMutation = useCreateReservationMutation();
  const reservationTransitionMutation = useReservationTransitionMutation();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [useGuest, setUseGuest] = useState(false);

  const [clientId, setClientId] = useState("");
  const [guestFirstName, setGuestFirstName] = useState("");
  const [guestLastName, setGuestLastName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestPhone, setGuestPhone] = useState("");

  const [vehicleId, setVehicleId] = useState("");
  const [startDatetime, setStartDatetime] = useState("");
  const [endDatetime, setEndDatetime] = useState("");

  const [totalDays, setTotalDays] = useState(1);
  const [baseAmount, setBaseAmount] = useState("");
  const [optionsAmount, setOptionsAmount] = useState("0");
  const [totalAmount, setTotalAmount] = useState("");
  const [cautionAmount, setCautionAmount] = useState("");

  const [withChauffeur, setWithChauffeur] = useState(false);
  const [pickupLocation, setPickupLocation] = useState("");
  const [dropoffLocation, setDropoffLocation] = useState("");
  const [pricingZone, setPricingZone] = useState<"URBAIN" | "PROVINCE">("URBAIN");

  const [error, setError] = useState<string | null>(null);

  const selectedVehicle = useMemo(
    () => ownerVehicles.find((vehicle) => vehicle.id === vehicleId),
    [ownerVehicles, vehicleId]
  );

  const getNumberValue = (value?: string | number | null) => {
    if (value === null || value === undefined) return 0;
    if (typeof value === "number") return Number.isNaN(value) ? 0 : value;

    const normalized = value.replace(/,/g, ".");
    const parsed = Number.parseFloat(normalized);
    return Number.isNaN(parsed) ? 0 : parsed;
  };

  const handleReservationTransition = async (
    reservationId: string,
    action: "accept" | "cancel"
  ) => {
    try {
      await reservationTransitionMutation.mutateAsync({
        id: reservationId,
        action,
      });

      toast.success(
        action === "accept"
          ? "Réservation confirmée avec succès."
          : "Réservation refusée avec succès."
      );
    } catch (error: any) {
      toast.error(
        error?.response?.data?.detail ||
          "Impossible de mettre à jour le statut."
      );
    }
  };

  const getReservationDisplayTotal = (reservation: Reservation) => {
    const baseAmount = getNumberValue(reservation.base_amount);
    const rawOptionsAmount = getNumberValue(reservation.options_amount);
    const rawTotalAmount = getNumberValue(reservation.total_amount);
    const totalDays = Math.max(1, getNumberValue(reservation.total_days) || 1);

    const equipmentsAmount = (reservation.equipments_data ?? []).reduce(
      (sum, equipment) => sum + getNumberValue(equipment?.price) * totalDays,
      0
    );

    const servicesAmount = (reservation.services_data ?? []).reduce(
      (sum, service) =>
        sum +
        getNumberValue(service?.price) *
          Math.max(1, getNumberValue(service?.quantity) || 1),
      0
    );

    const optionsAmount = Math.max(
      rawOptionsAmount,
      equipmentsAmount + servicesAmount
    );

    const configuredServiceFee = Math.max(
      0,
      getNumberValue(pricingConfig?.service_fee) || 0
    );

    return Math.max(
      rawTotalAmount,
      baseAmount + optionsAmount + configuredServiceFee,
      baseAmount + optionsAmount
    );
  };

  const calculateTotalDays = (start: string, end: string) => {
    if (!start || !end) return 1;

    const startDate = new Date(start);
    const endDate = new Date(end);

    if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
      return 1;
    }

    const diffMs = endDate.getTime() - startDate.getTime();
    if (diffMs <= 0) return 1;

    return Math.max(1, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
  };

  useEffect(() => {
    if (!selectedVehicle) {
      setBaseAmount("");
      setCautionAmount("");
      return;
    }

    const provincePrice =
      selectedVehicle.province_prix_jour ?? selectedVehicle.prix_jour;
    const basePrice =
      pricingZone === "PROVINCE" ? provincePrice : selectedVehicle.prix_jour;

    setBaseAmount(basePrice || "0");
    setCautionAmount(selectedVehicle.montant_caution || "0");
    setPickupLocation(selectedVehicle.adresse_localisation || "");
  }, [pricingZone, selectedVehicle]);

  useEffect(() => {
    setTotalDays(calculateTotalDays(startDatetime, endDatetime));
  }, [startDatetime, endDatetime]);

  useEffect(() => {
    const base = getNumberValue(baseAmount);
    const options = getNumberValue(optionsAmount);
    const total = base * totalDays + options;
    setTotalAmount(total.toFixed(2));
  }, [baseAmount, optionsAmount, totalDays]);

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "PENDING":
        return "En attente";
      case "CONFIRMED":
        return "Confirmé";
      case "IN_PROGRESS":
        return "En cours";
      case "COMPLETED":
        return "Terminé";
      case "CANCELLED":
        return "Annulé";
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-orange-100 text-orange-700 border-orange-200";
      case "CONFIRMED":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "IN_PROGRESS":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "COMPLETED":
        return "bg-gray-100 text-gray-700 border-gray-200";
      case "CANCELLED":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const resetForm = () => {
    setClientId("");
    setGuestFirstName("");
    setGuestLastName("");
    setGuestEmail("");
    setGuestPhone("");

    setVehicleId("");
    setStartDatetime("");
    setEndDatetime("");

    setTotalDays(1);
    setBaseAmount("");
    setOptionsAmount("0");
    setTotalAmount("");
    setCautionAmount("");

    setWithChauffeur(false);
    setPickupLocation("");
    setDropoffLocation("");
    setPricingZone("URBAIN");
    setUseGuest(false);
    setError(null);
  };

  const handleCreateReservation = async () => {
    if (!vehicleId) {
      setError("Veuillez sélectionner un véhicule.");
      return;
    }

    if (!startDatetime || !endDatetime) {
      setError("Les dates de début et de fin sont obligatoires.");
      return;
    }

    if (new Date(endDatetime) <= new Date(startDatetime)) {
      setError("La date de fin doit être après la date de début.");
      return;
    }

    if (!pickupLocation.trim()) {
      setError("Le lieu de prise en charge est obligatoire.");
      return;
    }

    if (!cautionAmount) {
      setError("Le montant de caution est obligatoire.");
      return;
    }

    if (!useGuest && !clientId) {
      setError("Sélectionnez un client ou activez le mode invité.");
      return;
    }

    if (useGuest) {
      const hasContact = guestEmail.trim() || guestPhone.trim();
      if (!guestFirstName.trim() || !guestLastName.trim() || !hasContact) {
        setError(
          "Nom, prénom et un contact (email ou téléphone) sont requis pour un invité."
        );
        return;
      }
    }

    setError(null);

    try {
      await createReservationMutation.mutateAsync({
        client: useGuest ? undefined : clientId,
        guest_first_name: useGuest ? guestFirstName : undefined,
        guest_last_name: useGuest ? guestLastName : undefined,
        guest_email: useGuest ? guestEmail : undefined,
        guest_phone: useGuest ? guestPhone : undefined,
        vehicle: vehicleId,
        start_datetime: startDatetime,
        end_datetime: endDatetime,
        caution_amount: cautionAmount,
        with_chauffeur: withChauffeur,
        pickup_location: pickupLocation,
        dropoff_location: dropoffLocation,
        driving_mode: withChauffeur ? "WITH_DRIVER" : "SELF_DRIVE",
        pricing_zone: pricingZone,
      });

      toast.success("Réservation créée avec succès.");
      setDialogOpen(false);
      resetForm();
    } catch (err: any) {
      const message =
        err?.response?.data?.detail ||
        err?.message ||
        "Impossible de créer la réservation.";
      setError(message);
      toast.error(message);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 font-poppins">
            Réservations
          </h2>
          <p className="text-gray-500 text-sm">
            Suivi des demandes et locations en cours.
          </p>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-xl">Créer une réservation</Button>
          </DialogTrigger>

          <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[640px]">
            <DialogHeader>
              <DialogTitle>Nouvelle réservation</DialogTitle>
              <DialogDescription>
                Créez une réservation pour un client existant ou un invité.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              <div className="flex items-center justify-between rounded-lg border border-gray-100 p-3">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Client invité
                  </p>
                  <p className="text-xs text-gray-500">
                    Activez pour saisir un client sans compte
                  </p>
                </div>

                <Switch
                  checked={useGuest}
                  onCheckedChange={(value) => {
                    setUseGuest(value);
                    setClientId("");
                  }}
                />
              </div>

              {!useGuest && (
                <div className="grid gap-2">
                  <Label htmlFor="client">Client *</Label>
                  <select
                    id="client"
                    className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                    value={clientId}
                    onChange={(event) => setClientId(event.target.value)}
                  >
                    <option value="">Sélectionner un client</option>
                    {ownerClients.map((client) => (
                      <option key={client.id} value={client.id}>
                        {client.first_name} {client.last_name} ({client.email})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {useGuest && (
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="guestFirstName">Prénom *</Label>
                    <Input
                      id="guestFirstName"
                      value={guestFirstName}
                      onChange={(event) => setGuestFirstName(event.target.value)}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="guestLastName">Nom *</Label>
                    <Input
                      id="guestLastName"
                      value={guestLastName}
                      onChange={(event) => setGuestLastName(event.target.value)}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="guestEmail">Email *</Label>
                    <Input
                      id="guestEmail"
                      type="email"
                      value={guestEmail}
                      onChange={(event) => setGuestEmail(event.target.value)}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="guestPhone">Téléphone *</Label>
                    <Input
                      id="guestPhone"
                      value={guestPhone}
                      onChange={(event) => setGuestPhone(event.target.value)}
                    />
                  </div>
                </div>
              )}

              <div className="grid gap-2">
                <Label htmlFor="vehicle">Véhicule *</Label>
                <select
                  id="vehicle"
                  className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                  value={vehicleId}
                  onChange={(event) => setVehicleId(event.target.value)}
                >
                  <option value="">Sélectionner un véhicule</option>
                  {ownerVehicles.map((vehicle) => (
                    <option key={vehicle.id} value={vehicle.id}>
                      {vehicle.titre || vehicle.marque_data?.nom}{" "}
                      {vehicle.modele_data?.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="pricingZone">Zone de déplacement</Label>
                <select
                  id="pricingZone"
                  className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                  value={pricingZone}
                  onChange={(event) =>
                    setPricingZone(event.target.value as "URBAIN" | "PROVINCE")
                  }
                >
                  <option value="URBAIN">Urbain</option>
                  <option value="PROVINCE">Province</option>
                </select>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="startDatetime">Début *</Label>
                  <Input
                    id="startDatetime"
                    type="datetime-local"
                    value={startDatetime}
                    onChange={(event) => setStartDatetime(event.target.value)}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="endDatetime">Fin *</Label>
                  <Input
                    id="endDatetime"
                    type="datetime-local"
                    value={endDatetime}
                    onChange={(event) => setEndDatetime(event.target.value)}
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="grid gap-2">
                  <Label htmlFor="totalDays">Jours</Label>
                  <Input
                    id="totalDays"
                    type="number"
                    min={1}
                    value={totalDays}
                    readOnly
                  />
                  <p className="text-xs text-gray-500">
                    Calculé automatiquement depuis les dates.
                  </p>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="baseAmount">Montant base</Label>
                  <Input
                    id="baseAmount"
                    type="number"
                    min={0}
                    value={baseAmount}
                    readOnly
                  />
                  <p className="text-xs text-gray-500">
                    Tarif journalier du véhicule.
                  </p>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="optionsAmount">Options</Label>
                  <Input
                    id="optionsAmount"
                    type="number"
                    min={0}
                    value={optionsAmount}
                    onChange={(event) => setOptionsAmount(event.target.value)}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="totalAmount">Total</Label>
                  <Input
                    id="totalAmount"
                    type="number"
                    min={0}
                    value={totalAmount}
                    readOnly
                  />
                  <p className="text-xs text-gray-500">
                    Calculé automatiquement.
                  </p>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="cautionAmount">Caution *</Label>
                  <Input
                    id="cautionAmount"
                    type="number"
                    min={0}
                    value={cautionAmount}
                    readOnly
                  />
                  <p className="text-xs text-gray-500">
                    Caution définie sur le véhicule.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between rounded-lg border border-gray-100 p-3">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Avec chauffeur
                  </p>
                  <p className="text-xs text-gray-500">
                    Activer si la réservation inclut un chauffeur
                  </p>
                </div>

                <Switch
                  checked={withChauffeur}
                  onCheckedChange={setWithChauffeur}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="pickupLocation">Lieu de prise en charge *</Label>
                <Textarea
                  id="pickupLocation"
                  value={pickupLocation}
                  onChange={(event) => setPickupLocation(event.target.value)}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="dropoffLocation">Lieu de retour</Label>
                <Textarea
                  id="dropoffLocation"
                  value={dropoffLocation}
                  onChange={(event) => setDropoffLocation(event.target.value)}
                />
              </div>

              {error && (
                <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
                  {error}
                </p>
              )}
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setDialogOpen(false);
                  resetForm();
                }}
              >
                Annuler
              </Button>

              <Button
                onClick={handleCreateReservation}
                disabled={createReservationMutation.isPending}
              >
                {createReservationMutation.isPending ? "Création..." : "Créer"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-none shadow-md rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-100">
              <tr>
                <th className="px-6 py-4">Référence</th>
                <th className="px-6 py-4">Véhicule</th>
                <th className="px-6 py-4">Client</th>
                <th className="px-6 py-4">Période</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4">Statut</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {isLoadingReservations ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i}>
                    <td className="px-6 py-4">
                      <Skeleton className="h-4 w-20" />
                    </td>
                    <td className="px-6 py-4">
                      <Skeleton className="h-4 w-32" />
                    </td>
                    <td className="px-6 py-4">
                      <Skeleton className="h-4 w-24" />
                    </td>
                    <td className="px-6 py-4">
                      <Skeleton className="h-4 w-40" />
                    </td>
                    <td className="px-6 py-4">
                      <Skeleton className="h-4 w-20" />
                    </td>
                    <td className="px-6 py-4">
                      <Skeleton className="h-6 w-20 rounded-full" />
                    </td>
                    <td className="px-6 py-4">
                      <Skeleton className="h-4 w-16 ml-auto" />
                    </td>
                  </tr>
                ))
              ) : allReservations.length > 0 ? (
                allReservations.map((reservation: Reservation) => {
                  const guestFirstName = reservation.guest_first_name;
                  const guestLastName = reservation.guest_last_name;
                  const guestEmail = reservation.guest_email;
                  const guestPhone = reservation.guest_phone;

                  const hasGuestIdentity = Boolean(
                    guestFirstName || guestLastName || guestEmail || guestPhone
                  );

                  const resolvedClient =
                    reservation.client_data ||
                    ownerClients.find((client) => client.id === reservation.client);

                  const clientFirstName = resolvedClient?.first_name;
                  const clientLastName = resolvedClient?.last_name;
                  const clientEmail = resolvedClient?.email;

                  const displayName = hasGuestIdentity
                    ? `${guestFirstName ?? ""} ${guestLastName ?? ""}`.trim() ||
                      guestEmail ||
                      guestPhone ||
                      "N/A"
                    : clientFirstName || clientLastName
                    ? `${clientFirstName ?? ""} ${clientLastName ?? ""}`.trim()
                    : clientEmail || "N/A";

                  const displayEmail = hasGuestIdentity ? guestEmail : clientEmail;

                  const initialsSourceFirst = hasGuestIdentity
                    ? guestFirstName
                    : clientFirstName;
                  const initialsSourceLast = hasGuestIdentity
                    ? guestLastName
                    : clientLastName;

                  const initialsFallback =
                    displayEmail?.substring(0, 2).toUpperCase() ?? "CL";

                  const initials = `${
                    initialsSourceFirst?.substring(0, 1).toUpperCase() ?? ""
                  }${
                    initialsSourceLast?.substring(0, 1).toUpperCase() ??
                    initialsFallback
                  }`;

                  const vehicleTitle =
                    reservation.vehicle_data?.titre ||
                    reservation.vehicle ||
                    "N/A";

                  const vehicleBrand =
                    reservation.vehicle_data?.marque_data?.nom ||
                    (reservation.vehicle_data as any)?.marque?.nom ||
                    "";

                  const vehicleModel =
                    reservation.vehicle_data?.modele_data?.label ||
                    (reservation.vehicle_data as any)?.modele?.label ||
                    "";

                  const paymentValidated =
                    reservation.payment?.status === "VALIDATED";

                  return (
                    <tr
                      key={reservation.id}
                      className="hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="px-6 py-4 font-mono text-sm font-semibold text-gray-900">
                        {reservation.reference}
                      </td>

                      <td className="px-6 py-4 font-medium text-gray-900">
                        {vehicleTitle}
                        <div className="text-xs text-gray-500">
                          {vehicleBrand} {vehicleModel}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-[10px] font-bold text-blue-600">
                            {initials}
                          </div>
                          <div>
                            <div className="font-medium">{displayName}</div>
                            {displayEmail && displayName !== displayEmail && (
                              <div className="text-xs text-gray-500">
                                {displayEmail}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-gray-500">
                        {new Date(reservation.start_datetime).toLocaleDateString()} -{" "}
                        {new Date(reservation.end_datetime).toLocaleDateString()}
                      </td>

                      <td className="px-6 py-4 font-medium">
                        {Math.round(getReservationDisplayTotal(reservation)).toLocaleString()} Ar
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                            reservation.status
                          )}`}
                        >
                          {getStatusLabel(reservation.status)}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() =>
                              navigate(`/prestataire/bookings/${reservation.id}`)
                            }
                          >
                            <Eye className="w-4 h-4 text-gray-400" />
                          </Button>

                          {reservation.status === "PENDING" && (
                            <>
                              <button
                                type="button"
                                className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                onClick={() =>
                                  handleReservationTransition(
                                    reservation.id,
                                    "accept"
                                  )
                                }
                                disabled={
                                  reservationTransitionMutation.isPending ||
                                  !paymentValidated
                                }
                                title={
                                  !paymentValidated
                                    ? "Le paiement doit être validé avant confirmation."
                                    : "Confirmer la réservation"
                                }
                              >
                                <Check className="w-4 h-4" />
                              </button>

                              <button
                                type="button"
                                className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                                onClick={() =>
                                  handleReservationTransition(
                                    reservation.id,
                                    "cancel"
                                  )
                                }
                                disabled={reservationTransitionMutation.isPending}
                                title="Refuser la réservation"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    Aucune réservation trouvée
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {allReservations.length > 0 && (
          <div className="p-4 border-t border-gray-100 flex justify-between items-center text-xs text-gray-500">
            <span>
              Affichage 1-{Math.min(allReservations.length, 10)} sur{" "}
              {allReservations.length}
            </span>
            <div className="flex gap-1">
              <Button variant="ghost" size="sm" disabled>
                Précédent
              </Button>
              <Button variant="ghost" size="sm">
                Suivant
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default BookingsView;