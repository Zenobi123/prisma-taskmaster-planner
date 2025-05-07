
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCcw, Save } from "lucide-react";
import { useObligationsFiscales } from '@/hooks/fiscal/useObligationsFiscales';
import { useBulkFiscalUpdate } from '@/hooks/fiscal/useBulkFiscalUpdate';
import { Client } from '@/types/client';
import { ClientFiscalData } from '@/hooks/fiscal/types';
import { LoadingIndicator } from './fiscal/components/LoadingIndicator';
import { FiscalAttestationCard } from './fiscal/components/FiscalAttestationCard';
import { FiscalObligationsSection } from './fiscal/components/FiscalObligationsSection';
import { SaveStatusMessage } from './fiscal/components/SaveStatusMessage';

interface ObligationsFiscalesProps {
  selectedClient: Client;
}

export function ObligationsFiscales({ selectedClient }: ObligationsFiscalesProps) {
  const {
    creationDate, 
    setCreationDate,
    validityEndDate,
    setValidityEndDate,
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
    lastSaveSuccess,
    hasUnsavedChanges,
    loadFiscalData
  } = useObligationsFiscales(selectedClient);

  // Use the useBulkFiscalUpdate hook correctly
  const bulkUpdateHook = useBulkFiscalUpdate(selectedClient?.id);

  const handleBulkUpdate = async () => {
    if (obligationStatuses) {
      await bulkUpdateHook.updateClientsfiscalData([selectedClient]);
    }
  };

  const handleSaveButtonClick = async () => {
    if (obligationStatuses) {
      const fiscalData: ClientFiscalData = {
        attestation: {
          creationDate,
          validityEndDate,
          showInAlert
        },
        obligations: obligationStatuses,
        hiddenFromDashboard
      };
      
      await handleSave(fiscalData);
    }
  };

  const refreshData = () => {
    loadFiscalData(true);
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
        <div>
          <CardTitle>Obligations Fiscales</CardTitle>
          <CardDescription>
            Suivi et gestion des obligations fiscales pour {selectedClient?.nom || selectedClient?.raisonsociale}
          </CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={refreshData} disabled={isLoading}>
            <RefreshCcw className="mr-2 h-4 w-4" />
            Actualiser
          </Button>
          <Button 
            onClick={handleSaveButtonClick} 
            disabled={isSaving || isLoading || !hasUnsavedChanges}
          >
            <Save className="mr-2 h-4 w-4" />
            Enregistrer
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {isLoading ? (
          <LoadingIndicator />
        ) : (
          <>
            <FiscalAttestationCard 
              creationDate={creationDate}
              validityEndDate={validityEndDate}
              setCreationDate={setCreationDate}
              setValidityEndDate={setValidityEndDate}
              showInAlert={showInAlert}
              hiddenFromDashboard={hiddenFromDashboard}
              onToggleAlert={handleToggleAlert}
              onToggleDashboardVisibility={handleToggleDashboardVisibility}
            />

            {obligationStatuses && (
              <FiscalObligationsSection 
                obligationStatuses={obligationStatuses}
                handleStatusChange={handleStatusChange}
                onBulkUpdate={handleBulkUpdate}
                isUpdating={bulkUpdateHook.isUpdating}
              />
            )}

            <SaveStatusMessage 
              saveAttempts={saveAttempts}
              lastSaveSuccess={lastSaveSuccess}
            />
          </>
        )}
      </CardContent>
    </Card>
  );
}
