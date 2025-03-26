
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import { formatMontant } from "@/utils/formatUtils";
import { ClientPayment } from "@/types/clientFinancial";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import ModePaiementBadge from "../../paiements/ModePaiementBadge";
import { Button } from "@/components/ui/button";
import { Eye, FileText } from "lucide-react";

interface PaymentsTableProps {
  payments: ClientPayment[];
  onViewReceipt?: (payment: ClientPayment) => void;
}

const PaymentsTable = ({ payments, onViewReceipt }: PaymentsTableProps) => {
  // Helper function to format dates
  const formatDate = (dateString: string) => {
    try {
      return format(
        typeof dateString === 'string' && dateString.includes('-') 
          ? parseISO(dateString) 
          : new Date(dateString), 
        'dd/MM/yyyy', 
        { locale: fr }
      );
    } catch (error) {
      return dateString;
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Référence</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Montant</TableHead>
          <TableHead>Mode</TableHead>
          <TableHead>Facture</TableHead>
          <TableHead>Type</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {payments && payments.length > 0 ? (
          payments.map((paiement) => (
            <TableRow key={paiement.id}>
              <TableCell className="font-medium">{paiement.reference}</TableCell>
              <TableCell>{formatDate(paiement.date)}</TableCell>
              <TableCell>{formatMontant(paiement.montant)}</TableCell>
              <TableCell>
                <ModePaiementBadge mode={paiement.mode} />
              </TableCell>
              <TableCell>
                {paiement.facture_id || (paiement.est_credit ? "Crédit" : "N/A")}
              </TableCell>
              <TableCell>
                {paiement.est_credit ? (
                  <Badge className="bg-blue-500">Avance</Badge>
                ) : (
                  <Badge variant="outline">Standard</Badge>
                )}
              </TableCell>
              <TableCell className="text-right">
                {onViewReceipt && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0"
                    onClick={() => onViewReceipt(paiement)}
                  >
                    <FileText className="h-4 w-4" />
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={7} className="text-center py-6 text-gray-500">
              Aucun paiement trouvé pour ce client
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default PaymentsTable;
