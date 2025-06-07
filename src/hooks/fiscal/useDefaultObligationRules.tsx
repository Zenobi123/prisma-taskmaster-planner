
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

    // Apply default rules based on regime fiscal and client type
    if (selectedClient.regimefiscal === "reel") {
      // Contribuables du régime du réel sont assujettis à la patente
      console.log("Applying rule: Régime réel → Patente obligatoire");
      baseStatuses.patente.assujetti = true;
    } else if (selectedClient.regimefiscal === "igs") {
      // Contribuables de l'IGS sont assujettis à l'IGS
      console.log("Applying rule: Régime IGS → IGS obligatoire");
      baseStatuses.igs.assujetti = true;
    }

    // Tous les contribuables personnes physiques sont assujetties à la DARP
    if (selectedClient.type === "physique") {
      console.log("Applying rule: Personne physique → DARP obligatoire");
      baseStatuses.darp.assujetti = true;
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

  const [obligationStatuses, setObligationStatuses] = useState<ObligationStatuses>(getDefaultObligationStatuses());

  // Re-apply default rules when client changes
  useEffect(() => {
    console.log("Client changed, re-applying default rules");
    setObligationStatuses(getDefaultObligationStatuses());
  }, [selectedClient.id, selectedClient.regimefiscal, selectedClient.type, selectedClient.situationimmobiliere?.type]);

  return {
    obligationStatuses,
    setObligationStatuses,
    getDefaultObligationStatuses
  };
};
