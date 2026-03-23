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