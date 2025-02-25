
export type ClientType = "physique" | "morale";
export type Sexe = "homme" | "femme";
export type EtatCivil = "celibataire" | "marie" | "divorce" | "veuf";
export type RegimeFiscalPhysique = 
  | "reel" 
  | "simplifie" 
  | "liberatoire" 
  | "non_professionnel_public" 
  | "non_professionnel_prive" 
  | "non_professionnel_autre";
export type RegimeFiscalMorale = "reel" | "simplifie" | "non_lucratif";
export type SituationImmobiliere = "proprietaire" | "locataire";
export type FormeJuridique = 
  | "sa" 
  | "sarl" 
  | "sas" 
  | "snc" 
  | "association" 
  | "gie" 
  | "autre";

// Ajout du type RegimeFiscal qui était manquant
export type RegimeFiscal = RegimeFiscalPhysique | RegimeFiscalMorale;

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
  statut: "actif" | "inactif";
  gestionexternalisee: boolean;
  created_at?: string;
  sexe?: Sexe;
  etatcivil?: EtatCivil;
  regimefiscal?: RegimeFiscalPhysique | RegimeFiscalMorale;
  situationimmobiliere?: {
    type: SituationImmobiliere;
    valeur?: number;
    loyer?: number;
  };
}
