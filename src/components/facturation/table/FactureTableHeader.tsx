
import {
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const FactureTableHeader = () => {
  return (
    <TableHeader>
      <TableRow>
        <TableHead className="whitespace-nowrap">N° Facture</TableHead>
        <TableHead className="whitespace-nowrap">Client</TableHead>
        <TableHead className="whitespace-nowrap hidden md:table-cell">Date</TableHead>
        <TableHead className="whitespace-nowrap hidden md:table-cell">Échéance</TableHead>
        <TableHead className="whitespace-nowrap min-w-32">Montant</TableHead>
        <TableHead className="whitespace-nowrap">Statut</TableHead>
        <TableHead className="text-right whitespace-nowrap">Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
};
