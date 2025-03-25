
import { ClientFinancialDetails } from "@/types/clientFinancial";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import ClientDetailsHeader from "./client-details/ClientDetailsHeader";
import ClientDetailsTabs from "./client-details/ClientDetailsTabs";
import { ClientDetailsProvider } from "./client-details/ClientDetailsContext";

interface ClientDetailsDialogProps {
  clientDetails: ClientFinancialDetails | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onOpenApplyCreditDialog: (invoiceId: string) => void;
  onOpenReminderDialog: (invoiceId: string) => void;
}

const ClientDetailsDialog = ({ 
  clientDetails, 
  isOpen, 
  onOpenChange, 
  onOpenApplyCreditDialog, 
  onOpenReminderDialog 
}: ClientDetailsDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <ClientDetailsProvider
          clientDetails={clientDetails}
          onOpenApplyCreditDialog={onOpenApplyCreditDialog}
          onOpenReminderDialog={onOpenReminderDialog}
        >
          <ClientDetailsHeader />
          <ClientDetailsTabs />
        </ClientDetailsProvider>
      </DialogContent>
    </Dialog>
  );
};

export default ClientDetailsDialog;
