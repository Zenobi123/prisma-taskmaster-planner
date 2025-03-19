
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
      console.log("Resetting factures to empty array...");
      
      // Return empty array instead of fetching from DB
      setFactures([]);
      
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
    console.log("Initial factures loading (returning empty array)...");
    fetchFactures();
  }, [fetchFactures]);

  return {
    factures,
    setFactures,
    isLoading,
    fetchFactures
  };
};
