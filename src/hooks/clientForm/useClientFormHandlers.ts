
import { ClientFormState } from "./types";
import { SituationImmobiliere } from "@/types/client";

export function useClientFormHandlers(
  formData: ClientFormState,
  setFormData: (formData: ClientFormState) => void
) {
  const handleChange = (name: string, value: any) => {
    console.log(`Handling change for ${name} with value:`, value);
    
    if (name === "situationimmobiliere.type") {
      setFormData({
        ...formData,
        situationimmobiliere: {
          type: value as SituationImmobiliere,
          valeur: undefined,
          loyer: undefined
        }
      });
    } else if (name === "situationimmobiliere.valeur" || name === "situationimmobiliere.loyer") {
      setFormData({
        ...formData,
        situationimmobiliere: {
          ...formData.situationimmobiliere,
          [name.split('.')[1]]: value !== "" ? Number(value) : undefined
        }
      });
    } else if (name === "regimefiscal") {
      // Log explicite pour le changement de régime fiscal
      console.log("Setting regime fiscal to:", value);
      setFormData({
        ...formData,
        regimefiscal: value
      });
    } else if (name.startsWith("igs.")) {
      const igsField = name.split('.')[1];
      console.log(`Setting IGS field ${igsField} to:`, value);
      
      setFormData({
        ...formData,
        igs: {
          ...formData.igs,
          [igsField]: value
        }
      });
      
      console.log("Updated IGS data:", {
        ...formData.igs,
        [igsField]: value
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  return {
    handleChange
  };
}
