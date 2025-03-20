
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

const FactureTableHeader = () => {
  return (
    <TableHeader className="bg-gray-50">
      <TableRow>
        <TableHead className="font-medium text-gray-700">N° Facture</TableHead>
        <TableHead className="font-medium text-gray-700">Client</TableHead>
        <TableHead className="font-medium text-gray-700">Date</TableHead>
        <TableHead className="font-medium text-gray-700">Montant</TableHead>
        <TableHead className="font-medium text-gray-700">Statut</TableHead>
        <TableHead className="text-right font-medium text-gray-700">Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
};

export default FactureTableHeader;
