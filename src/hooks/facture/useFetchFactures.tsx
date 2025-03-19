import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Facture } from "@/types/facture";

export const useFetchFactures = () => {
  const [factures, setFactures] = useState<Facture[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchFactures = useCallback(async () => {
    setIsLoading(true);
    try {
      console.log("Initializing empty factures array...");
      
      // Initialize with an empty array but don't reset it when it already has data
      // This ensures we keep any factures added during the session
      setFactures(prevFactures => prevFactures.length > 0 ? prevFactures : []);
      
    } catch (error) {
      console.error("Error loading factures:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les factures. Veuillez réessayer.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Charger les factures uniquement lors du montage initial du composant
  useEffect(() => {
    console.log("Initial factures loading...");
    fetchFactures();
  }, [fetchFactures]);

  return {
    factures,
    setFactures,
    isLoading,
    fetchFactures
  };
};
