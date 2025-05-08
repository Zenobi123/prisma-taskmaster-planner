
import React, { useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { FiscalAttestationSection } from "./fiscal/FiscalAttestationSection";
import { AnnualObligationsSection } from "./fiscal/AnnualObligationsSection";
import { useObligationsFiscales } from "@/hooks/fiscal/useObligationsFiscales";
import { Client } from "@/types/client";
import { Loader2, Save, AlertCircle, RefreshCw, CheckCircle2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

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
    handleAttachmentUpdate,
    handleSave,
    isLoading,
    dataLoaded,
    isSaving,
    saveAttempts,
    showInAlert,
    handleToggleAlert,
    hiddenFromDashboard,
    handleToggleDashboardVisibility,
    lastSaveSuccess,
    hasUnsavedChanges,
    selectedYear,
    setSelectedYear
  } = useObligationsFiscales(selectedClient);

  // Generate year options for the last 5 years and next 2 years
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 7 }, (_, i) => (currentYear - 4 + i).toString());

  // Function to handle page refresh
  const handleRefreshPage = () => {
    window.location.reload();
  };

  // Auto-save visual indicator
  useEffect(() => {
    if (hasUnsavedChanges && !isSaving) {
      const saveTimeout = setTimeout(() => {
        if (hasUnsavedChanges && !isSaving) {
          handleSave();
        }
      }, 120000); // 2 minutes
      
      return () => clearTimeout(saveTimeout);
    }
  }, [hasUnsavedChanges, isSaving, handleSave]);

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
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Obligations fiscales</CardTitle>
            <CardDescription>
              Suivi des obligations fiscales de l'entreprise
            </CardDescription>
          </div>
          
          <div className="flex items-center space-x-2">
            <Label htmlFor="year-select" className="text-sm font-medium">
              Année fiscale:
            </Label>
            <Select
              value={selectedYear}
              onValueChange={setSelectedYear}
            >
              <SelectTrigger className="w-[120px]" id="year-select">
                <SelectValue placeholder="Année" />
              </SelectTrigger>
              <SelectContent>
                {yearOptions.map(year => (
                  <SelectItem key={year} value={year}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {hasUnsavedChanges && (
          <Alert className="bg-amber-50 border-amber-200">
            <Clock className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800">
              Vous avez des modifications non enregistrées. Enregistrez avant de quitter cette page.
            </AlertDescription>
          </Alert>
        )}
        
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
          onAttachmentChange={handleAttachmentUpdate}
          clientId={selectedClient.id}
          selectedYear={selectedYear}
        />
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <Button 
          onClick={handleSave}
          className={`w-full ${hasUnsavedChanges ? "bg-primary" : ""}`}
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
              {hasUnsavedChanges ? "Enregistrer les modifications" : "Enregistrer toutes les modifications"}
            </>
          )}
        </Button>
        
        <div className="text-xs text-muted-foreground text-center w-full">
          Vos modifications sont enregistrées automatiquement tous les 2 minutes et lors de la fermeture de la page.
        </div>
      </CardFooter>
    </Card>
  );
}
