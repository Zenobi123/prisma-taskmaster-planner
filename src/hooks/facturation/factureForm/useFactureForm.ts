
import { useFactureFormState } from "./useFactureFormState";
import { useFactureFormInitializer } from "./useFactureFormInitializer";
import { useFactureFormPrestations } from "./useFactureFormPrestations";
import { useFactureFormSubmit } from "./useFactureFormSubmit";
import { useFactureFormValidation } from "./useFactureFormValidation";
import { useFactureClients } from "./useFactureClients";

export function useFactureForm() {
  const { 
    clients, 
    isLoading: isLoadingClients, 
    error: clientsError 
  } = useFactureClients();

  const formState = useFactureFormState();
  const { initializeForm, initializeFormForEdit } = useFactureFormInitializer();
  const prestationsState = useFactureFormPrestations();
  const { validateForm, toast } = useFactureFormValidation();
  const submitState = useFactureFormSubmit();

  return {
    // Form state
    ...formState,
    
    // Initialization
    initializeForm,
    initializeFormForEdit,
    
    // Prestations
    ...prestationsState,
    
    // Validation
    validateForm,
    
    // Submit
    ...submitState,
    
    // Clients
    clients,
    allClients: clients,
    getSelectedClient: (clientId: string) => clients.find(c => c.id === clientId),
    isLoadingClients,
    clientsError,
    
    // Additional methods
    toast
  };
}

export type UseFactureFormReturn = ReturnType<typeof useFactureForm>;
