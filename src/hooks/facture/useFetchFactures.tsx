
import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Facture } from "@/types/facture";
// Nous n'avons plus besoin d'importer fetchFacturesFromDB car nous ne l'utiliserons pas

export const useFetchFactures = () => {
  const [factures, setFactures] = useState<Facture[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchFactures = useCallback(async () => {
    setIsLoading(true);
    try {
      console.log("Resetting factures to empty array...");
      
      // Retourner un tableau vide au lieu de récupérer depuis la DB
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
