export interface Prestation {
  id?: string;
  description: string;
  quantite: number;
  prix_unitaire: number;
  montant?: number; // Ajouter cette propriété pour compatibilité PDF
}

export interface Paiement {
  id: string;
  facture_id: string;
  date: string;
  montant: number;
  mode_paiement: string;
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
  date: string | Date; // Support both string and Date
  echeance: string | Date; // Support both string and Date
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
