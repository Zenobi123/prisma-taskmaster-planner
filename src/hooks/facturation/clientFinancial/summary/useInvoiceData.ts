
import { useState, useEffect, useRef, useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export const useInvoiceData = () => {
  const { toast } = useToast();
  const [invoices, setInvoices] = useState<Tables<"factures">[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [sentInvoicesCount, setSentInvoicesCount] = useState(0);
  const [totalInvoiceAmount, setTotalInvoiceAmount] = useState(0);
  
  // Utilisation d'une référence pour éviter les appels inutiles
  const dataFetchedRef = useRef(false);
  // Cache timestamp pour limiter les rechargements
  const lastFetchTime = useRef<number>(0);
  // Durée de validité du cache en ms (15 secondes)
  const CACHE_DURATION = 15000;

  const fetchInvoices = useCallback(async (forceRefresh = false) => {
    // Si les données ont déjà été chargées et qu'on ne force pas le rafraîchissement,
    // et que le cache est encore valide, on ne recharge pas
    const now = Date.now();
    if (!forceRefresh && 
        dataFetchedRef.current && 
        now - lastFetchTime.current < CACHE_DURATION) {
      return;
    }
    
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
      
      const sentInvoices = invoicesData || [];
      setInvoices(sentInvoices);
      setSentInvoicesCount(sentInvoices.length);
      
      // Calculate the total amount of sent invoices
      const total = sentInvoices.reduce((sum, invoice) => sum + Number(invoice.montant), 0);
      setTotalInvoiceAmount(total);
      
      // Marquer les données comme chargées et mettre à jour l'horodatage
      dataFetchedRef.current = true;
      lastFetchTime.current = now;
      
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Échec de chargement des factures'));
      toast({
        title: "Erreur",
        description: "Impossible de récupérer les données des factures",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  return {
    invoices,
    isLoading,
    error,
    fetchInvoices,
    sentInvoicesCount,
    totalInvoiceAmount
  };
};
