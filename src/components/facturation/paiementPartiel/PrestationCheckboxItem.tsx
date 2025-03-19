
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Prestation } from "@/types/facture";

interface PrestationCheckboxItemProps {
  prestation: Prestation;
  index: number;
  isSelected: boolean;
  isDisabled: boolean;
  onToggle: (prestationId: string | undefined) => void;
  formatMontant: (montant: number) => string;
}

export const PrestationCheckboxItem = ({
  prestation,
  index,
  isSelected,
  isDisabled,
  onToggle,
  formatMontant
}: PrestationCheckboxItemProps) => {
  const isPayee = !!prestation.estPaye;

  return (
    <div className="flex items-start space-x-3 p-2 rounded bg-muted/30">
      <Checkbox 
        id={`prestation-${prestation.id || index}`}
        checked={isSelected}
        onCheckedChange={() => onToggle(prestation.id)}
        disabled={isDisabled}
        className="mt-1"
      />
      <div className="flex-1 space-y-1">
        <Label 
          htmlFor={`prestation-${prestation.id || index}`}
          className={`${isPayee ? 'line-through text-muted-foreground' : ''}`}
        >
          {prestation.description}
          {isPayee && (
            <span className="ml-2 text-xs text-green-600 font-medium">
              (Payé le {prestation.datePaiement})
            </span>
          )}
        </Label>
        <p className="text-sm text-muted-foreground">
          {formatMontant(prestation.montant)}
          {prestation.quantite && ` × ${prestation.quantite}`}
        </p>
      </div>
    </div>
  );
};
