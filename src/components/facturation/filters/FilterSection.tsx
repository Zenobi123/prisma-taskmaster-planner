
import { Client } from "@/types/client";
import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import FilterPopover from "./FilterPopover";
import FilterForm from "./FilterForm";
import AdvancedFilterForm from "./AdvancedFilterForm";

interface FilterSectionProps {
  // Basic filters
  statusFilter: string | null;
  setStatusFilter: (value: string | null) => void;
  clientFilter: string | null;
  setClientFilter: (value: string | null) => void;
  dateFilter: Date | null;
  setDateFilter: (value: Date | null) => void;
  
  // Advanced filters
  periodeFilter: {
    debut: Date | null;
    fin: Date | null;
  };
  montantFilter: {
    min: number | null;
    max: number | null;
  };
  modePaiementFilter: string | null;
  
  // Functions
  setPeriodeFilter: (value: { debut: Date | null; fin: Date | null; }) => void;
  setMontantFilter: (value: { min: number | null; max: number | null; }) => void;
  setModePaiementFilter: (value: string | null) => void;
  clearFilters: () => void;
  clients: Client[];
}

const FilterSection = ({
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
  clients
}: FilterSectionProps) => {
  const hasBasicFilters = !!(statusFilter || clientFilter || dateFilter);
  const hasAdvancedFilters = !!(
    periodeFilter.debut || 
    periodeFilter.fin || 
    montantFilter.min || 
    montantFilter.max || 
    modePaiementFilter
  );

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
    <>
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
          onClose={() => {}}
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
          onClose={() => {}}
          clearFilters={clearFilters}
        />
      </FilterPopover>
    </>
  );
};

export default FilterSection;
