
export interface Client {
  id: string;
  nom: string;
  email: string;
  telephone: string;
  adresse: string;
}

export interface Prestation {
  id?: string;
  description: string;
  montant: number;
  quantite?: number;
  estPaye?: boolean;
  datePaiement?: string;
}

export type FactureStatus = "non_paye" | "partiellement_paye" | "paye";

export interface Paiement {
  date: string;
  montant: number;
  mode: string;
  reference?: string;
  notes?: string;
}

export interface Facture {
  id: string;
  client_id: string;
  client_nom: string;
  client_email: string;
  client_telephone: string;
  client_adresse: string;
  date: string;
  echeance: string;
  prestations: Prestation[];
  montant: number;
  montant_paye?: number;
  status: FactureStatus;
  notes?: string;
  mode_reglement?: string;
  moyen_paiement?: string;
  paiements?: Paiement[];
  created_at?: string;
}
