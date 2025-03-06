
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Prestation } from "@/types/facture";
import { PrestationSelector } from "./PrestationSelector";
import { useState } from "react";

interface PrestationsFormProps {
  prestations: Prestation[];
  setPrestations: React.Dispatch<React.SetStateAction<Prestation[]>>;
}

export const PrestationsForm = ({ prestations, setPrestations }: PrestationsFormProps) => {
  const [openPrestationSelector, setOpenPrestationSelector] = useState(false);

  const handleAddPrestation = () => {
    setPrestations([...prestations, { description: "", montant: 0 }]);
  };

  const handleRemovePrestation = (index: number) => {
    if (prestations.length > 1) {
      setPrestations(prestations.filter((_, i) => i !== index));
    }
  };

  const updatePrestation = (index: number, field: keyof Prestation, value: string | number) => {
    const updatedPrestations = [...prestations];
    updatedPrestations[index] = {
      ...updatedPrestations[index],
      [field]: field === 'montant' ? Number(value) : value
    };
    setPrestations(updatedPrestations);
  };

  const addPredefinedPrestation = (prestation: { description: string, montant: number }) => {
    const updatedPrestations = [...prestations];
    // Remplacer la première prestation vide s'il y en a une
    const emptyIndex = updatedPrestations.findIndex(p => p.description === "" && p.montant === 0);
    
    if (emptyIndex !== -1) {
      updatedPrestations[emptyIndex] = {
        description: prestation.description,
        montant: prestation.montant
      };
    } else {
      updatedPrestations.push({
        description: prestation.description,
        montant: prestation.montant
      });
    }
    
    setPrestations(updatedPrestations);
    setOpenPrestationSelector(false);
  };

  const calculateTotal = () => {
    return prestations.reduce((sum, p) => sum + p.montant, 0);
  };

  return (
    <div className="grid gap-2">
      <div className="flex justify-between items-center">
        <Label>Prestations</Label>
        <PrestationSelector 
          openPrestationSelector={openPrestationSelector} 
          setOpenPrestationSelector={setOpenPrestationSelector}
          onSelectPrestation={addPredefinedPrestation}
        />
      </div>
      <div className="border rounded-md p-3">
        {prestations.map((prestation, index) => (
          <div key={index} className="grid grid-cols-12 gap-2 mb-2">
            <div className="col-span-8">
              <Input 
                placeholder="Description" 
                value={prestation.description}
                onChange={(e) => updatePrestation(index, 'description', e.target.value)}
              />
            </div>
            <div className="col-span-3">
              <Input 
                placeholder="Montant (FCFA)" 
                type="number" 
                value={prestation.montant || ''}
                onChange={(e) => updatePrestation(index, 'montant', e.target.value)}
              />
            </div>
            <div className="col-span-1 flex items-center justify-center">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => handleRemovePrestation(index)}
                disabled={prestations.length === 1}
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          </div>
        ))}
        <div className="flex justify-between items-center mt-4">
          <Button 
            variant="outline" 
            className="w-full" 
            size="sm"
            onClick={handleAddPrestation}
          >
            <Plus className="w-3 h-3 mr-1" /> Ajouter une prestation
          </Button>
        </div>
        <div className="flex justify-end mt-4 text-sm font-medium">
          Total: {calculateTotal().toLocaleString()} FCFA
        </div>
      </div>
    </div>
  );
};
