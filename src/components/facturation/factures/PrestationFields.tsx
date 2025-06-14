import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Prestation } from "@/types/facture";
import { Trash } from "lucide-react";

interface PrestationFieldsProps {
  prestations: Prestation[];
  onPrestationsChange: (prestations: Prestation[]) => void;
}

const defaultPrestation: Prestation = { description: "", quantite: 1, prix_unitaire: 0, montant: 0 };

const PrestationFields = ({ prestations, onPrestationsChange }: PrestationFieldsProps) => {
  const addPrestation = () => {
    onPrestationsChange([
      ...prestations, 
      { ...defaultPrestation }
    ]);
  };

  const updatePrestation = (index: number, field: keyof Prestation, value: any) => {
    const updatedPrestations = [...prestations];
    const p = { ...updatedPrestations[index] };

    if (field === 'description') {
      p.description = value;
    } else if (field === 'quantite') {
      p.quantite = Math.max(1, Number(value) || 1);
    } else if (field === 'prix_unitaire') {
      p.prix_unitaire = Math.max(0, Number(value) || 0);
    }
    
    p.montant = p.quantite * p.prix_unitaire;
    
    updatedPrestations[index] = p;
    onPrestationsChange(updatedPrestations);
  };

  const removePrestation = (index: number) => {
    if (prestations.length > 1) {
      const updatedPrestations = prestations.filter((_, i) => i !== index);
      onPrestationsChange(updatedPrestations);
    }
  };

  const calculateTotal = (prestation: Prestation) => {
    return prestation.montant;
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
                min="1"
                className="text-xs h-6"
                value={prestation.quantite}
                onChange={(e) => updatePrestation(index, "quantite", e.target.value)}
              />
            </div>
            <div className="col-span-2">
              <Input
                type="number"
                min="0"
                className="text-xs h-6"
                value={prestation.prix_unitaire}
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
