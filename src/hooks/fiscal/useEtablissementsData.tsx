
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
      
      // Ensure all establishments have proper structure
      const validEtablissements = safeEtablissements.map(etab => ({
        ...createDefaultEtablissement(),
        ...etab,
        chiffreAffaires: typeof etab.chiffreAffaires === 'number' ? etab.chiffreAffaires : 0
      }));
      
      console.log("useEtablissementsData - Initializing établissements:", validEtablissements);
      setLocalEtablissements(validEtablissements);
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
    
    try {
      // Ensure we're working with a valid array with proper structure
      const validEtablissements = Array.isArray(newEtablissements) && newEtablissements.length > 0
        ? newEtablissements.map(etab => {
            // Créer une copie propre de l'établissement pour éviter les références circulaires
            const cleanEtab = {
              nom: etab.nom || '',
              activite: etab.activite || '',
              ville: etab.ville || '',
              departement: etab.departement || '',
              quartier: etab.quartier || '',
              chiffreAffaires: typeof etab.chiffreAffaires === 'number' ? etab.chiffreAffaires : 0
            };
            return cleanEtab;
          })
        : [createDefaultEtablissement()];
      
      console.log("Setting établissements to:", validEtablissements);
      setLocalEtablissements(validEtablissements);
      
      return validEtablissements;
    } catch (error) {
      console.error("Error in handleEtablissementsChange:", error);
      const fallbackEtabs = [createDefaultEtablissement()];
      setLocalEtablissements(fallbackEtabs);
      return fallbackEtabs;
    }
  }, []);

  return { 
    localEtablissements, 
    handleEtablissementsChange 
  };
}
