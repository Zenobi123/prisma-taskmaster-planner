
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
  arrondi: number;
  acompteIRPrincipal: number;
  acompteIRCAC: number;
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

  // Calculate the rounded value to the next thousand
  const calculateRoundedValue = (value: number): number => {
    return Math.ceil(value / 1000) * 1000;
  };

  // Calculate totals for all columns
  const calculateTotals = () => {
    return {
      montantHT: rows.reduce((sum, row) => sum + row.montantHT, 0),
      arrondi: rows.reduce((sum, row) => sum + row.arrondi, 0),
      acompteIRPrincipal: rows.reduce((sum, row) => sum + row.acompteIRPrincipal, 0),
      acompteIRCAC: rows.reduce((sum, row) => sum + row.acompteIRCAC, 0),
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
      arrondi: 0,
      acompteIRPrincipal: 0,
      acompteIRCAC: 0,
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
            updatedRow.arrondi = calculateRoundedValue(numericValue);
            updatedRow.acompteIRPrincipal = numericValue * 0.05; // 5% of montantHT
            updatedRow.acompteIRCAC = updatedRow.acompteIRPrincipal * 0.1; // 10% of Principal
            updatedRow.droitEnregistrement = updatedRow.arrondi * 0.07 + 4500; // 7% of arrondi + 4500
            updatedRow.montantTTC = numericValue * 1.1925; // Montant HT x 1.1925
          } else if (field === 'acompteIRPrincipal') {
            updatedRow.acompteIRPrincipal = numericValue;
            updatedRow.acompteIRCAC = numericValue * 0.1; // 10% of Principal
            updatedRow.montantTTC = updatedRow.montantHT * 1.1925; // Recalculate TTC
          } else if (field === 'droitEnregistrement') {
            updatedRow.droitEnregistrement = numericValue;
            updatedRow.montantTTC = updatedRow.montantHT * 1.1925; // Recalculate TTC
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

      <div className="overflow-x-auto border-2 rounded-md border-black shadow-md">
        <Table className="border-collapse">
          <TableHeader className="bg-primary text-white">
            <TableRow className="border-b-2 border-black">
              <TableHead rowSpan={2} className="text-center text-white font-medium border-r-2 border-black">Date</TableHead>
              <TableHead rowSpan={2} className="text-center text-white font-medium border-r-2 border-black">Structure</TableHead>
              <TableHead rowSpan={2} className="text-center text-white font-medium border-r-2 border-black">Numéro Marché</TableHead>
              <TableHead rowSpan={2} className="text-center text-white font-medium border-r-2 border-black">Montant HT</TableHead>
              <TableHead rowSpan={2} className="text-center text-white font-medium border-r-2 border-black">Arrondi</TableHead>
              <TableHead colSpan={3} className="text-center text-white font-medium border-r-2 border-black">Acompte IR</TableHead>
              <TableHead rowSpan={2} className="text-center text-white font-medium border-r-2 border-black">Droit d'enregistrement</TableHead>
              <TableHead rowSpan={2} className="text-center text-white font-medium border-r-2 border-black">Montant TTC</TableHead>
              <TableHead rowSpan={2} className="text-center text-white font-medium">Actions</TableHead>
            </TableRow>
            <TableRow className="border-b-2 border-black">
              <TableHead className="text-center text-white font-medium border-r-2 border-black">Principal (5%)</TableHead>
              <TableHead className="text-center text-white font-medium border-r-2 border-black">CAC (10%)</TableHead>
              <TableHead className="text-center text-white font-medium border-r-2 border-black">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id} className="hover:bg-[#F2FCE2]/50 border-b-2 border-black/40">
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
                <TableCell className="border-r-2 border-black/40">
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
                <TableCell className="border-r-2 border-black/40">
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
                <TableCell className="border-r-2 border-black/40">
                  <input
                    type="text"
                    value={row.droitEnregistrement ? formatNumberWithSeparator(row.droitEnregistrement) : ''}
                    onChange={(e) => handleCellChange(row.id, 'droitEnregistrement', e.target.value)}
                    className="w-full p-1 border-2 rounded text-right border-neutral-300 focus:outline-none focus:ring-1 focus:ring-primary/30 focus:border-primary"
                  />
                </TableCell>
                <TableCell className="text-right border-r-2 border-black/40">
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
                <TableCell colSpan={11} className="text-center py-4 text-muted-foreground border-b-2 border-black/40">
                  Aucune donnée. Cliquez sur "Ajouter" pour commencer.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          <TableFooter className="bg-[#F2FCE2] text-primary font-medium">
            <TableRow>
              <TableCell colSpan={3} className="font-medium text-right border-r-2 border-black/40">TOTAUX</TableCell>
              <TableCell className="text-right font-medium border-r-2 border-black/40">{formatNumberWithSeparator(totals.montantHT)}</TableCell>
              <TableCell className="text-right font-medium border-r-2 border-black/40">{formatNumberWithSeparator(totals.arrondi)}</TableCell>
              <TableCell className="text-right font-medium border-r-2 border-black/40">{formatNumberWithSeparator(totals.acompteIRPrincipal)}</TableCell>
              <TableCell className="text-right font-medium border-r-2 border-black/40">{formatNumberWithSeparator(totals.acompteIRCAC)}</TableCell>
              <TableCell className="text-right font-medium border-r-2 border-black/40">{formatNumberWithSeparator(totals.acompteIRPrincipal + totals.acompteIRCAC)}</TableCell>
              <TableCell className="text-right font-medium border-r-2 border-black/40">{formatNumberWithSeparator(totals.droitEnregistrement)}</TableCell>
              <TableCell className="text-right font-medium border-r-2 border-black/40">{formatNumberWithSeparator(totals.montantTTC)}</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </div>
  );
};
