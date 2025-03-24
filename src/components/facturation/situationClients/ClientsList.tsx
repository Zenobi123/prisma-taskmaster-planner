
import { Card, CardContent } from "@/components/ui/card";
import { Table } from "@/components/ui/table";
import { ClientFinancialSummary } from "@/types/clientFinancial";
import { useClientsList } from "./clients-list/useClientsList";
import ClientsListHeader from "./clients-list/ClientsListHeader";
import ClientsTableHeader from "./clients-list/ClientsTableHeader";
import ClientsTableBody from "./clients-list/ClientsTableBody";
import ClientsPagination from "./clients-list/ClientsPagination";

interface ClientsListProps {
  clientsSummary: ClientFinancialSummary[];
  isLoading: boolean;
  onViewDetails: (clientId: string) => void;
}

const ClientsList = ({ clientsSummary, isLoading, onViewDetails }: ClientsListProps) => {
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
      />
      
      <CardContent>
        <Table>
          <ClientsTableHeader handleSort={handleSort} />
          <ClientsTableBody 
            isLoading={isLoading} 
            paginatedClients={paginatedClients}
            onViewDetails={onViewDetails}
          />
        </Table>
        
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
