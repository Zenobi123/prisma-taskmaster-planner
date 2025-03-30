
import { useState, useEffect, useRef } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const usePaymentData = () => {
  const { toast } = useToast();
  const [payments, setPayments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  // Utilisation d'une référence pour éviter les appels inutiles
  const dataFetchedRef = useRef(false);
  // Cache timestamp pour limiter les rechargements
  const lastFetchTime = useRef<number>(0);
  // Durée de validité du cache en ms (15 secondes)
  const CACHE_DURATION = 15000;

  const fetchPayments = async (forceRefresh = false) => {
    // Si les données ont déjà été chargées et qu'on ne force pas le rafraîchissement,
    // et que le cache est encore valide, on ne recharge pas
    const now = Date.now();
    if (!forceRefresh && 
        dataFetchedRef.current && 
        now - lastFetchTime.current < CACHE_DURATION) {
      console.log("Utilisation du cache des paiements");
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      console.log("Chargement des paiements depuis la base de données");
      
      const { data: paymentsData, error: paymentsError } = await supabase
        .from('paiements')
        .select('*');
        
      if (paymentsError) {
        throw new Error(paymentsError.message);
      }
      
      setPayments(paymentsData || []);
      
      // Marquer les données comme chargées et mettre à jour l'horodatage
      dataFetchedRef.current = true;
      lastFetchTime.current = now;
      
      console.log("Paiements chargés:", paymentsData?.length || 0);
    } catch (err) {
      console.error("Erreur lors du chargement des paiements:", err);
      setError(err instanceof Error ? err : new Error('Échec de chargement des paiements'));
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
