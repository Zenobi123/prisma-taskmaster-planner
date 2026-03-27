
import { Client } from "@/types/client";
import { DevisStatus } from "@/types/devis";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";

interface DevisFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: DevisStatus | "all";
  onStatusChange: (value: DevisStatus | "all") => void;
  clientFilter: string;
  onClientChange: (value: string) => void;
  clients: Client[];
}

const DevisFilters = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusChange,
  clientFilter,
  onClientChange,
  clients,
}: DevisFiltersProps) => {
  return (
    <div className="space-y-4 bg-white rounded-lg shadow-sm border border-neutral-200 p-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Rechercher un devis..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Filters row */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <Select
            value={statusFilter}
            onValueChange={(val) => onStatusChange(val as DevisStatus | "all")}
          >
            <SelectTrigger>
              <SelectValue placeholder="Statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous</SelectItem>
              <SelectItem value="brouillon">Brouillon</SelectItem>
              <SelectItem value="envoye">Envoy\u00e9</SelectItem>
              <SelectItem value="accepte">Accept\u00e9</SelectItem>
              <SelectItem value="refuse">Refus\u00e9</SelectItem>
              <SelectItem value="converti">Converti</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1">
          <Select
            value={clientFilter || "all"}
            onValueChange={(val) => onClientChange(val === "all" ? "" : val)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Client" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les clients</SelectItem>
              {clients.map((client) => (
                <SelectItem key={client.id} value={client.id}>
                  {client.nom}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default DevisFilters;
