
export type CourrierStatus = "brouillon" | "envoye" | "accuse" | "classe";
export type CourrierModeEnvoi = "remise_en_main_propre" | "courrier_postal" | "email" | "fax";

export interface CourrierRecord {
  id: string;
  reference: string;
  client_id: string;
  client_nom?: string;
  template_id: string;
  template_titre: string;
  sujet: string;
  contenu: string;
  message_personnalise?: string;
  statut: CourrierStatus;
  mode_envoi?: CourrierModeEnvoi;
  date_creation: string;
  date_envoi?: string;
  date_accuse?: string;
  notes?: string;
}

export interface CourrierFormData {
  client_ids: string[];
  template_id: string;
  message_personnalise?: string;
  mode_envoi?: CourrierModeEnvoi;
  notes?: string;
}

export interface CourrierFilters {
  search?: string;
  statut?: CourrierStatus | "";
  template_id?: string;
  date_debut?: string;
  date_fin?: string;
}
