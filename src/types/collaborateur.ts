
export type CollaborateurRole = "expert-comptable" | "assistant" | "fiscaliste" | "gestionnaire" | "comptable";

export type Permission = "lecture" | "ecriture" | "administration";

export type ModuleAcces = "clients" | "taches" | "facturation" | "rapports" | "planning";

export interface CollaborateurPermissions {
  module: ModuleAcces;
  niveau: Permission;
}

export interface Collaborateur {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  poste: CollaborateurRole;
  dateentree: string;
  statut: "actif" | "inactif";
  tachesencours: number;
  permissions: CollaborateurPermissions[];
  telephone: string;
  niveauetude: string;
  datenaissance: string;
  ville: string;
  quartier: string;
  created_at?: string;
}
