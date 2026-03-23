import { Filter, Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

interface SupportTicketFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  dateFilter: string;
  onDateFilterChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  searchPlaceholder?: string;
}

export function SupportTicketFilters({
  search,
  onSearchChange,
  dateFilter,
  onDateFilterChange,
  statusFilter,
  onStatusFilterChange,
  searchPlaceholder = "Rechercher par titre ou description...",
}: SupportTicketFiltersProps) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
      <div className="mb-4 flex items-center gap-2">
        <Filter className="h-4 w-4 text-slate-500" />
        <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-600">
          Recherche et filtres
        </h2>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder={searchPlaceholder}
            className="h-11 rounded-2xl border-slate-200 bg-slate-50 pl-10"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        <Select value={dateFilter} onValueChange={onDateFilterChange}>
          <SelectTrigger className="h-11 rounded-2xl border-slate-200 bg-slate-50">
            <SelectValue placeholder="Période" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les périodes</SelectItem>
            <SelectItem value="today">Aujourd’hui</SelectItem>
            <SelectItem value="week">Cette semaine</SelectItem>
            <SelectItem value="month">Ce mois</SelectItem>
            <SelectItem value="year">Cette année</SelectItem>
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={onStatusFilterChange}>
          <SelectTrigger className="h-11 rounded-2xl border-slate-200 bg-slate-50">
            <SelectValue placeholder="Statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            <SelectItem value="OPEN">Ouvert</SelectItem>
            <SelectItem value="IN_PROGRESS">En cours</SelectItem>
            <SelectItem value="RESOLVED">Résolu</SelectItem>
            <SelectItem value="CLOSED">Fermé</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}