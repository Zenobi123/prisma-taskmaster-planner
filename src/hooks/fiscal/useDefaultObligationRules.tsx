
import { useState, useEffect, useCallback } from "react";
import { Client } from "@/types/client";
import { ObligationStatuses } from "./types";
import { calculateAllTaxes, FiscalInput } from "@/utils/fiscalCalculations";

export const useDefaultObligationRules = (selectedClient: Client) => {
  const getDefaultObligationStatuses = useCallback((): ObligationStatuses => {
    // Calculer les montants des impôts à partir des données du profil client
    const fiscalInput: FiscalInput = {
      regimeFiscal: selectedClient.regimefiscal,
      chiffreAffaires: selectedClient.chiffreaffaires || 0,
      isCGA: selectedClient.iscga || false,
      isVendeurBoissons: selectedClient.isvendeurboissons || false,
      modePaiementIGS: selectedClient.modepaiementigs || "trimestriel",
      situationImmobiliere: selectedClient.situationimmobiliere ? {
        type: selectedClient.situationimmobiliere.type,
        loyerMensuel: selectedClient.situationimmobiliere.loyer,
        valeurBien: selectedClient.situationimmobiliere.valeur,
      } : undefined,
      modePaiementPSL: selectedClient.modepaiementpsl || "trimestriel",
    };
    const calculatedTaxes = calculateAllTaxes(fiscalInput);

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
      dbef: { assujetti: false, depose: false, periodicity: "annuelle" as const, attachements: {}, observations: "" },
      cntps: { assujetti: false, depose: false, periodicity: "mensuelle" as const, attachements: {}, observations: "" },
      precomptes: { assujetti: false, depose: false, periodicity: "mensuelle" as const, attachements: {}, observations: "" }
    };

    // Variables pour tracker si le client est assujetti à IGS ou Patente
    let isSubjectToIgsOrPatente = false;

    // Règles spécifiques pour les personnes physiques
    if (selectedClient.type === "physique") {

      // Toutes les personnes physiques sont assujetties à la DARP
      baseStatuses.darp.assujetti = true;

      // Règles selon le régime fiscal pour les personnes physiques
      if (selectedClient.regimefiscal === "reel") {
        baseStatuses.patente.assujetti = true;
        baseStatuses.patente.montantAnnuel = calculatedTaxes.patente;
        isSubjectToIgsOrPatente = true;
      } else if (selectedClient.regimefiscal === "igs") {
        baseStatuses.igs.assujetti = true;
        baseStatuses.igs.montantAnnuel = calculatedTaxes.igs;
        isSubjectToIgsOrPatente = true;
      }
    }

    // Règles spécifiques pour les personnes morales
    if (selectedClient.type === "morale") {

      // Toutes les personnes morales sont assujetties à la DBEF
      baseStatuses.dbef.assujetti = true;

      if (selectedClient.regimefiscal === "reel") {
        baseStatuses.patente.assujetti = true;
        baseStatuses.patente.montantAnnuel = calculatedTaxes.patente;
        isSubjectToIgsOrPatente = true;
      } else if (selectedClient.regimefiscal === "igs") {
        baseStatuses.igs.assujetti = true;
        baseStatuses.igs.montantAnnuel = calculatedTaxes.igs;
        isSubjectToIgsOrPatente = true;
      }
    }

    // Règle automatique : Les assujettis à IGS ou Patente sont automatiquement assujettis à la DSF
    if (isSubjectToIgsOrPatente) {
      baseStatuses.dsf.assujetti = true;
    }

    // Règles basées sur la situation immobilière
    const sitType = selectedClient.situationimmobiliere?.type;
    const isLocataire = sitType === "locataire" || sitType === "les_deux";
    const isProprietaire = sitType === "proprietaire" || sitType === "les_deux";

    // Bail Commercial et Précompte sur Loyer pour les locataires
    if (isLocataire && selectedClient.situationimmobiliere?.loyer) {
      baseStatuses.bailCommercial.assujetti = true;
      baseStatuses.bailCommercial.montantAnnuel = calculatedTaxes.bail;

      // PSL seulement pour les régimes professionnels (pas non_professionnel)
      if (selectedClient.regimefiscal !== "non_professionnel") {
        baseStatuses.precompteLoyer.assujetti = true;
        baseStatuses.precompteLoyer.montantAnnuel = calculatedTaxes.psl;
      }
    }

    // Taxe Foncière pour les propriétaires
    if (isProprietaire && selectedClient.situationimmobiliere?.valeur) {
      baseStatuses.tpf.assujetti = true;
      baseStatuses.tpf.montantAnnuel = calculatedTaxes.tf;
    }

    return baseStatuses;
  }, [
    selectedClient.id,
    selectedClient.regimefiscal,
    selectedClient.type,
    selectedClient.chiffreaffaires,
    selectedClient.iscga,
    selectedClient.isvendeurboissons,
    selectedClient.modepaiementigs,
    selectedClient.modepaiementpsl,
    selectedClient.situationimmobiliere?.type,
    selectedClient.situationimmobiliere?.loyer,
    selectedClient.situationimmobiliere?.valeur,
  ]);

  const [obligationStatuses, setObligationStatuses] = useState<ObligationStatuses>(() => getDefaultObligationStatuses());

  // Re-apply default rules when client changes
  useEffect(() => {
    const newDefaultStatuses = getDefaultObligationStatuses();
    setObligationStatuses(newDefaultStatuses);
  }, [getDefaultObligationStatuses]);

  return {
    obligationStatuses,
    setObligationStatuses,
    getDefaultObligationStatuses
  };
};
