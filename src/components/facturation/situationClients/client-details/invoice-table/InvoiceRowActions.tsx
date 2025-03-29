
import { ClientInvoice } from "@/types/clientFinancial";
import { Button } from "@/components/ui/button";
import { 
  CreditCard, 
  Bell, 
  Eye, 
  Download
} from "lucide-react";

interface InvoiceRowActionsProps {
  invoice: ClientInvoice;
  clientName: string;
  showApplyCredit: boolean;
  showReminder: boolean;
  onPreviewClick: (invoice: ClientInvoice) => void;
  onViewInNewTab: (invoice: ClientInvoice) => void;
  onDownloadClick: (invoice: ClientInvoice) => void;
  onApplyCreditClick: (invoiceId: string) => void;
  onReminderClick: (invoiceId: string) => void;
}

const InvoiceRowActions = ({
  invoice,
  clientName,
  showApplyCredit,
  showReminder,
  onPreviewClick,
  onViewInNewTab,
  onDownloadClick,
  onApplyCreditClick,
  onReminderClick
}: InvoiceRowActionsProps) => {
  return (
    <div className="flex justify-center gap-1">
      <Button
        variant="outline"
        size="icon"
        title="Aperçu"
        onClick={() => onPreviewClick(invoice)}
      >
        <Eye className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        title="Aperçu complet"
        onClick={() => onViewInNewTab(invoice)}
      >
        <Eye className="h-4 w-4 text-blue-500" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        title="Télécharger"
        onClick={() => onDownloadClick(invoice)}
      >
        <Download className="h-4 w-4" />
      </Button>
      {showApplyCredit && (
        <Button
          variant="outline"
          size="icon"
          title="Appliquer un crédit"
          onClick={() => onApplyCreditClick(invoice.id)}
        >
          <CreditCard className="h-4 w-4" />
        </Button>
      )}
      {showReminder && (
        <Button
          variant="outline"
          size="icon"
          title="Envoyer un rappel"
          onClick={() => onReminderClick(invoice.id)}
        >
          <Bell className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export default InvoiceRowActions;
