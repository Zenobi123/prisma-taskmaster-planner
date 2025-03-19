
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ClientStatusBadge } from "./ClientStatusBadge";
import { Facture } from "@/types/facture";

export interface ClientTableProps {
  clients: any[];
  sortColumn?: string;
  sortDirection?: 'asc' | 'desc';
  handleSort?: (column: string) => void;
  formatMontant: (montant: number) => string;
}

export const ClientTable = ({ 
  clients, 
  sortColumn, 
  sortDirection, 
  handleSort,
  formatMontant 
}: ClientTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead 
            className={`cursor-pointer ${sortColumn === 'nom' ? 'bg-gray-100' : ''}`}
            onClick={() => handleSort && handleSort('nom')}
          >
            Client {sortColumn === 'nom' && (sortDirection === 'asc' ? '↑' : '↓')}
          </TableHead>
          <TableHead 
            className={`cursor-pointer text-right ${sortColumn === 'montantTotal' ? 'bg-gray-100' : ''}`}
            onClick={() => handleSort && handleSort('montantTotal')}
          >
            Total {sortColumn === 'montantTotal' && (sortDirection === 'asc' ? '↑' : '↓')}
          </TableHead>
          <TableHead 
            className={`cursor-pointer text-right ${sortColumn === 'montantPaye' ? 'bg-gray-100' : ''}`}
            onClick={() => handleSort && handleSort('montantPaye')}
          >
            Payé {sortColumn === 'montantPaye' && (sortDirection === 'asc' ? '↑' : '↓')}
          </TableHead>
          <TableHead 
            className={`cursor-pointer text-right ${sortColumn === 'montantDu' ? 'bg-gray-100' : ''}`}
            onClick={() => handleSort && handleSort('montantDu')}
          >
            Dû {sortColumn === 'montantDu' && (sortDirection === 'asc' ? '↑' : '↓')}
          </TableHead>
          <TableHead 
            className={`cursor-pointer text-right ${sortColumn === 'pourcentagePaye' ? 'bg-gray-100' : ''}`}
            onClick={() => handleSort && handleSort('pourcentagePaye')}
          >
            % payé {sortColumn === 'pourcentagePaye' && (sortDirection === 'asc' ? '↑' : '↓')}
          </TableHead>
          <TableHead>Statut</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {clients.length > 0 ? (
          clients.map((client) => (
            <TableRow key={client.id}>
              <TableCell className="font-medium">{client.nom}</TableCell>
              <TableCell className="text-right">{formatMontant(client.montantTotal)}</TableCell>
              <TableCell className="text-right">{formatMontant(client.montantPaye)}</TableCell>
              <TableCell className="text-right">{formatMontant(client.montantDu)}</TableCell>
              <TableCell className="text-right">{client.pourcentagePaye.toFixed(0)}%</TableCell>
              <TableCell>
                <ClientStatusBadge status={client.status as Facture["status"]} />
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={6} className="text-center py-8 text-gray-500">
              Aucun client trouvé
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};
