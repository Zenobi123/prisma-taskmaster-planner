
import { useState } from "react";
import { Client, ClientType } from "@/types/client";
import { useClientFormState } from "./useClientFormState";
import { useClientFormHandlers } from "./useClientFormHandlers";
import { useClientFormSubmit } from "./useClientFormSubmit";

export function useClientForm(initialData?: Client) {
  const { formData, setFormData } = useClientFormState(initialData);
  const { handleChange } = useClientFormHandlers(formData, setFormData);
  const { prepareSubmitData } = useClientFormSubmit();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Process will be handled by parent component
  };

  const prepareClientData = (type: ClientType) => {
    console.log("Preparing client data for submission with type:", type);
    console.log("Current formData:", formData);
    console.log("Current regime fiscal:", formData.regimefiscal);
    
    return prepareSubmitData(formData, type, initialData);
  };

  return {
    formData,
    handleChange,
    handleSubmit,
    prepareSubmitData: prepareClientData,
  };
}

export * from "./types";
