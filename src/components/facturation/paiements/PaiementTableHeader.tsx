
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

const PaiementTableHeader = () => {
  return (
    <TableHeader>
      <TableRow>
        <TableHead>Référence</TableHead>
        <TableHead>Facture</TableHead>
        <TableHead>Client</TableHead>
        <TableHead>Date</TableHead>
        <TableHead>Montant</TableHead>
        <TableHead>Mode</TableHead>
        <TableHead className="text-right">Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
};

export default PaiementTableHeader;
