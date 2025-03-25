
import { useState, useEffect } from "react";
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
import { supabase } from "@/integrations/supabase/client";

interface ReminderDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedInvoiceId: string | null;
  onSendReminder: (method: 'email' | 'sms' | 'both') => Promise<void>;
}

interface InvoiceDetails {
  id: string;
  montant: number;
  montant_paye: number;
  montant_restant: number;
  echeance: string;
  client: {
    nom: string;
    telephone: string;
    email: string;
  };
}

const ReminderDialog = ({
  isOpen,
  onOpenChange,
  selectedInvoiceId,
  onSendReminder
}: ReminderDialogProps) => {
  const [selectedReminderMethod, setSelectedReminderMethod] = useState<'email' | 'sms' | 'both'>('email');
  const [invoiceDetails, setInvoiceDetails] = useState<InvoiceDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch invoice details when dialog opens and invoice ID is available
  useEffect(() => {
    const fetchInvoiceDetails = async () => {
      if (!selectedInvoiceId || !isOpen) return;
      
      setIsLoading(true);
      try {
        // Fetch the invoice with client information
        const { data, error } = await supabase
          .from('factures')
          .select(`
            id, 
            montant, 
            montant_paye,
            echeance,
            clients:client_id (
              id,
              nom,
              raisonsociale,
              type,
              contact
            )
          `)
          .eq('id', selectedInvoiceId)
          .single();
          
        if (error) throw error;
        
        // Format the client data for display
        const clientName = data.clients.type === 'physique' 
          ? data.clients.nom 
          : data.clients.raisonsociale;
          
        const contact = data.clients.contact || {};
        const clientPhone = contact.telephone || 'N/A';
        const clientEmail = contact.email || 'N/A';
        
        // Calculate montant_restant
        const montantRestant = data.montant - (data.montant_paye || 0);
        
        setInvoiceDetails({
          id: data.id,
          montant: data.montant,
          montant_paye: data.montant_paye || 0,
          montant_restant: montantRestant,
          echeance: data.echeance,
          client: {
            nom: clientName,
            telephone: clientPhone,
            email: clientEmail
          }
        });
        
      } catch (error) {
        console.error('Error fetching invoice details:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchInvoiceDetails();
  }, [selectedInvoiceId, isOpen]);

  const handleCreatePaymentReminder = async () => {
    await onSendReminder(selectedReminderMethod);
  };

  // Message templates for each reminder method with real data
  const getEmailTemplate = () => {
    if (!invoiceDetails) {
      return `Objet : Information sur votre facture N°${selectedInvoiceId || "XXXX"}

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
PRISMA GESTION`;
    }

    return `Objet : Information sur votre facture N°${invoiceDetails.id}

Cher(e) ${invoiceDetails.client.nom}, 

Nous espérons que vous allez bien.  

Nous souhaitons vous informer que votre facture N°${invoiceDetails.id} d'un montant de ${formatMontant(invoiceDetails.montant)} est toujours en attente de règlement.  

🔹 Montant restant à payer : ${formatMontant(invoiceDetails.montant_restant)}  
🔹 Date d'échéance : ${formatDate(invoiceDetails.echeance)}  

Nous vous invitons à effectuer votre règlement à votre convenance via :  
✔ Orange Money : [Numéro de paiement]  
✔ MTN Mobile Money : [Numéro de paiement]    

Si votre paiement a déjà été effectué, merci de ne pas tenir compte de ce message.  

N'hésitez pas à nous contacter au [Numéro support] ou à répondre à cet email si vous avez la moindre question.  

Nous restons à votre disposition et vous remercions pour votre confiance.  

Cordialement,
PRISMA GESTION`;
  };

  const getSmsTemplate = () => {
    if (!invoiceDetails) {
      return `Cher(e) [Nom du client], votre facture N°${selectedInvoiceId || "XXXX"} s'élève à [Montant total] FCFA.  
✔ Solde réglé : [Montant payé] FCFA  
✔ Solde restant : [Montant restant] FCFA  

Vous pouvez payer via :  
✔ Orange Money : [Numéro]  
✔ MTN Mobile Money : [Numéro]  

Besoin d'aide ? Contactez-nous au [Numéro support].  
Merci pour votre confiance.  
PRISMA GESTION`;
    }

    return `Cher(e) ${invoiceDetails.client.nom}, votre facture N°${invoiceDetails.id} s'élève à ${formatMontant(invoiceDetails.montant)}.  
✔ Solde réglé : ${formatMontant(invoiceDetails.montant_paye)}  
✔ Solde restant : ${formatMontant(invoiceDetails.montant_restant)}  

Vous pouvez payer via :  
✔ Orange Money : [Numéro]  
✔ MTN Mobile Money : [Numéro]  

Besoin d'aide ? Contactez-nous au [Numéro support].  
Merci pour votre confiance.  
PRISMA GESTION`;
  };

  const getBothTemplate = () => {
    if (!invoiceDetails) {
      return `[Email & SMS] Rappel important concernant votre facture n°${selectedInvoiceId || "XXXX"} en attente de paiement. Merci de régulariser votre situation rapidement.`;
    }

    return `[Email & SMS] Rappel important pour ${invoiceDetails.client.nom} concernant la facture n°${invoiceDetails.id} de ${formatMontant(invoiceDetails.montant)} (${formatMontant(invoiceDetails.montant_restant)} restant). Échéance: ${formatDate(invoiceDetails.echeance)}.`;
  };

  const messageTemplates = {
    email: getEmailTemplate(),
    sms: getSmsTemplate(),
    both: getBothTemplate()
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
        
        {/* Message preview section with loading state */}
        <div className="mt-4">
          <h4 className="text-sm font-medium mb-2">Aperçu du message</h4>
          <div className="bg-gray-50 border border-gray-200 rounded-md p-3 max-h-[250px] overflow-y-auto">
            {isLoading ? (
              <div className="flex justify-center items-center h-32">
                <div className="animate-pulse text-gray-400">Chargement...</div>
              </div>
            ) : (
              <pre className="text-xs text-gray-700 whitespace-pre-wrap">
                {messageTemplates[selectedReminderMethod]}
              </pre>
            )}
          </div>
        </div>
        
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
