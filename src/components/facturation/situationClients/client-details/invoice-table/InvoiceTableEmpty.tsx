
import { TableRow, TableCell } from "@/components/ui/table";

const InvoiceTableEmpty = () => {
  return (
    <TableRow>
      <TableCell colSpan={8} className="text-center py-6 text-muted-foreground">
        Aucune facture trouvée
      </TableCell>
    </TableRow>
  );
};

export default InvoiceTableEmpty;
