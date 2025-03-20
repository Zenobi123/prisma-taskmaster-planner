
import { useState } from "react";
import { Client } from "@/types/client";
import SearchInput from "./filters/SearchInput";
import FilterPopover from "./filters/FilterPopover";
import SortButton from "./filters/SortButton";
import FilterChips from "./filters/FilterChips";
import FilterForm from "./filters/FilterForm";

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

  const hasActiveFilters = !!(statusFilter || clientFilter || dateFilter);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <SearchInput 
          searchTerm={searchTerm} 
          setSearchTerm={setSearchTerm} 
        />

        <FilterPopover 
          hasActiveFilters={hasActiveFilters}
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

        <SortButton
          sortKey={sortKey}
          sortDirection={sortDirection}
          onSort={handleSort}
        />
      </div>

      <FilterChips
        statusFilter={statusFilter}
        clientFilter={clientFilter}
        dateFilter={dateFilter}
        setStatusFilter={setStatusFilter}
        setClientFilter={setClientFilter}
        setDateFilter={setDateFilter}
        clients={clients}
      />
    </div>
  );
};

export default FactureFilters;
