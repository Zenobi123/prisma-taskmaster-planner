
import { useCallback } from "react";
import { ObligationType, TaxObligationStatus, DeclarationObligationStatus, ObligationStatus } from "../types";

export const useObligationTypes = () => {
  // Type guards
  const isTaxObligation = useCallback((obligationType: ObligationType): boolean => {
    return ["igs", "patente", "licence", "bailCommercial", "precompteLoyer", "tpf"].includes(obligationType);
  }, []);

  const isDeclarationObligation = useCallback((obligationType: ObligationType): boolean => {
    return ["dsf", "darp", "cntps", "precomptes"].includes(obligationType);
  }, []);

  const isTaxObligationStatus = useCallback((obligation: ObligationStatus): obligation is TaxObligationStatus => {
    return 'payee' in obligation;
  }, []);

  const isDeclarationObligationStatus = useCallback((obligation: ObligationStatus): obligation is DeclarationObligationStatus => {
    return 'depose' in obligation && 'periodicity' in obligation;
  }, []);

  // Get obligation category
  const getObligationCategory = useCallback((obligationType: ObligationType): 'tax' | 'declaration' => {
    return isTaxObligation(obligationType) ? 'tax' : 'declaration';
  }, [isTaxObligation]);

  // Get obligation display name
  const getObligationDisplayName = useCallback((obligationType: ObligationType): string => {
    const names: Record<ObligationType, string> = {
      igs: "Impôt Général Synthétique (IGS)",
      patente: "Patente",
      licence: "Licence",
      bailCommercial: "Bail Commercial",
      precompteLoyer: "Précompte Loyer",
      tpf: "Taxe sur la propriété (TPF)",
      dsf: "Déclaration Statistique et Fiscale (DSF)",
      darp: "Déclaration Annuelle de Revenus Professionnels (DARP)",
      cntps: "Caisse Nationale de Prévoyance Sociale (CNTPS)",
      precomptes: "Précomptes"
    };
    return names[obligationType] || obligationType;
  }, []);

  return {
    isTaxObligation,
    isDeclarationObligation,
    isTaxObligationStatus,
    isDeclarationObligationStatus,
    getObligationCategory,
    getObligationDisplayName
  };
};
