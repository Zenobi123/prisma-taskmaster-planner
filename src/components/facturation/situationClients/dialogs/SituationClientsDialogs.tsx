
import ClientDetailsDialog from "../ClientDetailsDialog";
import ApplyCreditDialog from "../ApplyCreditDialog";
import ReminderDialog from "../ReminderDialog";
import { ClientFinancialDetails, ClientPayment } from "@/types/clientFinancial";

interface SituationClientsDialogsProps {
  clientDetails: ClientFinancialDetails | null;
  isDetailsDialogOpen: boolean;
  isApplyCreditDialogOpen: boolean;
  isReminderDialogOpen: boolean;
  selectedInvoiceId: string | null;
  availableCredits: ClientPayment[];
  onDetailsOpenChange: (open: boolean) => void;
  onApplyCreditOpenChange: (open: boolean) => void;
  onReminderOpenChange: (open: boolean) => void;
  onOpenApplyCreditDialog: (invoiceId: string) => void;
  onOpenReminderDialog: (invoiceId: string) => void;
  onApplyCredit: (creditId: string) => Promise<void>;
  onSendReminder: (method: 'email' | 'sms' | 'both') => Promise<void>;
}

const SituationClientsDialogs = ({
  clientDetails,
  isDetailsDialogOpen,
  isApplyCreditDialogOpen,
  isReminderDialogOpen,
  selectedInvoiceId,
  availableCredits,
  onDetailsOpenChange,
  onApplyCreditOpenChange,
  onReminderOpenChange,
  onOpenApplyCreditDialog,
  onOpenReminderDialog,
  onApplyCredit,
  onSendReminder
}: SituationClientsDialogsProps) => {
  return (
    <>
      <ClientDetailsDialog 
        clientDetails={clientDetails}
        isOpen={isDetailsDialogOpen}
        onOpenChange={onDetailsOpenChange}
        onOpenApplyCreditDialog={onOpenApplyCreditDialog}
        onOpenReminderDialog={onOpenReminderDialog}
      />

      <ApplyCreditDialog 
        isOpen={isApplyCreditDialogOpen}
        onOpenChange={onApplyCreditOpenChange}
        availableCredits={availableCredits}
        selectedInvoiceId={selectedInvoiceId}
        onApplyCredit={onApplyCredit}
      />

      <ReminderDialog 
        isOpen={isReminderDialogOpen}
        onOpenChange={onReminderOpenChange}
        selectedInvoiceId={selectedInvoiceId}
        onSendReminder={onSendReminder}
      />
    </>
  );
};

export default SituationClientsDialogs;
