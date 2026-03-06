import { CalendarIcon, Sparkles } from "lucide-react";
import { startOfToday } from "date-fns";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface DateSelectorProps {
  value?: any;
  onChange: (range: any) => void;
  className?: string;
}

 const DateSelector = ({ value, onChange, className }: DateSelectorProps) => {
  const today = startOfToday();

  const formatDate = (date: Date | undefined) => {
    if (!date) return null;
    const m = ["Jan","Fév","Mar","Avr","Mai","Jun","Jul","Aoû","Sep","Oct","Nov","Déc"];
    return `${date.getDate()} ${m[date.getMonth()]} ${date.getFullYear()}`;
  };

  const handleDateSelect = (date: Date | undefined, type: "from" | "to") => {
    const newRange = { ...value };

    if (type === "from") {
      newRange.from = date;
      if (date && newRange.to && date > newRange.to) newRange.to = undefined;
    } else {
      newRange.to = date;
    }

    onChange(newRange.from || newRange.to ? newRange : undefined);
  };

  return (
    <div className={cn("w-full", className)}>

      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 bg-primary/10 rounded-xl">
          <CalendarIcon className="h-5 w-5 text-primary animate-pulse" />
        </div>
        <div>
          <h3 className="text-lg font-bold">Sélection des dates</h3>
          <p className="text-xs text-muted-foreground">Choisissez votre période</p>
        </div>
      </div>

      <div className="space-y-4">

        {/* START DATE */}
        <div>
          <label className="text-xs font-semibold mb-1 block">Date de début</label>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-between rounded-xl h-14 border-2"
              >
                {value?.from ? formatDate(value.from) : "Sélectionner une date"}
                <CalendarIcon className="h-5 w-5 text-primary" />
              </Button>
            </PopoverTrigger>

            <PopoverContent className="p-0 rounded-2xl shadow-xl border bg-white">
              <Calendar
                mode="single"
                selected={value?.from}
                onSelect={(d) => handleDateSelect(d, "from")}
                defaultMonth={value?.from ?? today}
                fromDate={today}
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* END DATE */}
        <div>
          <label className="text-xs font-semibold mb-1 block">Date de fin</label>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-between rounded-xl h-14 border-2"
              >
                {value?.to ? formatDate(value.to) : "Sélectionner une date"}
                <CalendarIcon className="h-5 w-5 text-primary" />
              </Button>
            </PopoverTrigger>

            <PopoverContent className="p-0 rounded-2xl shadow-xl border bg-white">
              <Calendar
                mode="single"
                selected={value?.to}
                onSelect={(d) => handleDateSelect(d, "to")}
                defaultMonth={value?.to ?? value?.from ?? today}
                fromDate={value?.from ?? today}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Summary */}
      {value?.from && value?.to && (
        <div className="mt-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
          <div className="flex items-center gap-1 mb-2">
            <Sparkles className="h-4 w-4 text-emerald-600" />
            <span className="text-xs font-semibold text-emerald-700">
              Période sélectionnée
            </span>
          </div>
          <p className="text-sm font-bold">
            Du {formatDate(value.from)} au {formatDate(value.to)}
          </p>
        </div>
      )}
    </div>
  );
};

export default DateSelector;
