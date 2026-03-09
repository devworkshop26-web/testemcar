// src/components/prestataire/settings/CompanyInfoFormPrestataire.tsx
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { UseFormRegister, FieldErrors } from "react-hook-form";
import { PrestataireSettingsFormValues } from "@/hooks/usePrestataireSettings";
import { User } from "@/types/userType";

interface CompanyInfoFormPrestataireProps {
  register: UseFormRegister<PrestataireSettingsFormValues>;
  errors: FieldErrors<PrestataireSettingsFormValues>;
  user: User | null;

  // ✅ PRESTATAIRE DOCS
  previewLogo?: string;
  handleLogoUpload?: (e: any) => void;
  handleNifUpload?: (e: any) => void;
  handleStatUpload?: (e: any) => void;
  handleRcsUpload?: (e: any) => void;
  handleCifUpload?: (e: any) => void;
}

export const CompanyInfoFormPrestataire = ({
  register,
  errors,
  user,
  previewLogo,
  handleLogoUpload,
  handleNifUpload,
  handleStatUpload,
  handleRcsUpload,
  handleCifUpload,
}: CompanyInfoFormPrestataireProps) => {
  return (
    <div className="space-y-6">

      {/* LOGO */}
      <div className="flex items-center gap-4">
        <div className="w-24 h-24 rounded-full border border-dashed border-gray-300 flex items-center justify-center overflow-hidden bg-gray-50">
          {previewLogo ? (
            <img src={previewLogo} alt="Logo" className="w-full h-full object-cover" />
          ) : (
            <span className="text-xs text-gray-400 text-center px-2">Logo</span>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">Logo de l'entreprise</label>
          <Input
            type="file"
            accept="image/*"
            onChange={handleLogoUpload}
            className="w-full max-w-xs"
          />
        </div>
      </div>

      {/* Champs principaux entreprise */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Nom entreprise */}
        <div className="space-y-1">
          <label className="text-sm text-gray-600">Nom de l'entreprise *</label>
          <Input
            {...register("company_name", { required: "Nom entreprise obligatoire" })}
            placeholder="Nom de l'entreprise"
          />
          {errors?.company_name && (
            <p className="text-red-600 text-xs">{errors.company_name.message}</p>
          )}
        </div>

        {/* NIF */}
        <div className="space-y-1">
          <label className="text-sm text-gray-600">Numéro NIF *</label>
          <Input
            {...register("nif", { required: "NIF obligatoire" })}
            placeholder="NIF"
          />
          {/* File Upload NIF */}
          <div className="pt-1">
            <label className="text-xs text-gray-500">Document NIF (PDF/Image)</label>
            <Input type="file" onChange={handleNifUpload} className="h-8 text-xs" />
          </div>
        </div>

        {/* STAT */}
        <div className="space-y-1">
          <label className="text-sm text-gray-600">Numéro STAT *</label>
          <Input
            {...register("stat", { required: "STAT obligatoire" })}
            placeholder="STAT"
          />
          <div className="pt-1">
            <label className="text-xs text-gray-500">Document STAT (PDF/Image)</label>
            <Input type="file" onChange={handleStatUpload} className="h-8 text-xs" />
          </div>
        </div>

        {/* RCS */}
        <div className="space-y-1">
          <label className="text-sm text-gray-600">Numéro RCS</label>
          <Input {...register("rcs")} placeholder="RCS" />
          <div className="pt-1">
            <label className="text-xs text-gray-500">Document RCS (PDF/Image)</label>
            <Input type="file" onChange={handleRcsUpload} className="h-8 text-xs" />
          </div>
        </div>

        {/* CIF */}
        <div className="space-y-1">
          <label className="text-sm text-gray-600">Code CIF</label>
          <Input {...register("cif")} placeholder="CIF" />
          <div className="pt-1">
            <label className="text-xs text-gray-500">Document CIF (PDF/Image)</label>
            <Input type="file" onChange={handleCifUpload} className="h-8 text-xs" />
          </div>
        </div>

        {/* Téléphone Principal */}
        <div className="space-y-1">
          <label className="text-sm text-gray-600">Téléphone entreprise *</label>
          <Input {...register("company_phone", { required: "Téléphone obligatoire" })} placeholder="Téléphone principal" />
        </div>

        {/* Téléphone secondaire */}
        <div className="space-y-1">
          <label className="text-sm text-gray-600">Téléphone secondaire</label>
          <Input {...register("secondary_phone")} placeholder="Second téléphone" />
        </div>

        {/* Ville */}
        <div className="space-y-1">
          <label className="text-sm text-gray-600">Ville *</label>
          <Input {...register("city", { required: "Ville obligatoire" })} placeholder="Ville" />
        </div>

        {/* Email entreprise */}
        <div className="space-y-1">
          <label className="text-sm text-gray-600">Email entreprise *</label>
          <Input {...register("company_email", { required: "Email obligatoire" })} placeholder="Email professionnel" />
        </div>

      </div>

      {/* Adresse physique */}
      <div className="space-y-1">
        <label className="text-sm text-gray-600">Adresse entreprise</label>
        <Textarea {...register("company_address")} placeholder="Adresse de l’entreprise…" />
      </div>

    </div>
  );
};
