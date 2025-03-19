
import { TableCell, TableRow } from "@/components/ui/table";

export const FactureTableEmptyState = () => {
  return (
    <TableRow>
      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
        Aucune facture trouvée
      </TableCell>
    </TableRow>
  );
};
