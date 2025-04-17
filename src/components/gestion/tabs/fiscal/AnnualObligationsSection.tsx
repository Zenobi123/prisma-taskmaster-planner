
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { TaxObligationItem } from "./TaxObligationItem";
import { DeclarationObligationItem } from "./DeclarationObligationItem";
import { ObligationStatuses, ObligationType } from "@/hooks/fiscal/types";

interface AnnualObligationsSectionProps {
  obligationStatuses: ObligationStatuses;
  handleStatusChange: (type: ObligationType, field: string, value: boolean) => void;
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
                  title="Patente"
                  deadline="31 mars"
                  obligationType="patente"
                  status={obligationStatuses.patente}
                  onChange={handleStatusChange}
                />
                <TaxObligationItem
                  title="IGS"
                  deadline="30 juin"
                  obligationType="igs"
                  status={obligationStatuses.igs}
                  onChange={handleStatusChange}
                />
                <TaxObligationItem
                  title="Bail"
                  deadline="31 janvier"
                  obligationType="bail"
                  status={obligationStatuses.bail}
                  onChange={handleStatusChange}
                />
                <TaxObligationItem
                  title="Taxe foncière"
                  deadline="31 décembre"
                  obligationType="taxeFonciere"
                  status={obligationStatuses.taxeFonciere}
                  onChange={handleStatusChange}
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-muted-foreground">Déclarations</h4>
              <div className="space-y-2">
                <DeclarationObligationItem
                  title="DSF"
                  deadline="30 avril"
                  obligationType="dsf"
                  status={obligationStatuses.dsf}
                  onChange={handleStatusChange}
                />
                <DeclarationObligationItem
                  title="DARP"
                  deadline="31 mars"
                  obligationType="darp"
                  status={obligationStatuses.darp}
                  onChange={handleStatusChange}
                />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
