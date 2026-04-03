
import { SituationImmobiliere } from "@/types/client";
import { ClientFormState } from "./useClientFormState";
import { validateRegimeFiscal } from "./useClientFormValidation";

export function useClientFormHandlers(
  setFormData: React.Dispatch<React.SetStateAction<ClientFormState>>
) {
  const handleChange = (name: string, value: any) => {
    console.log("Handling change:", name, "=", value, "type:", typeof value);

    if (name === "situationimmobiliere.type") {
      setFormData(prev => {
        const newType = value as SituationImmobiliere;
        return {
          ...prev,
          situationimmobiliere: {
            type: newType,
            valeur: (newType === "proprietaire" || newType === "les_deux") ? prev.situationimmobiliere.valeur : undefined,
            loyer: (newType === "locataire" || newType === "les_deux") ? prev.situationimmobiliere.loyer : undefined,
          }
        };
      });
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

  return { handleChange };
}
