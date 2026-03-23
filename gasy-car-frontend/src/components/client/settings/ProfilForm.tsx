<<<<<<< HEAD
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Camera, Trash2 } from "lucide-react";
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
  handleCinRectoUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleCinVersoUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;

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
  previewCinRecto,
  previewCinVerso,
  handleCinRectoUpload,
  handleCinVersoUpload,
  deleteProfilePhoto,
  deleteCinRecto,
  deleteCinVerso,
  errors,
  user,
}: ProfileFormProps) => {
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
        <div className="space-y-3">
          <label className="text-sm font-semibold text-slate-700">
            Carte d'identité (Recto)
          </label>

          <div className="relative aspect-video w-full max-w-[360px] group rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 flex flex-col items-center justify-center overflow-hidden transition-all hover:border-primary/60">
            {previewCinRecto ? (
              <>
                <img
                  src={previewCinRecto}
                  alt="cin recto"
                  className="w-full h-full object-cover"
                />

                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <label className="p-2 bg-white rounded-full cursor-pointer hover:bg-slate-100 text-primary shadow-lg">
                    <Camera className="w-5 h-5" />
                    <input
                      type="file"
                      accept="image/png,image/jpeg"
                      className="hidden"
                      onChange={handleCinRectoUpload}
                    />
                  </label>

                  <button
                    type="button"
                    onClick={deleteCinRecto}
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
                  <Camera className="w-6 h-6" />
                </div>
                <span className="text-sm font-medium text-slate-700">Ajouter le recto</span>
                <span className="text-xs text-slate-400 mt-1">
                  Cliquez pour sélectionner une image
                </span>
                <input
                  type="file"
                  accept="image/png,image/jpeg"
                  className="hidden"
                  onChange={handleCinRectoUpload}
                />
              </label>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-sm font-semibold text-slate-700">
            Carte d'identité (Verso)
          </label>

          <div className="relative aspect-video w-full max-w-[360px] group rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 flex flex-col items-center justify-center overflow-hidden transition-all hover:border-primary/60">
            {previewCinVerso ? (
              <>
                <img
                  src={previewCinVerso}
                  alt="cin verso"
                  className="w-full h-full object-cover"
                />

                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <label className="p-2 bg-white rounded-full cursor-pointer hover:bg-slate-100 text-primary shadow-lg">
                    <Camera className="w-5 h-5" />
                    <input
                      type="file"
                      accept="image/png,image/jpeg"
                      className="hidden"
                      onChange={handleCinVersoUpload}
                    />
                  </label>

                  <button
                    type="button"
                    onClick={deleteCinVerso}
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
                  <Camera className="w-6 h-6" />
                </div>
                <span className="text-sm font-medium text-slate-700">Ajouter le verso</span>
                <span className="text-xs text-slate-400 mt-1">
                  Cliquez pour sélectionner une image
                </span>
                <input
                  type="file"
                  accept="image/png,image/jpeg"
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
=======
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
  previewDrivingLicenseRecto: string | null;
  previewDrivingLicenseVerso: string | null;
  previewResidenceCertificate: string | null;
  handleCinRectoUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleCinVersoUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleResidenceCertificateUpload: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => void;
  handleDrivingLicenseRectoUpload: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => void;
  handleDrivingLicenseVersoUpload: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => void;
  deleteProfilePhoto: () => void;
  deleteCinRecto: () => void;
  deleteCinVerso: () => void;
  deleteResidenceCertificate: () => void;
  deleteDrivingLicenseRecto: () => void;
  deleteDrivingLicenseVerso: () => void;
  errors: FieldErrors<ClientSettingsFormValues>;
  user: User;
}

const documentUploadClasses =
  "relative aspect-video w-full max-w-[360px] group rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 flex flex-col items-center justify-center overflow-hidden transition-all hover:border-primary/60";

export const ProfileForm = ({
  previewPhoto,
  register,
  handlePhotoUpload,
  previewCinRecto,
  previewCinVerso,
  previewDrivingLicenseRecto,
  previewDrivingLicenseVerso,
  previewResidenceCertificate,
  handleCinRectoUpload,
  handleCinVersoUpload,
  handleResidenceCertificateUpload,
  handleDrivingLicenseRectoUpload,
  handleDrivingLicenseVersoUpload,
  deleteProfilePhoto,
  deleteCinRecto,
  deleteCinVerso,
  deleteResidenceCertificate,
  deleteDrivingLicenseRecto,
  deleteDrivingLicenseVerso,
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
          <img src={preview} alt={alt} className="h-full w-full object-cover" />

          <div className="absolute inset-0 flex items-center justify-center gap-3 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
            <label className="cursor-pointer rounded-full bg-white p-2 text-primary shadow-lg hover:bg-slate-100">
              <Camera className="h-5 w-5" />
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
              className="rounded-full bg-white p-2 text-red-600 shadow-lg hover:bg-red-50"
              title="Supprimer"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
        </>
      ) : (
        <label className="flex cursor-pointer flex-col items-center p-6 text-center">
          <div className="mb-2 rounded-full bg-white p-3 text-slate-400 shadow-sm">
            <CreditCard className="h-6 w-6" />
          </div>
          <span className="text-sm font-medium text-slate-700">{addLabel}</span>
          <span className="mt-1 text-xs text-slate-400">{helperText}</span>
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
      <div className="flex flex-col items-center gap-4 sm:items-start">
        <div className="group relative">
          <div className="relative flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-slate-100 shadow-lg">
            <div className="flex h-[104px] w-[104px] items-center justify-center overflow-hidden rounded-full">
              <AvatarClient user={user} previewPhoto={previewPhoto} size={104} />
            </div>

            <label className="absolute inset-0 flex cursor-pointer flex-col items-center justify-center bg-black/40 text-white opacity-0 transition-opacity group-hover:opacity-100">
              <Camera className="mb-1 h-8 w-8" />
              <span className="px-2 text-center text-[10px] font-medium uppercase tracking-wider">
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
              className="absolute -right-1 -top-1 rounded-full bg-red-500 p-1.5 text-white shadow-sm transition-colors hover:bg-red-600"
              title="Supprimer la photo"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="text-center sm:text-left">
          <h3 className="font-medium text-slate-900">Photo de profil</h3>
          <p className="text-xs text-slate-500">JPG ou PNG. Max 3MB.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700">Prénom</label>
          <Input {...register("first_name")} className="rounded-xl" placeholder="Prénom" />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700">Nom</label>
          <Input {...register("last_name")} className="rounded-xl" placeholder="Nom" />
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
            <p className="mt-1 text-xs text-red-600">{errors.phone.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium italic text-slate-700">
            Email (non modifiable)
          </label>
          <Input
            value={user?.email}
            disabled
            className="cursor-not-allowed rounded-xl border-slate-200 bg-slate-50 text-slate-500"
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
            <p className="mt-1 text-xs text-red-600">{errors.cin_number.message}</p>
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
          className="min-h-[100px] rounded-xl"
          placeholder="Votre adresse..."
        />
      </div>

      <div className="space-y-4 pt-2">
        <div>
          <label className="text-sm font-semibold text-slate-700">
            Permis de conduire
          </label>
          <p className="mt-1 text-xs text-slate-500">
            Ajoutez le recto et le verso de votre permis de conduire.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="space-y-3">
            <label className="text-sm font-semibold text-slate-700">
              Permis de conduire (Recto)
            </label>
            {renderUploadCard({
              preview: previewDrivingLicenseRecto,
              alt: "permis de conduire recto",
              addLabel: "Ajouter le recto",
              onUpload: handleDrivingLicenseRectoUpload,
              onDelete: deleteDrivingLicenseRecto,
            })}
          </div>

          <div className="space-y-3">
            <label className="text-sm font-semibold text-slate-700">
              Permis de conduire (Verso)
            </label>
            {renderUploadCard({
              preview: previewDrivingLicenseVerso,
              alt: "permis de conduire verso",
              addLabel: "Ajouter le verso",
              onUpload: handleDrivingLicenseVersoUpload,
              onDelete: deleteDrivingLicenseVerso,
            })}
          </div>
        </div>
      </div>

      <div className="space-y-4 pt-2">
        <div>
          <label className="text-sm font-semibold text-slate-700">
            Carte d'identité
          </label>
          <p className="mt-1 text-xs text-slate-500">
            Ajoutez le recto et le verso de votre carte d'identité.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
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

      <div className="space-y-4 pt-2">
        <div>
          <label className="text-sm font-semibold text-slate-700">
            Certificat de résidence
          </label>
          <p className="mt-1 text-xs text-slate-500">
            Déposez un certificat de résidence de moins de 3 mois.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8">
          <div className="space-y-3">
            <label className="text-sm font-semibold text-slate-700">
              Certificat de résidence (moins de 3 mois)
            </label>
            {renderUploadCard({
              preview: previewResidenceCertificate,
              alt: "certificat de résidence",
              addLabel: "Ajouter le certificat",
              onUpload: handleResidenceCertificateUpload,
              onDelete: deleteResidenceCertificate,
              helperText: "JPG ou PNG. Document daté de moins de 3 mois.",
            })}
          </div>
        </div>
      </div>

      <div className="space-y-4 border-t border-slate-200 pt-6">
        <div>
          <label className="text-sm font-semibold text-slate-700">
            Infos fiscales
          </label>
          <p className="mt-1 text-xs text-slate-500">
            Exemple uniquement. Ces informations sont optionnelles.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">NIF</label>
            <Input {...register("nif")} className="rounded-xl" placeholder="Exemple : 4001234567" />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">STAT</label>
            <Input {...register("stat")} className="rounded-xl" placeholder="Exemple : 12345 11 2024 0 00001" />
          </div>
        </div>
      </div>
    </div>
  );
};
>>>>>>> 1808c1710915da136f342d0cca3a0c8440feec9d
