
import { ObligationStatuses } from "../types";
import { IGSData, Etablissement } from "../types/igsTypes";

// Prepare fiscal data for saving to the database
export const prepareFiscalData = (
  creationDate: string,
  validityEndDate: string,
  showInAlert: boolean,
  obligationStatuses: ObligationStatuses,
  hiddenFromDashboard: boolean,
  igsData: IGSData & { 
    chiffreAffairesAnnuel?: number;
    etablissements?: Etablissement[];
  }
) => {
  // Garantir que les objets de paiement sont bien définis
  const safePatente = igsData.patente || { montant: '', quittance: '' };
  const safeAcompteJanvier = igsData.acompteJanvier || { montant: '', quittance: '' };
  const safeAcompteFevrier = igsData.acompteFevrier || { montant: '', quittance: '' };
  
  // S'assurer que les établissements sont bien un tableau
  const safeEtablissements = Array.isArray(igsData.etablissements) ? igsData.etablissements : [];
  
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
      chiffreAffairesAnnuel: igsData.chiffreAffairesAnnuel || 0,
      etablissements: safeEtablissements
    }
  };
};

// Extract IGS data for client object
export const extractClientIGSData = (igsData: IGSData & { 
  chiffreAffairesAnnuel?: number;
  etablissements?: Etablissement[];
}) => {
  // Garantir que les objets de paiement sont bien définis
  const safePatente = igsData.patente || { montant: '', quittance: '' };
  const safeAcompteJanvier = igsData.acompteJanvier || { montant: '', quittance: '' };
  const safeAcompteFevrier = igsData.acompteFevrier || { montant: '', quittance: '' };
  
  // S'assurer que les établissements sont bien un tableau
  const safeEtablissements = Array.isArray(igsData.etablissements) ? igsData.etablissements : [];
  
  return {
    soumisIGS: igsData.soumisIGS,
    adherentCGA: igsData.adherentCGA,
    classeIGS: igsData.classeIGS,
    patente: safePatente,
    acompteJanvier: safeAcompteJanvier,
    acompteFevrier: safeAcompteFevrier,
    chiffreAffairesAnnuel: igsData.chiffreAffairesAnnuel || 0,
    etablissements: safeEtablissements
  };
};
