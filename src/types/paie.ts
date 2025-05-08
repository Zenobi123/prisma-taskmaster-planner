
export interface Paie {
  id: string;
  employe_id: string;
  mois: number;
  annee: number;
  salaire_base: number;
  heures_sup?: number;
  taux_horaire_sup?: number;
  montant_heures_sup?: number;
  primes?: any[];
  total_primes?: number;
  salaire_brut: number;
  cnps_employe?: number;
  cnps_employeur?: number;
  irpp?: number;
  cac?: number;
  cfc?: number;
  tdl?: number;
  rav?: number;
  autres_retenues?: any[];
  total_retenues?: number;
  salaire_net: number;
  date_paiement?: string;
  created_at: string;
  updated_at: string;
  mode_paiement?: string;
  reference_paiement?: string;
  statut: string;
  notes?: string;
}

export interface Employee {
  id: string;
  client_id: string;
  nom: string;
  prenom: string;
  email?: string;
  telephone?: string;
  adresse?: string;
  genre?: string;
  date_naissance?: string;
  date_embauche: string;
  poste: string;
  departement?: string;
  type_contrat?: string;
  statut: string;
  salaire_base: number;
  numero_cnps?: string;
  banque?: string;
  numero_compte?: string;
}
