
import { TableHeader, TableRow, TableHead } from "@/components/ui/table";

const InvoiceTableHeader = () => {
  return (
    <TableHeader>
      <TableRow>
        <TableHead className="w-[100px]">N° Facture</TableHead>
        <TableHead>Date</TableHead>
        <TableHead>Échéance</TableHead>
        <TableHead className="text-right">Montant</TableHead>
        <TableHead className="text-right">Payé</TableHead>
        <TableHead className="text-right">Restant</TableHead>
        <TableHead>Statut</TableHead>
        <TableHead className="text-center">Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
};

export default InvoiceTableHeader;
