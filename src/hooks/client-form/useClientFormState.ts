
import { useState } from "react";
import { 
  ClientType, 
  Sexe, 
  EtatCivil,
  SituationImmobiliere,
  FormeJuridique,
  RegimeFiscal
} from "@/types/client";

export interface ClientFormState {
  nom: string;
  nomcommercial: string;
  numerorccm: string;
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
  regimefiscal: RegimeFiscal;
  gestionexternalisee: boolean;
  inscriptionfanrharmony2: boolean;
  sexe: Sexe;
  etatcivil: EtatCivil;
  situationimmobiliere: {
    type: SituationImmobiliere;
    valeur?: number;
    loyer?: number;
  };
}

export const getInitialFormState = (): ClientFormState => ({
  nom: "",
  nomcommercial: "",
  numerorccm: "",
  raisonsociale: "",
  sigle: "",
  datecreation: "",
  lieucreation: "",
  nomdirigeant: "",
  formejuridique: undefined,
  niu: "",
  centrerattachement: "",
  ville: "",
  quartier: "",
  lieuDit: "",
  telephone: "",
  email: "",
  secteuractivite: "commerce",
  numerocnps: "",
  regimefiscal: "reel",
  gestionexternalisee: false,
  inscriptionfanrharmony2: false,
  sexe: "homme",
  etatcivil: "celibataire",
  situationimmobiliere: {
    type: "locataire",
    valeur: undefined,
    loyer: undefined
  }
});

export function useClientFormState() {
  const [formData, setFormData] = useState<ClientFormState>(getInitialFormState());

  return {
    formData,
    setFormData
  };
}
