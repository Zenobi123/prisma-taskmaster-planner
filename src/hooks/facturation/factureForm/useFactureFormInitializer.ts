
export function useFactureFormInitializer() {
  const initializeForm = (factureData?: any) => {
    console.log("Initializing form with data:", factureData);
  };

  const initializeFormForEdit = (factureData?: any) => {
    console.log("Initializing form for edit with data:", factureData);
  };

  return {
    initializeForm,
    initializeFormForEdit
  };
}
