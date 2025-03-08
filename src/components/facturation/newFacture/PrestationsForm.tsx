
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, X } from "lucide-react";
import { Prestation } from "@/types/facture";

interface PrestationsFormProps {
  prestations: Prestation[];
  setPrestations: (prestations: Prestation[]) => void;
}

export const PrestationsForm = ({
  prestations,
  setPrestations,
}: PrestationsFormProps) => {
  const handleAddPrestation = () => {
    setPrestations([...prestations, { description: "", montant: 0 }]);
  };

  const handleRemovePrestation = (index: number) => {
    setPrestations(prestations.filter((_, i) => i !== index));
  };

  const handleMontantChange = (index: number, value: string) => {
    const newPrestations = [...prestations];
    // Convert string to number, remove non-numeric characters
    const numericValue = value.replace(/[^0-9]/g, "");
    newPrestations[index].montant = numericValue ? parseInt(numericValue, 10) : 0;
    setPrestations(newPrestations);
  };

  const handleDescriptionChange = (index: number, value: string) => {
    const newPrestations = [...prestations];
    newPrestations[index].description = value;
    setPrestations(newPrestations);
  };

  // Calculate total
  const total = prestations.reduce((acc, curr) => {
    return acc + (typeof curr.montant === 'number' ? curr.montant : 0);
  }, 0);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Prestations</h3>
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

      <div className="space-y-3">
        {prestations.map((prestation, index) => (
          <div key={index} className="flex gap-2 items-start">
            <div className="flex-1">
              <Input
                placeholder="Description de la prestation"
                value={prestation.description}
                onChange={(e) => handleDescriptionChange(index, e.target.value)}
                className="w-full"
              />
            </div>
            <div className="w-1/4">
              <Input
                placeholder="Montant (FCFA)"
                value={prestation.montant ? prestation.montant.toLocaleString() : ""}
                onChange={(e) => handleMontantChange(index, e.target.value)}
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
