
import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

interface ReminderDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedInvoiceId: string | null;
  onSendReminder: (method: 'email' | 'sms' | 'both') => Promise<void>;
}

const ReminderDialog = ({
  isOpen,
  onOpenChange,
  selectedInvoiceId,
  onSendReminder
}: ReminderDialogProps) => {
  const [selectedReminderMethod, setSelectedReminderMethod] = useState<'email' | 'sms' | 'both'>('email');

  const handleCreatePaymentReminder = async () => {
    await onSendReminder(selectedReminderMethod);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Envoyer un rappel de paiement</DialogTitle>
          <DialogDescription>
            Choisissez la méthode d'envoi du rappel pour cette facture.
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-4">
          <h4 className="text-sm font-medium mb-2">Méthode de rappel</h4>
          <Select 
            defaultValue="email"
            onValueChange={(value) => setSelectedReminderMethod(value as 'email' | 'sms' | 'both')}
          >
            <SelectTrigger>
              <SelectValue placeholder="Choisir une méthode" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="sms">SMS</SelectItem>
                <SelectItem value="both">Email et SMS</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button onClick={handleCreatePaymentReminder}>
            Envoyer le rappel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReminderDialog;
