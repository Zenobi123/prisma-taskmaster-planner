
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import DatePickerSelector from './fiscal/DatePickerSelector';
import { TaxObligationItem } from './fiscal/TaxObligationItem';
import { DeclarationObligationItem } from './fiscal/DeclarationObligationItem';
import { FiscalAttestationSection } from './fiscal/FiscalAttestationSection';
import { FiscalBulkUpdateButton } from './fiscal/FiscalBulkUpdateButton';
import { IgsDetailPanel } from './fiscal/IgsDetailPanel';
import { Separator } from "@/components/ui/separator";
import { AlertTriangle, Save, CheckCircle, RefreshCcw } from "lucide-react";
import { useObligationsFiscales } from '@/hooks/fiscal/useObligationsFiscales';
import { useBulkFiscalUpdate } from '@/hooks/fiscal/useBulkFiscalUpdate';
import { Client } from '@/types/client';
import { TaxObligationStatus, DeclarationObligationStatus, ClientFiscalData } from '@/hooks/fiscal/types';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface ObligationsFiscalesProps {
  selectedClient: Client;
}

export function ObligationsFiscales({ selectedClient }: ObligationsFiscalesProps) {
  const [igsDetailsOpen, setIgsDetailsOpen] = useState(false);
  
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

  const handleToggleIgsDetails = () => {
    setIgsDetailsOpen(!igsDetailsOpen);
  };

  const handleBulkUpdate = async () => {
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
      
      // Use the appropriate function from the hook
      await bulkUpdateHook.updateClientsfiscalData([selectedClient]);
    }
  };

  const handleSaveButtonClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
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
          <div className="flex items-center justify-center h-64">
            <div className="flex flex-col items-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              <p className="text-sm text-muted-foreground">Chargement des données fiscales...</p>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Attestation de Situation Fiscale</h3>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="alert-toggle"
                    checked={showInAlert}
                    onCheckedChange={handleToggleAlert}
                  />
                  <Label htmlFor="alert-toggle" className="text-sm">Afficher dans les alertes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="dashboard-toggle"
                    checked={!hiddenFromDashboard}
                    onCheckedChange={handleToggleDashboardVisibility}
                  />
                  <Label htmlFor="dashboard-toggle" className="text-sm">Visible au tableau de bord</Label>
                </div>
              </div>
            </div>

            <FiscalAttestationSection 
              creationDate={creationDate}
              validityEndDate={validityEndDate}
              setCreationDate={setCreationDate}
              showInAlert={showInAlert}
              onToggleAlert={handleToggleAlert}
              hiddenFromDashboard={hiddenFromDashboard}
              onToggleDashboardVisibility={handleToggleDashboardVisibility}
            />

            <Separator className="my-6" />

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Obligations annuelles</h3>
                <FiscalBulkUpdateButton 
                  isLoading={bulkUpdateHook.isUpdating} 
                  onClick={handleBulkUpdate} 
                />
              </div>
              
              {obligationStatuses && (
                <div className="space-y-4 mt-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <h4 className="font-medium mb-2">Impôts</h4>
                      <div className="space-y-3">
                        <TaxObligationItem
                          label="Impôt Global sur les Revenus et IGS"
                          status={obligationStatuses.igs as TaxObligationStatus}
                          onStatusChange={(field, value) => handleStatusChange('igs', field, value)}
                          showDetails={igsDetailsOpen}
                          onToggleDetails={handleToggleIgsDetails}
                        />
                        <TaxObligationItem
                          label="Patente"
                          status={obligationStatuses.patente as TaxObligationStatus}
                          onStatusChange={(field, value) => handleStatusChange('patente', field, value)}
                        />
                        <TaxObligationItem
                          label="Impôts sur les Bénéfices (BAIC)"
                          status={obligationStatuses.baic as TaxObligationStatus}
                          onStatusChange={(field, value) => handleStatusChange('baic', field, value)}
                        />
                        <TaxObligationItem
                          label="Impôts sur Traitements et Salaires"
                          status={obligationStatuses.its as TaxObligationStatus}
                          onStatusChange={(field, value) => handleStatusChange('its', field, value)}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Déclarations</h4>
                      <div className="space-y-3">
                        <DeclarationObligationItem
                          label="Déclaration Statistique et Fiscale (DSF)"
                          status={obligationStatuses.dsf as DeclarationObligationStatus}
                          onStatusChange={(field, value) => handleStatusChange('dsf', field, value)}
                        />
                        <DeclarationObligationItem
                          label="DARP (Déclaration Annuelle des Retenues à la Source)"
                          status={obligationStatuses.darp as DeclarationObligationStatus}
                          onStatusChange={(field, value) => handleStatusChange('darp', field, value)}
                        />
                        <DeclarationObligationItem
                          label="Licence"
                          status={obligationStatuses.licence as DeclarationObligationStatus}
                          onStatusChange={(field, value) => handleStatusChange('licence', field, value)}
                        />
                      </div>
                    </div>
                  </div>
                  
                  {igsDetailsOpen && (
                    <IgsDetailPanel 
                      taxStatus={obligationStatuses.igs as TaxObligationStatus} 
                      onStatusChange={(field, value) => handleStatusChange('igs', field, value)}
                    />
                  )}
                </div>
              )}
            </div>

            {saveAttempts > 0 && (
              <div className={`mt-4 p-4 rounded-md flex items-center ${lastSaveSuccess ? 'bg-green-50' : 'bg-amber-50'}`}>
                {lastSaveSuccess ? (
                  <>
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                    <p className="text-sm text-green-700">
                      Les modifications ont été enregistrées avec succès à {new Date().toLocaleString('fr-FR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}.
                    </p>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="h-5 w-5 text-amber-600 mr-2" />
                    <p className="text-sm text-amber-700">
                      Erreur lors de l'enregistrement des modifications. Veuillez réessayer.
                    </p>
                  </>
                )}
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
