
import { useEffect } from "react";
import { Client } from "@/types/client";
import { ClientFormState } from "./useClientFormState";
import { validateRegimeFiscal } from "./useClientFormValidation";

export function useClientFormInitializer(
  initialData: Client | undefined,
  setFormData: React.Dispatch<React.SetStateAction<ClientFormState>>
) {
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
  }, [initialData, setFormData]);
}
