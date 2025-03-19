
import { useState } from "react";
import { Facture, Prestation } from "@/types/facture";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { EditPrestationsSection } from "./EditPrestationsSection";
import { EditNotesSection } from "./EditNotesSection";

interface FactureEditFormProps {
  selectedFacture: Facture;
  onCancel: () => void;
  onSave: (updates: Partial<Facture>) => Promise<void>;
  isLoading: boolean;
}

export const FactureEditForm = ({
  selectedFacture,
  onCancel,
  onSave,
  isLoading,
}: FactureEditFormProps) => {
  const [editNotes, setEditNotes] = useState(selectedFacture.notes || "");
  const [editPrestations, setEditPrestations] = useState<Prestation[]>(
    selectedFacture.prestations.map(p => ({
      ...p,
      // Ensure quantite and prix_unitaire are set
      quantite: p.quantite || 1,
      prix_unitaire: p.prix_unitaire || p.montant
    }))
  );

  const handleAddPrestation = () => {
    setEditPrestations([...editPrestations, { description: "", montant: 0, quantite: 1, prix_unitaire: 0 }]);
  };

  const handleRemovePrestation = (index: number) => {
    setEditPrestations(editPrestations.filter((_, i) => i !== index));
  };

  const handlePrestationChange = (index: number, field: keyof Prestation, value: string | number) => {
    const newPrestations = [...editPrestations];
    
    // Handle different field types
    if (field === 'montant' && typeof value === 'string') {
      // Convert string to number, remove non-numeric characters
      const numericValue = value.replace(/[^0-9]/g, "");
      newPrestations[index].montant = numericValue ? parseInt(numericValue, 10) : 0;
    } else {
      // Use type assertion for different field types
      (newPrestations[index][field] as any) = value;
    }
    
    setEditPrestations(newPrestations);
  };

  const handleSaveChanges = async () => {
    // Calculate the new total amount
    const montantTotal = editPrestations.reduce((sum, item) => {
      return sum + (item.montant || 0);
    }, 0);
    
    // Create the update object
    const updates: Partial<Facture> = {
      prestations: editPrestations,
      notes: editNotes,
      montant: montantTotal
    };
    
    await onSave(updates);
  };

  return (
    <>
      <ScrollArea className="max-h-[60vh] pr-4">
        <div className="space-y-6">
          <EditPrestationsSection
            prestations={editPrestations}
            onAddPrestation={handleAddPrestation}
            onRemovePrestation={handleRemovePrestation}
            onPrestationChange={handlePrestationChange}
          />
          
          <EditNotesSection 
            notes={editNotes} 
            onNotesChange={setEditNotes} 
          />
        </div>
      </ScrollArea>
      
      <div className="flex justify-between mt-6">
        <Button variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button 
          onClick={handleSaveChanges} 
          disabled={isLoading}
          className="flex gap-2"
        >
          {isLoading ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
          ) : (
            <Save className="h-4 w-4" />
          )}
          Sauvegarder
        </Button>
      </div>
    </>
  );
};
