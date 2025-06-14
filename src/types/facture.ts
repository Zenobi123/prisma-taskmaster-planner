export interface Prestation {
  id?: string;
  description: string;
  quantite: number;
  prix_unitaire: number;
  montant: number;
}

export interface Paiement {
  id: string;
  facture_id: string;
  date: string;
  montant: number;
  mode_paiement: string;
  mode?: string; // Pour compatibilité PDF
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Facture {
  id: string;
  client_id: string;
  client?: {
    id: string;
    nom: string;
    adresse: string;
    telephone: string;
    email: string;
  };
  date: string; // string uniquement
  echeance: string; // string uniquement
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
