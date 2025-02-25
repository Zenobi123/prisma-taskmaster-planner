
export type ClientType = "physique" | "morale";
export type Sexe = "homme" | "femme";
export type EtatCivil = "celibataire" | "marie" | "divorce" | "veuf";
export type RegimeFiscal = 
  | "reel" 
  | "simplifie" 
  | "liberatoire" 
  | "non_professionnel_public" 
  | "non_professionnel_prive" 
  | "non_professionnel_autre";
export type SituationImmobiliere = "proprietaire" | "locataire";

export interface Interaction {
  id: string;
  date: string;
  description: string;
}

export interface Client {
  id: string;
  type: ClientType;
  nom?: string;
  raisonsociale?: string;
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
  statut: "actif" | "inactif";
  gestionexternalisee: boolean;
  created_at?: string;
  sexe?: Sexe;
  etatcivil?: EtatCivil;
  regimefiscal?: RegimeFiscal;
  situationimmobiliere?: {
    type: SituationImmobiliere;
    valeur?: number; // Pour les propriétaires
    loyer?: number; // Pour les locataires
  };
}
