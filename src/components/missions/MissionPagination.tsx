
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious,
  PaginationEllipsis
} from "@/components/ui/pagination";

interface MissionPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const MissionPagination = ({ currentPage, totalPages, onPageChange }: MissionPaginationProps) => {
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      pageNumbers.push(1);
      
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);
      
      if (currentPage <= 2) {
        endPage = 4;
      } else if (currentPage >= totalPages - 1) {
        startPage = totalPages - 3;
      }
      
      if (startPage > 2) {
        pageNumbers.push('ellipsis-start');
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }
      
      if (endPage < totalPages - 1) {
        pageNumbers.push('ellipsis-end');
      }
      
      pageNumbers.push(totalPages);
    }
    
    return pageNumbers;
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <Pagination className="mt-8">
      <PaginationContent>
        {currentPage > 1 && (
          <PaginationItem>
            <PaginationPrevious 
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onPageChange(Math.max(1, currentPage - 1));
              }} 
            />
          </PaginationItem>
        )}
        
        {getPageNumbers().map((pageNumber, index) => {
          if (pageNumber === 'ellipsis-start' || pageNumber === 'ellipsis-end') {
            return (
              <PaginationItem key={`ellipsis-${index}`}>
                <PaginationEllipsis />
              </PaginationItem>
            );
          }
          
          return (
            <PaginationItem key={`page-${pageNumber}`}>
              <PaginationLink 
                href="#"
                isActive={currentPage === pageNumber}
                onClick={(e) => {
                  e.preventDefault();
                  onPageChange(Number(pageNumber));
                }}
              >
                {pageNumber}
              </PaginationLink>
            </PaginationItem>
          );
        })}
        
        {currentPage < totalPages && (
          <PaginationItem>
            <PaginationNext 
              href="#"
              onClick={(e) => {
                e.preventDefault(); 
                onPageChange(Math.min(totalPages, currentPage + 1));
              }} 
            />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
};

export default MissionPagination;
