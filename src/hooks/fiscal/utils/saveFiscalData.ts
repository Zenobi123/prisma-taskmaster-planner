
import { ObligationStatuses } from "../types";
import { IGSData } from "../types/igsTypes";

// Créer un établissement par défaut
const createDefaultEtablissement = () => {
  return {
    nom: "Établissement principal",
    activite: "",
    ville: "",
    departement: "",
    quartier: "",
    chiffreAffaires: 0
  };
};

// Prepare fiscal data for saving to the database
export const prepareFiscalData = (
  creationDate: string,
  validityEndDate: string,
  showInAlert: boolean,
  obligationStatuses: ObligationStatuses,
  hiddenFromDashboard: boolean,
  igsData: IGSData & { chiffreAffairesAnnuel?: number, etablissements?: any[] }
) => {
  // S'assurer que etablissements est toujours un tableau avec au moins un élément
  let safeEtablissements = [];
  
  if (Array.isArray(igsData.etablissements) && igsData.etablissements.length > 0) {
    safeEtablissements = [...igsData.etablissements]; // Créer une copie pour éviter les mutations accidentelles
  } else {
    safeEtablissements = [createDefaultEtablissement()]; // Toujours avoir au moins un établissement
  }
  
  console.log("Préparation des données fiscales pour enregistrement - etablissements:", safeEtablissements);

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
      chiffreAffairesAnnuel: igsData.chiffreAffairesAnnuel || 0,
      etablissements: safeEtablissements
    }
  };
};

// Extract IGS data for client object
export const extractClientIGSData = (igsData: IGSData & { chiffreAffairesAnnuel?: number, etablissements?: any[] }) => {
  // S'assurer que etablissements est toujours un tableau avec au moins un élément
  let safeEtablissements = [];
  
  if (Array.isArray(igsData.etablissements) && igsData.etablissements.length > 0) {
    safeEtablissements = [...igsData.etablissements]; 
  } else {
    safeEtablissements = [createDefaultEtablissement()]; // Toujours avoir au moins un établissement
  }
  
  console.log("Extract client IGS data - etablissements:", safeEtablissements);
  
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
    chiffreAffairesAnnuel: igsData.chiffreAffairesAnnuel || 0,
    etablissements: safeEtablissements
  };
};
