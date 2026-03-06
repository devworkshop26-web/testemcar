import React, { useCallback } from 'react';
import { useFormContext, Controller } from "react-hook-form";
import { CheckCircle2, Circle, Loader2, X, Upload } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { VehicleFormData, ImageFileState } from '@/types/addVehicleType';

// --- Composant Helper: Boutons Radio Oui/Non ---
export const BooleanRadioGroup = ({ label, name, icon: Icon }: { label: string, name: keyof VehicleFormData, icon: any }) => {
  const { watch, setValue, register } = useFormContext<VehicleFormData>();
  const currentValue = watch(name);

  const handleRadioChange = useCallback((value: 'true' | 'false') => {
    setValue(name, (value === 'true') as any, { shouldValidate: true });
  }, [name, setValue]);

  return (
    <div className="space-y-3">
      <Label className="flex items-center gap-2">
        {Icon && <Icon className="w-4 h-4 text-gray-500" />} {label}
      </Label>
      <div className="flex gap-4">
        <label className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border cursor-pointer transition-all ${currentValue === true ? 'border-primary bg-blue-50 text-primary font-medium ring-1 ring-primary' : 'border-gray-200 hover:bg-gray-50'}`}>
          <input
            type="radio"
            value="true"
            {...register(name)}
            className="hidden"
            onChange={() => handleRadioChange('true')}
            checked={currentValue === true}
          />
          <CheckCircle2 className={`w-4 h-4 ${currentValue === true ? 'text-primary' : 'text-gray-300'}`} />
          Oui
        </label>

        <label className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border cursor-pointer transition-all ${currentValue === false ? 'border-gray-400 bg-gray-50 text-gray-700 font-medium' : 'border-gray-200 hover:bg-gray-50'}`}>
          <input
            type="radio"
            value="false"
            {...register(name)}
            className="hidden"
            onChange={() => handleRadioChange('false')}
            checked={currentValue === false}
          />
          <Circle className={`w-4 h-4 ${currentValue === false ? 'text-gray-500' : 'text-gray-300'}`} />
          Non
        </label>
      </div>
    </div>
  );
};

// --- Composant Helper: Select Personnalisé ---
// --- Composant Helper: Select Personnalisé ---
interface CustomSelectProps {
  name: keyof VehicleFormData;
  label: string;
  placeholder?: string;
  options: { value: string; label: string }[];
  required?: boolean;
  tone?: "light" | "soft" | string;
}

export const CustomSelect = ({ name, label, placeholder, options, required = false, tone = "soft" }: CustomSelectProps) => {
  const { control, formState: { errors } } = useFormContext<VehicleFormData>();

  const baseClasses = tone === "light"
    ? "w-full bg-white/10 text-white border-white/30 focus:border-white/60 focus:ring-0"
    : "w-full bg-white border-slate-200 rounded-xl text-slate-800";

  return (
    <div className="space-y-2">
      <Label>{label} {required && "*"}</Label>

      <Controller
        control={control}
        name={name}
        rules={{ required: required ? "Ce champ est requis" : undefined }}
        render={({ field }) => {
          // Si la valeur = "", on la remplace par "__placeholder__" pour Radix
          const currentValue =
            field.value === "" || field.value === null || field.value === undefined
              ? "__placeholder__"
              : field.value;

          return (
            <Select
              value={currentValue as string}
              onValueChange={(v) =>
                field.onChange(v === "__placeholder__" ? "" : v)
              }
            >
              <SelectTrigger className={`${baseClasses} rounded-xl min-h-[46px] shadow-sm transition-all`}>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>

              <SelectContent className="bg-white">
                {options.map((opt) => {
                  // On transforme la valeur vide pour Radix
                  const realValue =
                    opt.value === "" ? "__placeholder__" : opt.value;

                  return (
                    <SelectItem key={realValue} value={realValue}>
                      {opt.label}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          );
        }}
      />

      {errors[name] && (
        <span className="text-xs text-red-500">
          {errors[name]?.message || "Ce champ est requis"}
        </span>
      )}
    </div>
  );
};



// --- Composant Helper: Slot d'Upload d'Image ---
export const ImageUploadSlot = React.memo(({ index, state, handleImageChange, removeImage }: { index: number, state: ImageFileState, handleImageChange: (e: React.ChangeEvent<HTMLInputElement>, index: number) => void, removeImage: (index: number) => void }) => {
  const inputId = `image-upload-${index}`;

  return (
    <div className="relative aspect-video rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 flex items-center justify-center group">
      <input
        type="file"
        id={inputId}
        accept="image/*"
        onChange={(e) => handleImageChange(e, index)}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        disabled={state.isUploading || (state.previewUrl !== null && !state.error)}
      />

      {state.isUploading && (
        <div className="absolute inset-0 bg-black/50 z-20 flex flex-col items-center justify-center text-white rounded-xl">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      )}

      {state.error && (
        <div className="absolute inset-0 bg-red-500/80 z-20 flex flex-col items-center justify-center text-white rounded-xl p-2">
          <X className="w-6 h-6" />
        </div>
      )}

      {state.previewUrl && (
        <>
          <img
            src={state.previewUrl}
            alt={`Aperçu ${index + 1}`}
            className="absolute inset-0 w-full h-full object-cover rounded-xl z-0"
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 w-8 h-8 rounded-full z-30 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => removeImage(index)}
            disabled={state.isUploading}
          >
            <X className="w-4 h-4" />
          </Button>
        </>
      )}

      {!state.previewUrl && !state.isUploading && (
        <div className="text-center p-4 transition-colors">
          <Upload className="h-6 w-6 text-gray-400 group-hover:text-primary" />
          <p className="text-sm font-medium text-gray-500 mt-2">Photo {index + 1}</p>
        </div>
      )}
    </div>
  );
});

ImageUploadSlot.displayName = 'ImageUploadSlot';

// --- Composant Helper: Select avec Recherche ---
export const SearchableSelect = ({
  name,
  label,
  placeholder,
  options,
  required = false
}: {
  name: keyof VehicleFormData,
  label: string,
  placeholder: string,
  options: { value: string; label: string }[],
  required?: boolean
}) => {
  const {
    register,
    setValue,
    watch,
    formState: { errors }
  } = useFormContext<VehicleFormData>();

  const selectedValue = watch(name);
  const [query, setQuery] = React.useState("");
  const [showSuggestions, setShowSuggestions] = React.useState(false);
  const wrapperRef = React.useRef<HTMLDivElement>(null);

  // Mettre à jour la query quand la valeur change (ex: initialisation)
  React.useEffect(() => {
    if (selectedValue && !query) {
      const found = options.find(opt => opt.value === selectedValue);
      if (found) {
        setQuery(found.label);
      }
    } else if (!selectedValue && query && !showSuggestions) {
      // Si la valeur est vide mais qu'il y a une query (et qu'on n'est pas en train de taper), on vide la query
      // Sauf si on veut permettre de filtrer sans sélectionner
    }
  }, [selectedValue, options]);

  // Fermer les suggestions si on clique dehors
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
        // Si on quitte sans sélectionner et que la query ne correspond pas à la valeur sélectionnée, on remet le label correct
        if (selectedValue) {
          const found = options.find(opt => opt.value === selectedValue);
          if (found && query !== found.label) {
            setQuery(found.label);
          }
        } else {
          setQuery("");
        }
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [wrapperRef, selectedValue, options, query]);

  const filteredOptions = React.useMemo(() => {
    if (!query) return options;
    const lowerQuery = query.toLowerCase();
    return options.filter(opt => opt.label.toLowerCase().includes(lowerQuery));
  }, [options, query]);

  const handleSelect = (value: string, label: string) => {
    setValue(name, value as any, { shouldValidate: true });
    setQuery(label);
    setShowSuggestions(false);
  };

  return (
    <div className="space-y-2" ref={wrapperRef}>
      <Label className="text-sm text-slate-700">{label} {required && "*"}</Label>
      <div className="relative">
        {/* Input caché pour le register si besoin, ou on utilise juste setValue */}
        <input type="hidden" {...register(name, { required: required ? "Ce champ est requis" : false })} />

        <Input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowSuggestions(true);
            if (!e.target.value) {
              setValue(name, "" as any, { shouldValidate: true });
            }
          }}
          onFocus={() => setShowSuggestions(true)}
          placeholder={placeholder}
          className="bg-white border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-200"
          autoComplete="off"
        />

        {showSuggestions && (
          <div className="absolute z-50 mt-2 w-full rounded-xl border border-slate-200 bg-white shadow-lg max-h-56 overflow-y-auto">
            {filteredOptions.length === 0 ? (
              <p className="px-3 py-2 text-sm text-slate-500">Aucun résultat</p>
            ) : (
              filteredOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => handleSelect(opt.value, opt.label)}
                  className="flex w-full items-center justify-between px-3 py-2 text-left hover:bg-slate-50 transition-colors"
                >
                  <span className="text-sm text-slate-800">{opt.label}</span>
                  {selectedValue === opt.value && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                </button>
              ))
            )}
          </div>
        )}
      </div>
      {errors[name] && <span className="text-xs text-red-500">{errors[name]?.message as string}</span>}
    </div>
  );
};