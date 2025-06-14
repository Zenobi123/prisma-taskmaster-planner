
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Prestation } from "@/types/facture";
import { Trash } from "lucide-react";

interface PrestationFieldsProps {
  prestations: Prestation[];
  onPrestationsChange: (prestations: Prestation[]) => void;
  // defaultPrestation prop seems unused here, but CreateFactureForm passes it. Removing if not needed.
}

const PrestationFields = ({ prestations, onPrestationsChange }: PrestationFieldsProps) => {
  const addPrestation = () => {
    // Use the structure consistent with Prestation type: prix_unitaire
    onPrestationsChange([...prestations, { description: "", quantite: 1, prix_unitaire: 0 }]);
  };

  const updatePrestation = (index: number, field: keyof Prestation, value: any) => {
    const updatedPrestations = [...prestations];
    let numericValue = value;
    if (field === "prix_unitaire" || field === "quantite") {
      numericValue = Number(value);
      // Ensure quantity is at least 1, and price is at least 0
      if (field === "quantite" && numericValue < 1) numericValue = 1;
      if (field === "prix_unitaire" && numericValue < 0) numericValue = 0;
    }
    
    updatedPrestations[index] = {
      ...updatedPrestations[index],
      [field]: numericValue,
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
    // Use prix_unitaire for calculation
    return (prestation.prix_unitaire * (prestation.quantite || 1));
  };

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <Label className="text-xs font-medium">Prestations</Label>
        <Button type="button" variant="outline" size="sm" onClick={addPrestation} className="h-6 text-xs">
          + Prestation
        </Button>
      </div>

      <div className="space-y-1">
        {prestations.map((prestation, index) => (
          <div key={index} className="grid grid-cols-12 gap-1 items-center border p-1 rounded-md">
            <div className="col-span-5">
              <Input
                placeholder="Description"
                className="text-xs h-6"
                value={prestation.description}
                onChange={(e) => updatePrestation(index, "description", e.target.value)}
              />
            </div>
            <div className="col-span-2">
              <Input
                type="number"
                min="1" // Ensure min is 1 as per Zod
                className="text-xs h-6"
                value={prestation.quantite}
                onChange={(e) => updatePrestation(index, "quantite", e.target.value)}
              />
            </div>
            <div className="col-span-2">
              <Input
                type="number"
                min="0" // Ensure min is 0
                className="text-xs h-6"
                value={prestation.prix_unitaire} // Use prix_unitaire
                onChange={(e) => updatePrestation(index, "prix_unitaire", e.target.value)}
              />
            </div>
            <div className="col-span-2">
              <div className="bg-gray-100 rounded p-1 text-right text-xs">
                {calculateTotal(prestation).toLocaleString('fr-FR')} XAF
              </div>
            </div>
            <div className="col-span-1 flex items-center justify-center">
              <Button 
                type="button" 
                variant="ghost" 
                size="sm" 
                className="h-4 w-4 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                onClick={() => removePrestation(index)}
                disabled={prestations.length === 1}
              >
                <Trash className="h-3 w-3" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PrestationFields;
