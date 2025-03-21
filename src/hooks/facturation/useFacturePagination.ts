
import { useState, useMemo } from "react";
import { Facture } from "@/types/facture";
import {
  getPaginatedFactures,
  calculateTotalPages
} from "@/utils/factureUtils";

export const useFacturePagination = (filteredFactures: Facture[]) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  
  // Calculate total pages
  const totalPages = useMemo(() => {
    return calculateTotalPages(filteredFactures.length, itemsPerPage);
  }, [filteredFactures, itemsPerPage]);

  // Get paginated results
  const paginatedFactures = useMemo(() => {
    return getPaginatedFactures(filteredFactures, currentPage, itemsPerPage);
  }, [filteredFactures, currentPage, itemsPerPage]);
  
  return {
    currentPage,
    setCurrentPage,
    itemsPerPage,
    totalPages,
    paginatedFactures
  };
};
