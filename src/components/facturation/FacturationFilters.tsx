
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FacturationFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  periodFilter: string;
  setPeriodFilter: (period: string) => void;
}

export const FacturationFilters = ({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  periodFilter,
  setPeriodFilter,
}: FacturationFiltersProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-6">
      <div className="relative md:col-span-5">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Rechercher une facture..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>
      <div className="md:col-span-3">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            <SelectItem value="payée">Payée</SelectItem>
            <SelectItem value="en_attente">En attente</SelectItem>
            <SelectItem value="envoyée">Envoyée</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="md:col-span-4">
        <Select value={periodFilter} onValueChange={setPeriodFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Période" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les périodes</SelectItem>
            <SelectItem value="this_month">Ce mois-ci</SelectItem>
            <SelectItem value="last_month">Mois dernier</SelectItem>
            <SelectItem value="last_three_months">3 derniers mois</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
