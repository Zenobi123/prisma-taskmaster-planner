
import { Prestation } from "@/types/facture";
import { Label } from "@/components/ui/label";
import { PrestationCheckboxItem } from "./PrestationCheckboxItem";

interface PrestationsSelectionListProps {
  prestations: Prestation[];
  selectedPrestations: string[];
  onTogglePrestation: (prestationId: string | undefined) => void;
  formatMontant: (montant: number) => string;
}

export const PrestationsSelectionList = ({
  prestations,
  selectedPrestations,
  onTogglePrestation,
  formatMontant
}: PrestationsSelectionListProps) => {
  const isPrestaionPayee = (prestation: Prestation): boolean => {
    return !!prestation.estPaye;
  };

  return (
    <div>
      <Label className="text-base font-medium">Sélectionnez les éléments à payer</Label>
      <div className="mt-2 space-y-2 max-h-[300px] overflow-y-auto">
        {prestations.map((prestation, index) => (
          <PrestationCheckboxItem
            key={prestation.id || index}
            prestation={prestation}
            index={index}
            isSelected={prestation.id ? selectedPrestations.includes(prestation.id) : false}
            isDisabled={isPrestaionPayee(prestation)}
            onToggle={onTogglePrestation}
            formatMontant={formatMontant}
          />
        ))}
      </div>
    </div>
  );
};
