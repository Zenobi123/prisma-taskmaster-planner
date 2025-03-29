
import { useState } from "react";
import { ClientInvoice } from "@/types/clientFinancial";
import { ClientPayment } from "@/types/clientFinancial";
import { Facture } from "@/types/facture";
import { Table, TableBody } from "@/components/ui/table";
import useFactureViewActions from "@/hooks/facturation/factureActions/useFactureViewActions";
import InvoiceTableHeader from "./invoice-table/InvoiceTableHeader";
import InvoiceTableRow from "./invoice-table/InvoiceTableRow";
import InvoiceTableEmpty from "./invoice-table/InvoiceTableEmpty";
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

  const convertToFacture = (invoice: ClientInvoice): Facture => {
    return {
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
  };

  const handlePreviewClick = (invoice: ClientInvoice) => {
    setPreviewInvoice(convertToFacture(invoice));
    setIsPreviewOpen(true);
  };

  const handleViewInNewTab = (invoice: ClientInvoice) => {
    handleVoirFacture(convertToFacture(invoice));
  };

  const handleDownloadClick = (invoice: ClientInvoice) => {
    handleTelechargerFacture(convertToFacture(invoice));
  };

  const hasCreditAvailable = availableCredits.length > 0;

  return (
    <>
      <Table>
        <InvoiceTableHeader />
        <TableBody>
          {invoices.length === 0 ? (
            <InvoiceTableEmpty />
          ) : (
            invoices.map((invoice) => (
              <InvoiceTableRow
                key={invoice.id}
                invoice={invoice}
                availableCredits={hasCreditAvailable}
                clientName={clientName}
                onPreviewClick={handlePreviewClick}
                onViewInNewTab={handleViewInNewTab}
                onDownloadClick={handleDownloadClick}
                onOpenApplyCreditDialog={onOpenApplyCreditDialog}
                onOpenReminderDialog={onOpenReminderDialog}
              />
            ))
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
