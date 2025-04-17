export type ClientType = "physique" | "morale";
export type Sexe = "homme" | "femme";
export type EtatCivil = "celibataire" | "marie" | "divorce" | "veuf";
export type RegimeFiscalPhysique = 
  | "igs" 
  | "non_professionnel_salarie" 
  | "non_professionnel_autre"
  | "reel";
export type RegimeFiscalMorale = "non_lucratif" | "reel";
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

// Ajout de l'export du type RegimeFiscal
export type RegimeFiscal = RegimeFiscalPhysique | RegimeFiscalMorale;

// Mise à jour des classes de 1 à 10 pour l'IGS
export type CGAClasse = "classe1" | "classe2" | "classe3" | "classe4" | "classe5" | 
  "classe6" | "classe7" | "classe8" | "classe9" | "classe10";

export interface IGSPayment {
  montant: string;
  quittance: string;
}

export interface IGSData {
  soumisIGS: boolean;
  adherentCGA: boolean;
  classeIGS?: CGAClasse;
  patente?: IGSPayment;
  acompteJanvier?: IGSPayment;
  acompteFevrier?: IGSPayment;
  etablissements?: any[];
  chiffreAffairesAnnuel?: number;
  completedPayments?: string[];
}

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
  statut: ClientStatus;
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
  fiscal_data?: any;
  igs?: IGSData;
}
