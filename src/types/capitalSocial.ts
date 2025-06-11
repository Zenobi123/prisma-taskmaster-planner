
export interface CapitalSocial {
  id?: string;
  client_id: string;
  montant_capital: number;
  valeur_action_part?: number;
  nombre_actions_parts?: number;
  type_capital: 'actions' | 'parts';
  created_at?: string;
  updated_at?: string;
}

export interface Actionnaire {
  id?: string;
  client_id: string;
  nom: string;
  prenom?: string;
  date_naissance?: string;
  lieu_habitation?: string;
  nombre_actions_parts: number;
  valeur_capital: number;
  pourcentage: number;
  created_at?: string;
  updated_at?: string;
}
