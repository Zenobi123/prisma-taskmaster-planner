
import React from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { TaxObligationStatus } from "@/hooks/fiscal/types";

export interface TaxObligationItemProps {
  id: string;
  title: string;
  status: TaxObligationStatus;
  onStatusChange: (status: TaxObligationStatus) => void;
}

export const TaxObligationItem = ({
  id,
  title,
  status,
  onStatusChange
}: TaxObligationItemProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
      <div className="flex flex-col">
        <Label htmlFor={`${id}-assujetti`} className="mb-1">{title}</Label>
        <div className="flex items-center space-x-2">
          <Switch
            id={`${id}-assujetti`}
            checked={status.assujetti}
            onCheckedChange={(checked) => onStatusChange({ ...status, assujetti: checked })}
          />
          <Label htmlFor={`${id}-assujetti`}>
            {status.assujetti ? 'Assujetti' : 'Non assujetti'}
          </Label>
        </div>
      </div>
      
      {status.assujetti && (
        <>
          <div className="flex items-center space-x-2">
            <Switch
              id={`${id}-paye`}
              checked={status.paye}
              onCheckedChange={(checked) => onStatusChange({ ...status, paye: checked })}
            />
            <Label htmlFor={`${id}-paye`}>
              {status.paye ? 'Payé' : 'Non payé'}
            </Label>
          </div>
          
          <div className="flex space-x-2">
            <Input
              type="date"
              placeholder="Date de paiement"
              className="flex-1"
              disabled={!status.paye}
            />
            <Input
              placeholder="Réf. quittance"
              className="flex-1"
              disabled={!status.paye}
            />
          </div>
        </>
      )}
    </div>
  );
};
