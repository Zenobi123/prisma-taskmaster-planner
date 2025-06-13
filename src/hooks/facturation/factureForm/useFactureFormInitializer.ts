
export function useFactureFormInitializer() {
  const initializeFormForEdit = (factureData?: any) => {
    // Initialize form logic here
    console.log("Initializing form with data:", factureData);
  };

  const initializeForm = (factureData?: any) => {
    // Alias for backward compatibility
    return initializeFormForEdit(factureData);
  };

  return {
    initializeFormForEdit,
    initializeForm
  };
}
