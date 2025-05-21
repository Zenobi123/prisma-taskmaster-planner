
import React, { useCallback } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";

interface ObligationHeaderProps {
  title: string;
  keyName: string;
  isAssujetti: boolean;
  expanded: boolean;
  onAssujettiChange: (checked: boolean) => void;
  toggleExpand: () => void;
}

export const ObligationHeader: React.FC<ObligationHeaderProps> = ({
  title,
  keyName,
  isAssujetti,
  expanded,
  onAssujettiChange,
  toggleExpand
}) => {
  // Fonction pour arrêter la propagation des événements
  const stopPropagation = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
  }, []);

  return (
    <div className="flex items-center justify-between" onClick={stopPropagation}>
      <div className="flex items-center space-x-3">
        <Switch
          id={`${keyName}-assujetti`}
          checked={isAssujetti}
          onCheckedChange={onAssujettiChange}
          className="cursor-pointer"
          onClick={stopPropagation}
        />
        <Label 
          htmlFor={`${keyName}-assujetti`} 
          className="cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            onAssujettiChange(!isAssujetti);
          }}
        >
          {title}
        </Label>
      </div>
      {isAssujetti && (
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={(e) => {
            e.stopPropagation();
            toggleExpand();
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
