
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const FactureTableHeader = () => {
  return (
    <TableHeader>
      <TableRow>
        <TableHead className="w-[120px]">N° Facture</TableHead>
        <TableHead>Client</TableHead>
        <TableHead>Date</TableHead>
        <TableHead>Échéance</TableHead>
        <TableHead className="text-right">Montant</TableHead>
        <TableHead>Statut</TableHead>
        <TableHead className="text-right">Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
};
