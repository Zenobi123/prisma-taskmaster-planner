
import React, { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { TaxObligationStatus } from "@/hooks/fiscal/types";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { formatCurrency } from "@/utils/formatUtils";

export interface TaxObligationItemProps {
  label: string;
  status: TaxObligationStatus;
  obligationKey: string;
  onChange: (obligation: string, field: string, value: any) => void;
  expanded?: boolean;
  onToggleExpand?: () => void;
}

export const TaxObligationItem: React.FC<TaxObligationItemProps> = ({
  label,
  status,
  obligationKey,
  onChange,
  expanded = false,
  onToggleExpand
}) => {
  const [showDetails, setShowDetails] = useState(false);

  const handleAssujettiChange = (checked: boolean | "indeterminate") => {
    if (typeof checked === "boolean") {
      console.log(`${obligationKey} assujetti change:`, checked);
      onChange(obligationKey, "assujetti", checked);
      
      // If not assujetti, automatically set paye to false
      if (!checked) {
        onChange(obligationKey, "paye", false);
      }
    }
  };

  const handlePayeChange = (checked: boolean | "indeterminate") => {
    if (typeof checked === "boolean") {
      console.log(`${obligationKey} paye change:`, checked);
      onChange(obligationKey, "paye", checked);
    }
  };

  const handleMontantChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value === '' ? undefined : parseFloat(e.target.value);
    onChange(obligationKey, "montant", value);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(obligationKey, "datePaiement", e.target.value);
  };

  const handleObservationsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(obligationKey, "observations", e.target.value);
  };

  const handleToggleDetails = () => {
    setShowDetails(!showDetails);
  };

  // Handle expansion click with proper event stopping
  const handleExpandClick = (e: React.MouseEvent) => {
    console.log("Expansion button clicked");
    e.preventDefault();
    e.stopPropagation();
    if (onToggleExpand) {
      onToggleExpand();
    }
  };

  return (
    <div className="border p-4 rounded-md bg-background">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Checkbox 
            id={`${obligationKey}-assujetti`}
            checked={Boolean(status?.assujetti)}
            onCheckedChange={handleAssujettiChange}
          />
          <label
            htmlFor={`${obligationKey}-assujetti`}
            className="font-medium cursor-pointer"
          >
            {label}
          </label>
        </div>
        
        {status?.assujetti && onToggleExpand && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleExpandClick}
            className="h-8 w-8 p-0"
            type="button"
            aria-label={expanded ? "Réduire" : "Développer"}
          >
            {expanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        )}
        
        {status?.assujetti && !onToggleExpand && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleToggleDetails}
            className="h-8 w-8 p-0"
            type="button"
            aria-label={showDetails ? "Réduire" : "Développer"}
          >
            {showDetails ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        )}
      </div>
      
      {status?.assujetti && (
        <div className="mt-4 pl-6 space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id={`${obligationKey}-paye`}
              checked={Boolean(status?.paye)}
              onCheckedChange={handlePayeChange}
            />
            <label
              htmlFor={`${obligationKey}-paye`}
              className="text-sm cursor-pointer"
            >
              Payé
            </label>
          </div>
          
          {(showDetails || expanded) && (
            <>
              <div className="space-y-1.5">
                <Label htmlFor={`${obligationKey}-montant`} className="text-sm">
                  Montant
                </Label>
                <Input
                  id={`${obligationKey}-montant`}
                  type="number"
                  placeholder="0"
                  value={status?.montant || ''}
                  onChange={handleMontantChange}
                  className="max-w-[200px]"
                />
              </div>

              {status?.paye && (
                <div className="space-y-1.5">
                  <Label htmlFor={`${obligationKey}-date`} className="text-sm">
                    Date de paiement
                  </Label>
                  <Input
                    id={`${obligationKey}-date`}
                    type="date"
                    value={status?.datePaiement || ""}
                    onChange={handleDateChange}
                    className="max-w-[200px]"
                  />
                </div>
              )}
              
              <div className="space-y-1.5">
                <Label htmlFor={`${obligationKey}-observations`} className="text-sm">
                  Observations
                </Label>
                <Textarea
                  id={`${obligationKey}-observations`}
                  value={status?.observations || ""}
                  onChange={handleObservationsChange}
                  placeholder="Ajoutez des observations concernant cette obligation..."
                  className="h-20"
                />
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};
