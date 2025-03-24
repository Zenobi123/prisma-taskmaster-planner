
import { useState, useEffect } from "react";
import { Client } from "@/types/client";
import FilterExpandButton from "./filters/FilterExpandButton";
import FilterSearchInput from "./filters/FilterSearchInput";
import FilterActions from "./filters/FilterActions";
import ExpandedFilters from "./filters/ExpandedFilters";
import { useInvoiceData } from "@/hooks/facturation/clientFinancial/summary/useInvoiceData";

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
  const { invoices } = useInvoiceData();
  
  useEffect(() => {
    if (invoices && invoices.length > 0) {
      const sentInvoicesCount = invoices.length; // All invoices are already filtered to 'envoyée' status in the hook
      console.log("Nombre total de factures envoyées:", sentInvoicesCount);
    }
  }, [invoices]);

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
    <div className="space-y-5 bg-white rounded-lg shadow-sm border border-neutral-200 p-4">
      <FilterSearchInput 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
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
        <div className="pt-2 border-t border-neutral-200 mt-2">
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
        </div>
      )}
    </div>
  );
};

export default FactureFilters;
