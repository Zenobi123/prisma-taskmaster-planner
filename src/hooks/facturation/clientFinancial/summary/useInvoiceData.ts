
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { fetchSentInvoicesCount, fetchTotalInvoicedAmount } from "@/components/facturation/analyse/services/analyseDataService";

export const useInvoiceData = () => {
  const { toast } = useToast();
  const [invoices, setInvoices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [sentInvoicesCount, setSentInvoicesCount] = useState(0);
  const [totalInvoiceAmount, setTotalInvoiceAmount] = useState(0);

  const fetchInvoices = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Récupérer uniquement les factures avec le statut "envoyée"
      const { data: invoicesData, error: invoicesError } = await supabase
        .from('factures')
        .select('*')
        .eq('status', 'envoyée');
        
      if (invoicesError) {
        throw new Error(invoicesError.message);
      }
      
      const sentInvoices = invoicesData || [];
      setInvoices(sentInvoices);
      
      // Utiliser les fonctions dédiées pour récupérer le nombre et le montant total
      const [count, totalAmount] = await Promise.all([
        fetchSentInvoicesCount(),
        fetchTotalInvoicedAmount()
      ]);
      
      setSentInvoicesCount(count);
      setTotalInvoiceAmount(totalAmount);
      
      console.log("Factures envoyées:", count);
      console.log("Montant total des factures envoyées:", totalAmount);
    } catch (err) {
      console.error("Erreur lors de la récupération des factures:", err);
      setError(err instanceof Error ? err : new Error('Impossible de récupérer les données des factures'));
      toast({
        title: "Erreur",
        description: "Impossible de récupérer les données des factures",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  return {
    invoices,
    isLoading,
    error,
    fetchInvoices,
    sentInvoicesCount,
    totalInvoiceAmount
  };
};
