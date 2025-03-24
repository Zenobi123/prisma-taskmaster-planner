
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

interface PaymentsTableProps {
  payments: ClientPayment[];
}

const PaymentsTable = ({ payments }: PaymentsTableProps) => {
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
        </TableRow>
      </TableHeader>
      <TableBody>
        {payments && payments.length > 0 ? (
          payments.map((paiement) => (
            <TableRow key={paiement.id} className="hover:bg-gray-50">
              <TableCell className="font-medium text-gray-700">{paiement.reference}</TableCell>
              <TableCell>{formatDate(paiement.date)}</TableCell>
              <TableCell className={paiement.est_credit ? "font-medium text-blue-600" : "font-medium text-green-600"}>
                {formatMontant(paiement.montant)}
              </TableCell>
              <TableCell>
                <ModePaiementBadge mode={paiement.mode} />
              </TableCell>
              <TableCell>
                {paiement.facture_id || (paiement.est_credit ? 
                  <Badge className="bg-blue-500">Crédit</Badge> : 
                  <span className="text-gray-500">N/A</span>
                )}
              </TableCell>
              <TableCell>
                {paiement.est_credit ? (
                  <Badge className="bg-blue-500 hover:bg-blue-600">Avance</Badge>
                ) : (
                  <Badge variant="outline" className="text-gray-600 border-gray-300">Standard</Badge>
                )}
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={6} className="text-center py-6 text-gray-500">
              Aucun paiement trouvé pour ce client
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default PaymentsTable;
