
import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Facture } from "@/types/facture";
import { fetchFacturesFromDB } from "@/services/facture/facturesQuery";

export const useFetchFactures = () => {
  const [factures, setFactures] = useState<Facture[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchFactures = useCallback(async () => {
    setIsLoading(true);
    try {
      console.log("Fetching factures from database...");
      
      // Charger les factures depuis la base de données avec force refresh
      const dbFactures = await fetchFacturesFromDB(true);
      console.log(`Loaded ${dbFactures.length} factures from database`);
      
      setFactures(dbFactures);
      
      // Notification de succès si le chargement a réussi
      toast({
        title: "Succès",
        description: `${dbFactures.length} factures chargées avec succès.`
      });
      
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
