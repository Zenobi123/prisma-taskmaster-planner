
import { Prestation } from "@/types/facture";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface PrestationsSelectionListProps {
  prestations: Prestation[];
  selectedPrestations: string[];
  onTogglePrestation: (prestationId: string) => void;
  formatMontant: (montant: number) => string;
}

export const PrestationsSelectionList = ({
  prestations,
  selectedPrestations,
  onTogglePrestation,
  formatMontant
}: PrestationsSelectionListProps) => {
  // Filter out prestations that are already paid or have no amount
  const availablePrestations = prestations.filter(p => p.montant > 0);
  
  if (availablePrestations.length === 0) {
    return (
      <div className="text-center p-4 bg-muted rounded-md">
        <p className="text-muted-foreground">Aucune prestation disponible pour le paiement.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Label className="font-medium">Sélectionner les prestations à payer</Label>
      <div className="space-y-2 max-h-60 overflow-y-auto">
        {availablePrestations.map((prestation, index) => (
          <Card key={index} className={selectedPrestations.includes(index.toString()) ? "border-primary" : ""}>
            <CardContent className="p-3 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Checkbox 
                  id={`prestation-${index}`}
                  checked={selectedPrestations.includes(index.toString())}
                  onCheckedChange={() => onTogglePrestation(index.toString())}
                />
                <Label 
                  htmlFor={`prestation-${index}`} 
                  className="cursor-pointer"
                >
                  {prestation.description}
                </Label>
              </div>
              <span className="font-medium">
                {formatMontant(prestation.montant)}
              </span>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
