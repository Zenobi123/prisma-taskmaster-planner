
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, ArrowUpDown } from "lucide-react";
import StatusSelector from "./factures/StatusSelector";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger 
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import ClientSelector from "./factures/ClientSelector";
import { Client } from "@/types/client";

interface FactureFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  statusFilter: string | null;
  setStatusFilter: (value: string | null) => void;
  clientFilter: string | null;
  setClientFilter: (value: string | null) => void;
  dateFilter: Date | null;
  setDateFilter: (value: Date | null) => void;
  sortKey: string;
  setSortKey: (value: string) => void;
  sortDirection: "asc" | "desc";
  setSortDirection: (value: "asc" | "desc") => void;
  clients: Client[];
}

const FactureFilters = ({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  clientFilter,
  setClientFilter,
  dateFilter,
  setDateFilter,
  sortKey,
  setSortKey,
  sortDirection,
  setSortDirection,
  clients
}: FactureFiltersProps) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
  };

  const clearFilters = () => {
    setStatusFilter(null);
    setClientFilter(null);
    setDateFilter(null);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <Input
            placeholder="Rechercher une facture..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 h-9 text-sm"
          />
        </div>

        <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="gap-1">
              <Filter size={16} />
              Filtres
              {(statusFilter || clientFilter || dateFilter) && (
                <span className="ml-1 rounded-full bg-primary w-2 h-2" />
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-72 p-4" align="end">
            <div className="space-y-4">
              <div>
                <Label className="text-sm mb-1">Statut</Label>
                <StatusSelector
                  value={statusFilter || ""}
                  onChange={(value) => setStatusFilter(value === "" ? null : value)}
                  includeEmpty
                />
              </div>

              <div>
                <Label className="text-sm mb-1">Client</Label>
                <ClientSelector
                  clients={clients}
                  value={clientFilter || ""}
                  onChange={(value) => setClientFilter(value === "" ? null : value)}
                  includeEmpty
                />
              </div>

              <div>
                <Label className="text-sm mb-1">Date</Label>
                <div className="mt-1">
                  <Calendar
                    mode="single"
                    selected={dateFilter || undefined}
                    onSelect={setDateFilter}
                    locale={fr}
                    className="border rounded-md"
                  />
                </div>
                {dateFilter && (
                  <div className="mt-2 text-sm text-gray-500">
                    Date sélectionnée: {format(dateFilter, "dd/MM/yyyy", { locale: fr })}
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={clearFilters}
                >
                  Réinitialiser
                </Button>
                <Button 
                  size="sm" 
                  onClick={() => setIsPopoverOpen(false)}
                  className="bg-[#84A98C] hover:bg-[#6B8E74] text-white"
                >
                  Appliquer
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        <Button
          variant="outline"
          size="sm"
          className="gap-1"
          onClick={() => handleSort("date")}
        >
          <ArrowUpDown size={16} />
          {sortKey === "date" ? (
            <span>Date {sortDirection === "asc" ? "↑" : "↓"}</span>
          ) : (
            <span>Trier</span>
          )}
        </Button>
      </div>

      {(statusFilter || clientFilter || dateFilter) && (
        <div className="flex flex-wrap gap-2 text-sm">
          {statusFilter && (
            <div className="bg-gray-100 rounded-full px-3 py-1 flex items-center">
              <span>Statut: {statusFilter === "en_attente" ? "Non payé" : statusFilter === "partiellement_payée" ? "Partiellement payé" : statusFilter === "payée" ? "Payé" : statusFilter}</span>
              <button 
                className="ml-2 text-gray-500 hover:text-gray-700"
                onClick={() => setStatusFilter(null)}
              >
                ×
              </button>
            </div>
          )}
          {clientFilter && (
            <div className="bg-gray-100 rounded-full px-3 py-1 flex items-center">
              <span>Client: {clients.find(c => c.id === clientFilter)?.nom || clients.find(c => c.id === clientFilter)?.raisonsociale || 'Inconnu'}</span>
              <button 
                className="ml-2 text-gray-500 hover:text-gray-700"
                onClick={() => setClientFilter(null)}
              >
                ×
              </button>
            </div>
          )}
          {dateFilter && (
            <div className="bg-gray-100 rounded-full px-3 py-1 flex items-center">
              <span>Date: {format(dateFilter, "dd/MM/yyyy", { locale: fr })}</span>
              <button 
                className="ml-2 text-gray-500 hover:text-gray-700"
                onClick={() => setDateFilter(null)}
              >
                ×
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FactureFilters;
