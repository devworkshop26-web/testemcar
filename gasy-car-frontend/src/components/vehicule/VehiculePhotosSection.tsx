import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PhotosProps } from "./types"
import { SectionBadge } from "./SectionBadge"

export function VehiculePhotosSection({ photos, handlePhotosChange, removePhoto }: PhotosProps) {
  return (
    <Card className="shadow-sm">
      <CardHeader className="space-y-2">
        <SectionBadge text="Étape 8" />
        <CardTitle>Photos</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-2 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="photos">Ajouter des photos</Label>
            <Input id="photos" type="file" accept="image/*" multiple onChange={(event) => handlePhotosChange(event.target.files)} />
            <p className="text-sm text-muted-foreground">Ajoutez plusieurs photos pour mieux présenter le véhicule.</p>
          </div>
        </div>
        {photos.length > 0 && (
          <div className="grid gap-4 md:grid-cols-4">
            {photos.map((photo) => (
              <div key={photo.id} className="group relative overflow-hidden rounded-lg border">
                <img src={photo.previewUrl} alt="Prévisualisation" className="h-32 w-full object-cover" />
                <button
                  type="button"
                  className="absolute right-2 top-2 rounded-full bg-black/60 px-2 py-1 text-xs text-white opacity-0 transition group-hover:opacity-100"
                  onClick={() => removePhoto(photo.id)}
                >
                  Retirer
                </button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

