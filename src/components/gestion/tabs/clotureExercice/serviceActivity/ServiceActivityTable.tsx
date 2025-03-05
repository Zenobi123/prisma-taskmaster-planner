
import React from "react";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ServiceActivityTableHeader } from "./ServiceActivityTableHeader";
import { ServiceActivityTableRowComponent } from "./ServiceActivityTableRow";
import { ServiceActivityTableFooter } from "./ServiceActivityTableFooter";
import { ServiceActivityRow, calculateTotals } from "./types";

interface ServiceActivityTableProps {
  rows: ServiceActivityRow[];
  handleCellChange: (id: string, field: keyof ServiceActivityRow, value: string) => void;
  removeRow: (id: string) => void;
}

export const ServiceActivityTable = ({ rows, handleCellChange, removeRow }: ServiceActivityTableProps) => {
  const totals = calculateTotals(rows);

  return (
    <div className="overflow-x-auto border-2 rounded-md border-black shadow-md">
      <Table className="border-collapse">
        <ServiceActivityTableHeader />
        <TableBody>
          {rows.map((row) => (
            <ServiceActivityTableRowComponent 
              key={row.id} 
              row={row} 
              handleCellChange={handleCellChange}
              removeRow={removeRow}
            />
          ))}
          {rows.length === 0 && (
            <TableRow>
              <TableCell colSpan={11} className="text-center py-4 text-muted-foreground border-b-2 border-black/40">
                Aucune donnée. Cliquez sur "Ajouter" pour commencer.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
        <ServiceActivityTableFooter totals={totals} />
      </Table>
    </div>
  );
};
