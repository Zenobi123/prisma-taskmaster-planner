
import { ClientInvoice } from "@/types/clientFinancial";
import { formatDate, formatMontant } from "@/utils/formatUtils";
import { TableRow, TableCell } from "@/components/ui/table";
import InvoiceStatusBadge from "./InvoiceStatusBadge";
import InvoiceRowActions from "./InvoiceRowActions";

interface InvoiceTableRowProps {
  invoice: ClientInvoice;
  availableCredits: boolean;
  clientName: string;
  onPreviewClick: (invoice: ClientInvoice) => void;
  onViewInNewTab: (invoice: ClientInvoice) => void;
  onDownloadClick: (invoice: ClientInvoice) => void;
  onOpenApplyCreditDialog: (invoiceId: string) => void;
  onOpenReminderDialog: (invoiceId: string) => void;
}

const InvoiceTableRow = ({
  invoice,
  availableCredits,
  clientName,
  onPreviewClick,
  onViewInNewTab,
  onDownloadClick,
  onOpenApplyCreditDialog,
  onOpenReminderDialog
}: InvoiceTableRowProps) => {
  const remainingAmount = Math.max(0, invoice.montant - (invoice.montant_paye || 0));
  const showApplyCredit = availableCredits && remainingAmount > 0;
  const showReminder = ["non_payée", "partiellement_payée", "en_retard"].includes(invoice.status_paiement);
  
  return (
    <TableRow>
      <TableCell className="font-medium">{invoice.id}</TableCell>
      <TableCell>{formatDate(invoice.date)}</TableCell>
      <TableCell>{formatDate(invoice.echeance)}</TableCell>
      <TableCell className="text-right">{formatMontant(invoice.montant)}</TableCell>
      <TableCell className="text-right">{formatMontant(invoice.montant_paye || 0)}</TableCell>
      <TableCell className="text-right">{formatMontant(remainingAmount)}</TableCell>
      <TableCell>
        <InvoiceStatusBadge status={invoice.status_paiement} />
      </TableCell>
      <TableCell>
        <InvoiceRowActions 
          invoice={invoice}
          clientName={clientName}
          showApplyCredit={showApplyCredit}
          showReminder={showReminder}
          onPreviewClick={onPreviewClick}
          onViewInNewTab={onViewInNewTab}
          onDownloadClick={onDownloadClick}
          onApplyCreditClick={onOpenApplyCreditDialog}
          onReminderClick={onOpenReminderDialog}
        />
      </TableCell>
    </TableRow>
  );
};

export default InvoiceTableRow;
