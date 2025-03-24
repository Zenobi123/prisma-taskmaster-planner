
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Client } from "@/types/client";
import ClientSelector from "../factures/ClientSelector";
import DateFilterSelector from "./DateFilterSelector";

interface ExpandedFiltersProps {
  statusFilter: string | null;
  setStatusFilter: (value: string | null) => void;
  statusPaiementFilter: string | null;
  setStatusPaiementFilter: (value: string | null) => void;
  clientFilter: string | null;
  setClientFilter: (value: string | null) => void;
  dateFilter: Date | null;
  setDateFilter: (value: Date | null) => void;
  clients: Client[];
}

const ExpandedFilters = ({
  statusFilter,
  setStatusFilter,
  statusPaiementFilter,
  setStatusPaiementFilter,
  clientFilter,
  setClientFilter,
  dateFilter,
  setDateFilter,
  clients,
}: ExpandedFiltersProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pb-2 pt-1">
      <div className="space-y-1">
        <Label htmlFor="status" className="text-xs">Statut document</Label>
        <Select 
          value={statusFilter || "all"} 
          onValueChange={(value) => setStatusFilter(value === "all" ? null : value)}
        >
          <SelectTrigger className="h-8 text-sm">
            <SelectValue placeholder="Tous les statuts" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            <SelectItem value="brouillon">Brouillon</SelectItem>
            <SelectItem value="envoyée">Envoyée</SelectItem>
            <SelectItem value="annulée">Annulée</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-1">
        <Label htmlFor="statusPaiement" className="text-xs">Statut paiement</Label>
        <Select 
          value={statusPaiementFilter || "all"} 
          onValueChange={(value) => setStatusPaiementFilter(value === "all" ? null : value)}
        >
          <SelectTrigger className="h-8 text-sm">
            <SelectValue placeholder="Tous les statuts" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            <SelectItem value="non_payée">Non payée</SelectItem>
            <SelectItem value="partiellement_payée">Partiellement payée</SelectItem>
            <SelectItem value="payée">Payée</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <ClientSelector 
        clients={clients}
        value={clientFilter || "all"}
        onChange={(value) => setClientFilter(value === "all" ? null : value)}
        includeEmpty={true}
      />
      
      <DateFilterSelector
        dateFilter={dateFilter}
        setDateFilter={setDateFilter}
      />
    </div>
  );
};

export default ExpandedFilters;
