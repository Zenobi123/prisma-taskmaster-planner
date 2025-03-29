
import { ClientInvoice } from "@/types/clientFinancial";
import { ClientPayment } from "@/types/clientFinancial";
import { formatDate } from "@/utils/formatUtils";
import { formatMontant } from "@/utils/formatUtils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Facture } from "@/types/facture";
import useFactureViewActions from "@/hooks/facturation/factureActions/useFactureViewActions";
import {
  CreditCard,
  Bell,
  Eye,
  Download,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import InvoicePreviewDialog from "../dialogs/InvoicePreviewDialog";

interface InvoicesTableProps {
  invoices: ClientInvoice[];
  availableCredits: ClientPayment[];
  onOpenApplyCreditDialog: (invoiceId: string) => void;
  onOpenReminderDialog: (invoiceId: string) => void;
  clientName: string;
}

const InvoicesTable = ({ 
  invoices, 
  availableCredits, 
  onOpenApplyCreditDialog,
  onOpenReminderDialog,
  clientName
}: InvoicesTableProps) => {
  const { handleVoirFacture, handleTelechargerFacture } = useFactureViewActions();
  const [previewInvoice, setPreviewInvoice] = useState<Facture | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const handlePreviewClick = (invoice: ClientInvoice) => {
    // Convertir ClientInvoice en Facture pour l'aperçu
    const factureForPreview: Facture = {
      id: invoice.id,
      client_id: invoice.id.split('-')[0], // Estimation de l'ID client
      client: {
        id: invoice.id.split('-')[0], // Estimation de l'ID client
        nom: clientName,
        adresse: "",
        telephone: "",
        email: ""
      },
      date: invoice.date,
      echeance: invoice.echeance,
      montant: invoice.montant,
      montant_paye: invoice.montant_paye,
      status: invoice.status as "brouillon" | "envoyée" | "annulée",
      status_paiement: invoice.status_paiement as "non_payée" | "partiellement_payée" | "payée" | "en_retard",
      prestations: []
    };
    
    setPreviewInvoice(factureForPreview);
    setIsPreviewOpen(true);
  };

  const handleDownloadClick = (invoice: ClientInvoice) => {
    // Convertir ClientInvoice en Facture pour le téléchargement
    const factureForDownload: Facture = {
      id: invoice.id,
      client_id: invoice.id.split('-')[0], // Estimation de l'ID client
      client: {
        id: invoice.id.split('-')[0], // Estimation de l'ID client
        nom: clientName,
        adresse: "",
        telephone: "",
        email: ""
      },
      date: invoice.date,
      echeance: invoice.echeance,
      montant: invoice.montant,
      montant_paye: invoice.montant_paye,
      status: invoice.status as "brouillon" | "envoyée" | "annulée",
      status_paiement: invoice.status_paiement as "non_payée" | "partiellement_payée" | "payée" | "en_retard",
      prestations: []
    };
    
    handleTelechargerFacture(factureForDownload);
  };

  const handleViewInvoiceInNewTab = (invoice: ClientInvoice) => {
    // Convertir ClientInvoice en Facture pour l'aperçu dans un nouvel onglet
    const factureForView: Facture = {
      id: invoice.id,
      client_id: invoice.id.split('-')[0], // Estimation de l'ID client
      client: {
        id: invoice.id.split('-')[0], // Estimation de l'ID client
        nom: clientName,
        adresse: "",
        telephone: "",
        email: ""
      },
      date: invoice.date,
      echeance: invoice.echeance,
      montant: invoice.montant,
      montant_paye: invoice.montant_paye,
      status: invoice.status as "brouillon" | "envoyée" | "annulée",
      status_paiement: invoice.status_paiement as "non_payée" | "partiellement_payée" | "payée" | "en_retard",
      prestations: []
    };
    
    handleVoirFacture(factureForView);
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "payée":
        return "success";
      case "partiellement_payée":
        return "secondary";
      case "en_retard":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const hasCreditAvailable = availableCredits.length > 0;

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">N° Facture</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Échéance</TableHead>
            <TableHead className="text-right">Montant</TableHead>
            <TableHead className="text-right">Payé</TableHead>
            <TableHead className="text-right">Restant</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-6 text-muted-foreground">
                Aucune facture trouvée
              </TableCell>
            </TableRow>
          ) : (
            invoices.map((invoice) => {
              const remainingAmount = Math.max(0, invoice.montant - (invoice.montant_paye || 0));
              const showApplyCredit = hasCreditAvailable && remainingAmount > 0;
              const showReminder = ["non_payée", "partiellement_payée", "en_retard"].includes(invoice.status_paiement);
              
              return (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium">{invoice.id}</TableCell>
                  <TableCell>{formatDate(invoice.date)}</TableCell>
                  <TableCell>{formatDate(invoice.echeance)}</TableCell>
                  <TableCell className="text-right">{formatMontant(invoice.montant)}</TableCell>
                  <TableCell className="text-right">{formatMontant(invoice.montant_paye || 0)}</TableCell>
                  <TableCell className="text-right">{formatMontant(remainingAmount)}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(invoice.status_paiement)}>
                      {invoice.status_paiement.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-center gap-1">
                      <Button
                        variant="outline"
                        size="icon"
                        title="Aperçu"
                        onClick={() => handlePreviewClick(invoice)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        title="Aperçu complet"
                        onClick={() => handleViewInvoiceInNewTab(invoice)}
                      >
                        <Eye className="h-4 w-4 text-blue-500" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        title="Télécharger"
                        onClick={() => handleDownloadClick(invoice)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      {showApplyCredit && (
                        <Button
                          variant="outline"
                          size="icon"
                          title="Appliquer un crédit"
                          onClick={() => onOpenApplyCreditDialog(invoice.id)}
                        >
                          <CreditCard className="h-4 w-4" />
                        </Button>
                      )}
                      {showReminder && (
                        <Button
                          variant="outline"
                          size="icon"
                          title="Envoyer un rappel"
                          onClick={() => onOpenReminderDialog(invoice.id)}
                        >
                          <Bell className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>

      <InvoicePreviewDialog 
        invoice={previewInvoice}
        open={isPreviewOpen}
        onOpenChange={setIsPreviewOpen}
      />
    </>
  );
};

export default InvoicesTable;
