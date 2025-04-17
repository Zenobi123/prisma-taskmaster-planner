
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { TaxObligationItem } from "./TaxObligationItem";
import { DeclarationObligationItem } from "./DeclarationObligationItem";
import { ObligationStatuses } from "@/hooks/fiscal/types";

interface AnnualObligationsSectionProps {
  obligationStatuses: ObligationStatuses;
  handleStatusChange: (type: string, field: string, value: boolean) => void;
}

export function AnnualObligationsSection({ 
  obligationStatuses,
  handleStatusChange
}: AnnualObligationsSectionProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Obligations fiscales annuelles</h3>
          
          <div className="space-y-6">
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-muted-foreground">Impôts et taxes</h4>
              <div className="space-y-2">
                <TaxObligationItem
                  label="Patente"
                  status={obligationStatuses.patente}
                  onChange={(field, value) => handleStatusChange("patente", field, value)}
                />
                <TaxObligationItem
                  label="IGS"
                  status={obligationStatuses.igs}
                  onChange={(field, value) => handleStatusChange("igs", field, value)}
                />
                <TaxObligationItem
                  label="Bail"
                  status={obligationStatuses.bail}
                  onChange={(field, value) => handleStatusChange("bail", field, value)}
                />
                <TaxObligationItem
                  label="Taxe foncière"
                  status={obligationStatuses.taxeFonciere}
                  onChange={(field, value) => handleStatusChange("taxeFonciere", field, value)}
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-muted-foreground">Déclarations</h4>
              <div className="space-y-2">
                <DeclarationObligationItem
                  label="DSF"
                  status={obligationStatuses.dsf}
                  onChange={(field, value) => handleStatusChange("dsf", field, value)}
                />
                <DeclarationObligationItem
                  label="DARP"
                  status={obligationStatuses.darp}
                  onChange={(field, value) => handleStatusChange("darp", field, value)}
                />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
