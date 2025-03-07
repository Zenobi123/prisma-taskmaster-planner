
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, X } from "lucide-react";
import { Prestation } from "@/types/facture";
import { PrestationSelector } from "./PrestationSelector";

interface PrestationsFormProps {
  prestations: Prestation[];
  setPrestations: (prestations: Prestation[]) => void;
  isPrestationSelectorOpen?: boolean;
  setIsPrestationSelectorOpen?: (open: boolean) => void;
}

export const PrestationsForm = ({
  prestations,
  setPrestations,
  isPrestationSelectorOpen = false,
  setIsPrestationSelectorOpen = () => {},
}: PrestationsFormProps) => {
  console.log("PrestationsForm rendered, selector open:", isPrestationSelectorOpen);

  const handleAddPrestation = () => {
    setPrestations([...prestations, { description: "", montant: 0 }]);
  };

  const handleRemovePrestation = (index: number) => {
    setPrestations(prestations.filter((_, i) => i !== index));
  };

  const handlePrestationChange = (index: number, field: keyof Prestation, value: string) => {
    const newPrestations = [...prestations];
    if (field === "montant") {
      // Convert string to number, remove non-numeric characters
      const numericValue = value.replace(/[^0-9]/g, "");
      newPrestations[index][field] = numericValue ? parseInt(numericValue, 10) : 0;
    } else {
      newPrestations[index][field] = value as never;
    }
    setPrestations(newPrestations);
  };

  const handleSelectPrestation = (prestation: { description: string; montant: number }) => {
    console.log("Prestation selected:", prestation);
    // Find the first empty prestation or add a new one
    const emptyIndex = prestations.findIndex(p => p.description === "" && p.montant === 0);
    if (emptyIndex !== -1) {
      const newPrestations = [...prestations];
      newPrestations[emptyIndex] = prestation;
      setPrestations(newPrestations);
    } else {
      setPrestations([...prestations, prestation]);
    }
  };

  // Calculate total
  const total = prestations.reduce((acc, curr) => {
    return acc + (typeof curr.montant === 'number' ? curr.montant : 0);
  }, 0);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Prestations</h3>
        <div className="flex space-x-2">
          <PrestationSelector
            openPrestationSelector={isPrestationSelectorOpen}
            setOpenPrestationSelector={setIsPrestationSelectorOpen}
            onSelectPrestation={handleSelectPrestation}
          />
          <Button 
            variant="outline" 
            size="sm" 
            className="h-8 px-2 gap-1"
            onClick={handleAddPrestation}
          >
            <Plus className="h-3.5 w-3.5" />
            <span className="sr-md:inline-block">Ajouter une ligne</span>
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        {prestations.map((prestation, index) => (
          <div key={index} className="flex gap-2 items-start">
            <div className="flex-1">
              <Input
                placeholder="Description de la prestation"
                value={prestation.description}
                onChange={(e) => handlePrestationChange(index, "description", e.target.value)}
                className="w-full"
              />
            </div>
            <div className="w-1/4">
              <Input
                placeholder="Montant (FCFA)"
                value={prestation.montant ? prestation.montant.toLocaleString() : ""}
                onChange={(e) => handlePrestationChange(index, "montant", e.target.value)}
                className="w-full text-right"
              />
            </div>
            {prestations.length > 1 && (
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9"
                onClick={() => handleRemovePrestation(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-end mt-4">
        <div className="w-1/4">
          <div className="flex justify-between font-medium">
            <span>Total:</span>
            <span>{total.toLocaleString()} FCFA</span>
          </div>
        </div>
      </div>
    </div>
  );
};
