import React, { useState, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { BadgeCheck, FileText, Upload, ImageIcon, X, Check } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { VehicleFormData, PhotoItem, MAX_IMAGES } from "@/types/addVehicleType";

interface StepFinalPublicationProps {
  stepNumber: number;
  photos: PhotoItem[];
  onAddPhotos: (files: FileList | null) => void;
  onRemovePhoto: (id: string) => void;
  error: string | null;
  isAdding: boolean;
  isEditMode?: boolean;
}

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
const ALLOWED_EXTENSIONS = ["jpg", "jpeg", "png", "webp"];

const isValidImageBySignature = async (file: File): Promise<boolean> => {
  try {
    const buffer = await file.slice(0, 16).arrayBuffer();
    const bytes = new Uint8Array(buffer);
    if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return true;
    if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47 &&
      bytes[4] === 0x0d && bytes[5] === 0x0a && bytes[6] === 0x1a && bytes[7] === 0x0a) return true;
    if (bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x38) return true;
    if (bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46 &&
      bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50) return true;
    return false;
  } catch { return false; }
};

const resizeImageFile = async (file: File): Promise<File> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        const scale = 0.9;
        const width = img.width * scale;
        const height = img.height * scale;
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) { resolve(file); return; }
        ctx.drawImage(img, 0, 0, width, height);
        const mimeType = ALLOWED_IMAGE_TYPES.includes(file.type) ? file.type : "image/jpeg";
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(new File([blob], file.name, { type: mimeType, lastModified: Date.now() }));
          } else { resolve(file); }
        }, mimeType, 0.9);
      } catch { resolve(file); }
    };
    img.onerror = () => resolve(file);
    img.src = URL.createObjectURL(file);
  });
};

export const StepFinalPublication = React.memo(
  ({ stepNumber, photos, onAddPhotos, onRemovePhoto, error, isAdding, isEditMode }: StepFinalPublicationProps) => {
    const {
      register,
      formState: { errors },
    } = useFormContext<VehicleFormData>();

    const [isDragging, setIsDragging] = useState(false);
    const [zoneError, setZoneError] = useState(false);
    const [zoneErrorMessage, setZoneErrorMessage] = useState<string | null>(null);

    const validateAndProcessFiles = async (files: FileList | null): Promise<FileList | null> => {
      if (!files || files.length === 0) {
        setZoneError(true);
        setZoneErrorMessage("Aucun fichier détecté.");
        return null;
      }

      if (photos.length + files.length > MAX_IMAGES) {
        setZoneError(true);
        setZoneErrorMessage(`Limite atteinte : ${MAX_IMAGES} photos maximum.`);
        return null;
      }

      const validFiles: File[] = [];
      let hasInvalid = false;

      for (const file of Array.from(files)) {
        const ext = file.name.toLowerCase().split(".").pop() || "";
        const isAllowed = ALLOWED_IMAGE_TYPES.includes(file.type) || ALLOWED_EXTENSIONS.includes(ext);
        const isReal = await isValidImageBySignature(file);

        if (isAllowed && isReal && file.size <= 5 * 1024 * 1024) {
          const resized = await resizeImageFile(file);
          validFiles.push(resized);
        } else {
          hasInvalid = true;
        }
      }

      if (validFiles.length === 0) {
        setZoneError(true);
        setZoneErrorMessage("Aucune image valide trouvée.");
        return null;
      }

      if (hasInvalid) {
        setZoneError(true);
        setZoneErrorMessage("Certains fichiers ont été ignorés (format ou taille non valide).");
      } else {
        setZoneError(false);
        setZoneErrorMessage(null);
      }

      const dt = new DataTransfer();
      validFiles.forEach((f) => dt.items.add(f));
      return dt.files;
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(true);
    };

    const handleDragLeave = () => setIsDragging(false);

    const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      const filtered = await validateAndProcessFiles(e.dataTransfer.files);
      if (filtered) onAddPhotos(filtered);
    };

    const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const filtered = await validateAndProcessFiles(e.target.files);
      if (filtered) onAddPhotos(filtered);
      e.target.value = "";
    };

    useEffect(() => {
      if (error) {
        setZoneError(true);
        setZoneErrorMessage(error);
      }
    }, [error]);

    return (
      <Card className="rounded-3xl bg-white border border-slate-100 shadow-sm overflow-hidden">
        <CardHeader className="pb-4 pt-6 px-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 shadow-sm">
              <FileText className="w-6 h-6 text-slate-700" />
            </div>
            <div className="space-y-0.5">
              <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
                Étape {stepNumber} · Publication
                <BadgeCheck className="w-5 h-5 text-emerald-500" />
              </CardTitle>
              <p className="text-sm text-slate-500">Derniers détails avant la mise en ligne.</p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="px-6 pb-8 space-y-10">
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Description détaillée *</label>
                <Textarea
                  {...register("description", {
                    required: "Description requise",
                    minLength: { value: 30, message: "Minimum 30 caractères" },
                  })}
                  placeholder="Points forts, confort, usage idéal..."
                  className="bg-slate-50/50 border-slate-200 rounded-2xl min-h-[120px] focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                />
                {errors.description && <p className="text-xs text-red-500">{errors.description.message as string}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Conditions particulières</label>
                <Textarea
                  {...register("conditions_particulieres")}
                  placeholder="Ex : Usage urbain uniquement, non fumeur..."
                  className="bg-slate-50/50 border-slate-200 rounded-2xl min-h-[100px] focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                />
              </div>
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 pt-6 border-t border-slate-100"
          >
            <div className="flex flex-col gap-1">
              <p className="text-sm font-semibold text-slate-900">Photos de l'annonce ({photos.length}/{MAX_IMAGES})</p>
              <p className="text-xs text-slate-500">Mettez en avant l'extérieur et l'intérieur du véhicule.</p>
              {isEditMode && (
                <div className="inline-flex items-center gap-2 mt-2 p-2 px-3 bg-blue-50 text-blue-700 rounded-xl text-[11px] font-medium border border-blue-100">
                  <ImageIcon className="w-3.5 h-3.5" />
                  Mode édition : vous pouvez encore ajouter {MAX_IMAGES - photos.length} photos.
                </div>
              )}
            </div>

            <motion.div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => document.getElementById('vehicle-photos')?.click()}
              className={`relative rounded-3xl border-2 border-dashed p-8 text-center transition-all cursor-pointer
                ${isDragging ? "bg-emerald-50 border-emerald-400" : "bg-slate-50/30 hover:bg-slate-50 border-slate-200"}
                ${zoneError ? "border-red-400 bg-red-50" : ""}
              `}
            >
              <input id="vehicle-photos" type="file" accept="image/*" multiple onChange={handleFileInput} className="hidden" />

              <div className="flex flex-col items-center gap-3">
                <div className="p-3.5 rounded-2xl bg-white shadow-sm border border-slate-100">
                  {isAdding ? <Upload className="w-7 h-7 animate-bounce text-emerald-600" /> : <Upload className="w-7 h-7 text-slate-400" />}
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-slate-900">Cliquez ou glissez vos photos ici</p>
                  <p className="text-[11px] text-slate-400">Haute définition recommandée · Max 5 Mo</p>
                </div>
              </div>

              <AnimatePresence>
                {zoneError && zoneErrorMessage && (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-xs text-red-500 mt-4 font-semibold">
                    {zoneErrorMessage}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <AnimatePresence mode="popLayout">
                {photos.map((photo, index) => (
                  <motion.div
                    key={photo.id || index}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="group relative aspect-video rounded-2xl overflow-hidden border border-slate-100 shadow-sm"
                  >
                    <img src={photo.previewUrl} alt="Aperçu" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); onRemovePhoto(photo.id); }}
                        className="p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors shadow-lg"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    {index === 0 && (
                      <div className="absolute top-2 left-2 px-2 py-0.5 rounded-lg bg-emerald-500/90 text-[10px] font-bold text-white shadow-sm">
                        Principale
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.section>
        </CardContent>
      </Card>
    );
  }
);

StepFinalPublication.displayName = "StepFinalPublication";
