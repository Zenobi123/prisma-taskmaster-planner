
import React from "react";
import { Switch } from "@/components/ui/switch";
import { ObligationType } from "@/hooks/fiscal/types";
import { Label } from "@/components/ui/label";

interface TaxObligationItemProps {
  title: string;
  deadline: string;
  obligationType: ObligationType;
  status: { 
    assujetti: boolean;
    paye?: boolean;
  };
  onChange: (
    obligationType: ObligationType, 
    statusType: "assujetti" | "paye", 
    value: boolean
  ) => void;
}

export function TaxObligationItem({
  title,
  deadline,
  obligationType,
  status,
  onChange
}: TaxObligationItemProps) {
  return (
    <div className="flex items-center justify-between p-4 border rounded-lg bg-white">
      <div>
        <h4 className="font-semibold">{title}</h4>
        <p className="text-sm text-muted-foreground">
          Date limite de paiement : {deadline}
        </p>
      </div>
      <div className="flex items-center gap-6">
        <div className="flex items-center space-x-2">
          <Switch
            id={`${obligationType}-assujetti`}
            checked={status.assujetti}
            onCheckedChange={(checked) => 
              onChange(obligationType, "assujetti", checked)
            }
          />
          <Label htmlFor={`${obligationType}-assujetti`} className="text-sm font-medium">
            Assujetti
          </Label>
        </div>
        
        {status.assujetti && (
          <div className="flex items-center space-x-2">
            <Switch
              id={`${obligationType}-paye`}
              checked={status.paye || false}
              onCheckedChange={(checked) => 
                onChange(obligationType, "paye", checked)
              }
            />
            <Label htmlFor={`${obligationType}-paye`} className="text-sm font-medium">
              Payé
            </Label>
          </div>
        )}
      </div>
    </div>
  );
}
