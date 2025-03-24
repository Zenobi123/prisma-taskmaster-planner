
import FilterSortButton from "./FilterSortButton";
import FilterResetButton from "./FilterResetButton";

interface FilterActionsProps {
  hasActiveFilters: boolean;
  clearFilters: () => void;
  sortKey: string;
  sortDirection: "asc" | "desc";
  toggleSort: (key: string) => void;
}

const FilterActions = ({
  hasActiveFilters,
  clearFilters,
  sortKey,
  sortDirection,
  toggleSort,
}: FilterActionsProps) => {
  return (
    <div className="flex items-center gap-2">
      <FilterSortButton
        sortKey={sortKey}
        sortDirection={sortDirection}
        toggleSort={toggleSort}
      />
      
      <FilterResetButton
        hasActiveFilters={hasActiveFilters}
        clearFilters={clearFilters}
      />
    </div>
  );
};

export default FilterActions;
