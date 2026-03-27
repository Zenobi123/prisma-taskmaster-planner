
export interface PropositionLigne {
  id?: string;
  type: "impot" | "honoraire";
  designation: string;
  base_annuelle: number;
  fraction: number;
  montant: number;
}

export type PropositionStatus = "brouillon" | "envoyee" | "acceptee";

export interface Proposition {
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
  date_manuelle: boolean;
  source_type?: "devis" | "facture" | null;
  source_id?: string | null;
  source_numero?: string | null;
  lignes: PropositionLigne[];
  total: number;
  total_impots: number;
  total_honoraires: number;
  status: PropositionStatus;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface PropositionFormData {
  client_id: string;
  date: string;
  date_manuelle: boolean;
  source_type?: "devis" | "facture" | null;
  source_id?: string | null;
  source_numero?: string | null;
  lignes: PropositionLigne[];
  notes?: string;
  status: PropositionStatus;
}

export interface PropositionFilters {
  searchTerm: string;
  statusFilter: PropositionStatus | "all";
  clientFilter: string;
}
