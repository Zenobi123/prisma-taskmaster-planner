
import { Client } from "@/types/client";
import { useClientFormState } from "./client-form/useClientFormState";
import { useClientFormHandlers } from "./client-form/useClientFormHandlers";
import { useClientFormDataProcessor } from "./client-form/useClientFormDataProcessor";
import { useClientFormInitializer } from "./client-form/useClientFormInitializer";

export function useClientForm(initialData?: Client) {
  const { formData, setFormData } = useClientFormState();
  const { handleChange } = useClientFormHandlers(setFormData);
  const { prepareSubmitData } = useClientFormDataProcessor();
  
  useClientFormInitializer(initialData, setFormData);

  return {
    formData,
    handleChange,
    prepareSubmitData: (type: any) => prepareSubmitData(formData, type)
  };
}
