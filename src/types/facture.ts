
export interface Prestation {
  id?: string;
  description: string;
  type: "impot" | "honoraire";
  quantite: number;
  prix_unitaire: number;
  montant: number;
}

// Paiement embarqué dans une facture (sous-enregistrement). Le paiement
// "métier" qui constate un règlement et génère le reçu est le type autonome
// défini dans @/types/paiement.
export interface FacturePaiement {
  id: string;
  facture_id: string;
  date: string;
  montant: number;
  mode: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Facture {
  id: string;
  numero?: string;
  client_id: string;
  client?: {
    id: string;
    nom: string;
    adresse: string;
    telephone: string;
    email: string;
  };
  date: string;
  echeance: string;
  montant: number;
  montant_paye?: number;
  montant_impots?: number;
  montant_honoraires?: number;
  status: "brouillon" | "envoyée" | "annulée";
  status_paiement: "non_payée" | "partiellement_payée" | "payée" | "en_retard";
  mode?: string;
  prestations: Prestation[];
  paiements?: FacturePaiement[];
  notes?: string;
  devis_id?: string;
  created_at?: string;
  updated_at?: string;
}
