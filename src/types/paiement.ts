
export interface Paiement {
  id: string;
  facture: string;
  client: string;
  client_id: string;
  date: string;
  montant: number;
  mode: "espèces" | "virement" | "orange_money" | "mtn_money";
  reference: string;
  solde_restant: number;
  est_credit?: boolean;
  est_verifie?: boolean;
  reference_transaction?: string;
  notes?: string;
  type_paiement?: "total" | "partiel";
  prestations_payees?: string[];
}
