
export type ClientType = "physique" | "morale";
export type Sexe = "homme" | "femme";
export type EtatCivil = "celibataire" | "marie" | "divorce" | "veuf";
export type SituationImmobiliere = "proprietaire" | "locataire";
export type FormeJuridique = 
  | "sa" 
  | "sarl" 
  | "sas" 
  | "snc" 
  | "association" 
  | "gie" 
  | "autre";
export type ClientStatus = "actif" | "inactif" | "archive";

export interface Interaction {
  id: string;
  date: string;
  description: string;
}

export interface Client {
  id: string;
  type: ClientType;
  nom?: string;
  nomcommercial?: string;
  numerorccm?: string;
  raisonsociale?: string;
  sigle?: string;
  datecreation?: string;
  lieucreation?: string;
  nomdirigeant?: string;
  formejuridique?: FormeJuridique;
  niu: string;
  centrerattachement: string;
  adresse: {
    ville: string;
    quartier: string;
    lieuDit: string;
  };
  contact: {
    telephone: string;
    email: string;
  };
  secteuractivite: string;
  numerocnps?: string;
  interactions: Interaction[];
  statut: ClientStatus;
  gestionexternalisee: boolean;
  created_at?: string;
  sexe?: Sexe;
  etatcivil?: EtatCivil;
  situationimmobiliere?: {
    type: SituationImmobiliere;
    valeur?: number;
    loyer?: number;
  };
  fiscal_data?: any; // On conserve cette propriété pour éviter les erreurs avec les autres composants
}
