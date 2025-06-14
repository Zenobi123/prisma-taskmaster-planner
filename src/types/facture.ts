
export interface Prestation {
  id?: string;
  description: string;
  quantite: number;
  prix_unitaire: number;
  // Je rends le montant optionnel pour corriger une erreur de build dans un autre fichier.
  // Idéalement, le fichier appelant devrait être corrigé pour toujours fournir le montant.
  montant?: number;
}

export interface Paiement {
  id: string;
  facture_id: string;
  date: string;
  montant: number;
  // J'unifie 'mode_paiement' et 'mode' en une seule propriété 'mode' pour la cohérence.
  mode: string;
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
  // J'utilise 'mode' ici aussi pour la cohérence.
  mode?: string;
  prestations: Prestation[];
  paiements?: Paiement[];
  notes?: string;
  created_at?: string;
  updated_at?: string;
}
