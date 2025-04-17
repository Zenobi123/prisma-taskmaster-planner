
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { FiscalAttestationSection } from "./fiscal/FiscalAttestationSection";
import { AnnualObligationsSection } from "./fiscal/AnnualObligationsSection";
import { useObligationsFiscales } from "@/hooks/fiscal/useObligationsFiscales";
import { Client } from "@/types/client";
import { Loader2, Save, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

export type { ObligationType, TaxObligationStatus, DeclarationObligationStatus, ObligationStatus, ObligationStatuses } from "@/hooks/fiscal/types";

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
    isSaving,
    saveAttempts,
    showInAlert,
    handleToggleAlert,
    hiddenFromDashboard,
    handleToggleDashboardVisibility,
    igsData,
    handleIGSDataChange
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
        {saveAttempts > 0 && saveAttempts % 3 === 0 && (
          <Alert className="bg-yellow-50 border-yellow-200">
            <AlertCircle className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-800">
              Si vous rencontrez des problèmes lors de l'enregistrement, veuillez actualiser la page après avoir sauvegardé.
            </AlertDescription>
          </Alert>
        )}
        
        <FiscalAttestationSection 
          creationDate={creationDate}
          validityEndDate={validityEndDate}
          setCreationDate={setCreationDate}
          showInAlert={showInAlert}
          onToggleAlert={handleToggleAlert}
          hiddenFromDashboard={hiddenFromDashboard}
          onToggleDashboardVisibility={handleToggleDashboardVisibility}
        />
        
        <AnnualObligationsSection 
          obligationStatuses={obligationStatuses}
          handleStatusChange={handleStatusChange}
          igsData={igsData}
          onIGSDataChange={handleIGSDataChange}
        />
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <Button 
          onClick={handleSave}
          className="w-full"
          disabled={isSaving}
        >
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Enregistrement en cours...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Enregistrer toutes les modifications
            </>
          )}
        </Button>
        
        <div className="text-xs text-muted-foreground text-center w-full">
          Pour voir les changements dans le tableau de bord, vous devrez peut-être actualiser la page après l'enregistrement.
        </div>
      </CardFooter>
    </Card>
  );
}
