
export interface ClientFiscalData {
  attestation: {
    creationDate: string;
    validityEndDate: string;
  };
  obligations: {
    patente: { assujetti: boolean; paye: boolean };
    bail: { assujetti: boolean; paye: boolean };
    taxeFonciere: { assujetti: boolean; paye: boolean };
    dsf: { assujetti: boolean; depose: boolean };
    darp: { assujetti: boolean; depose: boolean };
  };
  hiddenFromDashboard?: boolean;
}
