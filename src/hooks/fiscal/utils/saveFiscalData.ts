
import { ObligationStatuses } from "../types";
import { IGSData } from "../types/igsTypes";

// Prepare fiscal data for saving to the database
export const prepareFiscalData = (
  creationDate: string,
  validityEndDate: string,
  showInAlert: boolean,
  obligationStatuses: ObligationStatuses,
  hiddenFromDashboard: boolean,
  igsData: IGSData & { chiffreAffairesAnnuel?: number }
) => {
  // Garantir que les objets de paiement sont bien définis
  const safePatente = igsData.patente || { montant: '', quittance: '' };
  const safeAcompteJanvier = igsData.acompteJanvier || { montant: '', quittance: '' };
  const safeAcompteFevrier = igsData.acompteFevrier || { montant: '', quittance: '' };
  
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
      patente: safePatente,
      acompteJanvier: safeAcompteJanvier,
      acompteFevrier: safeAcompteFevrier,
      chiffreAffairesAnnuel: igsData.chiffreAffairesAnnuel || 0
    }
  };
};

// Extract IGS data for client object
export const extractClientIGSData = (igsData: IGSData & { chiffreAffairesAnnuel?: number }) => {
  // Garantir que les objets de paiement sont bien définis
  const safePatente = igsData.patente || { montant: '', quittance: '' };
  const safeAcompteJanvier = igsData.acompteJanvier || { montant: '', quittance: '' };
  const safeAcompteFevrier = igsData.acompteFevrier || { montant: '', quittance: '' };
  
  return {
    soumisIGS: igsData.soumisIGS,
    adherentCGA: igsData.adherentCGA,
    classeIGS: igsData.classeIGS,
    patente: safePatente,
    acompteJanvier: safeAcompteJanvier,
    acompteFevrier: safeAcompteFevrier,
    chiffreAffairesAnnuel: igsData.chiffreAffairesAnnuel || 0
  };
};
