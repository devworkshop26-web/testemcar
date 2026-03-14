// app/admin/bookings/_components/CreateReservationDialog.tsx
"use client";

import { useState, FormEvent, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
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
import { useToast } from "@/components/ui/use-toast";
import { useCreateReservationMutation } from "@/useQuery/reservationsUseQuery";
import { Reservation } from "@/types/reservationsType";
import { useVehiculesQuery } from "@/useQuery/vehiculeUseQuery";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown, User, Car } from "lucide-react";
import { cn } from "@/lib/utils";
import { adminUseQuery } from "@/useQuery/adminUseQuery";

interface CreateReservationDialogProps {
  onCreated?: (reservation: Reservation) => void;
}

export function CreateReservationDialog({
  onCreated,
}: CreateReservationDialogProps) {
  const { toast } = useToast();
  const createMutation = useCreateReservationMutation();

  const [clientId, setClientId] = useState("");
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
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [clientOpen, setClientOpen] = useState(false);
  const [vehicleOpen, setVehicleOpen] = useState(false);

  // Fetch clients and vehicles
  const { clientData = [] } = adminUseQuery();
  const { data: vehicles = [], isLoading: isLoadingVehicles } = useVehiculesQuery();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!clientId.trim() || !vehicleId.trim()) {
      setError("Client et véhicule sont obligatoires.");
      return;
    }
    if (!startDatetime || !endDatetime) {
      setError("Les dates de début et de fin sont obligatoires.");
      return;
    }
    if (!baseAmount || !totalAmount || !cautionAmount) {
      setError("Les montants base, total et caution sont obligatoires.");
      return;
    }
    if (!pickupLocation.trim()) {
      setError("Le lieu de prise en charge est obligatoire.");
      return;
    }

    setError(null);
    try {
      const payload = {
        client: clientId,
        vehicle: vehicleId,
        start_datetime: startDatetime,
        end_datetime: endDatetime,
        total_days: totalDays,
        base_amount: baseAmount,
        options_amount: optionsAmount || "0",
        total_amount: totalAmount,
        caution_amount: cautionAmount,
        with_chauffeur: withChauffeur,
        pickup_location: pickupLocation,
        dropoff_location: dropoffLocation,
      };

      const created = await createMutation.mutateAsync(payload);

      // reset rapide
      setClientId("");
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
      setOpen(false);
      onCreated?.(created);

      toast({
        title: "Réservation créée",
        description: `Réservation ${created.reference} créée avec succès.`,
      });
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue.");
      toast({
        variant: "destructive",
        title: "Erreur",
        description: err.message || "Impossible de créer la réservation.",
      });
    }
  };

  const handleDaysChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value) || 1;
    setTotalDays(value);
  };

  const selectedClient = clientData?.find(c => c.id === clientId);
  const selectedVehicle = vehicles?.find(v => v.id === vehicleId);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-xl">Créer une réservation</Button>
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
        <form onSubmit={handleSubmit} className="space-y-4">
          <DialogHeader>
            <DialogTitle>Nouvelle réservation</DialogTitle>
            <DialogDescription>
              Crée une réservation manuelle pour un client et un véhicule.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4">
            {/* Client Selection */}
            <div className="grid gap-2">
              <Label>Client</Label>
              <Popover open={clientOpen} onOpenChange={setClientOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={clientOpen}
                    className="justify-between"
                    disabled={createMutation.isPending}
                  >
                    {selectedClient ? (
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span>{selectedClient.username || selectedClient.email}</span>
                      </div>
                    ) : (
                      "Sélectionner un client..."
                    )}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[400px] p-0">
                  <Command>
                    <CommandInput placeholder="Rechercher un client..." />
                    <CommandList>
                      <CommandEmpty>Aucun client trouvé.</CommandEmpty>
                      <CommandGroup>
                        {clientData?.map((client) => (
                          <CommandItem
                            key={client.id}
                            value={`${client.username} ${client.email} ${client.first_name} ${client.last_name}`}
                            onSelect={() => {
                              setClientId(client.id);
                              setClientOpen(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                clientId === client.id ? "opacity-100" : "opacity-0"
                              )}
                            />
                            <div className="flex flex-col">
                              <span className="font-medium">
                                {client.username || client.email}
                              </span>
                              {client.first_name && client.last_name && (
                                <span className="text-xs text-muted-foreground">
                                  {client.first_name} {client.last_name}
                                </span>
                              )}
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            {/* Vehicle Selection */}
            <div className="grid gap-2">
              <Label>Véhicule</Label>
              <Popover open={vehicleOpen} onOpenChange={setVehicleOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={vehicleOpen}
                    className="justify-between"
                    disabled={createMutation.isPending || isLoadingVehicles}
                  >
                    {selectedVehicle ? (
                      <div className="flex items-center gap-2">
                        <Car className="h-4 w-4" />
                        <span>
                          {selectedVehicle.marque_data?.nom} {selectedVehicle.modele_data?.label} - {selectedVehicle.annee}
                        </span>
                      </div>
                    ) : (
                      "Sélectionner un véhicule..."
                    )}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[400px] p-0">
                  <Command>
                    <CommandInput placeholder="Rechercher un véhicule..." />
                    <CommandList>
                      <CommandEmpty>Aucun véhicule trouvé.</CommandEmpty>
                      <CommandGroup>
                        {vehicles.map((vehicle) => (
                          <CommandItem
                            key={vehicle.id}
                            value={`${vehicle.titre} ${vehicle.marque_data?.nom} ${vehicle.modele_data?.label} ${vehicle.annee}`}
                            onSelect={() => {
                              setVehicleId(vehicle.id);
                              setVehicleOpen(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                vehicleId === vehicle.id ? "opacity-100" : "opacity-0"
                              )}
                            />
                            <div className="flex flex-col">
                              <span className="font-medium">{vehicle.titre}</span>
                              <span className="text-xs text-muted-foreground">
                                {vehicle.marque_data?.nom} {vehicle.modele_data?.label} - {vehicle.annee} • {vehicle.prix_jour} {vehicle.devise}/jour
                              </span>
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            <div className="grid gap-2 md:grid-cols-3">
              <div className="grid gap-2 md:col-span-2">
                <Label>Date & heure de début</Label>
                <Input
                  type="datetime-local"
                  value={startDatetime}
                  onChange={(e) => setStartDatetime(e.target.value)}
                  disabled={createMutation.isPending}
                />
              </div>
              <div className="grid gap-2">
                <Label>Jours</Label>
                <Input
                  type="number"
                  min={1}
                  value={totalDays}
                  onChange={handleDaysChange}
                  disabled={createMutation.isPending}
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label>Date & heure de fin</Label>
              <Input
                type="datetime-local"
                value={endDatetime}
                onChange={(e) => setEndDatetime(e.target.value)}
                disabled={createMutation.isPending}
              />
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <div className="grid gap-2">
                <Label>Montant de base</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={baseAmount}
                  onChange={(e) => setBaseAmount(e.target.value)}
                  disabled={createMutation.isPending}
                />
              </div>
              <div className="grid gap-2">
                <Label>Montant options</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={optionsAmount}
                  onChange={(e) => setOptionsAmount(e.target.value)}
                  disabled={createMutation.isPending}
                />
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <div className="grid gap-2">
                <Label>Total</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={totalAmount}
                  onChange={(e) => setTotalAmount(e.target.value)}
                  disabled={createMutation.isPending}
                />
              </div>
              <div className="grid gap-2">
                <Label>Caution</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={cautionAmount}
                  onChange={(e) => setCautionAmount(e.target.value)}
                  disabled={createMutation.isPending}
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label>Lieu de prise en charge</Label>
              <Textarea
                value={pickupLocation}
                onChange={(e) => setPickupLocation(e.target.value)}
                disabled={createMutation.isPending}
              />
            </div>

            <div className="grid gap-2">
              <Label>Lieu de retour (optionnel)</Label>
              <Textarea
                value={dropoffLocation}
                onChange={(e) => setDropoffLocation(e.target.value)}
                disabled={createMutation.isPending}
              />
            </div>

            <div className="flex items-center justify-between rounded-xl bg-gray-50 px-3 py-2">
              <div>
                <p className="text-sm font-medium text-gray-800">
                  Avec chauffeur
                </p>
                <p className="text-xs text-gray-500">
                  Indique si la réservation inclut un chauffeur.
                </p>
              </div>
              <Switch
                checked={withChauffeur}
                onCheckedChange={setWithChauffeur}
                disabled={createMutation.isPending}
              />
            </div>

            {error && (
              <p className="text-xs text-red-500">{error}</p>
            )}
          </div>

          <DialogFooter className="flex gap-2 sm:justify-end">
            <DialogClose asChild disabled={createMutation.isPending}>
              <Button type="button" variant="outline" className="rounded-xl">
                Annuler
              </Button>
            </DialogClose>
            <Button
              type="submit"
              className="rounded-xl"
              disabled={createMutation.isPending}
            >
              {createMutation.isPending ? "Enregistrement..." : "Créer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
