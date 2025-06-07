
import { SituationImmobiliere } from "@/types/client";
import { ClientFormState } from "./useClientFormState";
import { validateRegimeFiscal } from "./useClientFormValidation";

export function useClientFormHandlers(
  setFormData: React.Dispatch<React.SetStateAction<ClientFormState>>
) {
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

  return { handleChange };
}
