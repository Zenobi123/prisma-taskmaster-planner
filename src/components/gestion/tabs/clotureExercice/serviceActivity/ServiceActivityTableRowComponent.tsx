
import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { ServiceActivityRow, formatNumberWithSeparator } from "./types";

interface ServiceActivityTableRowProps {
  row: ServiceActivityRow;
  handleCellChange: (id: string, field: keyof ServiceActivityRow, value: string) => void;
  removeRow: (id: string) => void;
}

export const ServiceActivityTableRowComponent = ({ 
  row, 
  handleCellChange, 
  removeRow 
}: ServiceActivityTableRowProps) => {
  return (
    <TableRow className="hover:bg-[#F2FCE2]/50 border-b-2 border-black/40">
      <TableCell className="border-r-2 border-black/40">
        <input
          type="text"
          value={row.date}
          onChange={(e) => handleCellChange(row.id, 'date', e.target.value)}
          className="w-full p-1 border-2 rounded border-neutral-300 focus:outline-none focus:ring-1 focus:ring-primary/30 focus:border-primary"
        />
      </TableCell>
      <TableCell className="border-r-2 border-black/40">
        <input
          type="text"
          value={row.structure}
          onChange={(e) => handleCellChange(row.id, 'structure', e.target.value)}
          className="w-full p-1 border-2 rounded border-neutral-300 focus:outline-none focus:ring-1 focus:ring-primary/30 focus:border-primary"
        />
      </TableCell>
      <TableCell className="border-r-2 border-black/40">
        <input
          type="text"
          value={row.numeroMarche}
          onChange={(e) => handleCellChange(row.id, 'numeroMarche', e.target.value)}
          className="w-full p-1 border-2 rounded border-neutral-300 focus:outline-none focus:ring-1 focus:ring-primary/30 focus:border-primary"
        />
      </TableCell>
      <TableCell className="border-r-2 border-black/40 min-w-36">
        <input
          type="text"
          value={row.montantHT ? formatNumberWithSeparator(row.montantHT) : ''}
          onChange={(e) => handleCellChange(row.id, 'montantHT', e.target.value)}
          className="w-full p-1 border-2 rounded text-right border-neutral-300 focus:outline-none focus:ring-1 focus:ring-primary/30 focus:border-primary"
        />
      </TableCell>
      <TableCell className="text-right border-r-2 border-black/40">
        {formatNumberWithSeparator(row.arrondi)}
      </TableCell>
      <TableCell className="border-r-2 border-black/40 w-32">
        <input
          type="text"
          value={row.acompteIRPrincipal ? formatNumberWithSeparator(row.acompteIRPrincipal) : ''}
          onChange={(e) => handleCellChange(row.id, 'acompteIRPrincipal', e.target.value)}
          className="w-full p-1 border-2 rounded text-right border-neutral-300 focus:outline-none focus:ring-1 focus:ring-primary/30 focus:border-primary"
        />
      </TableCell>
      <TableCell className="text-right border-r-2 border-black/40">
        {formatNumberWithSeparator(row.acompteIRCAC)}
      </TableCell>
      <TableCell className="text-right border-r-2 border-black/40">
        {formatNumberWithSeparator(row.acompteIRPrincipal + row.acompteIRCAC)}
      </TableCell>
      <TableCell className="border-r-2 border-black/40 w-24">
        <input
          type="text"
          value={row.droitEnregistrement ? formatNumberWithSeparator(row.droitEnregistrement) : ''}
          onChange={(e) => handleCellChange(row.id, 'droitEnregistrement', e.target.value)}
          className="w-full p-1 border-2 rounded text-right border-neutral-300 focus:outline-none focus:ring-1 focus:ring-primary/30 focus:border-primary"
        />
      </TableCell>
      <TableCell className="text-right border-r-2 border-black/40 w-28">
        {formatNumberWithSeparator(row.montantTTC)}
      </TableCell>
      <TableCell className="w-20">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => removeRow(row.id)}
          className="h-8 w-8 text-red-500 hover:bg-red-50"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </TableCell>
    </TableRow>
  );
};
