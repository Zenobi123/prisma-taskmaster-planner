
import { useState, useEffect } from "react";
import { 
  Client, 
  ClientType, 
  Sexe, 
  EtatCivil, 
  RegimeFiscalPhysique,
  RegimeFiscalMorale,
  SituationImmobiliere 
} from "@/types/client";

interface ClientFormState {
  nom: string;
  raisonsociale: string;
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
}

export function useClientForm(initialData?: Client) {
  const [formData, setFormData] = useState<ClientFormState>({
    nom: "",
    raisonsociale: "",
    niu: "",
    centrerattachement: "",
    ville: "",
    quartier: "",
    lieuDit: "",
    telephone: "",
    email: "",
    secteuractivite: "commerce",
    numerocnps: "",
    gestionexternalisee: false,
    sexe: "homme",
    etatcivil: "celibataire",
    regimefiscal: "reel",
    situationimmobiliere: {
      type: "locataire",
      valeur: undefined,
      loyer: undefined
    }
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        nom: initialData.nom || "",
        raisonsociale: initialData.raisonsociale || "",
        niu: initialData.niu,
        centrerattachement: initialData.centrerattachement,
        ville: initialData.adresse.ville,
        quartier: initialData.adresse.quartier,
        lieuDit: initialData.adresse.lieuDit,
        telephone: initialData.contact.telephone,
        email: initialData.contact.email,
        secteuractivite: initialData.secteuractivite,
        numerocnps: initialData.numerocnps || "",
        gestionexternalisee: initialData.gestionexternalisee || false,
        sexe: initialData.sexe || "homme",
        etatcivil: initialData.etatcivil || "celibataire",
        regimefiscal: initialData.regimefiscal || "reel",
        situationimmobiliere: {
          type: initialData.situationimmobiliere?.type || "locataire",
          valeur: initialData.situationimmobiliere?.valeur,
          loyer: initialData.situationimmobiliere?.loyer
        }
      });
    }
  }, [initialData]);

  const handleChange = (name: string, value: any) => {
    if (name === "situationimmobiliere.type") {
      setFormData(prev => ({
        ...prev,
        situationimmobiliere: {
          type: value as SituationImmobiliere,
          valeur: undefined,
          loyer: undefined
        }
      }));
    } else if (name === "situationimmobiliere.valeur" || name === "situationimmobiliere.loyer") {
      setFormData(prev => ({
        ...prev,
        situationimmobiliere: {
          ...prev.situationimmobiliere,
          [name.split('.')[1]]: value !== "" ? Number(value) : undefined
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const prepareSubmitData = (type: ClientType) => {
    return {
      type,
      nom: type === "physique" ? formData.nom : null,
      raisonsociale: type === "morale" ? formData.raisonsociale : null,
      niu: formData.niu,
      centrerattachement: formData.centrerattachement,
      adresse: {
        ville: formData.ville,
        quartier: formData.quartier,
        lieuDit: formData.lieuDit,
      },
      contact: {
        telephone: formData.telephone,
        email: formData.email,
      },
      secteuractivite: formData.secteuractivite,
      numerocnps: formData.numerocnps || null,
      gestionexternalisee: formData.gestionexternalisee,
      sexe: type === "physique" ? formData.sexe : undefined,
      etatcivil: type === "physique" ? formData.etatcivil : undefined,
      regimefiscal: type === "physique" ? formData.regimefiscal : undefined,
      situationimmobiliere: {
        type: formData.situationimmobiliere.type,
        valeur: formData.situationimmobiliere.type === "proprietaire" ? formData.situationimmobiliere.valeur : undefined,
        loyer: formData.situationimmobiliere.type === "locataire" ? formData.situationimmobiliere.loyer : undefined
      }
    };
  };

  return {
    formData,
    handleChange,
    prepareSubmitData
  };
}
