
import { useState, useEffect } from "react";
import { parse } from "date-fns";
import { Facture } from "@/types/facture";
import { useCourrierData } from "@/hooks/useCourrierData";

export interface UseFactureFormReturn {
  clients: any[];
  isLoading: boolean;
  error: any;
  initializeFormForEdit: (facture: Facture) => void;
}

export const useFactureForm = (
  setValue: (name: string, value: any) => void,
  setPrestations: (prestations: any[]) => void,
  setEditFactureId: (id: string | null) => void
): UseFactureFormReturn => {
  const { clients, isLoading, error } = useCourrierData();

  // Function to initialize form for editing
  const initializeFormForEdit = (facture: Facture) => {
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
  };

  return {
    clients,
    isLoading,
    error,
    initializeFormForEdit
  };
};
