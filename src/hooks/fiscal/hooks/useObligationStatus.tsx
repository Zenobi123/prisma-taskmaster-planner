
import { useState, useEffect, useCallback } from "react";
import { ObligationStatuses, TaxObligationStatus, DeclarationObligationStatus } from "../types";
import { toast } from "sonner";

// Initialiser les états des obligations fiscales avec des valeurs par défaut
const getDefaultObligationStatuses = (): ObligationStatuses => ({
  igs: { assujetti: false, paye: false },
  patente: { assujetti: false, paye: false },
  dsf: { assujetti: false, depose: false },
  darp: { assujetti: false, depose: false },
  iba: { assujetti: false, paye: false },
  baic: { assujetti: false, paye: false },
  ibnc: { assujetti: false, paye: false },
  ircm: { assujetti: false, paye: false },
  irf: { assujetti: false, paye: false },
  its: { assujetti: false, paye: false },
  licence: { assujetti: false, depose: false },
  precompte: { assujetti: false, paye: false },
  taxeSejour: { assujetti: false, paye: false },
  baillCommercial: { assujetti: false, paye: false }
});

export const useObligationStatus = () => {
  const [obligationStatuses, setObligationStatuses] = useState<ObligationStatuses>(getDefaultObligationStatuses());
  const [isInitialized, setIsInitialized] = useState(false);

  // Mettre à jour les obligations à partir des données du client
  const updateObligationsFromClientData = useCallback((fiscalData: any) => {
    console.log("Updating obligations from client data:", fiscalData);
    
    if (!fiscalData || !fiscalData.obligations) {
      console.log("No obligations data found in fiscal data");
      return;
    }
    
    try {
      // Décompresser les données des obligations
      const updatedStatuses = { ...getDefaultObligationStatuses() };
      
      // Fusionner les obligations existantes avec les valeurs par défaut
      Object.keys(fiscalData.obligations).forEach(key => {
        if (updatedStatuses.hasOwnProperty(key)) {
          updatedStatuses[key] = {
            ...updatedStatuses[key],
            ...fiscalData.obligations[key]
          };
          console.log(`Updated obligation ${key}:`, updatedStatuses[key]);
        }
      });
      
      // Mettre à jour l'état avec les nouvelles valeurs
      setObligationStatuses(updatedStatuses);
      setIsInitialized(true);
      console.log("Obligations updated successfully:", updatedStatuses);
    } catch (error) {
      console.error("Error updating obligations from client data:", error);
      toast.error("Erreur lors de la mise à jour des obligations fiscales");
    }
  }, []);

  // Fonction pour gérer les changements d'état des obligations
  const handleStatusChange = useCallback((obligation: string, field: string, value: boolean | string | number) => {
    console.log(`handleStatusChange: ${obligation}.${field} = ${value} (type: ${typeof value})`);
    
    setObligationStatuses(prev => {
      // Créer une copie profonde pour éviter des problèmes de mutabilité
      const newState = JSON.parse(JSON.stringify(prev));
      
      if (newState[obligation]) {
        // S'assurer que la valeur est du bon type (surtout pour les booléens)
        if (field === 'assujetti' || field === 'paye' || field === 'depose' || field === 'reductionCGA') {
          newState[obligation][field] = Boolean(value);
        } else {
          newState[obligation][field] = value;
        }
        
        // Logique conditionnelle : si assujetti devient false, réinitialiser les autres champs
        if (field === 'assujetti' && value === false) {
          if ('paye' in newState[obligation]) {
            newState[obligation].paye = false;
          }
          if ('depose' in newState[obligation]) {
            newState[obligation].depose = false;
          }
        }
      }
      
      console.log(`New obligation state for ${obligation}:`, newState[obligation]);
      return newState;
    });
  }, []);

  return {
    obligationStatuses,
    setObligationStatuses,
    handleStatusChange,
    updateObligationsFromClientData,
    isInitialized
  };
};
