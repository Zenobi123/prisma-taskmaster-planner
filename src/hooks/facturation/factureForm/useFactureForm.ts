
import { useCallback } from "react";
import { useFactureClients } from "./useFactureClients";
import { useFactureFormState, FactureFormData } from "./useFactureFormState";
import { useFactureFormPrestations } from "./useFactureFormPrestations";
import { useFactureFormValidation } from "./useFactureFormValidation";
import { useFactureFormSubmit } from "./useFactureFormSubmit";
import { useFactureFormInitializer } from "./useFactureFormInitializer";
import { useFactures } from "../useFactures";
import { Facture } from "@/types/facture";

export function useFactureForm(onSuccess: () => void, editMode: boolean = false) {
  // Get facture actions from useFactures
  const { addFacture, updateFacture } = useFactures();
  
  // Form state management
  const formState = useFactureFormState(editMode);
  
  // Prestations management
  const { 
    prestations, 
    setPrestations, 
    totalAmount 
  } = useFactureFormPrestations();
  
  // Client data
  const { 
    allClients, 
    getSelectedClient 
  } = useFactureClients();
  
  // Form validation
  const { validateFactureForm } = useFactureFormValidation();
  
  // Form submission handlers
  const { 
    submitNewFacture, 
    submitFactureUpdate
  } = useFactureFormSubmit(addFacture, updateFacture, onSuccess);
  
  // Form initializer for edit mode
  const { initializeFormForEdit } = useFactureFormInitializer(
    formState.setValue, 
    setPrestations, 
    formState.setEditFactureId
  );
  
  // Get the selected client
  const selectedClient = getSelectedClient(formState.selectedClientId);
  
  // Form submission handler
  const onSubmit = async (data: FactureFormData) => {
    // Validate form data
    if (!validateFactureForm(selectedClient, prestations)) {
      return;
    }
    
    // Handle form submission based on mode
    if (editMode && formState.editFactureId) {
      await submitFactureUpdate(
        data, 
        formState.editFactureId, 
        selectedClient, 
        prestations, 
        totalAmount
      );
    } else {
      await submitNewFacture(
        data, 
        selectedClient, 
        prestations, 
        totalAmount
      );
    }
  };
  
  return {
    ...formState,
    prestations,
    setPrestations,
    totalAmount,
    selectedClient,
    allClients,
    onSubmit,
    initializeFormForEdit
  };
}

export type UseFactureFormReturn = ReturnType<typeof useFactureForm>;
