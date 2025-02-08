
export type MissionType = "DSF" | "Declaration_Mensuelle_Fiscale" | "Declaration_Mensuelle_Sociale" | "Conseil";
export type MissionStatus = "en_attente" | "en_cours" | "terminee";

export interface Mission {
  id: string;
  client_id: string;
  collaborateur_id: string;
  type: MissionType;
  date_echeance: string;
  status: MissionStatus;
  created_at?: string;
  updated_at?: string;
}
