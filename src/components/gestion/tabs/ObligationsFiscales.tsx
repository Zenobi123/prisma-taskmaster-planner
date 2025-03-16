
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { FiscalAttestationSection } from "./fiscal/FiscalAttestationSection";
import { AnnualObligationsSection } from "./fiscal/AnnualObligationsSection";
import { useObligationsFiscales } from "./fiscal/hooks/useObligationsFiscales";

export { ObligationType, TaxObligationStatus, DeclarationObligationStatus, ObligationStatus, ObligationStatuses } from "./fiscal/types";

export function ObligationsFiscales() {
  const {
    creationDate,
    setCreationDate,
    validityEndDate,
    obligationStatuses,
    handleStatusChange,
    handleSave
  } = useObligationsFiscales();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Obligations fiscales</CardTitle>
        <CardDescription>
          Suivi des obligations fiscales de l'entreprise
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <FiscalAttestationSection 
          creationDate={creationDate}
          validityEndDate={validityEndDate}
          setCreationDate={setCreationDate}
          handleSave={handleSave}
        />
        
        <AnnualObligationsSection 
          obligationStatuses={obligationStatuses}
          handleStatusChange={handleStatusChange}
        />
      </CardContent>
    </Card>
  );
}
