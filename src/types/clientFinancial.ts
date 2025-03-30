
export interface ClientFinancialSummary {
  id: string;
  nom: string;
  facturesMontant: number;
  paiementsMontant: number;
  solde: number;
  status: 'àjour' | 'partiel' | 'retard';
}

export interface ClientInvoice {
  id: string;
  date: string;
  montant: number;
  montant_paye: number;
  montant_restant: number;
  status: string;
  status_paiement: string;
  echeance: string;
}

export interface ClientPayment {
  id: string;
  date: string;
  montant: number;
  mode: string;
  reference: string;
  facture_id: string | null;
  est_credit: boolean;
}

export interface ClientFinancialDetails {
  id?: string;
  nom?: string;
  factures: ClientInvoice[];
  paiements: ClientPayment[];
  solde_disponible: number;
  client?: any; // Add client property to store client details
}
