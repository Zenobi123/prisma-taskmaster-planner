
import { Client } from "@/types/client";
import SearchInput from "./filters/SearchInput";
import SortButton from "./filters/SortButton";
import FilterChips from "./filters/FilterChips";
import FilterSection from "./filters/FilterSection";
import FilterActions from "./filters/FilterActions";
import { useSortFactures } from "@/hooks/useSortFactures";

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
  const hasBasicFilters = !!(statusFilter || clientFilter || dateFilter);
  const hasAdvancedFilters = !!(
    periodeFilter.debut || 
    periodeFilter.fin || 
    montantFilter.min || 
    montantFilter.max || 
    modePaiementFilter
  );
  const hasAnyFilters = hasBasicFilters || hasAdvancedFilters;

  const { handleSort } = useSortFactures(sortKey, sortDirection);

  // Custom handleSort that updates the parent component's state
  const handleSortWithParentState = (key: string) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2 flex-wrap">
        <SearchInput 
          searchTerm={searchTerm} 
          setSearchTerm={setSearchTerm} 
        />

        <FilterSection
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          clientFilter={clientFilter}
          setClientFilter={setClientFilter}
          dateFilter={dateFilter}
          setDateFilter={setDateFilter}
          periodeFilter={periodeFilter}
          setPeriodeFilter={setPeriodeFilter}
          montantFilter={montantFilter}
          setMontantFilter={setMontantFilter}
          modePaiementFilter={modePaiementFilter}
          setModePaiementFilter={setModePaiementFilter}
          clearFilters={clearFilters}
          clients={clients}
        />

        <SortButton
          sortKey={sortKey}
          sortDirection={sortDirection}
          onSort={handleSortWithParentState}
        />

        <FilterActions 
          hasAnyFilters={hasAnyFilters}
          clearFilters={clearFilters}
        />
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
