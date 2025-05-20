
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { FiscalAttestationSection } from "./fiscal/FiscalAttestationSection";
import { AnnualObligationsSection } from "./fiscal/AnnualObligationsSection";
import { useObligationsFiscales } from "@/hooks/fiscal/useObligationsFiscales";
import { Client } from "@/types/client";
import { Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export type { ObligationType, TaxObligationStatus, DeclarationObligationStatus, ObligationStatus, ObligationStatuses, DeclarationPeriodicity } from "@/hooks/fiscal/types";

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
    showInAlert,
    handleToggleAlert,
    hiddenFromDashboard,
    handleToggleDashboardVisibility,
    hasUnsavedChanges,
    selectedYear,
    setSelectedYear,
    isDeclarationObligation
  } = useObligationsFiscales(selectedClient);

  // Generate year options for the last 5 years and next 2 years
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 7 }, (_, i) => (currentYear - 4 + i).toString());
  
  // Function for manual save only
  const handleManualSave = async () => {
    await handleSave();
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
          <div className="p-4 border rounded-md bg-amber-50 border-amber-200 text-amber-800">
            Vous avez des modifications non enregistrées. Utilisez le bouton d'enregistrement ci-dessous pour les sauvegarder.
          </div>
        )}
        
        <FiscalAttestationSection 
          creationDate={creationDate}
          validityEndDate={validityEndDate}
          setCreationDate={setCreationDate}
          showInAlert={showInAlert}
          onToggleAlert={() => handleToggleAlert()}
          hiddenFromDashboard={hiddenFromDashboard}
          onToggleDashboardVisibility={(value: boolean) => handleToggleDashboardVisibility(value)}
        />
        
        <AnnualObligationsSection 
          obligationStatuses={obligationStatuses}
          handleStatusChange={handleStatusChange}
          handleAttachmentChange={handleAttachmentUpdate}
          clientId={selectedClient.id}
          selectedYear={selectedYear}
          isDeclarationObligation={isDeclarationObligation}
        />
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <Button 
          onClick={handleManualSave}
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
              Enregistrer
            </>
          )}
        </Button>
        
        <div className="text-xs text-muted-foreground text-center w-full">
          Les données ne sont enregistrées que lorsque vous cliquez sur le bouton "Enregistrer".
        </div>
      </CardFooter>
    </Card>
  );
}
