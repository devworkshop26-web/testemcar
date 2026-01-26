"use client";

import { useState } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

import { Search, ChevronDown, Car } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useNavigate } from "react-router-dom";
import { categoryVehiculeUseQuery } from "@/useQuery/categoryUseQuery";

export default function SearchBar() {
  const navigate = useNavigate();
  const { CategoryData: categories = [] } = categoryVehiculeUseQuery();

  const [location, setLocation] = useState("");

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const [carType, setCarType] = useState<string>("");

  const [openStartDate, setOpenStartDate] = useState(false);
  const [openEndDate, setOpenEndDate] = useState(false);

  const carTypes = [
    "Citadine",
    "Berline",
    "SUV",
    "Utilitaire",
    "Sport/Luxe",
    "Monospace",
  ];

  // ============================
  // 🔍 FUNCTION : HANDLE SEARCH
  // ============================
  const handleSearch = () => {
    const params = new URLSearchParams();

    if (location) params.append("ville", location);
    if (startDate) params.append("start_date", format(startDate, "yyyy-MM-dd"));
    if (endDate) params.append("end_date", format(endDate, "yyyy-MM-dd"));
    if (carType) params.append("categorie", carType);

    navigate(`/search-results?${params.toString()}`);
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4">
      <div className="w-full bg-white rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-slate-100 p-2 flex flex-col lg:flex-row lg:items-center">

        {/* LIEU */}
        <div className="flex-[1.5] px-6 py-2 lg:py-1 lg:border-r border-slate-200 relative">
          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-0.5 block">
            Lieu
          </label>
          <Input
            placeholder="Ville, aéroport, adresse..."
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="border-none p-0 h-auto shadow-none focus-visible:ring-0 text-[15px] font-medium text-slate-900 placeholder:text-slate-400"
          />
        </div>

        {/* DEBUT */}
        <div className="flex-1 px-6 py-2 lg:py-1 lg:border-r border-slate-200">
          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-0.5 block">
            Départ
          </label>

          <Popover open={openStartDate} onOpenChange={setOpenStartDate}>
            <PopoverTrigger asChild>
              <button
                onClick={() => setOpenStartDate(true)}
                className="flex items-center gap-2 text-[15px] font-medium text-slate-900 hover:bg-slate-50 rounded px-1 -ml-1 transition-colors"
              >
                {startDate ? format(startDate, "dd/MM/yyyy", { locale: fr }) : "Date"}
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-white rounded-3xl shadow-xl border border-slate-200">
              <Calendar
                mode="single"
                selected={startDate || undefined}
                onSelect={(d) => { setStartDate(d || null); setOpenStartDate(false); }}
                numberOfMonths={1}
                locale={fr}
              />
              <div className="flex justify-end px-4 py-3 border-t">
                <Button variant="ghost" onClick={() => setStartDate(null)}>Effacer</Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* FIN */}
        <div className="flex-1 px-6 py-2 lg:py-1 lg:border-r border-slate-200 relative">
          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-0.5 block">
            Jusqu'au
          </label>

          <Popover open={openEndDate} onOpenChange={setOpenEndDate}>
            <PopoverTrigger asChild>
              <button
                onClick={() => setOpenEndDate(true)}
                className="flex items-center gap-2 text-[15px] font-medium text-slate-900 hover:bg-slate-50 rounded px-1 -ml-1 transition-colors"
              >
                {endDate ? format(endDate, "dd/MM/yyyy", { locale: fr }) : "Date"}
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-white rounded-3xl shadow-xl border border-slate-200">
              <Calendar
                mode="single"
                selected={endDate || undefined}
                onSelect={(d) => { setEndDate(d || null); setOpenEndDate(false); }}
                numberOfMonths={1}
                locale={fr}
              />
              <div className="flex justify-end px-4 py-3 border-t">
                <Button variant="ghost" onClick={() => setEndDate(null)}>Effacer</Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* TYPE DE VOITURE */}
        <div className="flex-1 px-6 py-2 lg:py-1 relative">
          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-0.5 block">
            Type de Voiture
          </label>

          <Select value={carType} onValueChange={setCarType}>
            <SelectTrigger className="w-full border-none p-0 h-auto shadow-none">
              <SelectValue placeholder="Type de voiture" />
            </SelectTrigger>
            <SelectContent className="bg-white rounded-xl shadow-xl border border-slate-200">
              {categories && categories.map((type) => (
                <SelectItem key={type.id} value={type.nom}>
                  {type.nom}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* BOUTON SEARCH */}
        <div className="px-2">
          <Button
            onClick={handleSearch}
            className="h-12 w-12 rounded-xl bg-[#5D3FD3] hover:bg-[#4c32b3] flex items-center justify-center shadow-lg hover:scale-105 transition-all"
          >
            <Search className="w-5 h-5 text-white" />
          </Button>
        </div>

      </div>
    </div>
  );
}
