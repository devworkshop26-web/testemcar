"use client"

import type React from "react"
import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Trash2, Upload, ArrowLeft, ImageIcon, Loader2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useVehiculeQuery } from "@/useQuery/vehiculeUseQuery"
import { uploadVehiclePhotos, deleteVehiclePhoto } from "@/Actions/vehiculePhotosApi"
import { toast } from "sonner"
// Import des composants de dialogue
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

const VehiclePhotosPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: vehicle, refetch, isLoading } = useVehiculeQuery(id)
  const [uploading, setUploading] = useState(false)
  // Nouvel état pour gérer la modal de suppression
  const [photoToDelete, setPhotoToDelete] = useState<string | null>(null)

  const MAX_PHOTOS = 5
  const currentPhotos = vehicle?.photos || []
  const photosCount = currentPhotos.length
  const isLimitReached = photosCount >= MAX_PHOTOS

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !id) return

    const files = Array.from(e.target.files)
    if (photosCount + files.length > MAX_PHOTOS) {
      toast.error(`Vous ne pouvez pas dépasser ${MAX_PHOTOS} photos au total.`)
      return
    }

    setUploading(true)
    try {
      await uploadVehiclePhotos(id, files)
      await refetch()
      toast.success("Photos ajoutées avec succès")
    } catch (error) {
      toast.error("Erreur lors du téléchargement")
    } finally {
      setUploading(false)
      e.target.value = ""
    }
  }

  const handleDelete = async () => {
    if (!photoToDelete) return

    setUploading(true)
    try {
      await deleteVehiclePhoto(photoToDelete)
      await refetch()
      toast.success("Photo supprimée")
    } catch (error) {
      toast.error("Erreur lors de la suppression")
    } finally {
      setUploading(false)
      setPhotoToDelete(null)
    }
  }

  if (isLoading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="animate-spin">
          <Loader2 className="w-8 h-8 text-slate-800" />
        </div>
      </div>
    )

  if (!vehicle) return null

  return (
    <div className="min-h-screen from-slate-50 to-slate-100 p-1 sm:p-8 py-2">
      <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="p-6 sm:p-10 space-y-8 animate-in fade-in duration-700">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-8">
            <div className="space-y-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(-1)}
                className="h-8 px-2 -ml-2 text-slate-600 hover:text-slate-900 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" /> Retour
              </Button>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">Galerie du véhicule</h1>
            </div>

            <div className="flex items-center">
              <Badge
                variant={isLimitReached ? "destructive" : "secondary"}
                className="text-base px-4 py-2 h-auto font-semibold font-poppins bg-slate-100 text-slate-900 hover:bg-slate-200"
              >
                {photosCount} / {MAX_PHOTOS} photos
              </Badge>
            </div>
          </div>

          {!isLimitReached ? (
            <Card className="border-2 border-dashed border-slate-300 bg-gradient-to-br from-slate-50 to-white hover:from-slate-100 hover:to-slate-50 transition-all duration-300 group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <CardContent className="flex flex-col items-center justify-center py-16 text-center space-y-4 relative z-10">
                <div className="p-4 rounded-2xl bg-white shadow-md group-hover:shadow-lg group-hover:scale-110 transition-all duration-300">
                  {uploading ? (
                    <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                  ) : (
                    <Upload className="w-8 h-8 text-blue-600" />
                  )}
                </div>
                <div className="space-y-2">
                  <p className="text-lg font-semibold text-slate-900">Cliquez pour ajouter des photos</p>
                  <p className="text-sm text-slate-500">
                    Formats acceptés : JPG, PNG. Max {MAX_PHOTOS - photosCount} restante(s).
                  </p>
                </div>

                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleUpload}
                  disabled={uploading}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                />
              </CardContent>
            </Card>
          ) : (
            <Alert variant="default" className="bg-red-50 border-red-200 border-2">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-700">
                Vous avez atteint la limite maximale de {MAX_PHOTOS} photos. Supprimez-en une pour en ajouter une
                nouvelle.
              </AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentPhotos.map((p: any, index: number) => (
              <div
                key={p.id}
                className="group relative aspect-[4/3] rounded-2xl border border-slate-200 bg-slate-50 hover:shadow-xl transition-all duration-500 animate-in fade-in slide-in-from-bottom-4 stagger overflow-hidden"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="absolute inset-0 rounded-2xl overflow-hidden">
                  <img
                    src={p.image || "/placeholder.svg"}
                    alt="Véhicule"
                    className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110 will-change-transform"
                  />
                </div>

                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-sm">
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => setPhotoToDelete(p.id)} // Ouvre la popup au lieu de supprimer direct
                    disabled={uploading}
                    className="scale-75 group-hover:scale-100 transition-transform duration-300 rounded-full shadow-lg"
                  >
                    {uploading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Trash2 className="w-5 h-5" />
                    )}
                  </Button>
                </div>
              </div>
            ))}

            {!isLimitReached &&
              Array.from({ length: MAX_PHOTOS - photosCount }).map((_, index) => (
                <div
                  key={`placeholder-${index}`}
                  className="aspect-[4/3] rounded-2xl border-2 border-dashed border-slate-300 flex items-center justify-center bg-gradient-to-br from-slate-50 to-white hover:from-slate-100 hover:border-slate-400 transition-all duration-300 animate-in fade-in"
                  style={{
                    animationDelay: `${(currentPhotos.length + index) * 100}ms`,
                  }}
                >
                  <ImageIcon className="w-8 h-8 text-slate-300" />
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Popup de Confirmation */}
      <AlertDialog open={!!photoToDelete} onOpenChange={() => setPhotoToDelete(null)}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer cette photo ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. La photo sera définitivement supprimée de la galerie.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Annuler</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 rounded-xl"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default VehiclePhotosPage