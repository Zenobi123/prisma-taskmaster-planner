
import { useState, useEffect, useCallback } from "react";
import { Client } from "@/types/client";
import { ObligationStatuses } from "./types";
import { computeClientTaxes } from "@/utils/clientFiscalSummary";

export const useDefaultObligationRules = (selectedClient: Client) => {
  // Primitives extraites pour des dépendances de hook stables (évite de dépendre
  // de l'objet situationimmobiliere dont l'identité peut changer à chaque rendu).
  const hasImmo = !!selectedClient.situationimmobiliere;
  const immoType = selectedClient.situationimmobiliere?.type;
  const immoLoyer = selectedClient.situationimmobiliere?.loyer;
  const immoValeur = selectedClient.situationimmobiliere?.valeur;

  const getDefaultObligationStatuses = useCallback((): ObligationStatuses => {
    // Calculer les montants des impôts via le moteur fiscal canonique
    const calculatedTaxes = computeClientTaxes({
      type: selectedClient.type,
      regimefiscal: selectedClient.regimefiscal,
      chiffreaffaires: selectedClient.chiffreaffaires || 0,
      iscga: selectedClient.iscga || false,
      isvendeurboissons: selectedClient.isvendeurboissons || false,
      modepaiementigs: selectedClient.modepaiementigs || "trimestriel",
      modepaiementpsl: selectedClient.modepaiementpsl || "trimestriel",
      situationimmobiliere: hasImmo
        ? { type: immoType, loyer: immoLoyer, valeur: immoValeur }
        : undefined,
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
    const isLocataire = immoType === "locataire" || immoType === "les_deux";
    const isProprietaire = immoType === "proprietaire" || immoType === "les_deux";

    // Bail Commercial et Précompte sur Loyer pour les locataires
    if (isLocataire && immoLoyer) {
      baseStatuses.bailCommercial.assujetti = true;
      baseStatuses.bailCommercial.montantAnnuel = calculatedTaxes.bail;

      // PSL seulement pour les régimes professionnels (pas non_professionnel)
      if (selectedClient.regimefiscal !== "non_professionnel") {
        baseStatuses.precompteLoyer.assujetti = true;
        baseStatuses.precompteLoyer.montantAnnuel = calculatedTaxes.psl;
      }
    }

    // Taxe Foncière pour les propriétaires
    if (isProprietaire && immoValeur) {
      baseStatuses.tpf.assujetti = true;
      baseStatuses.tpf.montantAnnuel = calculatedTaxes.tf;
    }

    return baseStatuses;
  }, [
    selectedClient.regimefiscal,
    selectedClient.type,
    selectedClient.chiffreaffaires,
    selectedClient.iscga,
    selectedClient.isvendeurboissons,
    selectedClient.modepaiementigs,
    selectedClient.modepaiementpsl,
    hasImmo,
    immoType,
    immoLoyer,
    immoValeur,
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
