
import { ClientType } from "@/types/client";
import { ClientFormState } from "./useClientFormState";
import { validateRegimeFiscal } from "./useClientFormValidation";

export function useClientFormDataProcessor() {
  const prepareSubmitData = (formData: ClientFormState, type: ClientType) => {
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

  return { prepareSubmitData };
}
