
import { Client } from "@/types/client";
import { ObligationStatuses } from "../types";
import { Json } from "@/integrations/supabase/types";

interface PrepareFiscalDataParams {
  selectedClient: Client;
  fiscalYear: string;
  creationDate: string;
  validityEndDate: string;
  showInAlert: boolean;
  hiddenFromDashboard: boolean;
  obligationStatuses: ObligationStatuses;
}

export const prepareFiscalDataForSave = (params: PrepareFiscalDataParams) => {
  const {
    selectedClient,
    fiscalYear,
    creationDate,
    validityEndDate,
    showInAlert,
    hiddenFromDashboard,
    obligationStatuses
  } = params;

  return {
    clientId: selectedClient.id,
    year: fiscalYear,
    attestation: {
      creationDate: creationDate || "",
      validityEndDate: validityEndDate || "",
      showInAlert: Boolean(showInAlert)
    },
    obligations: {
      [fiscalYear]: prepareObligationsForSave(obligationStatuses)
    },
    hiddenFromDashboard: Boolean(hiddenFromDashboard),
    selectedYear: fiscalYear,
    lastSaved: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
};

const prepareObligationsForSave = (obligations: ObligationStatuses): Json => {
  const prepared: any = {};
  
  Object.keys(obligations).forEach(obligationKey => {
    const obligation = obligations[obligationKey as keyof ObligationStatuses];
    if (obligation) {
      prepared[obligationKey] = {
        assujetti: Boolean(obligation.assujetti),
        attachements: obligation.attachements || {},
        observations: obligation.observations || "",
        // Tax-specific fields
        ...(('payee' in obligation) && { payee: Boolean(obligation.payee) }),
        ...(('dateEcheance' in obligation) && obligation.dateEcheance && { dateEcheance: obligation.dateEcheance }),
        ...(('datePaiement' in obligation) && obligation.datePaiement && { datePaiement: obligation.datePaiement }),
        ...(('montant' in obligation) && obligation.montant !== undefined && { montant: Number(obligation.montant) || 0 }),
        ...(('methodePaiement' in obligation) && obligation.methodePaiement && { methodePaiement: obligation.methodePaiement }),
        ...(('referencePaiement' in obligation) && obligation.referencePaiement && { referencePaiement: obligation.referencePaiement }),
        // Declaration-specific fields
        ...(('depose' in obligation) && { depose: Boolean(obligation.depose) }),
        ...(('periodicity' in obligation) && { periodicity: obligation.periodicity || "annuelle" }),
        ...(('dateDepot' in obligation) && obligation.dateDepot && { dateDepot: obligation.dateDepot }),
        ...(('regime' in obligation) && obligation.regime && { regime: obligation.regime }),
        // IGS-specific fields
        ...(('caValue' in obligation) && obligation.caValue !== undefined && { caValue: Number(obligation.caValue) || 0 }),
        ...(('isCGA' in obligation) && obligation.isCGA !== undefined && { isCGA: Boolean(obligation.isCGA) }),
        ...(('classe' in obligation) && obligation.classe !== undefined && { classe: obligation.classe }),
        // IGS quarterly payments
        ...(('q1Payee' in obligation) && obligation.q1Payee !== undefined && { q1Payee: Boolean(obligation.q1Payee) }),
        ...(('q2Payee' in obligation) && obligation.q2Payee !== undefined && { q2Payee: Boolean(obligation.q2Payee) }),
        ...(('q3Payee' in obligation) && obligation.q3Payee !== undefined && { q3Payee: Boolean(obligation.q3Payee) }),
        ...(('q4Payee' in obligation) && obligation.q4Payee !== undefined && { q4Payee: Boolean(obligation.q4Payee) }),
        // IGS quarterly amounts and dates
        ...(('q1Amount' in obligation) && obligation.q1Amount !== undefined && { q1Amount: Number(obligation.q1Amount) || 0 }),
        ...(('q2Amount' in obligation) && obligation.q2Amount !== undefined && { q2Amount: Number(obligation.q2Amount) || 0 }),
        ...(('q3Amount' in obligation) && obligation.q3Amount !== undefined && { q3Amount: Number(obligation.q3Amount) || 0 }),
        ...(('q4Amount' in obligation) && obligation.q4Amount !== undefined && { q4Amount: Number(obligation.q4Amount) || 0 }),
        ...(('q1Date' in obligation) && obligation.q1Date && { q1Date: obligation.q1Date }),
        ...(('q2Date' in obligation) && obligation.q2Date && { q2Date: obligation.q2Date }),
        ...(('q3Date' in obligation) && obligation.q3Date && { q3Date: obligation.q3Date }),
        ...(('q4Date' in obligation) && obligation.q4Date && { q4Date: obligation.q4Date })
      };
    }
  });

  return prepared as Json;
};
