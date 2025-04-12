
import React from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { TaxObligationStatus } from "@/hooks/fiscal/types";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";

export interface TaxObligationItemProps {
  id: string;
  title: string;
  status: TaxObligationStatus;
  onStatusChange: (status: TaxObligationStatus) => void;
  tooltip?: string;
}

export const TaxObligationItem = ({
  id,
  title,
  status,
  onStatusChange,
  tooltip
}: TaxObligationItemProps) => {
  // Create a default status if it's undefined
  const safeStatus: TaxObligationStatus = status || { assujetti: false, paye: false };
  
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
              id={`${id}-paye`}
              checked={safeStatus.paye}
              onCheckedChange={(checked) => onStatusChange({ ...safeStatus, paye: checked })}
            />
            <Label htmlFor={`${id}-paye`}>
              {safeStatus.paye ? 'Payé' : 'Non payé'}
            </Label>
          </div>
          
          <div className="flex space-x-2">
            <Input
              type="date"
              placeholder="Date de paiement"
              className="flex-1"
              disabled={!safeStatus.paye}
            />
            <Input
              placeholder="Réf. quittance"
              className="flex-1"
              disabled={!safeStatus.paye}
            />
          </div>
        </>
      )}
    </div>
  );
};
