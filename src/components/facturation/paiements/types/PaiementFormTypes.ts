
export type PrestationPayee = {
  id: string;
  montant_modifie: number;
};

export type PaiementFormData = {
  client_id: string;
  facture_id: string;
  date: Date;
  montant: number;
  mode: "espèces" | "virement" | "orange_money" | "mtn_money";
  est_credit: boolean;
  reference_transaction: string;
  notes: string;
  type_paiement: "total" | "partiel";
  prestations_payees: string[];
  prestations_montants: Record<string, number>;
};
