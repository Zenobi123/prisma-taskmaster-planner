
import { useMemo } from "react";
import { Facture } from "@/types/facture";

interface UseFacturePaginationProps {
  factures: Facture[];
  currentPage: number;
  itemsPerPage: number;
}

export const useFacturePagination = ({
  factures,
  currentPage,
  itemsPerPage
}: UseFacturePaginationProps) => {
  
  // Get paginated results
  const paginatedFactures = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return factures.slice(startIndex, endIndex);
  }, [factures, currentPage, itemsPerPage]);

  // Calculate total pages
  const totalPages = useMemo(() => {
    return Math.ceil(factures.length / itemsPerPage);
  }, [factures, itemsPerPage]);

  return { paginatedFactures, totalPages };
};
