
/**
 * Types pour le module de gestion administrative
 */

export interface Document {
  id: string;
  client_id: string;
  nom: string;
  type: string;
  categorie: string;
  description?: string;
  date_creation: string;
  date_expiration?: string;
  fichier_url?: string;
  statut: string;
  created_at: string;
  updated_at: string;
}

export interface Procedure {
  id: string;
  client_id: string;
  titre: string;
  description?: string;
  date_debut: string;
  date_fin?: string;
  responsable?: string;
  statut: string;
  priorite: string;
  etapes?: Record<string, any>[];
  created_at: string;
  updated_at: string;
}

export type ProcedureStatut = "En cours" | "Terminée" | "En pause" | "Annulée";
export type ProcedurePriorite = "Faible" | "Moyenne" | "Élevée" | "Critique";
export type DocumentStatut = "Actif" | "Expiré" | "En cours de renouvellement" | "Archivé";
export type DocumentType = "Attestation" | "Contrat" | "Formulaire" | "Autre";
