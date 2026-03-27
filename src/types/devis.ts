
export interface DevisPrestation {
  id?: string;
  description: string;
  type: "impot" | "honoraire";
  quantite: number;
  prix_unitaire: number;
  montant: number;
}

export type DevisStatus = "brouillon" | "envoye" | "accepte" | "refuse" | "converti";

export interface Devis {
  id: string;
  numero: string;
  client_id: string;
  client?: {
    id: string;
    nom: string;
    adresse: string;
    telephone: string;
    email: string;
  };
  date: string;
  date_validite: string;
  objet: string;
  status: DevisStatus;
  prestations: DevisPrestation[];
  montant_total: number;
  montant_impots: number;
  montant_honoraires: number;
  notes?: string;
  facture_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface DevisFormData {
  client_id: string;
  date: string;
  date_validite: string;
  objet: string;
  status: DevisStatus;
  prestations: DevisPrestation[];
  notes?: string;
}

export interface DevisFilters {
  searchTerm: string;
  statusFilter: DevisStatus | "all";
  clientFilter: string;
}
