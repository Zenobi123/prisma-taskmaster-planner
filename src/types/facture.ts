export interface Prestation {
  id?: string;
  description: string;
  quantite?: number;
  montant: number;
  taux?: number;
}

export interface Paiement {
  id: string;
  facture_id: string;
  date: string;
  montant: number;
  mode: string;
  notes?: string;
}

export interface Client {
  id: string;
  nom: string;
  adresse: string;
  telephone: string;
  email: string;
}

export interface Facture {
  id: string;
  client_id: string;
  client: Client;
  date: string;
  echeance: string;
  montant: number;
  montant_paye?: number;
  status: "brouillon" | "envoyée" | "annulée";
  status_paiement: "non_payée" | "partiellement_payée" | "payée" | "en_retard";
  mode_paiement?: string;
  prestations: Prestation[];
  paiements?: Paiement[];
  notes?: string;
  created_at?: string;
  updated_at?: string;
}
