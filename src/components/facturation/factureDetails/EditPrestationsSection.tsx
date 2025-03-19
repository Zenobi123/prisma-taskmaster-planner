
import { Prestation } from "@/types/facture";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle } from "lucide-react";

interface EditPrestationsSectionProps {
  prestations: Prestation[];
  onAddPrestation: () => void;
  onRemovePrestation: (index: number) => void;
  onPrestationChange: (index: number, field: keyof Prestation, value: string | number) => void;
}

export const EditPrestationsSection = ({
  prestations,
  onAddPrestation,
  onRemovePrestation,
  onPrestationChange,
}: EditPrestationsSectionProps) => {
  return (
    <div>
      <h3 className="text-lg font-medium mb-2">Prestations</h3>
      <div className="space-y-3">
        {prestations.map((prestation, index) => (
          <div key={index} className="flex gap-2 items-start">
            <div className="flex-1">
              <Input
                placeholder="Description de la prestation"
                value={prestation.description}
                onChange={(e) => onPrestationChange(index, 'description', e.target.value)}
                className="w-full"
              />
            </div>
            <div className="w-1/6">
              <Input
                placeholder="Quantité"
                value={prestation.quantite || 1}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9]/g, "");
                  const quantite = value ? parseInt(value, 10) : 1;
                  onPrestationChange(index, 'quantite', quantite);
                  // Update montant based on new quantity
                  if (prestation.prix_unitaire) {
                    onPrestationChange(index, 'montant', quantite * prestation.prix_unitaire);
                  }
                }}
                className="w-full text-right"
              />
            </div>
            <div className="w-1/4">
              <Input
                placeholder="Prix unitaire (FCFA)"
                value={prestation.prix_unitaire ? prestation.prix_unitaire.toLocaleString() : ""}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9]/g, "");
                  const prixUnitaire = value ? parseInt(value, 10) : 0;
                  onPrestationChange(index, 'prix_unitaire', prixUnitaire);
                  // Update montant based on new unit price
                  if (prestation.quantite) {
                    onPrestationChange(index, 'montant', prixUnitaire * prestation.quantite);
                  }
                }}
                className="w-full text-right"
              />
            </div>
            <div className="w-1/4">
              <Input
                placeholder="Montant (FCFA)"
                value={prestation.montant ? prestation.montant.toLocaleString() : ""}
                readOnly
                className="w-full text-right bg-gray-50"
              />
            </div>
            {prestations.length > 1 && (
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 text-destructive"
                onClick={() => onRemovePrestation(index)}
              >
                &times;
              </Button>
            )}
          </div>
        ))}
      </div>
      
      <Button 
        variant="outline" 
        size="sm" 
        className="mt-3"
        onClick={onAddPrestation}
      >
        <PlusCircle className="mr-1 h-4 w-4" />
        Ajouter une prestation
      </Button>
      
      <div className="flex justify-end mt-4">
        <div className="w-1/4">
          <div className="flex justify-between font-medium">
            <span>Total:</span>
            <span>
              {prestations.reduce((acc, curr) => acc + (curr.montant || 0), 0).toLocaleString()} FCFA
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
