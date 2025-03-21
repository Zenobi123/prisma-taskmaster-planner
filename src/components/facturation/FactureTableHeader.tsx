
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

const FactureTableHeader = () => {
  return (
    <TableHeader>
      <TableRow>
        <TableHead className="w-[140px]">N° Facture</TableHead>
        <TableHead>Client</TableHead>
        <TableHead>Date</TableHead>
        <TableHead>Échéance</TableHead>
        <TableHead>Montant</TableHead>
        <TableHead>Statut</TableHead>
        <TableHead className="text-right">Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
};

export default FactureTableHeader;
