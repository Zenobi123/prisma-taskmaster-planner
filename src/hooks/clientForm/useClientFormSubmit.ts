
import { ClientType, RegimeFiscalPhysique, RegimeFiscalMorale } from "@/types/client";
import { ClientFormState } from "./types";

export function useClientFormSubmit(formData: ClientFormState) {
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
      igs: formData.igs
    };

    console.log("Prepared IGS data:", formData.igs);

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
    prepareSubmitData
  };
}
