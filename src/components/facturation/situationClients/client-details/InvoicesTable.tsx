
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import { Bell, Wallet } from "lucide-react";
import { formatMontant } from "@/utils/formatUtils";
import { ClientInvoice, ClientPayment } from "@/types/clientFinancial";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import StatusBadge from "../../StatusBadge";

interface InvoicesTableProps {
  invoices: ClientInvoice[];
  availableCredits: ClientPayment[];
  onOpenApplyCreditDialog: (invoiceId: string) => void;
  onOpenReminderDialog: (invoiceId: string) => void;
}

const InvoicesTable = ({ 
  invoices, 
  availableCredits, 
  onOpenApplyCreditDialog, 
  onOpenReminderDialog 
}: InvoicesTableProps) => {
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
          <TableHead>Échéance</TableHead>
          <TableHead>Montant</TableHead>
          <TableHead>Payé</TableHead>
          <TableHead>Restant</TableHead>
          <TableHead>Statut</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices && invoices.length > 0 ? (
          invoices.map((facture) => (
            <TableRow key={facture.id}>
              <TableCell className="font-medium">{facture.id}</TableCell>
              <TableCell>{formatDate(facture.date)}</TableCell>
              <TableCell>{formatDate(facture.echeance)}</TableCell>
              <TableCell>{formatMontant(facture.montant)}</TableCell>
              <TableCell>{formatMontant(facture.montant_paye || 0)}</TableCell>
              <TableCell className={facture.montant_restant > 0 ? "text-red-600" : "text-green-600"}>
                {formatMontant(facture.montant_restant)}
              </TableCell>
              <TableCell>
                <StatusBadge status={facture.status_paiement} type="paiement" />
              </TableCell>
              <TableCell className="text-right space-x-1">
                {facture.status_paiement !== 'payée' && availableCredits.length > 0 && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => onOpenApplyCreditDialog(facture.id)}
                    title="Appliquer une avance"
                  >
                    <Wallet className="h-4 w-4" />
                  </Button>
                )}
                {facture.status_paiement !== 'payée' && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => onOpenReminderDialog(facture.id)}
                    title="Envoyer un rappel"
                  >
                    <Bell className="h-4 w-4" />
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={8} className="text-center py-6 text-gray-500">
              Aucune facture trouvée pour ce client
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default InvoicesTable;
