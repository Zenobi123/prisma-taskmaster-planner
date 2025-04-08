
import { useState, useEffect } from "react";
import { Client } from "@/types/client";
import { ClientFormState } from "./types";

export function useClientFormState(initialData?: Client) {
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
    situationimmobiliere: {
      type: "locataire",
      valeur: undefined,
      loyer: undefined
    },
    igs: {
      soumisIGS: false,
      adherentCGA: false,
      classeIGS: undefined
    }
  });

  useEffect(() => {
    if (initialData) {
      let igsData = {
        soumisIGS: false,
        adherentCGA: false,
        classeIGS: undefined
      };
      
      if (initialData.igs) {
        igsData = initialData.igs;
      } else if (initialData.fiscal_data?.igs) {
        igsData = initialData.fiscal_data.igs;
      }
      
      console.log("Initial IGS data:", igsData);
      
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
        situationimmobiliere: {
          type: initialData.situationimmobiliere?.type || "locataire",
          valeur: initialData.situationimmobiliere?.valeur,
          loyer: initialData.situationimmobiliere?.loyer
        },
        igs: igsData
      });
    }
  }, [initialData]);

  return {
    formData,
    setFormData
  };
}
