
import { createContext, useContext, ReactNode } from "react";

interface FactureFilterContextType {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  periodFilter: string;
  setPeriodFilter: (period: string) => void;
}

const FactureFilterContext = createContext<FactureFilterContextType | undefined>(undefined);

export const FactureFilterProvider = ({ 
  children, 
  value 
}: { 
  children: ReactNode; 
  value: FactureFilterContextType 
}) => {
  return (
    <FactureFilterContext.Provider value={value}>
      {children}
    </FactureFilterContext.Provider>
  );
};

export const useFactureFilter = () => {
  const context = useContext(FactureFilterContext);
  if (context === undefined) {
    throw new Error("useFactureFilter must be used within a FactureFilterProvider");
  }
  return context;
};
