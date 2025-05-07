
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Client } from "@/types/client";
import { useObligationsFiscales } from '@/hooks/fiscal/useObligationsFiscales';
import { useBulkFiscalUpdate } from '@/hooks/fiscal/useBulkFiscalUpdate';
import { ClientFiscalData } from '@/hooks/fiscal/types';
import { LoadingIndicator } from './fiscal/components/LoadingIndicator';
import { FiscalAttestationCard } from './fiscal/components/FiscalAttestationCard';
import { FiscalObligationsSection } from './fiscal/components/FiscalObligationsSection';
import { SaveStatusMessage } from './fiscal/components/SaveStatusMessage';
import { ObligationToolbar } from './fiscal/components/ObligationToolbar';

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

  // Use the useBulkFiscalUpdate hook
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
    loadFiscalData();
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
        <ObligationToolbar
          onSave={handleSaveButtonClick}
          onRefresh={refreshData}
          onBulkUpdate={handleBulkUpdate}
          isUpdating={bulkUpdateHook.isUpdating}
          isSaving={isSaving}
          isLoading={isLoading}
          hasUnsavedChanges={hasUnsavedChanges}
        />
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
