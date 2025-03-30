
import { useState, useMemo } from "react";
import { ClientFinancialSummary } from "@/types/clientFinancial";

export const useClientsList = (clientsSummary: ClientFinancialSummary[]) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortColumn, setSortColumn] = useState("nom");
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };
  
  // Utilisation de useMemo pour éviter des recalculs inutiles
  const filteredClients = useMemo(() => {
    console.log("Calcul des clients filtrés");
    return clientsSummary
      .filter(client => 
        client.nom?.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => {
        const aValue = a[sortColumn as keyof typeof a];
        const bValue = b[sortColumn as keyof typeof b];
        
        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
        }
        
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return sortDirection === 'asc' 
            ? aValue.localeCompare(bValue) 
            : bValue.localeCompare(aValue);
        }
        
        return 0;
      });
  }, [clientsSummary, searchTerm, sortColumn, sortDirection]);
  
  // Calcul de la pagination optimisé
  const totalPages = useMemo(() => 
    Math.ceil(filteredClients.length / itemsPerPage), 
    [filteredClients.length, itemsPerPage]
  );
  
  const paginatedClients = useMemo(() => 
    filteredClients.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    ),
    [filteredClients, currentPage, itemsPerPage]
  );

  return {
    searchTerm,
    setSearchTerm,
    sortColumn,
    sortDirection,
    currentPage,
    setCurrentPage,
    totalPages,
    filteredClients,
    paginatedClients,
    handleSort
  };
};
