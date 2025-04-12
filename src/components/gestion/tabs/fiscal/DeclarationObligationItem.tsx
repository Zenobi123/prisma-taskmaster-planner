
import React from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { DeclarationObligationStatus } from "@/hooks/fiscal/types";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";

export interface DeclarationObligationItemProps {
  id: string;
  title: string;
  status: DeclarationObligationStatus;
  onStatusChange: (status: DeclarationObligationStatus) => void;
  tooltip?: string;
}

export const DeclarationObligationItem = ({
  id,
  title,
  status,
  onStatusChange,
  tooltip
}: DeclarationObligationItemProps) => {
  // Create a default status if it's undefined
  const safeStatus: DeclarationObligationStatus = status || { assujetti: false, depose: false };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
      <div className="flex flex-col">
        <div className="flex items-center mb-1">
          <Label htmlFor={`${id}-assujetti`}>{title}</Label>
          {tooltip && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-4 w-4 ml-1 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs text-sm">{tooltip}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id={`${id}-assujetti`}
            checked={safeStatus.assujetti}
            onCheckedChange={(checked) => onStatusChange({ ...safeStatus, assujetti: checked })}
          />
          <Label htmlFor={`${id}-assujetti`}>
            {safeStatus.assujetti ? 'Assujetti' : 'Non assujetti'}
          </Label>
        </div>
      </div>
      
      {safeStatus.assujetti && (
        <>
          <div className="flex items-center space-x-2">
            <Switch
              id={`${id}-depose`}
              checked={safeStatus.depose}
              onCheckedChange={(checked) => onStatusChange({ ...safeStatus, depose: checked })}
            />
            <Label htmlFor={`${id}-depose`}>
              {safeStatus.depose ? 'Déposé' : 'Non déposé'}
            </Label>
          </div>
          
          <div className="flex space-x-2">
            <Input
              type="date"
              placeholder="Date de dépôt"
              className="flex-1"
              disabled={!safeStatus.depose}
            />
            <Input
              placeholder="Réf. dépôt"
              className="flex-1"
              disabled={!safeStatus.depose}
            />
          </div>
        </>
      )}
    </div>
  );
};
