
import { useState } from "react";
import { Facture } from "@/types/facture";

export const useFactureDialog = () => {
  const [editFactureDialogOpen, setEditFactureDialogOpen] = useState(false);
  const [currentEditFacture, setCurrentEditFacture] = useState<Facture | null>(null);
  
  const handleEditFacture = (facture: Facture) => {
    // Set the current facture to edit and open the dialog
    setCurrentEditFacture(facture);
    setEditFactureDialogOpen(true);
  };
  
  return {
    editFactureDialogOpen,
    setEditFactureDialogOpen,
    currentEditFacture,
    setCurrentEditFacture,
    handleEditFacture
  };
};
