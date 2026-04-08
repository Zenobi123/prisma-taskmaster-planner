
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useClientFinancialActions = (
  onSuccess?: () => Promise<void>
) => {
  const { toast } = useToast();

  const handleApplyCreditToInvoice = async (invoiceId: string, creditId: string, amount: number) => {
    try {
      
      const { error } = await supabase
        .functions
        .invoke('apply-credit', {
          body: { 
            invoiceId,
            creditId,
            amount
          }
        });
      
      if (error) {
        throw new Error(error.message);
      }
      
      toast({
        title: "Succès",
        description: "Le crédit a été appliqué à la facture",
      });
      
      if (onSuccess) {
        await onSuccess();
      }
      
      return true;
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'appliquer le crédit à la facture",
        variant: "destructive",
      });
      return false;
    }
  };

  const handleCreateReminder = async (invoiceId: string, method: 'email' | 'sms' | 'both') => {
    try {
      
      const { error } = await supabase
        .functions
        .invoke('send-payment-reminders', {
          body: { 
            invoiceId,
            method
          }
        });
      
      if (error) {
        throw new Error(error.message);
      }
      
      toast({
        title: "Succès",
        description: "Le rappel de paiement a été envoyé",
      });
      
      return true;
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer le rappel de paiement",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    handleApplyCreditToInvoice,
    handleCreateReminder
  };
};
