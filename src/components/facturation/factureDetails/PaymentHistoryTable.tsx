
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Paiement } from "@/types/facture";

interface PaymentHistoryTableProps {
  payments: Paiement[] | undefined;
  formatDate: (dateStr?: string) => string;
}

export const PaymentHistoryTable = ({ payments, formatDate }: PaymentHistoryTableProps) => {
  if (!payments || payments.length === 0) {
    return null;
  }
  
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Historique des paiements</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Mode</TableHead>
              <TableHead>Référence</TableHead>
              <TableHead className="text-right">Montant (FCFA)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.map((paiement, index) => (
              <TableRow key={index}>
                <TableCell>{formatDate(paiement.date)}</TableCell>
                <TableCell>{paiement.mode}</TableCell>
                <TableCell>{paiement.reference || "-"}</TableCell>
                <TableCell className="text-right">{paiement.montant.toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
