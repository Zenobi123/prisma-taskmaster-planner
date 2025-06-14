
import { Client } from "@/types/client";
import { ObligationStatuses } from "../types";

interface PrepareFiscalDataProps {
  selectedClient: Client;
  fiscalYear: string;
  creationDate: string;
  validityEndDate: string;
  showInAlert: boolean;
  hiddenFromDashboard: boolean;
  obligationStatuses: ObligationStatuses;
}

export const prepareFiscalDataForSave = ({
  selectedClient,
  fiscalYear,
  creationDate,
  validityEndDate,
  showInAlert,
  hiddenFromDashboard,
  obligationStatuses
}: PrepareFiscalDataProps) => {
  console.log("=== PRÉPARATION DES DONNÉES FISCALES ===");
  console.log("Client:", selectedClient.nom || selectedClient.raisonsociale);
  console.log("Année:", fiscalYear);
  console.log("Statuts des obligations:", obligationStatuses);

  // Préparer les données d'attestation
  const attestationData = {
    creationDate: creationDate || "",
    validityEndDate: validityEndDate || "",
    showInAlert: Boolean(showInAlert)
  };

  // Préparer les obligations avec une attention particulière pour l'IGS
  const preparedObligations: Record<string, any> = {};
  
  Object.entries(obligationStatuses).forEach(([obligationKey, obligation]) => {
    if (obligation) {
      const baseObligation = {
        assujetti: Boolean(obligation.assujetti),
        attachements: obligation.attachements || {},
        observations: obligation.observations || ""
      };

      // Gérer les obligations de type impôt (avec payee)
      if ('payee' in obligation) {
        const taxObligation = {
          ...baseObligation,
          payee: Boolean(obligation.payee),
          dateEcheance: obligation.dateEcheance || "",
          datePaiement: obligation.datePaiement || "",
          montant: obligation.montant || 0,
          methodePaiement: obligation.methodePaiement || "",
          referencePaiement: obligation.referencePaiement || ""
        };

        // Traitement spécial pour l'IGS avec TOUS les détails de paiement
        if (obligationKey === 'igs') {
          console.log("=== TRAITEMENT IGS COMPLET ===");
          console.log("Données IGS reçues:", obligation);
          
          preparedObligations[obligationKey] = {
            ...taxObligation,
            // Données spécifiques IGS - Calcul
            caValue: (obligation as any).caValue || "",
            isCGA: Boolean((obligation as any).isCGA),
            classe: (obligation as any).classe || "",
            outOfRange: Boolean((obligation as any).outOfRange),
            montantAnnuel: (obligation as any).montantAnnuel || 0,
            
            // Paiements trimestriels - STATUTS
            q1Payee: Boolean((obligation as any).q1Payee),
            q2Payee: Boolean((obligation as any).q2Payee),
            q3Payee: Boolean((obligation as any).q3Payee),
            q4Payee: Boolean((obligation as any).q4Payee),
            
            // Montants trimestriels - IMPORTANT pour le calcul des soldes
            q1Montant: Number((obligation as any).q1Montant) || 0,
            q2Montant: Number((obligation as any).q2Montant) || 0,
            q3Montant: Number((obligation as any).q3Montant) || 0,
            q4Montant: Number((obligation as any).q4Montant) || 0,
            
            // Dates trimestrielles de paiement - IMPORTANT pour le suivi
            q1Date: (obligation as any).q1Date || "",
            q2Date: (obligation as any).q2Date || "",
            q3Date: (obligation as any).q3Date || "",
            q4Date: (obligation as any).q4Date || "",
            
            // Références de paiement trimestrielles
            q1Reference: (obligation as any).q1Reference || "",
            q2Reference: (obligation as any).q2Reference || "",
            q3Reference: (obligation as any).q3Reference || "",
            q4Reference: (obligation as any).q4Reference || "",
            
            // Modes de paiement trimestriels
            q1Mode: (obligation as any).q1Mode || "",
            q2Mode: (obligation as any).q2Mode || "",
            q3Mode: (obligation as any).q3Mode || "",
            q4Mode: (obligation as any).q4Mode || "",
            
            // Montants calculés - CRITIQUES pour l'affichage des soldes
            montantTotal: (obligation as any).montantTotal || 0,
            montantTotalPaye: Number((obligation as any).montantTotalPaye) || 
                             (Number((obligation as any).q1Montant) || 0) + 
                             (Number((obligation as any).q2Montant) || 0) + 
                             (Number((obligation as any).q3Montant) || 0) + 
                             (Number((obligation as any).q4Montant) || 0),
            soldeRestant: Number((obligation as any).soldeRestant) || 
                         Math.max(0, (Number((obligation as any).montantAnnuel) || 0) - 
                         ((Number((obligation as any).q1Montant) || 0) + 
                          (Number((obligation as any).q2Montant) || 0) + 
                          (Number((obligation as any).q3Montant) || 0) + 
                          (Number((obligation as any).q4Montant) || 0)))
          };
          
          console.log("=== IGS SAUVEGARDÉ ===");
          console.log("Montant annuel:", preparedObligations[obligationKey].montantAnnuel);
          console.log("Montant total payé:", preparedObligations[obligationKey].montantTotalPaye);
          console.log("Solde restant:", preparedObligations[obligationKey].soldeRestant);
          console.log("Montants trimestriels:", {
            q1: preparedObligations[obligationKey].q1Montant,
            q2: preparedObligations[obligationKey].q2Montant,
            q3: preparedObligations[obligationKey].q3Montant,
            q4: preparedObligations[obligationKey].q4Montant
          });
          console.log("Dates trimestrielles:", {
            q1: preparedObligations[obligationKey].q1Date,
            q2: preparedObligations[obligationKey].q2Date,
            q3: preparedObligations[obligationKey].q3Date,
            q4: preparedObligations[obligationKey].q4Date
          });
        } else {
          preparedObligations[obligationKey] = taxObligation;
        }
      }
      // Gérer les obligations de type déclaration (avec depose)
      else if ('depose' in obligation) {
        preparedObligations[obligationKey] = {
          ...baseObligation,
          depose: Boolean(obligation.depose),
          periodicity: obligation.periodicity || "annuelle",
          dateDepot: obligation.dateDepot || "",
          dateEcheance: obligation.dateEcheance || "",
          regime: obligation.regime || "",
          dateSoumission: obligation.dateSoumission || ""
        };
      }
      // Fallback pour les autres types
      else {
        preparedObligations[obligationKey] = baseObligation;
      }
    }
  });

  const fiscalDataToSave = {
    clientId: selectedClient.id,
    year: fiscalYear,
    attestation: attestationData,
    obligations: {
      [fiscalYear]: preparedObligations
    },
    hiddenFromDashboard: Boolean(hiddenFromDashboard),
    selectedYear: fiscalYear,
    updatedAt: new Date().toISOString()
  };

  console.log("=== DONNÉES FINALES PRÉPARÉES ===");
  console.log("IGS dans les données finales:", fiscalDataToSave.obligations[fiscalYear].igs);
  return fiscalDataToSave;
};
