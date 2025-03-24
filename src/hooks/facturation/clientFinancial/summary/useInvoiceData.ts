
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useInvoiceData = () => {
  const { toast } = useToast();
  const [invoices, setInvoices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchInvoices = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { data: invoicesData, error: invoicesError } = await supabase
        .from('factures')
        .select('*')
        .eq('status', 'envoyée');
        
      if (invoicesError) {
        throw new Error(invoicesError.message);
      }
      
      setInvoices(invoicesData || []);
    } catch (err) {
      console.error("Error fetching invoices:", err);
      setError(err instanceof Error ? err : new Error('Failed to fetch invoices'));
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
    fetchInvoices
  };
};
