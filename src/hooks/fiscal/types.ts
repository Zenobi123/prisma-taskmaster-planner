
// Types conservés pour référence et compatibilité avec d'autres parties de l'application
export interface FiscalAlert {
  type: string;
  title: string;
  description: string;
  clientId?: string;
}

export interface FiscalObligation {
  name: string;
  deadline: string;
  daysRemaining: number;
  type: string;
  clientId?: string;
}

export interface ProcessedClient {
  id: string;
  name: string;
  fiscalData: any;
  type: 'physique' | 'morale';
  nom?: string;
  raisonsociale?: string;
}

export interface FiscalAttestationData {
  creationDate?: string;
  validityEndDate?: string;
  showInAlert?: boolean;
}

export interface ClientFiscalData {
  attestation?: FiscalAttestationData;
  obligations?: any;
}
