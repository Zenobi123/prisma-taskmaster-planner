
import { Button } from "@/components/ui/button";
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowUpDown } from "lucide-react";

interface ClientsTableHeaderProps {
  handleSort: (column: string) => void;
}

const ClientsTableHeader = ({ handleSort }: ClientsTableHeaderProps) => {
  return (
    <TableHeader>
      <TableRow>
        <TableHead>
          <Button variant="ghost" className="p-0 font-semibold flex items-center gap-1"
            onClick={() => handleSort('nom')}>
            Client
            <ArrowUpDown className="h-4 w-4" />
          </Button>
        </TableHead>
        <TableHead>
          <Button variant="ghost" className="p-0 font-semibold flex items-center gap-1"
            onClick={() => handleSort('facturesMontant')}>
            Total facturé
            <ArrowUpDown className="h-4 w-4" />
          </Button>
        </TableHead>
        <TableHead>
          <Button variant="ghost" className="p-0 font-semibold flex items-center gap-1"
            onClick={() => handleSort('paiementsMontant')}>
            Total payé
            <ArrowUpDown className="h-4 w-4" />
          </Button>
        </TableHead>
        <TableHead>
          <Button variant="ghost" className="p-0 font-semibold flex items-center gap-1"
            onClick={() => handleSort('solde')}>
            Solde
            <ArrowUpDown className="h-4 w-4" />
          </Button>
        </TableHead>
        <TableHead>Statut</TableHead>
        <TableHead className="text-right">Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
};

export default ClientsTableHeader;
