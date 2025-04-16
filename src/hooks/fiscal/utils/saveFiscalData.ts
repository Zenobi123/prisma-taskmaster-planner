
import { ObligationStatuses } from "../types";
import { IGSData } from "../types/igsTypes";

// Prepare fiscal data for saving to the database
export const prepareFiscalData = (
  creationDate: string,
  validityEndDate: string,
  showInAlert: boolean,
  obligationStatuses: ObligationStatuses,
  hiddenFromDashboard: boolean,
  igsData: IGSData & { chiffreAffairesAnnuel?: number, etablissements?: any[] }
) => {
  return {
    attestation: {
      creationDate,
      validityEndDate,
      showInAlert
    },
    obligations: obligationStatuses,
    hiddenFromDashboard,
    igs: {
      soumisIGS: igsData.soumisIGS,
      adherentCGA: igsData.adherentCGA,
      classeIGS: igsData.classeIGS,
      patente: igsData.patente,
      acompteJanvier: igsData.acompteJanvier,
      acompteFevrier: igsData.acompteFevrier,
      chiffreAffairesAnnuel: igsData.chiffreAffairesAnnuel || 0,
      etablissements: igsData.etablissements || []
    }
  };
};

// Extract IGS data for client object
export const extractClientIGSData = (igsData: IGSData & { chiffreAffairesAnnuel?: number, etablissements?: any[] }) => {
  return {
    soumisIGS: igsData.soumisIGS,
    adherentCGA: igsData.adherentCGA,
    classeIGS: igsData.classeIGS,
    patente: igsData.patente,
    acompteJanvier: igsData.acompteJanvier,
    acompteFevrier: igsData.acompteFevrier,
    chiffreAffairesAnnuel: igsData.chiffreAffairesAnnuel || 0,
    etablissements: igsData.etablissements || []
  };
};
