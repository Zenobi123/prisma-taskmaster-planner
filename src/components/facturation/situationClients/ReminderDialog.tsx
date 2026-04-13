
import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

import { ReminderDialogProps } from "./reminder/types";
import { MethodSelector } from "./reminder/MethodSelector";
import { MessagePreview } from "./reminder/MessagePreview";
import { useReminderInvoice } from "./reminder/useReminderInvoice";
import { useCopyToClipboard } from "./reminder/useCopyToClipboard";
import { getMessageTemplate } from "./reminder/reminderTemplates";

const ReminderDialog = ({
  isOpen,
  onOpenChange,
  selectedInvoiceId,
  onSendReminder
}: ReminderDialogProps) => {
  const [selectedReminderMethod, setSelectedReminderMethod] = useState<'email' | 'sms' | 'both'>('email');
  const { invoiceDetails, isLoading } = useReminderInvoice(selectedInvoiceId, isOpen);
  const { copyToClipboard } = useCopyToClipboard();

  const handleCreatePaymentReminder = async () => {
    await onSendReminder(selectedReminderMethod);
  };

  const messageContent = getMessageTemplate(selectedReminderMethod, invoiceDetails);

  const handleCopy = () => {
    copyToClipboard(messageContent);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader className="pb-4 border-b border-border/50">
          <DialogTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            Envoyer un rappel de paiement
          </DialogTitle>
          <DialogDescription>
            Choisissez la méthode d'envoi du rappel pour cette facture.
          </DialogDescription>
        </DialogHeader>
        
        <MethodSelector 
          selectedReminderMethod={selectedReminderMethod}
          onMethodChange={setSelectedReminderMethod}
        />
        
        <MessagePreview 
          isLoading={isLoading}
          messageContent={messageContent}
          onCopy={handleCopy}
        />
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button onClick={handleCreatePaymentReminder} disabled={isLoading}>
            Envoyer le rappel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReminderDialog;
