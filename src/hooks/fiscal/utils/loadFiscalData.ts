
import { Client, CGAClasse } from "@/types/client";
import { ObligationStatuses } from "../types";
import { FiscalData, IGSData, Etablissement } from "../types/igsTypes";

// Default values for new fiscal data
const defaultObligationStatuses: ObligationStatuses = {
  patente: { assujetti: false, paye: false },
  bail: { assujetti: false, paye: false },
  taxeFonciere: { assujetti: false, paye: false },
  dsf: { assujetti: false, depose: false },
  darp: { assujetti: false, depose: false },
  tva: { assujetti: false, paye: false },
  cnps: { assujetti: false, paye: false }
};

// Load fiscal data for a client
export const loadFiscalData = async (clientId: string): Promise<FiscalData> => {
  // Simulate an API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Return empty fiscal data
  return {
    attestation: {
      creationDate: "",
      validityEndDate: "",
      showInAlert: true
    },
    obligations: { ...defaultObligationStatuses },
    hiddenFromDashboard: false,
    igs: {
      soumisIGS: false,
      adherentCGA: false,
      patente: { montant: '', quittance: '' },
      acompteJanvier: { montant: '', quittance: '' },
      acompteFevrier: { montant: '', quittance: '' },
      etablissements: []
    }
  };
};

// Default IGS values to use when data is missing
const defaultIGSData: IGSData = {
  soumisIGS: false,
  adherentCGA: false,
  patente: { montant: '', quittance: '' },
  acompteJanvier: { montant: '', quittance: '' },
  acompteFevrier: { montant: '', quittance: '' },
  chiffreAffairesAnnuel: 0,
  etablissements: []
};

export const extractIGSData = (fiscalData: FiscalData | null, client: Client): IGSData & { 
  chiffreAffairesAnnuel?: number;
  etablissements?: Etablissement[];
} => {
  // Check if fiscal data is available and extract IGS data
  const fiscalIGS = fiscalData?.igs || defaultIGSData;
  // Extract client IGS data or use defaults
  const clientIGS = client?.igs || defaultIGSData;
  
  // Merge and return values from both sources with safe defaults
  return {
    soumisIGS: fiscalIGS.soumisIGS !== undefined ? fiscalIGS.soumisIGS : (clientIGS.soumisIGS || false),
    adherentCGA: fiscalIGS.adherentCGA !== undefined ? fiscalIGS.adherentCGA : (clientIGS.adherentCGA || false),
    classeIGS: fiscalIGS.classeIGS || clientIGS.classeIGS,
    patente: fiscalIGS.patente || clientIGS.patente || { montant: '', quittance: '' },
    acompteJanvier: fiscalIGS.acompteJanvier || clientIGS.acompteJanvier || { montant: '', quittance: '' },
    acompteFevrier: fiscalIGS.acompteFevrier || clientIGS.acompteFevrier || { montant: '', quittance: '' },
    chiffreAffairesAnnuel: fiscalIGS.chiffreAffairesAnnuel || clientIGS.chiffreAffairesAnnuel || 0,
    etablissements: fiscalIGS.etablissements || clientIGS.etablissements || []
  };
};
