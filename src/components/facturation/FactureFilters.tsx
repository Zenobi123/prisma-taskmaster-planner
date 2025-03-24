
import { useState } from "react";
import { Client } from "@/types/client";
import FilterExpandButton from "./filters/FilterExpandButton";
import FilterSearchInput from "./filters/FilterSearchInput";
import FilterActions from "./filters/FilterActions";
import ExpandedFilters from "./filters/ExpandedFilters";

interface FactureFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  statusFilter: string | null;
  setStatusFilter: (value: string | null) => void;
  statusPaiementFilter: string | null;
  setStatusPaiementFilter: (value: string | null) => void;
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
  statusPaiementFilter,
  setStatusPaiementFilter,
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
      setSortDirection("desc");
    }
  };
  
  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter(null);
    setStatusPaiementFilter(null);
    setClientFilter(null);
    setDateFilter(null);
    setSortKey("date");
    setSortDirection("desc");
  };
  
  const hasActiveFilters = !!searchTerm || !!statusFilter || !!statusPaiementFilter || !!clientFilter || !!dateFilter;
  
  return (
    <div className="space-y-4">
      <FilterSearchInput 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />
      
      <div className="flex items-center justify-between">
        <FilterExpandButton 
          expanded={expanded}
          setExpanded={setExpanded}
        />
        
        <FilterActions
          hasActiveFilters={hasActiveFilters}
          clearFilters={clearFilters}
          sortKey={sortKey}
          sortDirection={sortDirection}
          toggleSort={toggleSort}
        />
      </div>
      
      {expanded && (
        <ExpandedFilters
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          statusPaiementFilter={statusPaiementFilter}
          setStatusPaiementFilter={setStatusPaiementFilter}
          clientFilter={clientFilter}
          setClientFilter={setClientFilter}
          dateFilter={dateFilter}
          setDateFilter={setDateFilter}
          clients={clients}
        />
      )}
    </div>
  );
};

export default FactureFilters;
