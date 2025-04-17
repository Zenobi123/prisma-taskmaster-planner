
import React from "react";
import { Switch } from "@/components/ui/switch";
import { ObligationType } from "@/hooks/fiscal/types";

interface TaxObligationItemProps {
  title: string;
  deadline: string;
  obligationType: ObligationType;
  status: { assujetti: boolean };
  onChange: (
    obligationType: ObligationType, 
    statusType: "assujetti", 
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
      <div className="flex items-center space-x-2">
        <span className="text-sm font-medium">Assujetti</span>
        <Switch
          checked={status.assujetti}
          onCheckedChange={(checked) => 
            onChange(obligationType, "assujetti", checked)
          }
        />
      </div>
    </div>
  );
}
