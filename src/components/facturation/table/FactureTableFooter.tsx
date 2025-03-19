
import {
  TableCell,
  TableFooter,
  TableRow,
} from "@/components/ui/table";

interface FactureTableFooterProps {
  totalMontant: number;
  formatMontant: (montant: number) => string;
}

export const FactureTableFooter = ({
  totalMontant,
  formatMontant,
}: FactureTableFooterProps) => {
  return (
    <TableFooter>
      <TableRow>
        <TableCell colSpan={3} className="font-semibold">Total</TableCell>
        <TableCell colSpan={1} className="hidden md:table-cell"></TableCell>
        <TableCell className="font-semibold min-w-32">{formatMontant(totalMontant)}</TableCell>
        <TableCell colSpan={2}></TableCell>
      </TableRow>
    </TableFooter>
  );
};
