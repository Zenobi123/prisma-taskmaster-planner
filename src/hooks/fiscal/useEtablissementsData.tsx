
import { useState, useEffect, useCallback } from "react";
import { Etablissement } from "@/types/client";
import { useToast } from "@/components/ui/use-toast";

export function useEtablissementsData(etablissements: Etablissement[] | undefined) {
  const { toast } = useToast();
  const [localEtablissements, setLocalEtablissements] = useState<Etablissement[]>([]);

  // Créer un établissement par défaut
  const createDefaultEtablissement = (): Etablissement => {
    return {
      nom: "Établissement principal",
      activite: "",
      ville: "",
      departement: "",
      quartier: "",
      chiffreAffaires: 0
    };
  };

  // Initialize établissements data
  useEffect(() => {
    try {
      // Make sure établissements is initialized as an array with at least one element
      let safeEtablissements: Etablissement[] = [];
      
      if (Array.isArray(etablissements) && etablissements.length > 0) {
        // Utiliser les établissements existants
        safeEtablissements = [...etablissements];
      } else {
        // Créer un établissement par défaut si aucun n'existe
        safeEtablissements = [createDefaultEtablissement()];
      }
      
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

  // Handle établissements changes - completely replace the array when updated
  const handleEtablissementsChange = useCallback((newEtablissements: Etablissement[]) => {
    console.log("handleEtablissementsChange called with:", newEtablissements);
    
    // Ensure we're working with a valid array
    if (!Array.isArray(newEtablissements)) {
      console.warn("Attempted to set établissements with non-array value:", newEtablissements);
      newEtablissements = [createDefaultEtablissement()];
    }
    
    // S'assurer qu'il y a toujours au moins un établissement
    const safeEtablissements = newEtablissements.length > 0 
      ? [...newEtablissements] 
      : [createDefaultEtablissement()];
    
    console.log("Setting établissements to:", safeEtablissements);
    setLocalEtablissements(safeEtablissements);
    
    return safeEtablissements;
  }, []);

  return { localEtablissements, handleEtablissementsChange };
}
