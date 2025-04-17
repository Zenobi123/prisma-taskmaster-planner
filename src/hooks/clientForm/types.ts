
import { 
  Client, 
  ClientType, 
  Sexe, 
  EtatCivil, 
  RegimeFiscalPhysique,
  RegimeFiscalMorale,
  SituationImmobiliere,
  FormeJuridique,
} from "@/types/client";

export interface ClientFormState {
  nom: string;
  raisonsociale: string;
  sigle: string;
  datecreation: string;
  lieucreation: string;
  nomdirigeant: string;
  formejuridique?: FormeJuridique;
  niu: string;
  centrerattachement: string;
  ville: string;
  quartier: string;
  lieuDit: string;
  telephone: string;
  email: string;
  secteuractivite: string;
  numerocnps: string;
  gestionexternalisee: boolean;
  sexe: Sexe;
  etatcivil: EtatCivil;
  regimefiscal: RegimeFiscalPhysique | RegimeFiscalMorale;
  situationimmobiliere: {
    type: SituationImmobiliere;
    valeur?: number;
    loyer?: number;
  };
  igs?: any;
}

export interface UseClientFormReturn {
  formData: ClientFormState;
  handleChange: (name: string, value: any) => void;
  prepareSubmitData: (type: ClientType) => any;
}
