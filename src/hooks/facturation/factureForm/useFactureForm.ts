
import { useFactureFormState } from "./useFactureFormState";
import { useFactureFormInitializer } from "./useFactureFormInitializer";
import { useFactureFormPrestations } from "./useFactureFormPrestations";
import { useFactureFormSubmit } from "./useFactureFormSubmit";
import { useFactureFormValidation } from "./useFactureFormValidation";
import { useFactureClients } from "./useFactureClients";

export function useFactureForm(onSuccess?: () => void, editMode = false) {
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

  // Get selected client
  const selectedClient = clients.find(c => c.id === formState.selectedClientId) || null;

  const handleFormSubmit = async (data: any) => {
    const isValid = validateForm(data);
    if (isValid) {
      const success = await submitState.onSubmit(data);
      if (success && onSuccess) {
        onSuccess();
      }
    }
  };

  return {
    // Form methods from react-hook-form
    handleSubmit: formState.handleSubmit,
    setValue: formState.setValue,
    watch: formState.watch,
    register: formState.register,
    
    // Form state
    prestations: prestationsState.prestations,
    setPrestations: prestationsState.setPrestations,
    totalAmount: formState.totalAmount,
    resetForm: formState.resetForm,
    
    // Current form values
    selectedClientId: formState.selectedClientId,
    selectedClient,
    selectedDate: formState.selectedDate,
    selectedEcheance: formState.selectedEcheance,
    selectedStatus: formState.selectedStatus,
    selectedStatusPaiement: formState.selectedStatusPaiement,
    selectedModePaiement: formState.selectedModePaiement,
    
    // Initialization
    initializeForm,
    initializeFormForEdit,
    
    // Validation
    validateForm,
    
    // Submit
    onSubmit: handleFormSubmit,
    isSubmitting: submitState.isSubmitting,
    
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
