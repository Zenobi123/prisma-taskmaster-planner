
import { useState, useEffect, useCallback } from "react";
import { ObligationStatuses } from "../types";

export const useObligationStatus = () => {
  const [obligationStatuses, setObligationStatuses] = useState<ObligationStatuses>({
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

  // Réduire les logs en production pour améliorer les performances
  const isProduction = process.env.NODE_ENV === 'production';
  
  useEffect(() => {
    if (!isProduction) {
      console.log("Current obligation statuses:", JSON.stringify(obligationStatuses, null, 2));
    }
  }, [obligationStatuses, isProduction]);

  // Optimisation du handleStatusChange pour éviter le clonage profond coûteux
  const handleStatusChange = useCallback((obligation: string, field: string, value: any) => {
    if (!isProduction) {
      console.log(`useObligationStatus: Updating ${obligation}.${field} to:`, value);
    }
    
    setObligationStatuses(prev => {
      // Cas des propriétés imbriquées avec notation pointée
      if (field.includes('.')) {
        const parts = field.split('.');
        
        // Création immutable de l'objet mis à jour
        return {
          ...prev,
          [obligation]: {
            ...prev[obligation],
            [parts[0]]: {
              ...(prev[obligation][parts[0]] || {}),
              [parts[1]]: value
            }
          }
        };
      } 
      // Cas simple: mise à jour directe d'une propriété de premier niveau
      else {
        return {
          ...prev,
          [obligation]: {
            ...prev[obligation],
            [field]: value
          }
        };
      }
    });
  }, [isProduction]);

  return {
    obligationStatuses,
    setObligationStatuses,
    handleStatusChange
  };
};
