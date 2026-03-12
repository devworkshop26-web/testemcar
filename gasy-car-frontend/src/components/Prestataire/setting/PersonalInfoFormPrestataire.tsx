import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Camera, Trash2 } from "lucide-react";
import AvatarPrestataire from "../AvatarPrestataire";

import { UseFormRegister, FieldErrors } from "react-hook-form";
import { PrestataireSettingsFormValues } from "@/hooks/usePrestataireSettings";
import { User } from "@/types/userType";

interface PersonalInfoFormPrestataireProps {
  previewPhoto: string;
  register: UseFormRegister<PrestataireSettingsFormValues>;
  handlePhotoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleDeletePhoto: () => void;
  errors: FieldErrors<PrestataireSettingsFormValues>;
  user: User | null;
  previewCinRecto: string;
  previewCinVerso: string;
  handleCinRectoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleCinVersoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  deleteProfilePhoto: () => void;
  deleteCinRecto: () => void;
  deleteCinVerso: () => void;
}

const ACCEPTED_IMAGE_TYPES = ".jpg,.jpeg,.png,.webp,.bmp,.tif,.tiff";

export const PersonalInfoFormPrestataire = ({
  previewPhoto,
  register,
  errors,
  user,
  previewCinRecto,
  previewCinVerso,
  handlePhotoUpload,
  handleCinRectoUpload,
  handleCinVersoUpload,
  deleteProfilePhoto,
  deleteCinRecto,
  deleteCinVerso,
}: PersonalInfoFormPrestataireProps) => {
  return (
    <div className="space-y-8">
      <div className="flex flex-col items-center sm:items-start gap-4">
        <div className="relative group">
          <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gray-100">
            <AvatarPrestataire user={user} previewPhoto={previewPhoto} size={128} />

            <label className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white">
              <Camera className="w-8 h-8 mb-1" />
              <span className="text-[10px] font-medium uppercase tracking-wider text-center px-2">
                {previewPhoto || user?.image ? "Changer" : "Ajouter"}
              </span>
              <input
                type="file"
                accept={ACCEPTED_IMAGE_TYPES}
                className="hidden"
                onChange={handlePhotoUpload}
              />
            </label>
          </div>

          {(previewPhoto || user?.image) && (
            <button
              type="button"
              onClick={deleteProfilePhoto}
              className="absolute -top-1 -right-1 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 shadow-sm transition-colors"
              title="Supprimer la photo"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="text-center sm:text-left">
          <h3 className="font-medium text-gray-900">Photo de profil</h3>
          <p className="text-xs text-gray-500">JPG, PNG, WebP, BMP ou TIFF. Max 10MB.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700">Prénom</label>
          <Input {...register("first_name")} className="rounded-xl" placeholder="Ex: Jean" />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700">Nom</label>
          <Input {...register("last_name")} className="rounded-xl" placeholder="Ex: Dupont" />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700 italic">Email (non modifiable)</label>
          <Input
            value={user?.email || ""}
            disabled
            className="bg-gray-50 border-gray-200 cursor-not-allowed rounded-xl text-gray-500"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700">Téléphone</label>
          <Input
            {...register("phone", {
              required: "Téléphone obligatoire",
              pattern: {
                value: /^0\d{9}$/,
                message: "Format attendu : 0341234567",
              },
            })}
            inputMode="numeric"
            className={`rounded-xl ${errors?.phone ? "border-red-500" : ""}`}
            placeholder="0341234567"
          />
          {errors?.phone && (
            <p className="text-red-600 text-xs mt-1">{errors.phone.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700">Numéro CIN</label>
          <Input {...register("cin_number")} className="rounded-xl" placeholder="Numéro de carte d'identité" />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700">Date de naissance</label>
          <Input type="date" {...register("date_of_birth")} className="rounded-xl" />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-gray-700">Adresse complète</label>
        <Textarea
          {...register("address")}
          className="rounded-xl min-h-[100px]"
          placeholder="Votre adresse de résidence..."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
        <div className="space-y-3">
          <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            Carte d'identité (Recto)
          </label>

          <div className="relative aspect-video w-full max-w-[320px] group rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 flex flex-col items-center justify-center overflow-hidden transition-all hover:border-blue-400">
            {previewCinRecto ? (
              <>
                <img src={previewCinRecto} alt="Recto" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <label className="p-2 bg-white rounded-full cursor-pointer hover:bg-gray-100 text-blue-600 shadow-lg">
                    <Camera className="w-5 h-5" />
                    <input
                      type="file"
                      accept={ACCEPTED_IMAGE_TYPES}
                      className="hidden"
                      onChange={handleCinRectoUpload}
                    />
                  </label>
                  <button
                    type="button"
                    onClick={deleteCinRecto}
                    className="p-2 bg-white rounded-full hover:bg-red-50 text-red-600 shadow-lg"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </>
            ) : (
              <label className="cursor-pointer flex flex-col items-center p-6 text-center">
                <div className="mb-2 p-3 bg-white rounded-full shadow-sm text-gray-400">
                  <Camera className="w-6 h-6" />
                </div>
                <span className="text-sm font-medium text-gray-600">Ajouter le recto</span>
                <span className="text-xs text-gray-400 mt-1">Cliquez ou glissez une image</span>
                <input
                  type="file"
                  accept={ACCEPTED_IMAGE_TYPES}
                  className="hidden"
                  onChange={handleCinRectoUpload}
                />
              </label>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            Carte d'identité (Verso)
          </label>

          <div className="relative aspect-video w-full max-w-[320px] group rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 flex flex-col items-center justify-center overflow-hidden transition-all hover:border-blue-400">
            {previewCinVerso ? (
              <>
                <img src={previewCinVerso} alt="Verso" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <label className="p-2 bg-white rounded-full cursor-pointer hover:bg-gray-100 text-blue-600 shadow-lg">
                    <Camera className="w-5 h-5" />
                    <input
                      type="file"
                      accept={ACCEPTED_IMAGE_TYPES}
                      className="hidden"
                      onChange={handleCinVersoUpload}
                    />
                  </label>
                  <button
                    type="button"
                    onClick={deleteCinVerso}
                    className="p-2 bg-white rounded-full hover:bg-red-50 text-red-600 shadow-lg"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </>
            ) : (
              <label className="cursor-pointer flex flex-col items-center p-6 text-center">
                <div className="mb-2 p-3 bg-white rounded-full shadow-sm text-gray-400">
                  <Camera className="w-6 h-6" />
                </div>
                <span className="text-sm font-medium text-gray-600">Ajouter le verso</span>
                <span className="text-xs text-gray-400 mt-1">Cliquez ou glissez une image</span>
                <input
                  type="file"
                  accept={ACCEPTED_IMAGE_TYPES}
                  className="hidden"
                  onChange={handleCinVersoUpload}
                />
              </label>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};