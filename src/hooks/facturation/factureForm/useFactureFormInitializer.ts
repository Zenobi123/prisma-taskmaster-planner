
import { useCallback } from "react";
import { parse } from "date-fns";
import { Facture } from "@/types/facture";

export const useFactureFormInitializer = (
  setValue: (name: string, value: any) => void,
  setPrestations: (prestations: any[]) => void,
  setEditFactureId: (id: string | null) => void
) => {
  // Function to initialize form for editing
  const initializeFormForEdit = useCallback((facture: Facture) => {
    // Set edit facture ID
    setEditFactureId(facture.id);
    
    // Set form values
    setValue("client_id", facture.client_id);
    
    // Convert date strings to Date objects
    const dateFormat = "dd/MM/yyyy";
    const dateObj = parse(facture.date, dateFormat, new Date());
    const echeanceObj = parse(facture.echeance, dateFormat, new Date());
    
    setValue("date", dateObj);
    setValue("echeance", echeanceObj);
    setValue("status", facture.status);
    setValue("status_paiement", facture.status_paiement);
    setValue("mode_paiement", facture.mode_paiement || "espèces");
    setValue("notes", facture.notes || "");
    
    // Set prestations
    if (facture.prestations && facture.prestations.length > 0) {
      setPrestations(facture.prestations);
    }
  }, [setValue, setPrestations, setEditFactureId]);

  return {
    initializeFormForEdit
  };
};
