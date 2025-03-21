
import { useState } from "react";
import { Client } from "@/types/client";
import { RefreshCcw, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import SearchInput from "./filters/SearchInput";
import FilterPopover from "./filters/FilterPopover";
import SortButton from "./filters/SortButton";
import FilterChips from "./filters/FilterChips";
import FilterForm from "./filters/FilterForm";
import AdvancedFilterForm from "./filters/AdvancedFilterForm";

interface FactureFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  statusFilter: string | null;
  setStatusFilter: (value: string | null) => void;
  clientFilter: string | null;
  setClientFilter: (value: string | null) => void;
  dateFilter: Date | null;
  setDateFilter: (value: Date | null) => void;
  // Nouveaux filtres
  periodeFilter: {
    debut: Date | null;
    fin: Date | null;
  };
  setPeriodeFilter: (value: { debut: Date | null; fin: Date | null; }) => void;
  montantFilter: {
    min: number | null;
    max: number | null;
  };
  setMontantFilter: (value: { min: number | null; max: number | null; }) => void;
  modePaiementFilter: string | null;
  setModePaiementFilter: (value: string | null) => void;
  clearFilters: () => void;
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
  periodeFilter,
  setPeriodeFilter,
  montantFilter,
  setMontantFilter,
  modePaiementFilter,
  setModePaiementFilter,
  clearFilters,
  sortKey,
  setSortKey,
  sortDirection,
  setSortDirection,
  clients
}: FactureFiltersProps) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [isAdvancedFilterOpen, setIsAdvancedFilterOpen] = useState(false);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
  };

  const hasBasicFilters = !!(statusFilter || clientFilter || dateFilter);
  const hasAdvancedFilters = !!(
    periodeFilter.debut || 
    periodeFilter.fin || 
    montantFilter.min || 
    montantFilter.max || 
    modePaiementFilter
  );
  const hasAnyFilters = hasBasicFilters || hasAdvancedFilters;

  const handleClearAllFilters = () => {
    clearFilters();
  };

  const setPeriodeDebut = (date: Date | null) => {
    setPeriodeFilter({
      ...periodeFilter,
      debut: date
    });
  };

  const setPeriodeFin = (date: Date | null) => {
    setPeriodeFilter({
      ...periodeFilter,
      fin: date
    });
  };

  const setMontantMin = (value: number | null) => {
    setMontantFilter({
      ...montantFilter,
      min: value
    });
  };

  const setMontantMax = (value: number | null) => {
    setMontantFilter({
      ...montantFilter,
      max: value
    });
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2 flex-wrap">
        <SearchInput 
          searchTerm={searchTerm} 
          setSearchTerm={setSearchTerm} 
        />

        <FilterPopover 
          hasActiveFilters={hasBasicFilters}
        >
          <FilterForm
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            clientFilter={clientFilter}
            setClientFilter={setClientFilter}
            dateFilter={dateFilter}
            setDateFilter={setDateFilter}
            clients={clients}
            onClose={() => setIsPopoverOpen(false)}
            clearFilters={clearFilters}
          />
        </FilterPopover>

        <FilterPopover 
          hasActiveFilters={hasAdvancedFilters}
          trigger={
            <Button variant="outline" size="sm" className="gap-1">
              <SlidersHorizontal size={16} />
              Filtres avancés
              {hasAdvancedFilters && (
                <span className="ml-1 rounded-full bg-primary w-2 h-2" />
              )}
            </Button>
          }
        >
          <AdvancedFilterForm
            periodeDebut={periodeFilter.debut}
            periodeFin={periodeFilter.fin}
            setPeriodeDebut={setPeriodeDebut}
            setPeriodeFin={setPeriodeFin}
            montantMin={montantFilter.min}
            montantMax={montantFilter.max}
            setMontantMin={setMontantMin}
            setMontantMax={setMontantMax}
            modePaiement={modePaiementFilter}
            setModePaiement={setModePaiementFilter}
            onClose={() => setIsAdvancedFilterOpen(false)}
            clearFilters={clearFilters}
          />
        </FilterPopover>

        <SortButton
          sortKey={sortKey}
          sortDirection={sortDirection}
          onSort={handleSort}
        />

        {hasAnyFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearAllFilters}
            className="flex items-center gap-1"
          >
            <RefreshCcw className="h-3.5 w-3.5" />
            Réinitialiser
          </Button>
        )}
      </div>

      <FilterChips
        statusFilter={statusFilter}
        clientFilter={clientFilter}
        dateFilter={dateFilter}
        periodeFilter={periodeFilter}
        montantFilter={montantFilter}
        modePaiementFilter={modePaiementFilter}
        setStatusFilter={setStatusFilter}
        setClientFilter={setClientFilter}
        setDateFilter={setDateFilter}
        setPeriodeFilter={setPeriodeFilter}
        setMontantFilter={setMontantFilter}
        setModePaiementFilter={setModePaiementFilter}
        clients={clients}
      />
    </div>
  );
};

export default FactureFilters;
