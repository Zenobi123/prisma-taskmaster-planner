
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

  const {
    formData,
    errors,
    updateFormData,
    resetForm,
    getSelectedClient
  } = useFactureFormState();

  const { initializeForm } = useFactureFormInitializer(updateFormData, resetForm);
  const { prestations, handlePrestationChange } = useFactureFormPrestations(formData, updateFormData);
  const { validateForm } = useFactureFormValidation();
  const { handleSubmit, isSubmitting } = useFactureFormSubmit(formData, validateForm, resetForm);

  return {
    formData,
    errors,
    updateFormData,
    resetForm,
    initializeForm,
    prestations,
    handlePrestationChange,
    validateForm,
    handleSubmit,
    isSubmitting,
    clients,
    allClients: clients,
    getSelectedClient: (clientId: string) => clients.find(c => c.id === clientId),
    isLoadingClients,
    clientsError,
  };
}
