
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Facture } from "@/types/facture";
import { fetchFacturesFromDB } from "@/services/factureService";

export const useFetchFactures = () => {
  const [factures, setFactures] = useState<Facture[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchFactures();
  }, []);

  const fetchFactures = async () => {
    setIsLoading(true);
    try {
      const mappedFactures = await fetchFacturesFromDB();
      setFactures(mappedFactures);
      console.log("Factures chargées:", mappedFactures);
    } catch (error) {
      console.error("Erreur lors du chargement des factures:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les factures.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    factures,
    setFactures,
    isLoading
  };
};
