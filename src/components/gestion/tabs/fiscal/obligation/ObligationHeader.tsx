
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
    <div className="flex items-start sm:items-center justify-between gap-2" onClick={stopPropagation}>
      <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
        <Switch
          id={`${keyName}-assujetti`}
          checked={isAssujetti}
          onCheckedChange={onAssujettiChange}
          className="cursor-pointer shrink-0"
          onClick={stopPropagation}
        />
        <Label
          htmlFor={`${keyName}-assujetti`}
          className="cursor-pointer text-sm sm:text-base leading-tight"
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
          className="h-7 sm:h-8 px-1.5 sm:px-2 flex items-center gap-1 shrink-0 text-xs sm:text-sm"
          type="button"
        >
          {expanded ? (
            <>
              <span className="hidden sm:inline">Réduire</span>
              <ChevronUp className="h-4 w-4" />
            </>
          ) : (
            <>
              <span className="hidden sm:inline">Plus d'options</span>
              <ChevronDown className="h-4 w-4" />
            </>
          )}
        </Button>
      )}
    </div>
  );
};
