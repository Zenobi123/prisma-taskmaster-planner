
import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { DeclarationPeriodicity } from "@/hooks/fiscal/types";

interface DeclarationHeaderProps {
  title: string;
  keyName: string;
  isAssujetti: boolean;
  expanded: boolean;
  periodicity: DeclarationPeriodicity;
  onAssujettiChange: (checked: boolean | "indeterminate") => void;
  onToggleExpand: () => void;
}

export const DeclarationHeader: React.FC<DeclarationHeaderProps> = ({
  title,
  keyName,
  isAssujetti,
  expanded,
  periodicity,
  onAssujettiChange,
  onToggleExpand
}) => {
  const handleCheckboxClick = (e: React.MouseEvent) => {
    // Empêche la propagation pour éviter les clics multiples
    e.stopPropagation();
  };
  
  const handleLabelClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Inverse manuellement l'état
    onAssujettiChange(!isAssujetti);
  };

  const handleClickContainer = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div className="flex items-center justify-between" onClick={handleClickContainer}>
      <div className="flex items-center space-x-2">
        <Checkbox 
          id={`${keyName}-assujetti`}
          checked={isAssujetti}
          onCheckedChange={onAssujettiChange}
          onClick={handleCheckboxClick}
          className="cursor-pointer"
        />
        <div onClick={handleLabelClick}>
          <label
            htmlFor={`${keyName}-assujetti`}
            className="font-medium cursor-pointer"
          >
            {title}
          </label>
          <Badge 
            variant={periodicity === "mensuelle" ? "outline" : "secondary"} 
            className="ml-2 text-xs"
          >
            {periodicity === "mensuelle" ? "Mensuelle" : "Annuelle"}
          </Badge>
        </div>
      </div>
      
      {isAssujetti && (
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={(e) => {
            e.stopPropagation();
            onToggleExpand();
          }}
          className="h-8 px-2 flex items-center gap-1"
          type="button"
        >
          {expanded ? (
            <>
              Réduire
              <ChevronUp className="h-4 w-4" />
            </>
          ) : (
            <>
              Plus d'options
              <ChevronDown className="h-4 w-4" />
            </>
          )}
        </Button>
      )}
    </div>
  );
};
