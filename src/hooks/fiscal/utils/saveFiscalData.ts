
import { Client } from "@/types/client";
import { FiscalData, IGSData } from "../types/igsTypes";
import { ObligationStatuses } from "../types";

/**
 * Prepares fiscal data for saving
 */
export function prepareFiscalData(
  creationDate: string,
  validityEndDate: string,
  showInAlert: boolean,
  obligationStatuses: ObligationStatuses,
  hiddenFromDashboard: boolean,
  igsData: IGSData
): FiscalData {
  return {
    attestation: {
      creationDate,
      validityEndDate,
      showInAlert
    },
    obligations: obligationStatuses,
    hiddenFromDashboard,
    igs: igsData
  };
}

/**
 * Returns the IGS data for direct client property update
 */
export function extractClientIGSData(igsData: IGSData) {
  return {
    soumisIGS: igsData.soumisIGS,
    adherentCGA: igsData.adherentCGA,
    classeIGS: igsData.classeIGS,
    patente: igsData.patente,
    acompteJanvier: igsData.acompteJanvier,
    acompteFevrier: igsData.acompteFevrier
  };
}
