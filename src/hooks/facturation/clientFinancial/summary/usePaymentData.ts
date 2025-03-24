
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const usePaymentData = () => {
  const { toast } = useToast();
  const [payments, setPayments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchPayments = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { data: paymentsData, error: paymentsError } = await supabase
        .from('paiements')
        .select('*');
        
      if (paymentsError) {
        throw new Error(paymentsError.message);
      }
      
      setPayments(paymentsData || []);
    } catch (err) {
      console.error("Error fetching payments:", err);
      setError(err instanceof Error ? err : new Error('Failed to fetch payments'));
      toast({
        title: "Erreur",
        description: "Impossible de récupérer les données des paiements",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  return {
    payments,
    isLoading,
    error,
    fetchPayments
  };
};
