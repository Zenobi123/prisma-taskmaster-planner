
import { Client } from "@/types/client";
import { ObligationStatuses, IgsObligationStatus } from "../types";

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

  // Préparer les données d'attestation
  const attestationData = {
    creationDate: creationDate || "",
    validityEndDate: validityEndDate || "",
    showInAlert: Boolean(showInAlert)
  };

  // Préparer les obligations avec une attention particulière pour l'IGS
  const preparedObligations: Record<string, unknown> = {};
  
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
          const igs = obligation as IgsObligationStatus;
          preparedObligations[obligationKey] = {
            ...taxObligation,
            // Données spécifiques IGS - Calcul
            caValue: igs.caValue || "",
            isCGA: Boolean(igs.isCGA),
            classe: igs.classe || "",
            outOfRange: Boolean(igs.outOfRange),
            montantAnnuel: igs.montantAnnuel || 0,

            // Paiements trimestriels - STATUTS
            q1Payee: Boolean(igs.q1Payee),
            q2Payee: Boolean(igs.q2Payee),
            q3Payee: Boolean(igs.q3Payee),
            q4Payee: Boolean(igs.q4Payee),

            // Montants trimestriels - IMPORTANT pour le calcul des soldes
            q1Montant: Number(igs.q1Montant) || 0,
            q2Montant: Number(igs.q2Montant) || 0,
            q3Montant: Number(igs.q3Montant) || 0,
            q4Montant: Number(igs.q4Montant) || 0,

            // Dates trimestrielles de paiement - IMPORTANT pour le suivi
            q1Date: igs.q1Date || "",
            q2Date: igs.q2Date || "",
            q3Date: igs.q3Date || "",
            q4Date: igs.q4Date || "",

            // Références de paiement trimestrielles
            q1Reference: igs.q1Reference || "",
            q2Reference: igs.q2Reference || "",
            q3Reference: igs.q3Reference || "",
            q4Reference: igs.q4Reference || "",

            // Modes de paiement trimestriels
            q1Mode: igs.q1Mode || "",
            q2Mode: igs.q2Mode || "",
            q3Mode: igs.q3Mode || "",
            q4Mode: igs.q4Mode || "",

            // Montants calculés - CRITIQUES pour l'affichage des soldes
            montantTotal: igs.montantTotal || 0,
            montantTotalPaye: Number(igs.montantTotalPaye) ||
                             (Number(igs.q1Montant) || 0) +
                             (Number(igs.q2Montant) || 0) +
                             (Number(igs.q3Montant) || 0) +
                             (Number(igs.q4Montant) || 0),
            soldeRestant: Number(igs.soldeRestant) ||
                         Math.max(0, (Number(igs.montantAnnuel) || 0) -
                         ((Number(igs.q1Montant) || 0) +
                          (Number(igs.q2Montant) || 0) +
                          (Number(igs.q3Montant) || 0) +
                          (Number(igs.q4Montant) || 0)))
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

  return fiscalDataToSave;
};
