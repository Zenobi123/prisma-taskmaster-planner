
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { DeclarationObligationItem } from "./DeclarationObligationItem";
import { TaxObligationItem } from "./TaxObligationItem";
import { ObligationStatuses } from "@/hooks/fiscal/types";

export interface AnnualObligationsSectionProps {
  obligationStatuses: ObligationStatuses;
  handleStatusChange: (
    obligationType: keyof ObligationStatuses,
    status: any
  ) => void;
}

export const AnnualObligationsSection = ({
  obligationStatuses,
  handleStatusChange
}: AnnualObligationsSectionProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Obligations annuelles</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <TaxObligationItem
          id="taxeFonciere"
          title="Taxe Foncière"
          status={obligationStatuses.taxeFonciere}
          onStatusChange={(status) => handleStatusChange('taxeFonciere', status)}
        />

        <Separator />

        <TaxObligationItem
          id="bail"
          title="Bail"
          status={obligationStatuses.bail}
          onStatusChange={(status) => handleStatusChange('bail', status)}
        />

        <Separator />

        <DeclarationObligationItem
          id="dsf"
          title="DSF (Déclaration Statistique et Fiscale)"
          status={obligationStatuses.dsf}
          onStatusChange={(status) => handleStatusChange('dsf', status)}
        />

        <Separator />

        <DeclarationObligationItem
          id="darp"
          title="DARP (Déclaration Annuelle des Revenus Professionnels)"
          status={obligationStatuses.darp}
          onStatusChange={(status) => handleStatusChange('darp', status)}
        />
      </CardContent>
    </Card>
  );
};
