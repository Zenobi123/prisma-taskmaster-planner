
export type CollaborateurRole = "expert-comptable" | "assistant" | "fiscaliste" | "gestionnaire";

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
  dateEntree: string;
  statut: "actif" | "inactif";
  tachesEnCours: number;
  permissions: CollaborateurPermissions[];
  telephone: string;
  niveauEtude: string;
  dateNaissance: string;
  ville: string;
  quartier: string;
}
