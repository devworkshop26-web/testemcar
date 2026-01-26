"use client"

import type React from "react"
import { useState } from "react"
import {
  useVehicleAvailabilityQuery,
  useCreateVehicleAvailabilityMutation,
  useDeleteVehicleAvailabilityMutation,
  useUpdateVehicleAvailabilityMutation,
} from "@/useQuery/vehicleAvailabilityUseQuery"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Loader2, CalendarIcon, Trash2, AlertCircle, AlertTriangle, Clock, CheckCircle2 } from "lucide-react"
import { format, parseISO, isSameDay, startOfToday } from "date-fns"
import { fr } from "date-fns/locale"
import { toast } from "sonner"
import type { Vehicule } from "@/types/vehiculeType"
import type { DateRange } from "react-day-picker"

interface AvailabilityTabProps {
  vehicle: Vehicule
}

const AvailabilityTab: React.FC<AvailabilityTabProps> = ({ vehicle }) => {
  // --- Gestion des Requêtes ---
  const { data: availabilities, isLoading } = useVehicleAvailabilityQuery(vehicle.id)
  const createMutation = useCreateVehicleAvailabilityMutation()
  const updateMutation = useUpdateVehicleAvailabilityMutation()
  const deleteMutation = useDeleteVehicleAvailabilityMutation()

  // --- États ---
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false) // État pour la popup de suppression
  const [editingId, setEditingId] = useState<string | null>(null)
  const [tempRange, setTempRange] = useState<DateRange | undefined>(undefined)

  // Formulaire
  const [type, setType] = useState<"BLOCKED" | "MAINTENANCE">("BLOCKED")
  const [description, setDescription] = useState("")

  // --- Logique du Calendrier Principal ---
  const handleMainCalendarSelect = (range: DateRange | undefined) => {
    if (!range?.from) {
      setTempRange(undefined)
      return
    }

    // Si clic simple (pas encore de range complet ou clic sur une date existante)
    if (!range.to || isSameDay(range.from, range.to)) {
      const date = range.from

      // Vérifier si on clique sur une dispo existante pour l'éditer
      const existing = availabilities?.find(
        (a) =>
          isSameDay(parseISO(a.start_date), date) || (date >= parseISO(a.start_date) && date <= parseISO(a.end_date)),
      )

      if (existing) {
        handleEdit(existing)
        return // On arrête là, le handleEdit ouvre la modale
      }
    }

    // Sinon, on prépare la création
    setTempRange(range)
    resetForm()
    // Si on a sélectionné une date (même sans range complet), on ouvre la modale pour finir la saisie
    setIsDialogOpen(true)
  }

  // Modificateurs visuels
  const blockedDays =
    availabilities
      ?.filter((a) => a.type === "BLOCKED")
      .map((a) => ({ from: parseISO(a.start_date), to: parseISO(a.end_date) })) || []
  const maintenanceDays =
    availabilities
      ?.filter((a) => a.type === "MAINTENANCE")
      .map((a) => ({ from: parseISO(a.start_date), to: parseISO(a.end_date) })) || []

  // --- Gestion des Actions ---

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Validation : On s'assure qu'on a bien une date de début et de fin
    // Si "to" est undefined (un seul jour cliqué), on le met égal à "from"
    const finalStart = tempRange?.from
    const finalEnd = tempRange?.to || tempRange?.from

    if (!vehicle.id || !finalStart || !finalEnd) {
      toast.error("Veuillez sélectionner une période valide sur le calendrier.")
      return
    }

    const formattedStart = format(finalStart, "yyyy-MM-dd")
    const formattedEnd = format(finalEnd, "yyyy-MM-dd")

    try {
      if (editingId) {
        await updateMutation.mutateAsync({
          id: editingId,
          data: { start_date: formattedStart, end_date: formattedEnd, type, description },
        })
        toast.success("Mise à jour réussie")
      } else {
        await createMutation.mutateAsync({
          vehicle: vehicle.id,
          start_date: formattedStart,
          end_date: formattedEnd,
          type,
          description,
        })
        toast.success("Indisponibilité ajoutée")
      }
      setIsDialogOpen(false)
      setTempRange(undefined)
    } catch (error) {
      toast.error("Une erreur est survenue")
    }
  }

  const confirmDelete = async () => {
    if (!editingId) return
    try {
      await deleteMutation.mutateAsync(editingId)
      toast.success("Supprimé avec succès")
      setIsDeleteConfirmOpen(false) // Fermer la confirmation
      setIsDialogOpen(false) // Fermer la modale principale
      setTempRange(undefined)
    } catch (error) {
      toast.error("Erreur lors de la suppression")
    }
  }

  const handleEdit = (availability: any) => {
    setEditingId(availability.id)
    setTempRange({
      from: parseISO(availability.start_date),
      to: parseISO(availability.end_date),
    })
    setType(availability.type)
    setDescription(availability.description || "")
    setIsDialogOpen(true)
  }

  const resetForm = () => {
    setEditingId(null)
    // On ne reset pas tempRange ici si on vient du calendrier
    setType("BLOCKED")
    setDescription("")
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/5 via-primary/10 to-transparent border border-primary/20 p-8 shadow-lg">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/10 rounded-xl">
                <CalendarIcon className="w-7 h-7 text-primary" />
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
                Calendrier des disponibilités
              </h2>
            </div>
            <p className="text-muted-foreground text-base max-w-2xl leading-relaxed">
              Gérez les périodes d'indisponibilité et de maintenance de votre véhicule en toute simplicité
            </p>
          </div>
          <Badge
            variant={vehicle.est_disponible ? "default" : "destructive"}
            className="px-6 py-2.5 text-sm font-medium shadow-lg flex items-center gap-2 rounded-full"
          >
            {vehicle.est_disponible ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                Véhicule Actif
              </>
            ) : (
              <>
                <Clock className="w-4 h-4" />
                Véhicule Inactif
              </>
            )}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 shadow-xl border-primary/10 rounded-2xl overflow-hidden backdrop-blur-sm bg-card/50">
          <CardContent className="p-0">
            <div className="p-8">
              <style jsx global>{`
                .modern-calendar {
                  width: 100%;
                  border-radius: 1rem;
                }
                
                .modern-calendar .rdp-months {
                  width: 100%;
                }
                
                .modern-calendar .rdp-month {
                  width: 100%;
                }
                
                .modern-calendar .rdp-caption {
                  display: flex;
                  justify-content: center;
                  padding: 1rem 0 1.5rem;
                  position: relative;
                }
                
                .modern-calendar .rdp-caption_label {
                  font-size: 1.25rem;
                  font-weight: 700;
                  color: hsl(var(--foreground));
                }
                
                .modern-calendar .rdp-table {
                  width: 100%;
                  border-collapse: separate;
                  border-spacing: 0.25rem;
                }
                
                .modern-calendar .rdp-head_cell {
                  width: 14.285%;
                  text-align: center;
                  font-weight: 600;
                  font-size: 0.875rem;
                  color: hsl(var(--muted-foreground));
                  padding: 0.75rem 0;
                  text-transform: uppercase;
                  letter-spacing: 0.05em;
                }
                
                .modern-calendar .rdp-cell {
                  width: 14.285%;
                  text-align: center;
                  padding: 0.25rem;
                }
                
                .modern-calendar .rdp-day {
                  width: 100%;
                  height: 3.5rem;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  font-size: 1rem;
                  font-weight: 500;
                  border-radius: 0.75rem;
                  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                  cursor: pointer;
                  border: 2px solid transparent;
                  position: relative;
                }
                
                .modern-calendar .rdp-day:hover:not(.rdp-day_disabled) {
                  background-color: hsl(var(--primary) / 0.1);
                  border-color: hsl(var(--primary) / 0.3);
                  transform: scale(1.05);
                  box-shadow: 0 4px 12px -2px hsl(var(--primary) / 0.2);
                }
                
                .modern-calendar .rdp-day_selected {
                  background: linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--primary) / 0.8) 100%);
                  color: hsl(var(--primary-foreground));
                  font-weight: 600;
                  border-color: hsl(var(--primary));
                  box-shadow: 0 4px 12px -2px hsl(var(--primary) / 0.3);
                }
                
                .modern-calendar .rdp-day_disabled {
                  opacity: 0.3;
                  cursor: not-allowed;
                  color: hsl(var(--muted-foreground));
                }
                
                .modern-calendar .rdp-day_today:not(.rdp-day_selected) {
                  background-color: hsl(var(--accent));
                  border-color: hsl(var(--primary) / 0.4);
                  font-weight: 700;
                }
                
                /* Styles pour les périodes bloquées et maintenance avec meilleur design */
                .modern-calendar .rdp-day_blocked,
                .modern-calendar button.rdp-day_blocked {
                  background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%) !important;
                  color: #dc2626 !important;
                  font-weight: 700 !important;
                  border: 2px solid #ef4444 !important;
                  position: relative;
                  box-shadow: 0 4px 12px -2px rgba(220, 38, 38, 0.3) !important;
                }
                
                .modern-calendar .rdp-day_blocked::after,
                .modern-calendar button.rdp-day_blocked::after {
                  content: '';
                  position: absolute;
                  bottom: 4px;
                  left: 50%;
                  transform: translateX(-50%);
                  width: 6px;
                  height: 6px;
                  background-color: #dc2626;
                  border-radius: 50%;
                  box-shadow: 0 0 4px rgba(220, 38, 38, 0.5);
                }
                
                .modern-calendar .rdp-day_blocked:hover,
                .modern-calendar button.rdp-day_blocked:hover {
                  background: linear-gradient(135deg, #fecaca 0%, #fca5a5 100%) !important;
                  border-color: #dc2626 !important;
                  transform: scale(1.05);
                }
                
                .modern-calendar .rdp-day_maintenance,
                .modern-calendar button.rdp-day_maintenance {
                  background: linear-gradient(135deg, #ffedd5 0%, #fed7aa 100%) !important;
                  color: #ea580c !important;
                  font-weight: 700 !important;
                  border: 2px solid #f97316 !important;
                  position: relative;
                  box-shadow: 0 4px 12px -2px rgba(234, 88, 12, 0.3) !important;
                }
                
                .modern-calendar .rdp-day_maintenance::after,
                .modern-calendar button.rdp-day_maintenance::after {
                  content: '';
                  position: absolute;
                  bottom: 4px;
                  left: 50%;
                  transform: translateX(-50%);
                  width: 6px;
                  height: 6px;
                  background-color: #ea580c;
                  border-radius: 50%;
                  box-shadow: 0 0 4px rgba(234, 88, 12, 0.5);
                }
                
                .modern-calendar .rdp-day_maintenance:hover,
                .modern-calendar button.rdp-day_maintenance:hover {
                  background: linear-gradient(135deg, #fed7aa 0%, #fdba74 100%) !important;
                  border-color: #ea580c !important;
                  transform: scale(1.05);
                }
                
                /* S'assurer que les dates bloquées et maintenance gardent leur couleur même si sélectionnées ou dans une range */
                .modern-calendar .rdp-day_selected.rdp-day_blocked,
                .modern-calendar .rdp-day_range_middle.rdp-day_blocked,
                .modern-calendar .rdp-day_range_start.rdp-day_blocked,
                .modern-calendar .rdp-day_range_end.rdp-day_blocked {
                  background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%) !important;
                  color: #dc2626 !important;
                  border-color: #ef4444 !important;
                }
                
                .modern-calendar .rdp-day_selected.rdp-day_maintenance,
                .modern-calendar .rdp-day_range_middle.rdp-day_maintenance,
                .modern-calendar .rdp-day_range_start.rdp-day_maintenance,
                .modern-calendar .rdp-day_range_end.rdp-day_maintenance {
                  background: linear-gradient(135deg, #ffedd5 0%, #fed7aa 100%) !important;
                  color: #ea580c !important;
                  border-color: #f97316 !important;
                }
              `}</style>

              <Calendar
                mode="range"
                selected={tempRange}
                onSelect={handleMainCalendarSelect}
                locale={fr}
                className="modern-calendar"
                numberOfMonths={2}
                disabled={{ before: startOfToday() }}
                modifiers={{
                  blocked: blockedDays,
                  maintenance: maintenanceDays,
                }}
                modifiersClassNames={{
                  blocked: "rdp-day_blocked",
                  maintenance: "rdp-day_maintenance",
                }}
              />
            </div>

            <div className="flex flex-wrap gap-6 p-6 border-t bg-gradient-to-br from-muted/30 to-muted/10 justify-center">
              <div className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/50 backdrop-blur-sm border border-border/50">
                <div className="w-4 h-4 rounded-full bg-gradient-to-br from-red-200 to-red-300 border-2 border-red-500 shadow-sm" />
                <span className="font-medium text-sm">Indisponible</span>
              </div>
              <div className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/50 backdrop-blur-sm border border-border/50">
                <div className="w-4 h-4 rounded-full bg-gradient-to-br from-orange-200 to-orange-300 border-2 border-orange-500 shadow-sm" />
                <span className="font-medium text-sm">Maintenance</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-xl rounded-2xl overflow-hidden backdrop-blur-sm bg-card/50 border-primary/10">
          <CardHeader className="pb-4 bg-gradient-to-br from-muted/30 to-transparent border-b">
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <div className="w-1 h-6 bg-primary rounded-full" />
              Périodes enregistrées
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
              {isLoading ? (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : availabilities && availabilities.length > 0 ? (
                availabilities
                  .sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime())
                  .map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleEdit(item)}
                      className="group relative p-4 rounded-xl border-2 bg-card hover:shadow-lg transition-all duration-300 cursor-pointer hover:border-primary/50 hover:-translate-y-1"
                    >
                      <div className="absolute top-0 left-0 w-full h-1 rounded-t-xl bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                      <div className="flex items-start justify-between mb-3">
                        <Badge
                          variant="outline"
                          className={`font-semibold ${
                            item.type === "MAINTENANCE"
                              ? "bg-orange-50 text-orange-700 border-orange-300"
                              : "bg-red-50 text-red-700 border-red-300"
                          }`}
                        >
                          {item.type === "MAINTENANCE" ? "Maintenance" : "Bloqué"}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-2 text-sm font-bold">
                        <CalendarIcon className="w-4 h-4 text-muted-foreground" />
                        <span>
                          {format(parseISO(item.start_date), "dd MMM", { locale: fr })}
                          {" → "}
                          {format(parseISO(item.end_date), "dd MMM yyyy", { locale: fr })}
                        </span>
                      </div>

                      {item.description && (
                        <p className="mt-2 text-xs text-muted-foreground line-clamp-2">{item.description}</p>
                      )}
                    </div>
                  ))
              ) : (
                <div className="text-center py-16 text-muted-foreground flex flex-col items-center">
                  <div className="w-20 h-20 rounded-full bg-muted/30 flex items-center justify-center mb-4">
                    <AlertCircle className="w-10 h-10 opacity-30" />
                  </div>
                  <p className="font-medium text-lg">Aucune indisponibilité</p>
                  <p className="text-sm mt-1">Cliquez sur le calendrier pour ajouter</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open)
          if (!open) {
            setTempRange(undefined)
            resetForm()
          }
        }}
      >
        {/* MODIFICATION: Largeur passée à sm:max-w-[800px] pour accueillir 2 calendriers */}
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] rounded-2xl border-primary/20 flex flex-col p-0">
          <DialogHeader className="px-6 pt-6 pb-4 shrink-0">
            <DialogTitle className="text-2xl font-bold flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <CalendarIcon className="w-5 h-5 text-primary" />
              </div>
              {editingId ? "Modifier l'indisponibilité" : "Ajouter une indisponibilité"}
            </DialogTitle>
          </DialogHeader>

          <div
            className="overflow-y-auto px-6 py-2 flex-1 custom-scrollbar"
            style={{ maxHeight: "calc(90vh - 180px)" }}
          >
            <form id="availability-form" onSubmit={handleSubmit} className="space-y-6">
              <div className="border-2 border-primary/20 rounded-xl p-4 bg-gradient-to-br from-muted/20 to-transparent shadow-inner">
                {/* MODIFICATION: numberOfMonths passé à 2 */}
                <Calendar
                  mode="range"
                  selected={tempRange}
                  onSelect={setTempRange}
                  locale={fr}
                  numberOfMonths={2}
                  disabled={{ before: startOfToday() }}
                  className="modern-calendar mx-auto"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-1">
                    Début
                  </span>
                  <span className="text-base font-bold">
                    {tempRange?.from ? format(tempRange.from, "dd MMMM yyyy", { locale: fr }) : "-"}
                  </span>
                </div>
                <div className="p-4 rounded-xl bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-1">
                    Fin
                  </span>
                  <span className="text-base font-bold">
                    {tempRange?.to
                      ? format(tempRange.to, "dd MMMM yyyy", { locale: fr })
                      : tempRange?.from
                        ? format(tempRange.from, "dd MMMM yyyy", { locale: fr })
                        : "-"}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold">Type d'indisponibilité</Label>
                <Select value={type} onValueChange={(val: "BLOCKED" | "MAINTENANCE") => setType(val)}>
                  <SelectTrigger className="bg-white h-12 rounded-xl border-2 hover:border-primary/50 transition-colors">
                    <SelectValue placeholder="Sélectionnez un type" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl bg-white">
                    <SelectItem value="BLOCKED" className="rounded-lg">
                      Indisponible (Bloqué)
                    </SelectItem>
                    <SelectItem value="MAINTENANCE" className="rounded-lg">
                      Maintenance
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold">Description (optionnel)</Label>
                <Textarea
                  placeholder="Ajoutez une note ou raison..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="rounded-xl border-2 hover:border-primary/50 transition-colors resize-none"
                />
              </div>
            </form>
          </div>

          <DialogFooter className="flex gap-3 sm:justify-between items-center px-6 pb-6 pt-4 border-t shrink-0">
            {editingId ? (
              <Button
                type="button"
                variant="destructive"
                size="lg"
                onClick={() => setIsDeleteConfirmOpen(true)}
                disabled={deleteMutation.isPending}
                className="rounded-xl"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Supprimer
              </Button>
            ) : (
              <div></div>
            )}

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={() => setIsDialogOpen(false)}
                className="rounded-xl"
              >
                Annuler
              </Button>
              <Button
                type="submit"
                form="availability-form"
                size="lg"
                disabled={createMutation.isPending || updateMutation.isPending}
                className="rounded-xl min-w-[120px]"
              >
                {(createMutation.isPending || updateMutation.isPending) && (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                )}
                {editingId ? "Mettre à jour" : "Enregistrer"}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <DialogContent className="sm:max-w-[450px] max-h-[90vh] rounded-2xl flex flex-col p-0">
          <DialogHeader className="px-6 pt-6 pb-4 shrink-0">
            <DialogTitle className="flex items-center gap-3 text-destructive text-xl font-bold">
              <div className="p-2 bg-destructive/10 rounded-lg">
                <AlertTriangle className="w-5 h-5" />
              </div>
              Confirmer la suppression
            </DialogTitle>
          </DialogHeader>

          <div className="overflow-y-auto px-6 py-2 flex-1 custom-scrollbar">
            <DialogDescription className="text-base leading-relaxed">
              Êtes-vous sûr de vouloir supprimer cette période d'indisponibilité ? Cette action est irréversible et ne
              peut pas être annulée.
            </DialogDescription>
          </div>

          <DialogFooter className="px-6 pb-6 pt-4 gap-3 sm:gap-3 border-t shrink-0">
            <Button
              variant="outline"
              size="lg"
              onClick={() => setIsDeleteConfirmOpen(false)}
              className="rounded-xl flex-1 sm:flex-none"
            >
              Annuler
            </Button>
            <Button
              variant="destructive"
              size="lg"
              onClick={confirmDelete}
              disabled={deleteMutation.isPending}
              className="rounded-xl flex-1 sm:flex-none min-w-[140px]"
            >
              {deleteMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {deleteMutation.isPending ? "Suppression..." : "Oui, supprimer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: hsl(var(--muted) / 0.3);
          border-radius: 100px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: hsl(var(--primary) / 0.3);
          border-radius: 100px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: hsl(var(--primary) / 0.5);
        }
      `}</style>
    </div>
  )
}

export default AvailabilityTab