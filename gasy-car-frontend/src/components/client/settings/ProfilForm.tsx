import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Camera, CreditCard, Trash2 } from "lucide-react";
import { AvatarClient } from "@/components/client/AvatarClient";

import { UseFormRegister, FieldErrors } from "react-hook-form";
import { User } from "@/types/userType";
import { ClientSettingsFormValues } from "@/hooks/useClientSetting";

interface ProfileFormProps {
  previewPhoto: string | null;
  register: UseFormRegister<ClientSettingsFormValues>;
  handlePhotoUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleDeletePhoto: () => void;

  previewCinRecto: string | null;
  previewCinVerso: string | null;
  previewDrivingLicense: string | null;
  handleCinRectoUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleCinVersoUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleDrivingLicenseUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;

  deleteProfilePhoto: () => void;
  deleteCinRecto: () => void;
  deleteCinVerso: () => void;
  deleteDrivingLicense: () => void;

  errors: FieldErrors<ClientSettingsFormValues>;
  user: User;
}

const documentUploadClasses =
  "relative aspect-video w-full max-w-[360px] group rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 flex flex-col items-center justify-center overflow-hidden transition-all hover:border-primary/60";

export const ProfileForm = ({
  previewPhoto,
  register,
  handlePhotoUpload,
  handleDeletePhoto,
  previewCinRecto,
  previewCinVerso,
  previewDrivingLicense,
  handleCinRectoUpload,
  handleCinVersoUpload,
  handleDrivingLicenseUpload,
  deleteProfilePhoto,
  deleteCinRecto,
  deleteCinVerso,
  deleteDrivingLicense,
  errors,
  user,
}: ProfileFormProps) => {
  const renderUploadCard = ({
    preview,
    alt,
    addLabel,
    onUpload,
    onDelete,
    helperText = "Cliquez pour sélectionner une image",
  }: {
    preview: string | null;
    alt: string;
    addLabel: string;
    onUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onDelete: () => void;
    helperText?: string;
  }) => (
    <div className={documentUploadClasses}>
      {preview ? (
        <>
          <img src={preview} alt={alt} className="w-full h-full object-cover" />

          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <label className="p-2 bg-white rounded-full cursor-pointer hover:bg-slate-100 text-primary shadow-lg">
              <Camera className="w-5 h-5" />
              <input
                type="file"
                accept="image/png,image/jpeg"
                className="hidden"
                onChange={onUpload}
              />
            </label>

            <button
              type="button"
              onClick={onDelete}
              className="p-2 bg-white rounded-full hover:bg-red-50 text-red-600 shadow-lg"
              title="Supprimer"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </>
      ) : (
        <label className="cursor-pointer flex flex-col items-center p-6 text-center">
          <div className="mb-2 p-3 bg-white rounded-full shadow-sm text-slate-400">
            <CreditCard className="w-6 h-6" />
          </div>
          <span className="text-sm font-medium text-slate-700">{addLabel}</span>
          <span className="text-xs text-slate-400 mt-1">{helperText}</span>
          <input
            type="file"
            accept="image/png,image/jpeg"
            className="hidden"
            onChange={onUpload}
          />
        </label>
      )}
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col items-center sm:items-start gap-4">
        <div className="relative group">
          <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg bg-slate-100 flex items-center justify-center">
            <div className="w-[104px] h-[104px] rounded-full overflow-hidden flex items-center justify-center">
              <AvatarClient user={user} previewPhoto={previewPhoto} size={104} />
            </div>

            <label className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white">
              <Camera className="w-8 h-8 mb-1" />
              <span className="text-[10px] font-medium uppercase tracking-wider text-center px-2">
                {previewPhoto || user?.image ? "Changer" : "Ajouter"}
              </span>
              <input
                type="file"
                accept="image/png,image/jpeg"
                className="hidden"
                onChange={handlePhotoUpload}
              />
            </label>
          </div>

          {(user?.image || previewPhoto) && (
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
          <h3 className="font-medium text-slate-900">Photo de profil</h3>
          <p className="text-xs text-slate-500">JPG ou PNG. Max 3MB.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700">Prénom</label>
          <Input
            {...register("first_name")}
            className="rounded-xl"
            placeholder="Prénom"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700">Nom</label>
          <Input
            {...register("last_name")}
            className="rounded-xl"
            placeholder="Nom"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700">Téléphone *</label>
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
            className={`rounded-xl ${errors?.phone ? "border-red-500" : ""}`}
            placeholder="Téléphone"
          />
          {errors?.phone && (
            <p className="text-red-600 text-xs mt-1">{errors.phone.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700 italic">
            Email (non modifiable)
          </label>
          <Input
            value={user?.email}
            disabled
            className="bg-slate-50 border-slate-200 cursor-not-allowed rounded-xl text-slate-500"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700">Numéro CIN *</label>
          <Input
            {...register("cin_number", {
              required: "Le CIN est obligatoire",
              minLength: {
                value: 12,
                message: "Le CIN doit contenir au moins 12 caractères",
              },
            })}
            className={`rounded-xl ${errors?.cin_number ? "border-red-500" : ""}`}
            placeholder="N° CIN"
          />
          {errors?.cin_number && (
            <p className="text-red-600 text-xs mt-1">{errors.cin_number.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700">Date de naissance</label>
          <Input type="date" {...register("date_of_birth")} className="rounded-xl" />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-slate-700">Adresse complète</label>
        <Textarea
          {...register("address")}
          className="rounded-xl min-h-[100px]"
          placeholder="Votre adresse..."
        />
      </div>

      <div className="space-y-3 pt-2">
        <div>
          <label className="text-sm font-semibold text-slate-700">
            Permis de conduire
          </label>
          <p className="mt-1 text-xs text-slate-500">
            Ajoutez ici la photo ou le scan de votre permis de conduire.
          </p>
        </div>

        {renderUploadCard({
          preview: previewDrivingLicense,
          alt: "permis de conduire",
          addLabel: "Ajouter le permis",
          onUpload: handleDrivingLicenseUpload,
          onDelete: deleteDrivingLicense,
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
        <div className="space-y-3">
          <label className="text-sm font-semibold text-slate-700">
            Carte d'identité (Recto)
          </label>
          {renderUploadCard({
            preview: previewCinRecto,
            alt: "cin recto",
            addLabel: "Ajouter le recto",
            onUpload: handleCinRectoUpload,
            onDelete: deleteCinRecto,
          })}
        </div>

        <div className="space-y-3">
          <label className="text-sm font-semibold text-slate-700">
            Carte d'identité (Verso)
          </label>
          {renderUploadCard({
            preview: previewCinVerso,
            alt: "cin verso",
            addLabel: "Ajouter le verso",
            onUpload: handleCinVersoUpload,
            onDelete: deleteCinVerso,
          })}
        </div>
      </div>
    </div>
  );
};
