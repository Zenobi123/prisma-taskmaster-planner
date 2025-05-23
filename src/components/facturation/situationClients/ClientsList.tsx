
import { Card, CardContent } from "@/components/ui/card";
import { Table } from "@/components/ui/table";
import { ClientFinancialSummary } from "@/types/clientFinancial";
import { useClientsList } from "./clients-list/useClientsList";
import ClientsListHeader from "./clients-list/ClientsListHeader";
import ClientsTableHeader from "./clients-list/ClientsTableHeader";
import ClientsTableBody from "./clients-list/ClientsTableBody";
import ClientsPagination from "./clients-list/ClientsPagination";
import { useIsMobile } from "@/hooks/use-mobile";

interface ClientsListProps {
  clientsSummary: ClientFinancialSummary[];
  isLoading: boolean;
  onViewDetails: (clientId: string) => void;
}

const ClientsList = ({ clientsSummary, isLoading, onViewDetails }: ClientsListProps) => {
  const isMobile = useIsMobile();
  
  const {
    searchTerm,
    setSearchTerm,
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedClients,
    handleSort
  } = useClientsList(clientsSummary);

  return (
    <Card className="w-full">
      <ClientsListHeader 
        searchTerm={searchTerm} 
        setSearchTerm={setSearchTerm}
        isMobile={isMobile}
      />
      
      <CardContent className={isMobile ? "px-2" : ""}>
        <div className="border rounded-md overflow-hidden">
          <Table>
            {!isMobile && <ClientsTableHeader handleSort={handleSort} />}
            <ClientsTableBody 
              isLoading={isLoading} 
              paginatedClients={paginatedClients}
              onViewDetails={onViewDetails}
              isMobile={isMobile}
            />
          </Table>
        </div>
        
        <ClientsPagination
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
        />
      </CardContent>
    </Card>
  );
};

export default ClientsList;
