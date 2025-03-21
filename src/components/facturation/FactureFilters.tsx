
import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, ChevronUp, ChevronDown } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";
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
  clients,
}: FactureFiltersProps) => {
  const [expanded, setExpanded] = useState(false);
  
  const toggleSort = (key: string) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDirection("desc"); // Default to descending when changing sort key
    }
  };
  
  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter(null);
    setClientFilter(null);
    setDateFilter(null);
    setSortKey("date");
    setSortDirection("desc");
  };
  
  const hasActiveFilters = !!searchTerm || !!statusFilter || !!clientFilter || !!dateFilter;
  
  return (
    <div className="space-y-4">
      <div className="relative w-full">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Rechercher une facture..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-8 h-9 text-sm"
        />
      </div>
      
      <div className="flex items-center justify-between">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setExpanded(!expanded)}
          className="text-xs flex items-center gap-1 h-8"
        >
          {expanded ? (
            <>Masquer les filtres <ChevronUp className="ml-1 h-3 w-3" /></>
          ) : (
            <>Afficher les filtres <ChevronDown className="ml-1 h-3 w-3" /></>
          )}
        </Button>
        
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className="text-xs h-8"
              >
                Trier par: {sortKey === "date" ? "Date" : "Montant"}
                {sortDirection === "asc" ? " ↑" : " ↓"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => toggleSort("date")}>
                Date {sortKey === "date" && (sortDirection === "asc" ? "↑" : "↓")}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => toggleSort("montant")}>
                Montant {sortKey === "montant" && (sortDirection === "asc" ? "↑" : "↓")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {hasActiveFilters && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={clearFilters}
              className="text-xs h-8"
            >
              Réinitialiser
            </Button>
          )}
        </div>
      </div>
      
      {expanded && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-2 pt-1">
          <div className="space-y-1">
            <Label htmlFor="status" className="text-xs">Statut</Label>
            <Select 
              value={statusFilter || ""} 
              onValueChange={(value) => setStatusFilter(value || null)}
            >
              <SelectTrigger className="h-8 text-sm">
                <SelectValue placeholder="Tous les statuts" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Tous les statuts</SelectItem>
                <SelectItem value="en_attente">En attente</SelectItem>
                <SelectItem value="envoyée">Envoyée</SelectItem>
                <SelectItem value="payée">Payée</SelectItem>
                <SelectItem value="partiellement_payée">Partiellement payée</SelectItem>
                <SelectItem value="annulée">Annulée</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <ClientSelector 
            clients={clients}
            value={clientFilter || ""}
            onChange={(value) => setClientFilter(value || null)}
            includeEmpty={true}
          />
          
          <div className="space-y-1">
            <Label htmlFor="date" className="text-xs">Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date"
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal h-8 text-sm",
                    !dateFilter && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateFilter ? format(dateFilter, "dd/MM/yyyy", { locale: fr }) : <span>Toutes les dates</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dateFilter || undefined}
                  onSelect={setDateFilter}
                  initialFocus
                  className="pointer-events-auto"
                />
                {dateFilter && (
                  <div className="p-2 border-t border-gray-100 flex justify-end">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setDateFilter(null)}
                      className="text-xs"
                    >
                      Réinitialiser
                    </Button>
                  </div>
                )}
              </PopoverContent>
            </Popover>
          </div>
        </div>
      )}
    </div>
  );
};

export default FactureFilters;
