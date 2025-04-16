
import { useState, useEffect, useCallback } from "react";
import { Etablissement } from "@/types/client";
import { useToast } from "@/components/ui/use-toast";

export function useEtablissementsData(etablissements: Etablissement[] | undefined) {
  const { toast } = useToast();
  const [localEtablissements, setLocalEtablissements] = useState<Etablissement[]>([]);

  // Initialize établissements data
  useEffect(() => {
    try {
      // Make sure établissements is initialized as an array
      const safeEtablissements = Array.isArray(etablissements) ? [...etablissements] : [];
      console.log("useEtablissementsData - Initializing établissements:", safeEtablissements);
      setLocalEtablissements(safeEtablissements);
    } catch (error) {
      console.error("Error initializing établissements data:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les données des établissements",
        variant: "destructive"
      });
    }
  }, [etablissements, toast]);

  // Handle établissements changes
  const handleEtablissementsChange = useCallback((newEtablissements: Etablissement[]) => {
    console.log("handleEtablissementsChange called with:", newEtablissements);
    
    // Ensure we're working with a valid array
    if (!Array.isArray(newEtablissements)) {
      console.warn("Attempted to set établissements with non-array value:", newEtablissements);
      newEtablissements = [];
    }
    
    // Create a safe copy to avoid reference issues
    const safeEtablissements = [...newEtablissements];
    
    console.log("Setting établissements to:", safeEtablissements);
    setLocalEtablissements(safeEtablissements);
    
    return safeEtablissements;
  }, []);

  return { localEtablissements, handleEtablissementsChange };
}
