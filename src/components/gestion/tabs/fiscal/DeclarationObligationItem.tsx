
import React from "react";
import { ObligationType, DeclarationObligationStatus } from "../ObligationsFiscales";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface DeclarationObligationItemProps {
  title: string;
  deadline: string;
  obligationType: Extract<ObligationType, "dsf" | "darp">;
  status: DeclarationObligationStatus;
  onChange: (
    obligationType: ObligationType,
    statusType: "assujetti" | "paye" | "depose",
    value: boolean
  ) => void;
}

export function DeclarationObligationItem({
  title,
  deadline,
  obligationType,
  status,
  onChange
}: DeclarationObligationItemProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col space-y-3">
          <div className="flex justify-between items-center">
            <div>
              <h5 className="font-medium">{title}</h5>
              <p className="text-sm text-gray-500">
                Date limite de dépôt : {deadline}
              </p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 mt-2">
            <div className="flex items-center space-x-2">
              <Switch
                id={`${obligationType}-assujetti`}
                checked={status.assujetti}
                onCheckedChange={(checked) => onChange(obligationType, "assujetti", checked)}
              />
              <Label htmlFor={`${obligationType}-assujetti`}>
                {status.assujetti ? "Assujetti" : "Non assujetti"}
              </Label>
            </div>
            
            {status.assujetti && (
              <div className="flex items-center space-x-2">
                <Switch
                  id={`${obligationType}-depose`}
                  checked={status.depose}
                  onCheckedChange={(checked) => onChange(obligationType, "depose", checked)}
                />
                <Label htmlFor={`${obligationType}-depose`}>
                  {status.depose ? "Déposée" : "Non déposée"}
                </Label>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
