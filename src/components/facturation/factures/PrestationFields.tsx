
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Prestation } from "@/types/facture";
import { Trash } from "lucide-react";
import { useState } from "react";

interface PrestationFieldsProps {
  prestations: Prestation[];
  onPrestationsChange: (prestations: Prestation[]) => void;
}

const PrestationFields = ({ prestations, onPrestationsChange }: PrestationFieldsProps) => {
  const addPrestation = () => {
    onPrestationsChange([...prestations, { description: "", quantite: 1, montant: 0 }]);
  };

  const updatePrestation = (index: number, field: keyof Prestation, value: any) => {
    const updatedPrestations = [...prestations];
    updatedPrestations[index] = {
      ...updatedPrestations[index],
      [field]: field === "montant" || field === "quantite" ? Number(value) : value,
    };
    onPrestationsChange(updatedPrestations);
  };

  const removePrestation = (index: number) => {
    if (prestations.length > 1) {
      const updatedPrestations = prestations.filter((_, i) => i !== index);
      onPrestationsChange(updatedPrestations);
    }
  };

  const calculateTotal = (prestation: Prestation) => {
    return (prestation.montant * (prestation.quantite || 1));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-lg font-semibold">Prestations</Label>
        <Button type="button" variant="outline" onClick={addPrestation}>
          Ajouter une prestation
        </Button>
      </div>

      <div className="space-y-4">
        {prestations.map((prestation, index) => (
          <div key={index} className="grid grid-cols-12 gap-3 items-center border p-3 rounded-md">
            <div className="col-span-5">
              <Label htmlFor={`prestations.${index}.description`}>Description</Label>
              <Input
                placeholder="Description de la prestation"
                value={prestation.description}
                onChange={(e) => updatePrestation(index, "description", e.target.value)}
              />
            </div>
            <div className="col-span-2">
              <Label htmlFor={`prestations.${index}.quantite`}>Quantité</Label>
              <Input
                type="number"
                min="1"
                value={prestation.quantite}
                onChange={(e) => updatePrestation(index, "quantite", e.target.value)}
              />
            </div>
            <div className="col-span-2">
              <Label htmlFor={`prestations.${index}.montant`}>Prix unitaire</Label>
              <Input
                type="number"
                min="0"
                value={prestation.montant}
                onChange={(e) => updatePrestation(index, "montant", e.target.value)}
              />
            </div>
            <div className="col-span-2">
              <Label>Total</Label>
              <div className="bg-gray-100 rounded p-2 text-right">
                {calculateTotal(prestation).toLocaleString('fr-FR')} XAF
              </div>
            </div>
            <div className="col-span-1 flex items-end justify-center">
              <Button 
                type="button" 
                variant="ghost" 
                size="icon" 
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                onClick={() => removePrestation(index)}
                disabled={prestations.length === 1}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PrestationFields;
