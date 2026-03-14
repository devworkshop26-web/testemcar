import * as React from "react";
import { useFormContext } from "react-hook-form";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Command, CommandGroup, CommandItem, CommandInput, CommandEmpty } from "@/components/ui/command";
import { Button } from "@/components/ui/button";

type Option = { value: string; label: string };

interface Props {
  name: string;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  options: Option[];
  onChangeCustom?: (value: string) => void;
}

export const SearchableSelect = ({
  name,
  label,
  placeholder = "Sélectionner...",
  disabled,
  required,
  options,
  onChangeCustom,
}: Props) => {
  const { setValue, watch } = useFormContext();
  const selectedValue = watch(name);

  const selectedLabel = options.find((o) => o.value === selectedValue)?.label;

  const [open, setOpen] = React.useState(false);

  const handleSelect = (value: string) => {
    setValue(name, value, { shouldValidate: true });
    if (onChangeCustom) onChangeCustom(value);
    setOpen(false);
  };

  return (
    <div className="space-y-1">
      {label && (
        <label className="text-sm font-medium text-slate-700">
          {label} {required && "*"}
        </label>
      )}

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild disabled={disabled}>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              "w-full justify-between rounded-xl border-slate-300",
              disabled && "opacity-50 cursor-not-allowed"
            )}
          >
            {selectedLabel ?? placeholder}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-full p-0 rounded-xl">
          <Command className="rounded-xl">
            <CommandInput placeholder={`Rechercher...`} />
            <CommandEmpty>Aucun résultat.</CommandEmpty>

            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  onSelect={() => handleSelect(option.value)}
                  className="flex items-center justify-between cursor-pointer"
                >
                  {option.label}
                  {selectedValue === option.value && (
                    <Check className="h-4 w-4 text-emerald-500" />
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};
