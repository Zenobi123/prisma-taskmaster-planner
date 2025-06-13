
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

        // Traitement spécial pour l'IGS
        if (obligationKey === 'igs') {
          console.log("Traitement spécial IGS:", obligation);
          preparedObligations[obligationKey] = {
            ...taxObligation,
            // Données spécifiques IGS
            caValue: (obligation as any).caValue || "",
            isCGA: Boolean((obligation as any).isCGA),
            classe: (obligation as any).classe || "",
            outOfRange: Boolean((obligation as any).outOfRange),
            // Paiements trimestriels
            q1Payee: Boolean((obligation as any).q1Payee),
            q2Payee: Boolean((obligation as any).q2Payee),
            q3Payee: Boolean((obligation as any).q3Payee),
            q4Payee: Boolean((obligation as any).q4Payee),
            // Montants trimestriels
            q1Montant: (obligation as any).q1Montant || 0,
            q2Montant: (obligation as any).q2Montant || 0,
            q3Montant: (obligation as any).q3Montant || 0,
            q4Montant: (obligation as any).q4Montant || 0,
            // Dates trimestrielles
            q1Date: (obligation as any).q1Date || "",
            q2Date: (obligation as any).q2Date || "",
            q3Date: (obligation as any).q3Date || "",
            q4Date: (obligation as any).q4Date || "",
            // Montants calculés
            montantAnnuel: (obligation as any).montantAnnuel || 0,
            montantTotal: (obligation as any).montantTotal || 0,
            soldeRestant: (obligation as any).soldeRestant || 0
          };
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

  console.log("Données préparées pour la sauvegarde:", fiscalDataToSave);
  return fiscalDataToSave;
};
