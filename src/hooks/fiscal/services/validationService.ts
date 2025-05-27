import { ObligationStatuses, TaxObligationStatus, DeclarationObligationStatus, IgsObligationStatus } from "../types";
import { toast } from "sonner";

/**
 * Valide et migre une obligation fiscale (impôt direct)
 */
const validateAndMigrateTaxObligation = (obligation: any, obligationName: string): TaxObligationStatus => {
  // Structure de base valide
  const validatedObligation: TaxObligationStatus = {
    assujetti: Boolean(obligation?.assujetti || false),
    payee: Boolean(obligation?.payee || obligation?.paye || false),
    attachements: obligation?.attachements || {},
    observations: obligation?.observations || ""
  };

  // Propriétés optionnelles avec migration des anciens noms
  if (obligation?.dateEcheance) validatedObligation.dateEcheance = obligation.dateEcheance;
  if (obligation?.datePaiement) validatedObligation.datePaiement = obligation.datePaiement;
  if (obligation?.montant !== undefined) validatedObligation.montant = Number(obligation.montant) || 0;
  if (obligation?.montantAnnuel !== undefined) validatedObligation.montantAnnuel = Number(obligation.montantAnnuel) || 0;
  if (obligation?.montantPenalite !== undefined) validatedObligation.montantPenalite = Number(obligation.montantPenalite) || 0;
  if (obligation?.montantTotal !== undefined) validatedObligation.montantTotal = Number(obligation.montantTotal) || 0;
  if (obligation?.methodePaiement) validatedObligation.methodePaiement = obligation.methodePaiement;
  if (obligation?.referencePaiement) validatedObligation.referencePaiement = obligation.referencePaiement;

  // Propriétés trimestrielles pour toutes les obligations fiscales
  if (obligation?.q1Payee !== undefined) validatedObligation.q1Payee = Boolean(obligation.q1Payee);
  if (obligation?.q2Payee !== undefined) validatedObligation.q2Payee = Boolean(obligation.q2Payee);
  if (obligation?.q3Payee !== undefined) validatedObligation.q3Payee = Boolean(obligation.q3Payee);
  if (obligation?.q4Payee !== undefined) validatedObligation.q4Payee = Boolean(obligation.q4Payee);

  console.log(`Migration réussie pour l'obligation fiscale: ${obligationName}`);
  return validatedObligation;
};

/**
 * Valide et migre une obligation IGS avec ses propriétés spécifiques
 */
const validateAndMigrateIgsObligation = (obligation: any): IgsObligationStatus => {
  // Commencer par la structure de base d'une obligation fiscale
  const baseObligation = validateAndMigrateTaxObligation(obligation, "IGS");
  
  // Ajouter les propriétés spécifiques à IGS
  const igsObligation: IgsObligationStatus = {
    ...baseObligation
  };

  // Propriétés spécifiques IGS avec migration des anciens noms
  if (obligation?.caValue || obligation?.chiffreAffaires) {
    igsObligation.caValue = obligation.caValue || obligation.chiffreAffaires?.toString() || "";
  }
  if (obligation?.isCGA !== undefined) igsObligation.isCGA = Boolean(obligation.isCGA);
  if (obligation?.classe !== undefined) igsObligation.classe = obligation.classe;
  if (obligation?.outOfRange !== undefined) igsObligation.outOfRange = Boolean(obligation.outOfRange);

  console.log("Migration réussie pour l'obligation IGS avec propriétés spécifiques");
  return igsObligation;
};

/**
 * Valide et migre une obligation déclarative
 */
const validateAndMigrateDeclarationObligation = (
  obligation: any, 
  obligationName: string,
  defaultPeriodicity: "mensuelle" | "trimestrielle" | "annuelle"
): DeclarationObligationStatus => {
  // Structure de base valide
  const validatedObligation: DeclarationObligationStatus = {
    assujetti: Boolean(obligation?.assujetti || false),
    depose: Boolean(obligation?.depose || false),
    periodicity: obligation?.periodicity || defaultPeriodicity,
    attachements: obligation?.attachements || {},
    observations: obligation?.observations || ""
  };

  // Propriétés optionnelles
  if (obligation?.dateDepot) validatedObligation.dateDepot = obligation.dateDepot;
  if (obligation?.dateEcheance) validatedObligation.dateEcheance = obligation.dateEcheance;
  if (obligation?.regime) validatedObligation.regime = obligation.regime;
  if (obligation?.dateSoumission) validatedObligation.dateSoumission = obligation.dateSoumission;

  console.log(`Migration réussie pour l'obligation déclarative: ${obligationName}`);
  return validatedObligation;
};

/**
 * Valide et migre toutes les obligations d'une année vers la structure unifiée
 */
export const validateAndMigrateObligationStatuses = (obligations: any): ObligationStatuses => {
  if (!obligations || typeof obligations !== 'object') {
    console.log("Création d'une nouvelle structure d'obligations vide");
    return createDefaultObligationStatuses();
  }

  console.log("Début de la validation et migration des obligations fiscales");

  const migratedObligations: ObligationStatuses = {
    // Impôts directs avec migration des anciens noms
    igs: validateAndMigrateIgsObligation(obligations.igs),
    patente: validateAndMigrateTaxObligation(obligations.patente, "Patente"),
    licence: validateAndMigrateTaxObligation(obligations.licence, "Licence"),
    bailCommercial: validateAndMigrateTaxObligation(
      obligations.bailCommercial || obligations.baillCommercial, 
      "Bail Commercial"
    ),
    precompteLoyer: validateAndMigrateTaxObligation(
      obligations.precompteLoyer || obligations.precompte, 
      "Précompte Loyer"
    ),
    tpf: validateAndMigrateTaxObligation(
      obligations.tpf || obligations.taxeFonciere, 
      "TPF"
    ),
    
    // Déclarations
    dsf: validateAndMigrateDeclarationObligation(obligations.dsf, "DSF", "annuelle"),
    darp: validateAndMigrateDeclarationObligation(obligations.darp, "DARP", "annuelle"),
    cntps: validateAndMigrateDeclarationObligation(obligations.cntps, "CNTPS", "mensuelle"),
    precomptes: validateAndMigrateDeclarationObligation(obligations.precomptes, "Précomptes", "mensuelle")
  };

  console.log("Migration complète des obligations terminée avec succès");
  return migratedObligations;
};

/**
 * Crée une structure d'obligations par défaut avec tous les champs requis
 */
export const createDefaultObligationStatuses = (): ObligationStatuses => {
  return {
    // Impôts directs
    igs: { assujetti: false, payee: false, attachements: {}, observations: "" },
    patente: { assujetti: false, payee: false, attachements: {}, observations: "" },
    licence: { assujetti: false, payee: false, attachements: {}, observations: "" },
    bailCommercial: { assujetti: false, payee: false, attachements: {}, observations: "" },
    precompteLoyer: { assujetti: false, payee: false, attachements: {}, observations: "" },
    tpf: { assujetti: false, payee: false, attachements: {}, observations: "" },
    
    // Déclarations
    dsf: { assujetti: false, depose: false, periodicity: "annuelle", attachements: {}, observations: "" },
    darp: { assujetti: false, depose: false, periodicity: "annuelle", attachements: {}, observations: "" },
    cntps: { assujetti: false, depose: false, periodicity: "mensuelle", attachements: {}, observations: "" },
    precomptes: { assujetti: false, depose: false, periodicity: "mensuelle", attachements: {}, observations: "" }
  };
};

/**
 * Valide la structure complète des données fiscales et migre si nécessaire
 */
export const validateAndMigrateFiscalData = (fiscalData: any): any => {
  if (!fiscalData) {
    console.log("Aucune donnée fiscale trouvée, création d'une structure par défaut");
    return {
      obligations: {},
      attestation: null,
      hiddenFromDashboard: false,
      selectedYear: new Date().getFullYear().toString()
    };
  }

  console.log("Validation et migration des données fiscales complètes");

  const migratedData = {
    ...fiscalData,
    obligations: {}
  };

  // Migrer les obligations pour chaque année
  if (fiscalData.obligations && typeof fiscalData.obligations === 'object') {
    Object.keys(fiscalData.obligations).forEach(year => {
      const yearObligations = fiscalData.obligations[year];
      migratedData.obligations[year] = validateAndMigrateObligationStatuses(yearObligations);
      console.log(`Obligations migrées pour l'année ${year}`);
    });
  }

  console.log("Migration complète des données fiscales terminée");
  return migratedData;
};

/**
 * Vérifie la cohérence des données d'obligations avec des type guards sécurisés
 */
export const validateObligationConsistency = (obligations: ObligationStatuses): boolean => {
  const errors: string[] = [];

  // Vérifier chaque obligation fiscale avec type guards
  const taxObligationKeys = ['igs', 'patente', 'licence', 'bailCommercial', 'precompteLoyer', 'tpf'] as const;
  taxObligationKeys.forEach(key => {
    const obligation = obligations[key];
    if (!obligation || typeof obligation.assujetti !== 'boolean') {
      errors.push(`Structure invalide pour l'obligation: ${key}`);
    } else if ('payee' in obligation && typeof obligation.payee !== 'boolean') {
      errors.push(`Propriété payee invalide pour l'obligation: ${key}`);
    }
  });

  // Vérifier chaque obligation déclarative avec type guards
  const declarationObligationKeys = ['dsf', 'darp', 'cntps', 'precomptes'] as const;
  declarationObligationKeys.forEach(key => {
    const obligation = obligations[key];
    if (!obligation || typeof obligation.assujetti !== 'boolean') {
      errors.push(`Structure invalide pour la déclaration: ${key}`);
    } else if ('depose' in obligation && typeof obligation.depose !== 'boolean') {
      errors.push(`Propriété depose invalide pour la déclaration: ${key}`);
    }
  });

  if (errors.length > 0) {
    console.error("Erreurs de validation détectées:", errors);
    toast.error(`Erreurs de validation: ${errors.join(', ')}`);
    return false;
  }

  console.log("Validation de cohérence réussie pour toutes les obligations");
  return true;
};
