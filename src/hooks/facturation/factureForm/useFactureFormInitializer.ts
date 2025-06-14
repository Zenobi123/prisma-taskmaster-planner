
import { useEffect } from "react";
import { Client } from "@/types/client";
import { Facture } from "@/types/facture";
import { formatDate } from "@/utils/factureUtils";

interface UseFactureFormInitializerProps {
  editMode: boolean;
  factureToEdit: Facture | null;
  setValue: (name: keyof Facture, value: any) => void;
  reset: (values?: any) => void;
}

export const useFactureFormInitializer = ({
  editMode,
  factureToEdit,
  setValue,
  reset
}: UseFactureFormInitializerProps) => {
  useEffect(() => {
    if (editMode && factureToEdit) {
      const formattedFacture = {
        ...factureToEdit,
        date: typeof factureToEdit.date === 'string' ? new Date(factureToEdit.date) : factureToEdit.date,
        echeance: typeof factureToEdit.echeance === 'string' ? new Date(factureToEdit.echeance) : factureToEdit.echeance,
      };
      
      reset(formattedFacture);
    }
  }, [editMode, factureToEdit, setValue, reset]);
};
