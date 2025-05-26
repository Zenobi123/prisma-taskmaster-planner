
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { Eye } from "lucide-react";
import { formatMontant } from "@/utils/formatUtils";
import { ClientFinancialSummary } from "@/types/clientFinancial";
import ClientStatusBadge from "./ClientStatusBadge";

interface ClientsTableRowProps {
  client: ClientFinancialSummary;
  onViewDetails: (clientId: string) => void;
  isMobile?: boolean;
}

const ClientsTableRow = ({ client, onViewDetails, isMobile }: ClientsTableRowProps) => {
  return (
    <TableRow>
      <TableCell>{client.nom}</TableCell>
      <TableCell>{formatMontant(client.facturesMontant)}</TableCell>
      <TableCell>{formatMontant(client.paiementsMontant)}</TableCell>
      <TableCell className={client.solde >= 0 ? "text-green-600" : "text-red-600"}>
        {formatMontant(client.solde)}
      </TableCell>
      <TableCell>
        <ClientStatusBadge status={client.status} />
      </TableCell>
      <TableCell className="text-right">
        <Button 
          variant="outline" 
          size="icon"
          onClick={() => onViewDetails(client.id)}
        >
          <Eye className="h-4 w-4" />
        </Button>
      </TableCell>
    </TableRow>
  );
};

export default ClientsTableRow;
