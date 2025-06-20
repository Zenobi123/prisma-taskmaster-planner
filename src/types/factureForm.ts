
export interface Prestation {
  id?: string;
  description: string;
  quantite: number;
  prix_unitaire: number;
  montant: number;
}

export interface FactureFormData {
  client_id: string;
  date: Date;
  echeance: Date;
  montant: number;
  status: "brouillon" | "envoyée" | "annulée";
  status_paiement: "non_payée" | "partiellement_payée" | "payée" | "en_retard";
  mode?: string;
  prestations: Prestation[];
  notes?: string;
}

export interface DateRange {
  from?: Date;
  to?: Date;
}

export interface FactureFilters {
  searchTerm: string;
  statusFilter: string;
  statusPaiementFilter: string;
  clientFilter: string;
  dateFilter: Date | undefined;
  sortKey: string;
  sortDirection: 'asc' | 'desc';
}
