
import { useState, useEffect, useCallback } from "react";
import { Etablissement } from "@/types/client";
import { useToast } from "@/components/ui/use-toast";
import { createDefaultEtablissement } from "@/components/gestion/tabs/fiscal/components/etablissements/utils";

export function useEtablissementsData(etablissements: Etablissement[] | undefined) {
  const { toast } = useToast();
  const [localEtablissements, setLocalEtablissements] = useState<Etablissement[]>([]);

  // Initialize établissements data
  useEffect(() => {
    try {
      // Ensure we're working with a valid array with at least one element
      const safeEtablissements = Array.isArray(etablissements) && etablissements.length > 0
        ? [...etablissements]
        : [createDefaultEtablissement()];
      
      console.log("useEtablissementsData - Initializing établissements:", safeEtablissements);
      setLocalEtablissements(safeEtablissements);
    } catch (error) {
      console.error("Error initializing établissements data:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les données des établissements",
        variant: "destructive"
      });
      
      // Fallback to default establishment
      setLocalEtablissements([createDefaultEtablissement()]);
    }
  }, [etablissements, toast]);

  // Handle établissements changes
  const handleEtablissementsChange = useCallback((newEtablissements: Etablissement[]) => {
    console.log("handleEtablissementsChange called with:", newEtablissements);
    
    // Ensure we're working with a valid array with at least one element
    const safeEtablissements = Array.isArray(newEtablissements) && newEtablissements.length > 0
      ? [...newEtablissements]
      : [createDefaultEtablissement()];
    
    console.log("Setting établissements to:", safeEtablissements);
    setLocalEtablissements(safeEtablissements);
    
    return safeEtablissements;
  }, []);

  return { 
    localEtablissements, 
    handleEtablissementsChange 
  };
}
