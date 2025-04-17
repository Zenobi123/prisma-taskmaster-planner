
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { FiscalAttestationSection } from "./fiscal/FiscalAttestationSection";
import { AnnualObligationsSection } from "./fiscal/AnnualObligationsSection";
import { useObligationsFiscales } from "@/hooks/fiscal/useObligationsFiscales";
import { Client } from "@/types/client";
import { Loader2, Save, AlertCircle, RefreshCw, CheckCircle2 } from "lucide-react";
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
    dataLoaded,
    isSaving,
    saveAttempts,
    showInAlert,
    handleToggleAlert,
    hiddenFromDashboard,
    handleToggleDashboardVisibility,
    igsData,
    handleIGSDataChange,
    lastSaveSuccess
  } = useObligationsFiscales(selectedClient);

  // Fonction pour gérer le rafraîchissement de la page
  const handleRefreshPage = () => {
    window.location.reload();
  };

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
        {lastSaveSuccess && saveAttempts > 0 && (
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Les modifications ont été enregistrées avec succès.
            </AlertDescription>
          </Alert>
        )}
        
        {!lastSaveSuccess && saveAttempts > 0 && (
          <Alert className={saveAttempts >= 2 ? "bg-amber-50 border-amber-200" : "bg-yellow-50 border-yellow-200"}>
            <AlertCircle className={`h-4 w-4 ${saveAttempts >= 2 ? "text-amber-600" : "text-yellow-600"}`} />
            <AlertDescription className={saveAttempts >= 2 ? "text-amber-800" : "text-yellow-800"}>
              {saveAttempts >= 2 
                ? "Si les données ne sont pas visibles après enregistrement, veuillez actualiser la page." 
                : "Pour voir les changements dans le tableau de bord, actualisez la page après l'enregistrement."}
            </AlertDescription>
            {saveAttempts >= 2 && (
              <Button variant="outline" size="sm" className="ml-auto" onClick={handleRefreshPage}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Actualiser maintenant
              </Button>
            )}
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
          Vos modifications seront enregistrées de façon permanente et visibles dans tout le système après actualisation.
        </div>
      </CardFooter>
    </Card>
  );
}
