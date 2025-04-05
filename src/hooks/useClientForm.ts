
import { useState, useEffect } from "react";
import { 
  Client, 
  ClientType, 
  Sexe, 
  EtatCivil, 
  RegimeFiscalPhysique,
  RegimeFiscalMorale,
  SituationImmobiliere,
  FormeJuridique
} from "@/types/client";
import { TransitionFiscaleData } from "@/hooks/fiscal/types";

interface ClientFormState {
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
  transitionFiscale: TransitionFiscaleData;
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
    gestionexternalisee: false,
    sexe: "homme",
    etatcivil: "celibataire",
    regimefiscal: "reel",
    transitionFiscale: {
      igsAssujetissement: false
    },
    situationimmobiliere: {
      type: "locataire",
      valeur: undefined,
      loyer: undefined
    }
  });

  useEffect(() => {
    if (initialData) {
      // Initialize with default transitionFiscale if not present
      const transitionFiscale = initialData.fiscal_data?.transitionFiscale || {
        igsAssujetissement: false
      };
      
      // Ensure boolean values are properly set
      if (transitionFiscale.igsAssujetissement !== undefined) {
        transitionFiscale.igsAssujetissement = Boolean(transitionFiscale.igsAssujetissement);
      }
      
      if (transitionFiscale.cgaAdhesion !== undefined) {
        transitionFiscale.cgaAdhesion = Boolean(transitionFiscale.cgaAdhesion);
      }
      
      setFormData({
        nom: initialData.nom || "",
        raisonsociale: initialData.raisonsociale || "",
        sigle: initialData.sigle || "",
        datecreation: initialData.datecreation || "",
        lieucreation: initialData.lieucreation || "",
        nomdirigeant: initialData.nomdirigeant || "",
        formejuridique: initialData.formejuridique,
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
        transitionFiscale: transitionFiscale,
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
    } else if (name.startsWith("transitionFiscale.")) {
      // Ensure proper type conversion for boolean values
      let finalValue = value;
      if (name === "transitionFiscale.igsAssujetissement" || name === "transitionFiscale.cgaAdhesion") {
        finalValue = value === true || value === "true";
      } else if (name === "transitionFiscale.classeIGS") {
        finalValue = value !== undefined && value !== "" ? Number(value) : undefined;
      }
      
      console.log(`Setting ${name} to:`, finalValue);
      
      setFormData(prev => ({
        ...prev,
        transitionFiscale: {
          ...prev.transitionFiscale,
          [name.split('.')[1]]: finalValue
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const prepareSubmitData = (type: ClientType) => {
    const baseData = {
      type,
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
      situationimmobiliere: {
        type: formData.situationimmobiliere.type,
        valeur: formData.situationimmobiliere.type === "proprietaire" ? formData.situationimmobiliere.valeur : undefined,
        loyer: formData.situationimmobiliere.type === "locataire" ? formData.situationimmobiliere.loyer : undefined
      },
      fiscal_data: {
        transitionFiscale: formData.transitionFiscale
      }
    };

    if (type === "physique") {
      return {
        ...baseData,
        nom: formData.nom,
        raisonsociale: null,
        sexe: formData.sexe,
        etatcivil: formData.etatcivil,
        regimefiscal: formData.regimefiscal as RegimeFiscalPhysique,
        sigle: null,
        datecreation: null,
        lieucreation: null,
        nomdirigeant: null,
        formejuridique: null
      };
    } else {
      return {
        ...baseData,
        nom: null,
        raisonsociale: formData.raisonsociale,
        sexe: undefined,
        etatcivil: undefined,
        regimefiscal: formData.regimefiscal as RegimeFiscalMorale,
        sigle: formData.sigle || null,
        datecreation: formData.datecreation || null,
        lieucreation: formData.lieucreation || null,
        nomdirigeant: formData.nomdirigeant || null,
        formejuridique: formData.formejuridique || null
      };
    }
  };

  return {
    formData,
    handleChange,
    prepareSubmitData
  };
}
