
import { FacturesFilters } from "@/services/factures/getFactures";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, 
  PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

interface FacturesPaginationProps {
  totalCount: number;
  filters: FacturesFilters;
  onPageChange: (page: number) => void;
}

export const FacturesPagination = ({ 
  totalCount, 
  filters, 
  onPageChange 
}: FacturesPaginationProps) => {
  // Calculer le nombre total de pages
  const totalPages = Math.ceil(totalCount / (filters.limit || 10));
  
  if (totalPages <= 1) return null;
  
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious 
            onClick={() => filters.page && filters.page > 1 && onPageChange(filters.page - 1)}
            className={filters.page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
          />
        </PaginationItem>
        
        {Array.from({ length: totalPages }).map((_, i) => (
          <PaginationItem key={i}>
            <PaginationLink 
              isActive={filters.page === i + 1}
              onClick={() => onPageChange(i + 1)}
            >
              {i + 1}
            </PaginationLink>
          </PaginationItem>
        ))}
        
        <PaginationItem>
          <PaginationNext 
            onClick={() => filters.page && filters.page < totalPages && onPageChange(filters.page + 1)}
            className={filters.page === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};
