
import React, { useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow,
  TableFooter
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

interface ServiceActivityRow {
  id: string;
  date: string;
  structure: string;
  numeroMarche: string;
  montantHT: number;
  acompteIRPrincipal: number;
  acompteIRTTC: number;
  droitEnregistrement: number;
  montantTTC: number;
}

interface ServiceActivityContentProps {
  previousYear?: number;
}

export const ServiceActivityContent = ({ previousYear }: ServiceActivityContentProps) => {
  const [rows, setRows] = useState<ServiceActivityRow[]>([]);

  // Format numbers with thousands separator (French locale)
  const formatNumberWithSeparator = (value: number): string => {
    return value.toLocaleString('fr-FR', { maximumFractionDigits: 0 });
  };

  // Calculate totals for all columns
  const calculateTotals = () => {
    return {
      montantHT: rows.reduce((sum, row) => sum + row.montantHT, 0),
      acompteIRPrincipal: rows.reduce((sum, row) => sum + row.acompteIRPrincipal, 0),
      acompteIRTTC: rows.reduce((sum, row) => sum + row.acompteIRTTC, 0),
      droitEnregistrement: rows.reduce((sum, row) => sum + row.droitEnregistrement, 0),
      montantTTC: rows.reduce((sum, row) => sum + row.montantTTC, 0)
    };
  };

  // Add a new empty row
  const addRow = () => {
    const newRow: ServiceActivityRow = {
      id: crypto.randomUUID(),
      date: "",
      structure: "",
      numeroMarche: "",
      montantHT: 0,
      acompteIRPrincipal: 0,
      acompteIRTTC: 0,
      droitEnregistrement: 0,
      montantTTC: 0
    };
    setRows([...rows, newRow]);
  };

  // Remove a row by id
  const removeRow = (id: string) => {
    setRows(rows.filter(row => row.id !== id));
  };

  // Handle changes to any cell in the table
  const handleCellChange = (id: string, field: keyof ServiceActivityRow, value: string) => {
    setRows(rows.map(row => {
      if (row.id === id) {
        const updatedRow = { ...row };
        
        if (field === 'date' || field === 'structure' || field === 'numeroMarche') {
          updatedRow[field] = value;
        } else {
          // For numeric fields, parse the input and calculate derived values
          const numericValue = parseFloat(value.replace(/\s/g, '').replace(',', '.')) || 0;
          
          if (field === 'montantHT') {
            updatedRow.montantHT = numericValue;
            updatedRow.acompteIRPrincipal = numericValue * 0.05; // 5% of montantHT
            updatedRow.acompteIRTTC = updatedRow.acompteIRPrincipal * 1.055; // Principal + 5.5%
            updatedRow.montantTTC = numericValue + updatedRow.acompteIRTTC + updatedRow.droitEnregistrement;
          } else if (field === 'acompteIRPrincipal') {
            updatedRow.acompteIRPrincipal = numericValue;
            updatedRow.acompteIRTTC = numericValue * 1.055; // Principal + 5.5%
            updatedRow.montantTTC = updatedRow.montantHT + updatedRow.acompteIRTTC + updatedRow.droitEnregistrement;
          } else if (field === 'droitEnregistrement') {
            updatedRow.droitEnregistrement = numericValue;
            updatedRow.montantTTC = updatedRow.montantHT + updatedRow.acompteIRTTC + numericValue;
          }
        }
        
        return updatedRow;
      }
      return row;
    }));
  };

  const totals = calculateTotals();

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          Analyse du chiffre d'affaires pour l'activité de prestation de services
          {previousYear ? ` de l'exercice ${previousYear}` : ""}.
        </p>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={addRow}
          className="flex items-center gap-1 border-primary text-primary hover:bg-primary hover:text-white"
        >
          <Plus className="h-4 w-4" /> Ajouter
        </Button>
      </div>

      <div className="overflow-x-auto border-2 rounded-md border-[#84A98C] shadow-md">
        <Table className="border-collapse">
          <TableHeader className="bg-primary text-white">
            <TableRow className="border-b-2 border-[#84A98C]">
              <TableHead rowSpan={2} className="text-center text-white font-medium border-r-2 border-[#84A98C]">Date</TableHead>
              <TableHead rowSpan={2} className="text-center text-white font-medium border-r-2 border-[#84A98C]">Structure</TableHead>
              <TableHead rowSpan={2} className="text-center text-white font-medium border-r-2 border-[#84A98C]">Numéro Marché</TableHead>
              <TableHead rowSpan={2} className="text-center text-white font-medium border-r-2 border-[#84A98C]">Montant HT</TableHead>
              <TableHead colSpan={3} className="text-center text-white font-medium border-r-2 border-[#84A98C]">Acompte IR</TableHead>
              <TableHead rowSpan={2} className="text-center text-white font-medium border-r-2 border-[#84A98C]">Droit d'enregistrement</TableHead>
              <TableHead rowSpan={2} className="text-center text-white font-medium border-r-2 border-[#84A98C]">Montant TTC</TableHead>
              <TableHead rowSpan={2} className="text-center text-white font-medium">Actions</TableHead>
            </TableRow>
            <TableRow className="border-b-2 border-[#84A98C]">
              <TableHead className="text-center text-white font-medium border-r-2 border-[#84A98C]">Principal (5%)</TableHead>
              <TableHead className="text-center text-white font-medium border-r-2 border-[#84A98C]">TTC (5,5%)</TableHead>
              <TableHead className="text-center text-white font-medium border-r-2 border-[#84A98C]">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id} className="hover:bg-[#F2FCE2]/50 border-b-2 border-[#84A98C]/40">
                <TableCell className="border-r-2 border-[#84A98C]/40">
                  <input
                    type="text"
                    value={row.date}
                    onChange={(e) => handleCellChange(row.id, 'date', e.target.value)}
                    className="w-full p-1 border-2 rounded border-neutral-300 focus:outline-none focus:ring-1 focus:ring-primary/30 focus:border-primary"
                  />
                </TableCell>
                <TableCell className="border-r-2 border-[#84A98C]/40">
                  <input
                    type="text"
                    value={row.structure}
                    onChange={(e) => handleCellChange(row.id, 'structure', e.target.value)}
                    className="w-full p-1 border-2 rounded border-neutral-300 focus:outline-none focus:ring-1 focus:ring-primary/30 focus:border-primary"
                  />
                </TableCell>
                <TableCell className="border-r-2 border-[#84A98C]/40">
                  <input
                    type="text"
                    value={row.numeroMarche}
                    onChange={(e) => handleCellChange(row.id, 'numeroMarche', e.target.value)}
                    className="w-full p-1 border-2 rounded border-neutral-300 focus:outline-none focus:ring-1 focus:ring-primary/30 focus:border-primary"
                  />
                </TableCell>
                <TableCell className="border-r-2 border-[#84A98C]/40">
                  <input
                    type="text"
                    value={row.montantHT ? formatNumberWithSeparator(row.montantHT) : ''}
                    onChange={(e) => handleCellChange(row.id, 'montantHT', e.target.value)}
                    className="w-full p-1 border-2 rounded text-right border-neutral-300 focus:outline-none focus:ring-1 focus:ring-primary/30 focus:border-primary"
                  />
                </TableCell>
                <TableCell className="border-r-2 border-[#84A98C]/40">
                  <input
                    type="text"
                    value={row.acompteIRPrincipal ? formatNumberWithSeparator(row.acompteIRPrincipal) : ''}
                    onChange={(e) => handleCellChange(row.id, 'acompteIRPrincipal', e.target.value)}
                    className="w-full p-1 border-2 rounded text-right border-neutral-300 focus:outline-none focus:ring-1 focus:ring-primary/30 focus:border-primary"
                  />
                </TableCell>
                <TableCell className="text-right border-r-2 border-[#84A98C]/40">
                  {formatNumberWithSeparator(row.acompteIRTTC)}
                </TableCell>
                <TableCell className="text-right border-r-2 border-[#84A98C]/40">
                  {formatNumberWithSeparator(row.acompteIRPrincipal + row.acompteIRTTC)}
                </TableCell>
                <TableCell className="border-r-2 border-[#84A98C]/40">
                  <input
                    type="text"
                    value={row.droitEnregistrement ? formatNumberWithSeparator(row.droitEnregistrement) : ''}
                    onChange={(e) => handleCellChange(row.id, 'droitEnregistrement', e.target.value)}
                    className="w-full p-1 border-2 rounded text-right border-neutral-300 focus:outline-none focus:ring-1 focus:ring-primary/30 focus:border-primary"
                  />
                </TableCell>
                <TableCell className="text-right border-r-2 border-[#84A98C]/40">
                  {formatNumberWithSeparator(row.montantTTC)}
                </TableCell>
                <TableCell>
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
            ))}
            {rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={10} className="text-center py-4 text-muted-foreground border-b-2 border-[#84A98C]/40">
                  Aucune donnée. Cliquez sur "Ajouter" pour commencer.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          <TableFooter className="bg-[#F2FCE2] text-primary font-medium">
            <TableRow>
              <TableCell colSpan={3} className="font-medium text-right border-r-2 border-[#84A98C]/40">TOTAUX</TableCell>
              <TableCell className="text-right font-medium border-r-2 border-[#84A98C]/40">{formatNumberWithSeparator(totals.montantHT)}</TableCell>
              <TableCell className="text-right font-medium border-r-2 border-[#84A98C]/40">{formatNumberWithSeparator(totals.acompteIRPrincipal)}</TableCell>
              <TableCell className="text-right font-medium border-r-2 border-[#84A98C]/40">{formatNumberWithSeparator(totals.acompteIRTTC)}</TableCell>
              <TableCell className="text-right font-medium border-r-2 border-[#84A98C]/40">{formatNumberWithSeparator(totals.acompteIRPrincipal + totals.acompteIRTTC)}</TableCell>
              <TableCell className="text-right font-medium border-r-2 border-[#84A98C]/40">{formatNumberWithSeparator(totals.droitEnregistrement)}</TableCell>
              <TableCell className="text-right font-medium border-r-2 border-[#84A98C]/40">{formatNumberWithSeparator(totals.montantTTC)}</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </div>
  );
};
