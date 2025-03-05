
import React from "react";
import { TableCell, TableFooter, TableRow } from "@/components/ui/table";
import { formatNumberWithSeparator } from "./types";

interface ServiceActivityTableFooterProps {
  totals: {
    montantHT: number;
    arrondi: number;
    acompteIRPrincipal: number;
    acompteIRCAC: number;
    droitEnregistrement: number;
    montantTTC: number;
  };
}

export const ServiceActivityTableFooter = ({ totals }: ServiceActivityTableFooterProps) => {
  return (
    <TableFooter className="bg-[#F2FCE2] text-primary font-medium">
      <TableRow>
        <TableCell colSpan={3} className="font-medium text-right border-r-2 border-black/40">TOTAUX</TableCell>
        <TableCell className="text-right font-medium border-r-2 border-black/40 min-w-36">{formatNumberWithSeparator(totals.montantHT)}</TableCell>
        <TableCell className="text-right font-medium border-r-2 border-black/40">{formatNumberWithSeparator(totals.arrondi)}</TableCell>
        <TableCell className="text-right font-medium border-r-2 border-black/40">{formatNumberWithSeparator(totals.acompteIRPrincipal)}</TableCell>
        <TableCell className="text-right font-medium border-r-2 border-black/40">{formatNumberWithSeparator(totals.acompteIRCAC)}</TableCell>
        <TableCell className="text-right font-medium border-r-2 border-black/40">{formatNumberWithSeparator(totals.acompteIRPrincipal + totals.acompteIRCAC)}</TableCell>
        <TableCell className="text-right font-medium border-r-2 border-black/40 w-32">{formatNumberWithSeparator(totals.droitEnregistrement)}</TableCell>
        <TableCell className="text-right font-medium border-r-2 border-black/40 w-32">{formatNumberWithSeparator(totals.montantTTC)}</TableCell>
        <TableCell></TableCell>
      </TableRow>
    </TableFooter>
  );
};
