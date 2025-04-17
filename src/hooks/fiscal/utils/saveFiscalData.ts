
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
    completedPayments?: string[];
  }
) => {
  console.log("Preparing fiscal data for saving with IGS data:", igsData);
  
  // Garantir que les objets de paiement sont bien définis
  const safePatente = igsData.patente || { montant: '', quittance: '' };
  const safeAcompteJanvier = igsData.acompteJanvier || { montant: '', quittance: '' };
  const safeAcompteFevrier = igsData.acompteFevrier || { montant: '', quittance: '' };
  
  // S'assurer que les établissements sont bien un tableau
  const safeEtablissements = Array.isArray(igsData.etablissements) ? 
    igsData.etablissements : 
    [{
      nom: "Établissement principal",
      activite: "",
      ville: "",
      departement: "",
      quartier: "",
      chiffreAffaires: 0
    }];
  
  // S'assurer que les paiements complétés sont bien un tableau
  const safeCompletedPayments = Array.isArray(igsData.completedPayments) ?
    igsData.completedPayments : [];
  
  // Assembler les données fiscales complètes
  const preparedData = {
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
      etablissements: safeEtablissements,
      completedPayments: safeCompletedPayments
    }
  };
  
  console.log("Prepared fiscal data:", preparedData);
  return preparedData;
};

// Extract IGS data for client object
export const extractClientIGSData = (igsData: IGSData & { 
  chiffreAffairesAnnuel?: number;
  etablissements?: Etablissement[];
  completedPayments?: string[];
}) => {
  console.log("Extracting client IGS data from:", igsData);
  
  // Garantir que les objets de paiement sont bien définis
  const safePatente = igsData.patente || { montant: '', quittance: '' };
  const safeAcompteJanvier = igsData.acompteJanvier || { montant: '', quittance: '' };
  const safeAcompteFevrier = igsData.acompteFevrier || { montant: '', quittance: '' };
  
  // S'assurer que les établissements sont bien un tableau
  const safeEtablissements = Array.isArray(igsData.etablissements) ? 
    igsData.etablissements : 
    [{
      nom: "Établissement principal",
      activite: "",
      ville: "",
      departement: "",
      quartier: "",
      chiffreAffaires: 0
    }];
  
  // S'assurer que les paiements complétés sont bien un tableau
  const safeCompletedPayments = Array.isArray(igsData.completedPayments) ?
    igsData.completedPayments : [];
  
  const extractedData = {
    soumisIGS: igsData.soumisIGS,
    adherentCGA: igsData.adherentCGA,
    classeIGS: igsData.classeIGS,
    patente: safePatente,
    acompteJanvier: safeAcompteJanvier,
    acompteFevrier: safeAcompteFevrier,
    chiffreAffairesAnnuel: igsData.chiffreAffairesAnnuel || 0,
    etablissements: safeEtablissements,
    completedPayments: safeCompletedPayments
  };
  
  console.log("Extracted client IGS data:", extractedData);
  return extractedData;
};
