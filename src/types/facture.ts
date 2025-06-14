export interface Prestation {
  id?: string;
  description: string;
  quantite: number; // Made non-optional as per Zod schema
  prix_unitaire: number; // Changed from montant to prix_unitaire
  taux?: number; // Kept taux as it might be used for other calculations (TVA etc.)
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
  client: Client; // Assuming Client object is populated, adjust if it's just client_id
  date: string | Date; // Allow Date for form, string for DB
  echeance: string | Date; // Allow Date for form, string for DB
  montant: number; // This is the total amount, calculated from prestations
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
