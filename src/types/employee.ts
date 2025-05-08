
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
