
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
import { Mail, MessageSquare, Send } from "lucide-react";
import { formatMontant, formatDate } from "@/utils/formatUtils";

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

  // Message templates for each reminder method
  const messageTemplates = {
    email: `Objet : Information sur votre facture N°${selectedInvoiceId || "XXXX"}

Cher(e) [Nom du client], 

Nous espérons que vous allez bien.  

Nous souhaitons vous informer que votre facture N°${selectedInvoiceId || "XXXX"} d'un montant de [Montant total] F CFA est toujours en attente de règlement.  

🔹 Montant restant à payer : [Montant restant] F CFA  
🔹 Date d'échéance : [Date]  

Nous vous invitons à effectuer votre règlement à votre convenance via :  
✔ Orange Money : [Numéro de paiement]  
✔ MTN Mobile Money : [Numéro de paiement]    

Si votre paiement a déjà été effectué, merci de ne pas tenir compte de ce message.  

N'hésitez pas à nous contacter au [Numéro support] ou à répondre à cet email si vous avez la moindre question.  

Nous restons à votre disposition et vous remercions pour votre confiance.  

Cordialement,
PRISMA GESTION`,

    sms: `Rappel: Votre facture n°${selectedInvoiceId || "XXXX"} est en attente de paiement. Merci de régulariser votre situation dans les meilleurs délais.`,

    both: `[Email & SMS] Rappel important concernant votre facture n°${selectedInvoiceId || "XXXX"} en attente de paiement. Merci de régulariser votre situation rapidement.`
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
                <SelectItem value="email" className="flex items-center">
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-blue-500" />
                    <span>Email</span>
                  </div>
                </SelectItem>
                <SelectItem value="sms" className="flex items-center">
                  <div className="flex items-center">
                    <MessageSquare className="h-4 w-4 mr-2 text-green-500" />
                    <span>SMS</span>
                  </div>
                </SelectItem>
                <SelectItem value="both" className="flex items-center">
                  <div className="flex items-center">
                    <Send className="h-4 w-4 mr-2 text-purple-500" />
                    <span>Email et SMS</span>
                  </div>
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        
        {/* Message preview section */}
        <div className="mt-4">
          <h4 className="text-sm font-medium mb-2">Aperçu du message</h4>
          <div className="bg-gray-50 border border-gray-200 rounded-md p-3 max-h-[200px] overflow-y-auto">
            <pre className="text-xs text-gray-700 whitespace-pre-wrap">
              {messageTemplates[selectedReminderMethod]}
            </pre>
          </div>
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
