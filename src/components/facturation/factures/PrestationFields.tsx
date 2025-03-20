
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Prestation } from "@/types/facture";
import { Trash } from "lucide-react";

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
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">Prestations</Label>
        <Button type="button" variant="outline" size="sm" onClick={addPrestation} className="h-7 text-xs">
          + Prestation
        </Button>
      </div>

      <div className="space-y-1">
        {prestations.map((prestation, index) => (
          <div key={index} className="grid grid-cols-12 gap-1 items-center border p-1 rounded-md">
            <div className="col-span-5">
              <Input
                placeholder="Description"
                className="text-xs h-7"
                value={prestation.description}
                onChange={(e) => updatePrestation(index, "description", e.target.value)}
              />
            </div>
            <div className="col-span-2">
              <Input
                type="number"
                min="1"
                className="text-xs h-7"
                value={prestation.quantite}
                onChange={(e) => updatePrestation(index, "quantite", e.target.value)}
              />
            </div>
            <div className="col-span-2">
              <Input
                type="number"
                min="0"
                className="text-xs h-7"
                value={prestation.montant}
                onChange={(e) => updatePrestation(index, "montant", e.target.value)}
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
                className="h-5 w-5 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
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
