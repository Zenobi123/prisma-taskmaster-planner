
import { Etablissement } from "@/types/client";

// Utility function to create a default establishment
export const createDefaultEtablissement = (): Etablissement => {
  return {
    nom: "Établissement principal",
    activite: "",
    ville: "",
    departement: "",
    quartier: "",
    chiffreAffaires: 0
  };
};
