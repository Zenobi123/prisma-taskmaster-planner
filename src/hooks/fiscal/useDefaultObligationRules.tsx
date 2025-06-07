
import { useState, useEffect } from "react";
import { Client } from "@/types/client";
import { ObligationStatuses } from "./types";

export const useDefaultObligationRules = (selectedClient: Client) => {
  const getDefaultObligationStatuses = (): ObligationStatuses => {
    console.log("Applying default rules for client:", {
      regimefiscal: selectedClient.regimefiscal,
      type: selectedClient.type,
      situationimmobiliere: selectedClient.situationimmobiliere,
      nom: selectedClient.nom || selectedClient.raisonsociale
    });

    const baseStatuses: ObligationStatuses = {
      // Direct taxes - all start as not subject by default
      igs: { assujetti: false, payee: false, attachements: {}, observations: "" },
      patente: { assujetti: false, payee: false, attachements: {}, observations: "" },
      licence: { assujetti: false, payee: false, attachements: {}, observations: "" },
      bailCommercial: { assujetti: false, payee: false, attachements: {}, observations: "" },
      precompteLoyer: { assujetti: false, payee: false, attachements: {}, observations: "" },
      tpf: { assujetti: false, payee: false, attachements: {}, observations: "" },
      // Declarations - all start as not subject by default
      dsf: { assujetti: false, depose: false, periodicity: "annuelle" as const, attachements: {}, observations: "" },
      darp: { assujetti: false, depose: false, periodicity: "annuelle" as const, attachements: {}, observations: "" },
      cntps: { assujetti: false, depose: false, periodicity: "mensuelle" as const, attachements: {}, observations: "" },
      precomptes: { assujetti: false, depose: false, periodicity: "mensuelle" as const, attachements: {}, observations: "" }
    };

    // Variables pour tracker si le client est assujetti à IGS ou Patente
    let isSubjectToIgsOrPatente = false;

    // Règles spécifiques pour les personnes physiques
    if (selectedClient.type === "physique") {
      console.log("Applying rules for personne physique");
      
      // Toutes les personnes physiques sont assujetties à la DARP
      console.log("Applying rule: Personne physique → DARP obligatoire");
      baseStatuses.darp.assujetti = true;

      // Règles selon le régime fiscal pour les personnes physiques
      if (selectedClient.regimefiscal === "reel") {
        console.log("Applying rule: Personne physique + Régime réel → Patente obligatoire");
        baseStatuses.patente.assujetti = true;
        isSubjectToIgsOrPatente = true;
      } else if (selectedClient.regimefiscal === "igs") {
        console.log("Applying rule: Personne physique + Régime IGS → IGS obligatoire");
        baseStatuses.igs.assujetti = true;
        isSubjectToIgsOrPatente = true;
      } else if (selectedClient.regimefiscal === "non_professionnel") {
        console.log("Applying rule: Personne physique + Non professionnel → Aucune obligation fiscale professionnelle");
        // Les non-professionnels ne sont pas assujettis aux impôts professionnels
        // Seule la DARP reste applicable (déjà définie ci-dessus)
      }
    }

    // Règles spécifiques pour les personnes morales  
    if (selectedClient.type === "morale") {
      console.log("Applying rules for personne morale");
      
      if (selectedClient.regimefiscal === "reel") {
        console.log("Applying rule: Personne morale + Régime réel → Patente obligatoire");
        baseStatuses.patente.assujetti = true;
        isSubjectToIgsOrPatente = true;
      } else if (selectedClient.regimefiscal === "igs") {
        console.log("Applying rule: Personne morale + Régime IGS → IGS obligatoire");
        baseStatuses.igs.assujetti = true;
        isSubjectToIgsOrPatente = true;
      }
    }

    // Règle automatique : Les assujettis à IGS ou Patente sont automatiquement assujettis à la DSF
    if (isSubjectToIgsOrPatente) {
      console.log("Applying rule: Assujetti IGS/Patente → DSF obligatoire");
      baseStatuses.dsf.assujetti = true;
    }

    // Règles basées sur la situation immobilière
    if (selectedClient.situationimmobiliere?.type === "proprietaire") {
      console.log("Applying rule: Propriétaire → TPF obligatoire");
      baseStatuses.tpf.assujetti = true;
    } else if (selectedClient.situationimmobiliere?.type === "locataire") {
      // Si le client est locataire, il peut être assujetti au précompte loyer
      console.log("Applying rule: Locataire → Précompte loyer potentiel");
      // Note: Cette règle peut dépendre d'autres critères spécifiques
      // Pour l'instant on la laisse à false par défaut
    }

    console.log("Final default statuses:", baseStatuses);
    return baseStatuses;
  };

  const [obligationStatuses, setObligationStatuses] = useState<ObligationStatuses>(() => getDefaultObligationStatuses());

  // Re-apply default rules when client changes
  useEffect(() => {
    console.log("Client changed, re-applying default rules");
    const newDefaultStatuses = getDefaultObligationStatuses();
    setObligationStatuses(newDefaultStatuses);
  }, [selectedClient.id, selectedClient.regimefiscal, selectedClient.type, selectedClient.situationimmobiliere?.type]);

  return {
    obligationStatuses,
    setObligationStatuses,
    getDefaultObligationStatuses
  };
};
