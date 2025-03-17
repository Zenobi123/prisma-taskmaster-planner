
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { FiscalAttestationSection } from "./fiscal/FiscalAttestationSection";
import { AnnualObligationsSection } from "./fiscal/AnnualObligationsSection";
import { useObligationsFiscales } from "./fiscal/hooks/useObligationsFiscales";
import { Client } from "@/types/client";
import { Loader2 } from "lucide-react";

// Properly re-export types with 'export type' syntax to fix the TS1205 error
export type { ObligationType, TaxObligationStatus, DeclarationObligationStatus, ObligationStatus, ObligationStatuses } from "./fiscal/types";

interface ObligationsFiscalesProps {
  selectedClient: Client;
}

export function ObligationsFiscales({ selectedClient }: ObligationsFiscalesProps) {
  const {
    creationDate,
    setCreationDate,
    validityEndDate,
    obligationStatuses,
    handleStatusChange,
    handleSave,
    isLoading,
    showInAlert,
    handleToggleAlert
  } = useObligationsFiscales(selectedClient);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-60">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

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
          showInAlert={showInAlert}
          onToggleAlert={handleToggleAlert}
        />
        
        <AnnualObligationsSection 
          obligationStatuses={obligationStatuses}
          handleStatusChange={handleStatusChange}
        />
      </CardContent>
    </Card>
  );
}
