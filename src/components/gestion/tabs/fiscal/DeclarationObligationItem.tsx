
import React from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { DeclarationObligationStatus } from "@/hooks/fiscal/types";

export interface DeclarationObligationItemProps {
  id: string;
  title: string;
  status: DeclarationObligationStatus;
  onStatusChange: (status: DeclarationObligationStatus) => void;
}

export const DeclarationObligationItem = ({
  id,
  title,
  status,
  onStatusChange
}: DeclarationObligationItemProps) => {
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
              id={`${id}-depose`}
              checked={status.depose}
              onCheckedChange={(checked) => onStatusChange({ ...status, depose: checked })}
            />
            <Label htmlFor={`${id}-depose`}>
              {status.depose ? 'Déposé' : 'Non déposé'}
            </Label>
          </div>
          
          <div className="flex space-x-2">
            <Input
              type="date"
              placeholder="Date de dépôt"
              className="flex-1"
              disabled={!status.depose}
            />
            <Input
              placeholder="Numéro d'accusé"
              className="flex-1"
              disabled={!status.depose}
            />
          </div>
        </>
      )}
    </div>
  );
};
