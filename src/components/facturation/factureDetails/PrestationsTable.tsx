
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Prestation } from "@/types/facture";

interface PrestationsTableProps {
  prestations: Prestation[];
  totalAmount: number;
  paidAmount: number | undefined;
  formatAmount: (amount?: number) => string;
}

export const PrestationsTable = ({
  prestations,
  totalAmount,
  paidAmount,
  formatAmount
}: PrestationsTableProps) => {
  // Calculate the remaining amount to pay
  const remainingAmount = totalAmount - (paidAmount || 0);

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Prestations facturées</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[60%]">Description</TableHead>
              <TableHead className="text-right">Montant (FCFA)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {prestations.map((prestation, index) => (
              <TableRow key={index}>
                <TableCell>{prestation.description}</TableCell>
                <TableCell className="text-right">{prestation.montant.toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        <div className="mt-4 border-t pt-4">
          <div className="flex justify-between font-semibold text-lg">
            <span>Total:</span>
            <span>{formatAmount(totalAmount)}</span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>Montant payé:</span>
            <span>{formatAmount(paidAmount)}</span>
          </div>
          <div className="flex justify-between font-bold text-lg mt-2">
            <span>Reste à payer:</span>
            <span>{formatAmount(remainingAmount)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
