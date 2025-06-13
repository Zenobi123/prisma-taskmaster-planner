export function useFactureFormInitializer() {
  const initializeFormForEdit = (factureData?: any) => {
    // Initialize form logic here
    console.log("Initializing form with data:", factureData);
  };

  return {
    initializeFormForEdit
  };
}
