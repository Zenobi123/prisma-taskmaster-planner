
import { useState, useEffect } from "react";
import { 
  Client, 
  ClientType, 
  Sexe, 
  EtatCivil,
  SituationImmobiliere,
  FormeJuridique,
  RegimeFiscal
} from "@/types/client";

interface ClientFormState {
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

// Valid regime fiscal values
const VALID_REGIME_FISCAL: RegimeFiscal[] = ["reel", "igs", "non_professionnel"];

// Function to validate and clean regime fiscal value
const validateRegimeFiscal = (value: any): RegimeFiscal => {
  console.log("Validating regimefiscal value:", value, "type:", typeof value);
  
  if (typeof value === "string" && VALID_REGIME_FISCAL.includes(value as RegimeFiscal)) {
    return value as RegimeFiscal;
  }
  
  console.warn(`Invalid regimefiscal value: ${value}, defaulting to 'reel'`);
  return "reel";
};

export function useClientForm(initialData?: Client) {
  const [formData, setFormData] = useState<ClientFormState>({
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

  useEffect(() => {
    if (initialData) {
      console.log("Setting form data from initial data:", initialData);
      
      // Validate regime fiscal from initial data
      const validatedRegimeFiscal = validateRegimeFiscal(initialData.regimefiscal);
      
      setFormData({
        nom: initialData.nom || "",
        nomcommercial: initialData.nomcommercial || "",
        numerorccm: initialData.numerorccm || "",
        raisonsociale: initialData.raisonsociale || "",
        sigle: initialData.sigle || "",
        datecreation: initialData.datecreation || "",
        lieucreation: initialData.lieucreation || "",
        nomdirigeant: initialData.nomdirigeant || "",
        formejuridique: initialData.formejuridique,
        niu: initialData.niu || "",
        centrerattachement: initialData.centrerattachement || "",
        ville: initialData.adresse?.ville || "",
        quartier: initialData.adresse?.quartier || "",
        lieuDit: initialData.adresse?.lieuDit || "",
        telephone: initialData.contact?.telephone || "",
        email: initialData.contact?.email || "",
        secteuractivite: initialData.secteuractivite || "commerce",
        numerocnps: initialData.numerocnps || "",
        regimefiscal: validatedRegimeFiscal,
        gestionexternalisee: initialData.gestionexternalisee || false,
        inscriptionfanrharmony2: initialData.inscriptionfanrharmony2 || false,
        sexe: initialData.sexe || "homme",
        etatcivil: initialData.etatcivil || "celibataire",
        situationimmobiliere: {
          type: initialData.situationimmobiliere?.type || "locataire",
          valeur: initialData.situationimmobiliere?.valeur,
          loyer: initialData.situationimmobiliere?.loyer
        }
      });
    }
  }, [initialData]);

  const handleChange = (name: string, value: any) => {
    console.log("Handling change:", name, "=", value, "type:", typeof value);
    
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
    } else if (name === "regimefiscal") {
      // Always validate regime fiscal
      const validatedValue = validateRegimeFiscal(value);
      setFormData(prev => ({ ...prev, regimefiscal: validatedValue }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const prepareSubmitData = (type: ClientType) => {
    console.log("Preparing submit data with regimefiscal:", formData.regimefiscal);
    
    // Final validation of regime fiscal before submission
    const finalRegimeFiscal = validateRegimeFiscal(formData.regimefiscal);
    
    const baseData = {
      type,
      niu: formData.niu || "",
      centrerattachement: formData.centrerattachement || "",
      adresse: {
        ville: formData.ville || "",
        quartier: formData.quartier || "",
        lieuDit: formData.lieuDit || "",
      },
      contact: {
        telephone: formData.telephone || "",
        email: formData.email || "",
      },
      secteuractivite: formData.secteuractivite || "commerce",
      numerocnps: formData.numerocnps || null,
      regimefiscal: finalRegimeFiscal,
      gestionexternalisee: formData.gestionexternalisee || false,
      inscriptionfanrharmony2: formData.inscriptionfanrharmony2 || false,
      situationimmobiliere: {
        type: formData.situationimmobiliere?.type || "locataire",
        valeur: formData.situationimmobiliere?.type === "proprietaire" ? formData.situationimmobiliere.valeur : undefined,
        loyer: formData.situationimmobiliere?.type === "locataire" ? formData.situationimmobiliere.loyer : undefined
      }
    };

    if (type === "physique") {
      return {
        ...baseData,
        nom: formData.nom || "",
        nomcommercial: formData.nomcommercial || null,
        numerorccm: formData.numerorccm || null,
        raisonsociale: null,
        sexe: formData.sexe || "homme",
        etatcivil: formData.etatcivil || "celibataire",
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
        nomcommercial: null,
        numerorccm: formData.numerorccm || null,
        raisonsociale: formData.raisonsociale || "",
        sexe: undefined,
        etatcivil: undefined,
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
