import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Camera, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AvatarClient } from "@/components/client/AvatarClient";

import { UseFormRegister, FieldErrors } from "react-hook-form";
import { User } from "@/types/userType";
import { ClientSettingsFormValues } from "@/hooks/useClientSetting";

interface ProfileFormProps {
  previewPhoto: string | null;
  register: UseFormRegister<ClientSettingsFormValues>;
  handlePhotoUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleDeletePhoto: () => void;

  // ✅ CIN
  previewCinRecto: string | null;
  previewCinVerso: string | null;
  handleCinRectoUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleCinVersoUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;

  // ✅ suppression backend
  deleteProfilePhoto: () => void;
  deleteCinRecto: () => void;
  deleteCinVerso: () => void;

  errors: FieldErrors<ClientSettingsFormValues>;
  user: User;
}

export const ProfileForm = ({
  previewPhoto,
  register,
  handlePhotoUpload,
  handleDeletePhoto,

  // ✅ CIN
  previewCinRecto,
  previewCinVerso,
  handleCinRectoUpload,
  handleCinVersoUpload,

  // ✅ suppression backend
  deleteProfilePhoto,
  deleteCinRecto,
  deleteCinVerso,

  errors,
  user,
}: ProfileFormProps) => {
  return (
    <div className="space-y-6">
      {/* ---------------------------------------
          PHOTO DE PROFIL
      --------------------------------------- */}
      <div className="flex items-center gap-4">
        {/* Avatar 100% géré automatiquement */}
        <AvatarClient user={user} previewPhoto={previewPhoto} size={56} />

        <div className="flex flex-col gap-2">
          <label className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 flex items-center gap-2 text-sm">
            <Camera className="w-4 h-4" />
            Changer la photo
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoUpload}
            />
          </label>

          {/* Supprimer photo si backend en a une */}
          {(user?.image || previewPhoto) && (
            <Button
              type="button"
              variant="outline"
              className="rounded-xl text-red-600 border-red-300 hover:bg-red-50 flex items-center gap-2 text-sm"
              onClick={deleteProfilePhoto}
            >
              <Trash2 className="w-4 h-4" />
              Supprimer photo
            </Button>
          )}
        </div>
      </div>

      {/* ---------------------------------------
          CHAMPS DU PROFIL
      --------------------------------------- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Prénom */}
        <div className="space-y-1">
          <label className="text-sm text-gray-600">Prénom</label>
          <Input {...register("first_name")} placeholder="Prénom" />
        </div>

        {/* Nom */}
        <div className="space-y-1">
          <label className="text-sm text-gray-600">Nom</label>
          <Input {...register("last_name")} placeholder="Nom" />
        </div>

        {/* Téléphone */}
        <div className="space-y-1">
          <label className="text-sm text-gray-600">Téléphone *</label>
          <Input
            {...register("phone", {
              required: "Le numéro de téléphone est obligatoire",
              minLength: {
                value: 8,
                message: "Numéro invalide : minimum 8 chiffres",
              },
              pattern: {
                value: /^[0-9]+$/,
                message: "Le numéro doit contenir uniquement des chiffres",
              },
            })}
            placeholder="Téléphone"
          />
          {errors?.phone && (
            <p className="text-red-600 text-xs mt-1">{errors.phone.message}</p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-1">
          <label className="text-sm text-gray-600">
            Email (non modifiable)
          </label>
          <Input value={user?.email} disabled className="bg-gray-100" />
        </div>

        {/* CIN */}
        <div className="space-y-1">
          <label className="text-sm text-gray-600">Numéro CIN *</label>
          <Input
            {...register("cin_number", {
              required: "Le CIN est obligatoire",
              minLength: {
                value: 12,
                message: "Le CIN doit contenir au moins 12 caractères",
              },
            })}
            placeholder="N° CIN"
          />
          {errors?.cin_number && (
            <p className="text-red-600 text-xs mt-1">
              {errors.cin_number.message}
            </p>
          )}
        </div>

        {/* Date de naissance */}
        <div className="space-y-1">
          <label className="text-sm text-gray-600">Date de naissance</label>
          <Input type="date" {...register("date_of_birth")} />
        </div>
      </div>

      {/* Adresse */}
      <div className="space-y-1">
        <label className="text-sm text-gray-600">Adresse complète</label>
        <Textarea {...register("address")} placeholder="Votre adresse..." />
      </div>

      {/* ---------------------------------------
          ✅ PHOTOS CIN (RECTO / VERSO)
          - Même style que photo profil
          - Un peu plus grand
      --------------------------------------- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* CIN RECTO */}
        <div className="space-y-3">
          <label className="text-sm text-gray-600">Photo CIN recto</label>

          <div className="flex items-center gap-4">
            <div className="w-36 h-24 rounded-xl border bg-gray-50 overflow-hidden flex items-center justify-center">
              {previewCinRecto ? (
                <img
                  src={previewCinRecto}
                  alt="cin recto"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-xs text-gray-400">Aucune photo</span>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 flex items-center gap-2 text-sm">
                <Camera className="w-4 h-4" />
                Changer recto
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleCinRectoUpload}
                />
              </label>

              {previewCinRecto && (
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-xl text-red-600 border-red-300 hover:bg-red-50 flex items-center gap-2 text-sm"
                  onClick={deleteCinRecto}
                >
                  <Trash2 className="w-4 h-4" />
                  Supprimer
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* CIN VERSO */}
        <div className="space-y-3">
          <label className="text-sm text-gray-600">Photo CIN verso</label>

          <div className="flex items-center gap-4">
            <div className="w-36 h-24 rounded-xl border bg-gray-50 overflow-hidden flex items-center justify-center">
              {previewCinVerso ? (
                <img
                  src={previewCinVerso}
                  alt="cin verso"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-xs text-gray-400">Aucune photo</span>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 flex items-center gap-2 text-sm">
                <Camera className="w-4 h-4" />
                Changer verso
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleCinVersoUpload}
                />
              </label>

              {previewCinVerso && (
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-xl text-red-600 border-red-300 hover:bg-red-50 flex items-center gap-2 text-sm"
                  onClick={deleteCinVerso}
                >
                  <Trash2 className="w-4 h-4" />
                  Supprimer
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* NOTE :
         handleDeletePhoto est gardé (ton code existant),
         mais maintenant la suppression réelle en base se fait via deleteProfilePhoto.
      */}
    </div>
  );
};
