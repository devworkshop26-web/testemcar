import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { EquipmentsProps } from "./types"
import { SectionBadge } from "./SectionBadge"
import { Search, X } from "lucide-react"

export function VehiculeEquipmentsSection({ equipments, watch, setValue }: EquipmentsProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [showSuggestions, setShowSuggestions] = useState(false)
  
  const selectedEquipments = watch("equipements") || []

  // Filter equipments based on search query
  const filteredEquipments = useMemo(() => {
    if (!searchQuery.trim()) return []
    
    const query = searchQuery.toLowerCase()
    return equipments.filter((equipment) => {
      const name = equipment.nom ?? equipment.label ?? equipment.name ?? ""
      const description = equipment.description ?? ""
      const isAlreadySelected = selectedEquipments.includes(String(equipment.id))
      
      return !isAlreadySelected && (
        name.toLowerCase().includes(query) ||
        description.toLowerCase().includes(query)
      )
    }).slice(0, 5) // Limit to 5 suggestions
  }, [searchQuery, equipments, selectedEquipments])

  // Get selected equipment details
  const selectedEquipmentDetails = useMemo(() => {
    return selectedEquipments
      .map((id) => equipments.find((eq) => String(eq.id) === id))
      .filter(Boolean)
  }, [selectedEquipments, equipments])

  const addEquipment = (equipmentId: string) => {
    const current = new Set(selectedEquipments)
    current.add(equipmentId)
    setValue("equipements", Array.from(current))
    setSearchQuery("")
    setShowSuggestions(false)
  }

  const removeEquipment = (equipmentId: string) => {
    const current = new Set(selectedEquipments)
    current.delete(equipmentId)
    setValue("equipements", Array.from(current))
  }

  return (
    <Card className="shadow-sm">
      <CardHeader className="space-y-2">
        <SectionBadge text="Étape 7" />
        <CardTitle>Équipements</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Recherchez et ajoutez les équipements disponibles sur ce véhicule.
        </p>
        <Separator />

        {/* Search Input */}
        <div className="relative">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Rechercher un équipement..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setShowSuggestions(true)
              }}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => {
                // Delay to allow click on suggestion
                setTimeout(() => setShowSuggestions(false), 200)
              }}
              className="pl-9"
            />
          </div>

          {/* Autocomplete Suggestions */}
          {showSuggestions && searchQuery.trim() && filteredEquipments.length > 0 && (
            <div className="absolute z-10 mt-1 w-full rounded-md border bg-popover shadow-md bg-white">
              <div className="max-h-60 overflow-auto p-1">
                {filteredEquipments.map((equipment) => (
                  <button
                    key={equipment.id}
                    type="button"
                    onClick={() => addEquipment(String(equipment.id))}
                    className="w-full rounded-sm px-3 py-2 text-left text-sm hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                  >
                    <div className="font-medium">
                      {equipment.nom ?? equipment.label ?? equipment.name}
                    </div>
                    {equipment.description && (
                      <div className="text-xs text-muted-foreground">
                        {equipment.description}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* No results message */}
          {showSuggestions && searchQuery.trim() && filteredEquipments.length === 0 && (
            <div className="absolute z-10 mt-1 w-full rounded-md border bg-popover p-3 shadow-md">
              <p className="text-sm text-muted-foreground">
                Aucun équipement trouvé
              </p>
            </div>
          )}
        </div>

        {/* Selected Equipments */}
        {selectedEquipmentDetails.length > 0 && (
          <div>
            <p className="mb-2 text-sm font-medium">
              Équipements sélectionnés ({selectedEquipmentDetails.length})
            </p>
            <div className="flex flex-wrap gap-2">
              {selectedEquipmentDetails.map((equipment) => (
                <Badge
                  key={equipment.id}
                  variant="secondary"
                  className="gap-1 pr-1"
                >
                  <span>{equipment.nom ?? equipment.label ?? equipment.name}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0.5 hover:bg-transparent"
                    onClick={() => removeEquipment(String(equipment.id))}
                  >
                    <X className="h-3 w-3" />
                    <span className="sr-only">Retirer</span>
                  </Button>
                </Badge>
              ))}
            </div>
          </div>
        )}

        {selectedEquipmentDetails.length === 0 && (
          <p className="text-sm text-muted-foreground italic">
            Aucun équipement sélectionné. Utilisez la recherche ci-dessus pour ajouter des équipements.
          </p>
        )}
      </CardContent>
    </Card>
  )
}

