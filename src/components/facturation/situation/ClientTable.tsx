
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, ArrowUpDown } from "lucide-react";
import { ClientStatusBadge } from "./ClientStatusBadge";

interface ClientData {
  id: string;
  nom: string;
  facturesMontant: number;
  paiementsMontant: number;
  solde: number;
  status: string;
}

interface ClientTableProps {
  clients: ClientData[];
  sortColumn: string;
  sortDirection: 'asc' | 'desc';
  handleSort: (column: string) => void;
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
          <TableHead className="w-[100px]">ID</TableHead>
          <TableHead>
            <Button 
              variant="ghost" 
              className="p-0 font-semibold flex items-center gap-1"
              onClick={() => handleSort('nom')}
            >
              Client
              <ArrowUpDown className="h-4 w-4" />
            </Button>
          </TableHead>
          <TableHead>
            <Button 
              variant="ghost" 
              className="p-0 font-semibold flex items-center gap-1"
              onClick={() => handleSort('facturesMontant')}
            >
              Total facturé
              <ArrowUpDown className="h-4 w-4" />
            </Button>
          </TableHead>
          <TableHead>
            <Button 
              variant="ghost" 
              className="p-0 font-semibold flex items-center gap-1"
              onClick={() => handleSort('paiementsMontant')}
            >
              Total payé
              <ArrowUpDown className="h-4 w-4" />
            </Button>
          </TableHead>
          <TableHead>
            <Button 
              variant="ghost" 
              className="p-0 font-semibold flex items-center gap-1"
              onClick={() => handleSort('solde')}
            >
              Solde
              <ArrowUpDown className="h-4 w-4" />
            </Button>
          </TableHead>
          <TableHead>Statut</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {clients.length > 0 ? (
          clients.map((client) => (
            <TableRow key={client.id}>
              <TableCell className="font-medium">{client.id}</TableCell>
              <TableCell>{client.nom}</TableCell>
              <TableCell>{formatMontant(client.facturesMontant)}</TableCell>
              <TableCell>{formatMontant(client.paiementsMontant)}</TableCell>
              <TableCell>{formatMontant(client.solde)}</TableCell>
              <TableCell><ClientStatusBadge status={client.status} /></TableCell>
              <TableCell className="text-right">
                <Button variant="outline" size="icon">
                  <Eye className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={7} className="text-center py-8 text-gray-500">
              Aucun client trouvé
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};
