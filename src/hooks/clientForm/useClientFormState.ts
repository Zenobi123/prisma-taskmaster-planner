import { Client } from "@/types/client";
import { ClientFormState } from "./types";

export function useClientFormState(initialData?: Client) {
  const defaultFormData: ClientFormState = {
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
    secteuractivite: "",
    numerocnps: "",
    gestionexternalisee: false,
    sexe: "homme",
    etatcivil: "celibataire",
    regimefiscal: "igs", // Définir IGS comme régime fiscal par défaut pour les personnes physiques
    situationimmobiliere: {
      type: "locataire",
    },
    igs: {
      soumisIGS: false,
      adherentCGA: false,
      classeIGS: undefined
    }
  };

  // Initialize with default or provided data
  let formData = { ...defaultFormData };

  if (initialData) {
    // Récupérer les données IGS soit directement depuis igs soit depuis fiscal_data.igs
    const igsData = initialData.igs || (initialData.fiscal_data?.igs ? initialData.fiscal_data.igs : undefined);
    
    // Log explicite pour le régime fiscal lors de l'initialisation
    console.log("Setting form state with regime fiscal:", initialData.regimefiscal || defaultFormData.regimefiscal);
    
    formData = {
      nom: initialData.nom || "",
      raisonsociale: initialData.raisonsociale || "",
      sigle: initialData.sigle || "",
      datecreation: initialData.datecreation || "",
      lieucreation: initialData.lieucreation || "",
      nomdirigeant: initialData.nomdirigeant || "",
      formejuridique: initialData.formejuridique,
      niu: initialData.niu,
      centrerattachement: initialData.centrerattachement,
      ville: initialData.adresse?.ville || "",
      quartier: initialData.adresse?.quartier || "",
      lieuDit: initialData.adresse?.lieuDit || "",
      telephone: initialData.contact?.telephone || "",
      email: initialData.contact?.email || "",
      secteuractivite: initialData.secteuractivite,
      numerocnps: initialData.numerocnps || "",
      gestionexternalisee: initialData.gestionexternalisee || false,
      sexe: initialData.sexe || "homme",
      etatcivil: initialData.etatcivil || "celibataire",
      regimefiscal: initialData.regimefiscal || (initialData.type === "physique" ? "igs" : "non_lucratif"),
      situationimmobiliere: initialData.situationimmobiliere || { type: "locataire" },
      igs: igsData || { soumisIGS: false, adherentCGA: false }
    };
  }

  const setFormData = (newData: ClientFormState) => {
    formData = newData;
  };

  return { formData, setFormData };
}
