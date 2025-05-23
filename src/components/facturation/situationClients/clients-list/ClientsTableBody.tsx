
import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ClientFinancialSummary } from "@/types/clientFinancial";
import ClientsTableRow from "./ClientsTableRow";

interface ClientsTableBodyProps {
  isLoading: boolean;
  paginatedClients: ClientFinancialSummary[];
  onViewDetails: (clientId: string) => void;
  isMobile?: boolean;
}

const ClientsTableBody = ({ isLoading, paginatedClients, onViewDetails, isMobile }: ClientsTableBodyProps) => {
  if (isLoading) {
    return (
      <TableBody>
        <TableRow>
          <TableCell colSpan={6} className="text-center py-8 text-gray-500">
            Chargement des données...
          </TableCell>
        </TableRow>
      </TableBody>
    );
  }

  if (paginatedClients.length === 0) {
    return (
      <TableBody>
        <TableRow>
          <TableCell colSpan={6} className="text-center py-8 text-gray-500">
            Aucun client trouvé
          </TableCell>
        </TableRow>
      </TableBody>
    );
  }

  return (
    <TableBody>
      {paginatedClients.map((client) => (
        <ClientsTableRow 
          key={client.id} 
          client={client} 
          onViewDetails={onViewDetails}
          isMobile={isMobile} 
        />
      ))}
    </TableBody>
  );
};

export default ClientsTableBody;
