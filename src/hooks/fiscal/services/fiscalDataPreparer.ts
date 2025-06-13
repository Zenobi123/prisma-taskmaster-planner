
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
  console.log("=== PRÉPARATION DES DONNÉES ===");
  console.log("Année fiscale:", fiscalYear);
  console.log("Statuts des obligations:", obligationStatuses);

  // Préparer les données d'attestation
  const attestationData = {
    creationDate,
    validityEndDate,
    showInAlert
  };

  // Préparer les obligations avec toutes les données IGS
  const preparedObligations = Object.keys(obligationStatuses).reduce((acc, key) => {
    const obligation = obligationStatuses[key as keyof ObligationStatuses];
    if (obligation) {
      acc[key] = {
        assujetti: Boolean(obligation.assujetti),
        attachements: obligation.attachements || {},
        observations: obligation.observations || "",
        // Tax-specific fields
        ...(('payee' in obligation) && { payee: Boolean(obligation.payee) }),
        ...(('dateEcheance' in obligation) && obligation.dateEcheance && { dateEcheance: obligation.dateEcheance }),
        ...(('datePaiement' in obligation) && obligation.datePaiement && { datePaiement: obligation.datePaiement }),
        ...(('montant' in obligation) && obligation.montant !== undefined && { montant: obligation.montant }),
        ...(('methodePaiement' in obligation) && obligation.methodePaiement && { methodePaiement: obligation.methodePaiement }),
        ...(('referencePaiement' in obligation) && obligation.referencePaiement && { referencePaiement: obligation.referencePaiement }),
        // Declaration-specific fields
        ...(('depose' in obligation) && { depose: Boolean(obligation.depose) }),
        ...(('periodicity' in obligation) && { periodicity: obligation.periodicity || "annuelle" }),
        ...(('dateDepot' in obligation) && obligation.dateDepot && { dateDepot: obligation.dateDepot }),
        ...(('regime' in obligation) && obligation.regime && { regime: obligation.regime }),
        // IGS-specific fields - ensure all are saved
        ...(('caValue' in obligation) && obligation.caValue !== undefined && { caValue: obligation.caValue }),
        ...(('isCGA' in obligation) && obligation.isCGA !== undefined && { isCGA: obligation.isCGA }),
        ...(('classe' in obligation) && obligation.classe !== undefined && { classe: obligation.classe }),
        ...(('q1Payee' in obligation) && obligation.q1Payee !== undefined && { q1Payee: obligation.q1Payee }),
        ...(('q2Payee' in obligation) && obligation.q2Payee !== undefined && { q2Payee: obligation.q2Payee }),
        ...(('q3Payee' in obligation) && obligation.q3Payee !== undefined && { q3Payee: obligation.q3Payee }),
        ...(('q4Payee' in obligation) && obligation.q4Payee !== undefined && { q4Payee: obligation.q4Payee }),
        ...(('q1Date' in obligation) && obligation.q1Date && { q1Date: obligation.q1Date }),
        ...(('q2Date' in obligation) && obligation.q2Date && { q2Date: obligation.q2Date }),
        ...(('q3Date' in obligation) && obligation.q3Date && { q3Date: obligation.q3Date }),
        ...(('q4Date' in obligation) && obligation.q4Date && { q4Date: obligation.q4Date }),
        ...(('q1Montant' in obligation) && obligation.q1Montant !== undefined && { q1Montant: obligation.q1Montant }),
        ...(('q2Montant' in obligation) && obligation.q2Montant !== undefined && { q2Montant: obligation.q2Montant }),
        ...(('q3Montant' in obligation) && obligation.q3Montant !== undefined && { q3Montant: obligation.q3Montant }),
        ...(('q4Montant' in obligation) && obligation.q4Montant !== undefined && { q4Montant: obligation.q4Montant }),
        ...(('montantAnnuel' in obligation) && obligation.montantAnnuel !== undefined && { montantAnnuel: obligation.montantAnnuel })
      };
    }
    return acc;
  }, {} as any);

  // Construire les données finales
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
