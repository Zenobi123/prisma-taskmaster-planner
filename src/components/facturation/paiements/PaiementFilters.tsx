
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Filter, X, Search } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useState } from "react";

interface PaiementFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filters: {
    mode: string;
    client: string;
    dateDebut: Date | null;
    dateFin: Date | null;
    montantMin: string;
    montantMax: string;
    estCredit: string;
  };
  onFilterChange: (filterType: string, value: any) => void;
  onResetFilters: () => void;
  clients: string[];
}

const PaiementFilters = ({
  searchTerm,
  onSearchChange,
  filters,
  onFilterChange,
  onResetFilters,
  clients
}: PaiementFiltersProps) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const activeFiltersCount = Object.values(filters).filter(value => 
    value !== "" && value !== null
  ).length;

  return (
    <div className="space-y-4">
      {/* Barre de recherche principale */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Rechercher par référence, client, facture..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        
        <Button
          variant="outline"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center gap-2"
        >
          <Filter className="h-4 w-4" />
          Filtres avancés
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="ml-1">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
        
        {activeFiltersCount > 0 && (
          <Button variant="ghost" onClick={onResetFilters} className="flex items-center gap-2">
            <X className="h-4 w-4" />
            Réinitialiser
          </Button>
        )}
      </div>

      {/* Filtres avancés */}
      {showAdvanced && (
        <div className="bg-gray-50 p-4 rounded-lg space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Mode de paiement */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Mode de paiement</label>
              <Select value={filters.mode} onValueChange={(value) => onFilterChange('mode', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Tous les modes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tous les modes</SelectItem>
                  <SelectItem value="espèces">Espèces</SelectItem>
                  <SelectItem value="virement">Virement</SelectItem>
                  <SelectItem value="orange_money">Orange Money</SelectItem>
                  <SelectItem value="mtn_money">MTN Money</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Client */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Client</label>
              <Select value={filters.client} onValueChange={(value) => onFilterChange('client', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Tous les clients" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tous les clients</SelectItem>
                  {clients.map((client) => (
                    <SelectItem key={client} value={client}>
                      {client}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Type de paiement */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Type</label>
              <Select value={filters.estCredit} onValueChange={(value) => onFilterChange('estCredit', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Tous les types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tous les types</SelectItem>
                  <SelectItem value="false">Paiements factures</SelectItem>
                  <SelectItem value="true">Crédits clients</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Date début */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Date début</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filters.dateDebut ? format(filters.dateDebut, "dd/MM/yyyy", { locale: fr }) : "Sélectionner"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={filters.dateDebut || undefined}
                    onSelect={(date) => onFilterChange('dateDebut', date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Date fin */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Date fin</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filters.dateFin ? format(filters.dateFin, "dd/MM/yyyy", { locale: fr }) : "Sélectionner"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={filters.dateFin || undefined}
                    onSelect={(date) => onFilterChange('dateFin', date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Montant minimum */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Montant min</label>
              <Input
                type="number"
                placeholder="0"
                value={filters.montantMin}
                onChange={(e) => onFilterChange('montantMin', e.target.value)}
              />
            </div>

            {/* Montant maximum */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Montant max</label>
              <Input
                type="number"
                placeholder="∞"
                value={filters.montantMax}
                onChange={(e) => onFilterChange('montantMax', e.target.value)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaiementFilters;
