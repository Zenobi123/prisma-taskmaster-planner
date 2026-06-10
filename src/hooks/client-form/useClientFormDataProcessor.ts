
import { ClientType } from "@/types/client";
import { ClientFormState } from "./useClientFormState";
import { validateRegimeFiscal } from "./useClientFormValidation";

export function useClientFormDataProcessor() {
  const prepareSubmitData = (formData: ClientFormState, type: ClientType) => {

    // Final validation of regime fiscal before submission
    const finalRegimeFiscal = validateRegimeFiscal(formData.regimefiscal);

    // Multi-agences : si saisi, cumul des champs à plat pour rétrocompatibilité
    // avec les modules qui lisent encore `chiffreaffaires` et `situationimmobiliere`.
    const hasAgences = Array.isArray(formData.agences) && formData.agences.length > 0;
    const cumulCA = hasAgences
      ? formData.agences.reduce((s, a) => s + (a.chiffreAffaires || 0), 0)
      : parseFloat(formData.chiffreaffaires) || 0;
    const cumulLoyer = hasAgences
      ? formData.agences.reduce((s, a) => s + (a.loyerMensuel || 0), 0)
      : (formData.situationimmobiliere?.loyer ?? undefined);
    const cumulValeur = hasAgences
      ? formData.agences.reduce((s, a) => s + (a.valeurBien || 0), 0)
      : (formData.situationimmobiliere?.valeur ?? undefined);
    // Statut immo cumulé : si au moins une agence locataire ET au moins une propriétaire → les_deux
    let cumulStatutImmo = formData.situationimmobiliere?.type || "locataire";
    if (hasAgences) {
      const hasLoc = formData.agences.some(a => a.statutImmo === "locataire" || a.statutImmo === "les_deux");
      const hasProp = formData.agences.some(a => a.statutImmo === "proprietaire" || a.statutImmo === "les_deux");
      cumulStatutImmo = hasLoc && hasProp ? "les_deux" : hasLoc ? "locataire" : hasProp ? "proprietaire" : "locataire";
    }

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
        contact_principal: formData.contact_principal || "",
      },
      secteuractivite: formData.secteuractivite || "",
      numerocnps: formData.numerocnps || null,
      regimefiscal: finalRegimeFiscal,
      gestionexternalisee: formData.gestionexternalisee || false,
      situationimmobiliere: {
        type: cumulStatutImmo,
        valeur: (cumulStatutImmo === "proprietaire" || cumulStatutImmo === "les_deux") ? cumulValeur : undefined,
        loyer: (cumulStatutImmo === "locataire" || cumulStatutImmo === "les_deux") ? cumulLoyer : undefined,
      },
      civilite: formData.civilite,
      chiffreaffaires: cumulCA,
      iscga: formData.iscga,
      isvendeurboissons: formData.isvendeurboissons,
      modepaiementigs: formData.modepaiementigs,
      modepaiementpsl: formData.modepaiementpsl,
      agences: hasAgences ? formData.agences : undefined,
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

