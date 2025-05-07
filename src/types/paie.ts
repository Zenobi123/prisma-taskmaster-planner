
/**
 * Types pour le module de gestion de la paie
 */

export type PaieStatut = "En cours" | "Payé" | "Annulé";

export type Genre = "Homme" | "Femme";

export type ContratType = "CDI" | "CDD" | "Stage" | "Prestation";

export interface Employe {
  id: string;
  client_id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  adresse: string;
  date_naissance: string;
  genre: Genre;
  poste: string;
  departement: string;
  date_embauche: string;
  type_contrat: ContratType;
  salaire_base: number;
  numero_cnps: string;
  banque: string;
  numero_compte: string;
  created_at: string;
  updated_at: string;
}

export interface Paie {
  id: string;
  client_id: string;
  employe_id: string;
  mois: number;
  annee: number;
  salaire_base: number;
  salaire_brut: number;
  heures_sup: number;
  montant_heures_sup: number;
  primes: Record<string, any>; // Différents types de primes
  irpp: number;
  cac: number;
  cnps_employe: number;
  cnps_employeur: number;
  tdl: number;
  rav: number;
  cfc: number;
  cfc_employeur: number;
  fne: number;
  autres_retenues: Record<string, any>; // Autres types de retenues
  salaire_net: number;
  cout_total_employeur: number;
  statut: PaieStatut;
  date_paiement: string | null;
  reference_virement: string | null;
  observations: string | null;
  created_at: string;
  updated_at: string;
}

export interface PaieParameters {
  cnpsEmployeeRate: number;
  cnpsEmployerRate: number;
  cfcEmployeeRate: number;
  cfcEmployerRate: number;
  fneRate: number;
  cacRate: number;
  taxAbatement: number;
  tdlBareme: { min: number; max: number; montant: number }[];
  ravBareme: { min: number; max: number; montant: number }[];
}

export interface PayrollItem {
  id: number;
  employeeId: number;
  month: number;
  year: number;
  grossSalary: number;
  cnpsEmployee: number;
  irpp: number;
  cac: number;
  tdl: number;
  rav: number;
  cfc: number;
  netSalary: number;
}

export interface Employee {
  id: number;
  firstname: string;
  lastname: string;
  department: string;
}
