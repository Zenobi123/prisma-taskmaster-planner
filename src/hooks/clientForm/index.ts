
import { Client, ClientType } from "@/types/client";
import { useClientFormState } from "./useClientFormState";
import { useClientFormHandlers } from "./useClientFormHandlers";
import { useClientFormSubmit } from "./useClientFormSubmit";
import { UseClientFormReturn } from "./types";

export function useClientForm(initialData?: Client): UseClientFormReturn {
  // Initialize form state
  const { formData, setFormData } = useClientFormState(initialData);
  
  // Form event handlers
  const { handleChange } = useClientFormHandlers(formData, setFormData);
  
  // Form submission preparation
  const { prepareSubmitData } = useClientFormSubmit(formData);

  return {
    formData,
    handleChange,
    prepareSubmitData
  };
}

// Re-export types
export * from "./types";
