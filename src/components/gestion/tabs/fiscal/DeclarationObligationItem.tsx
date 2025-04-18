
import React, { useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { DeclarationObligationStatus } from "@/hooks/fiscal/types";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface DeclarationObligationItemProps {
  label: string;
  status: DeclarationObligationStatus;
  obligationKey: string;
  onChange: (obligation: string, field: string, value: boolean | string) => void;
  expanded?: boolean;
  onToggleExpand?: () => void;
}

export const DeclarationObligationItem: React.FC<DeclarationObligationItemProps> = ({
  label,
  status,
  obligationKey,
  onChange,
  expanded = false,
  onToggleExpand
}) => {
  // Debug the expanded state
  useEffect(() => {
    console.log(`DeclarationObligationItem ${label} expanded state:`, expanded);
  }, [expanded, label]);

  const handleAssujettiChange = (checked: boolean | "indeterminate") => {
    if (typeof checked === "boolean") {
      console.log(`${obligationKey} assujetti change:`, checked);
      onChange(obligationKey, "assujetti", checked);
    }
  };

  const handleDeposeChange = (checked: boolean | "indeterminate") => {
    if (typeof checked === "boolean") {
      console.log(`${obligationKey} depose change:`, checked);
      onChange(obligationKey, "depose", checked);
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(obligationKey, "dateDepot", e.target.value);
  };

  const handleObservationsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(obligationKey, "observations", e.target.value);
  };

  // Handle expansion click with proper event stopping
  const handleExpandClick = (e: React.MouseEvent) => {
    console.log("Expansion button clicked for Declaration item");
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
            checked={status?.assujetti || false}
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
      </div>
      
      {status?.assujetti && (
        <div className="mt-4 pl-6 space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id={`${obligationKey}-depose`}
              checked={status?.depose || false}
              onCheckedChange={handleDeposeChange}
            />
            <label
              htmlFor={`${obligationKey}-depose`}
              className="text-sm cursor-pointer"
            >
              Déposé
            </label>
          </div>
          
          {expanded && (
            <>
              {status?.depose && (
                <div className="space-y-1.5">
                  <Label htmlFor={`${obligationKey}-date`} className="text-sm">
                    Date de dépôt
                  </Label>
                  <Input
                    id={`${obligationKey}-date`}
                    type="date"
                    value={status?.dateDepot || ""}
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
