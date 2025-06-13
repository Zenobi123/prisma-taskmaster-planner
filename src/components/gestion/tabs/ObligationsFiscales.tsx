
import React, { useEffect } from "react";
import { Client } from "@/types/client";
import { FiscalAttestationSection } from "./fiscal/FiscalAttestationSection";
import { DirectTaxesSection } from "./fiscal/DirectTaxesSection";
import { AnnualObligationsSection } from "./fiscal/AnnualObligationsSection";
import { UnsavedChangesAlert } from "./fiscal/UnsavedChangesAlert";
import { SaveButton } from "./fiscal/SaveButton";
import { ObligationsFiscalesHeader } from "./fiscal/ObligationsFiscalesHeader";
import { useObligationsFiscalesState } from "@/hooks/fiscal/useObligationsFiscalesState";
import { useValidityDateCalculation } from "@/hooks/fiscal/useValidityDateCalculation";
import { useObligationStatusHandlers } from "@/hooks/fiscal/useObligationStatusHandlers";
import { useObligationTypes } from "@/hooks/fiscal/hooks/useObligationTypes";
import { useUnifiedFiscalSave } from "@/hooks/fiscal/useUnifiedFiscalSave";

interface ObligationsFiscalesProps {
  selectedClient: Client;
}

export const ObligationsFiscales: React.FC<ObligationsFiscalesProps> = ({ selectedClient }) => {
  const {
    fiscalYear,
    setFiscalYear,
    creationDate,
    setCreationDate,
    validityEndDate,
    setValidityEndDate,
    showInAlert,
    setShowInAlert,
    hiddenFromDashboard,
    setHiddenFromDashboard,
    obligationStatuses,
    setObligationStatuses
  } = useObligationsFiscalesState({ selectedClient });

  const { isDeclarationObligation } = useObligationTypes();

  // Hook unifié de sauvegarde avec auto-save optionnel
  const {
    isSaving,
    hasUnsavedChanges,
    lastSaveTime,
    markAsChanged,
    manualSave,
    cleanup,
    setHasUnsavedChanges
  } = useUnifiedFiscalSave({
    selectedClient,
    fiscalYear,
    creationDate,
    validityEndDate,
    showInAlert,
    hiddenFromDashboard,
    obligationStatuses,
    autoSave: false, // Désactivé par défaut, peut être activé via les paramètres
    autoSaveDelay: 3000
  });

  // Calculate validity end date when creation date changes
  useValidityDateCalculation({
    creationDate,
    setValidityEndDate,
    setHasUnsavedChanges: markAsChanged
  });

  // Status change handlers
  const { handleFiscalYearChange, handleStatusChange, handleAttachmentChange } = useObligationStatusHandlers({
    setObligationStatuses,
    setHasUnsavedChanges: markAsChanged
  });

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFiscalYear(e.target.value);
    handleFiscalYearChange(e);
  };

  // Cleanup à la destruction du composant
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  return (
    <div className="space-y-6">
      {/* Header et sélecteur d'année */}
      <ObligationsFiscalesHeader 
        fiscalYear={fiscalYear}
        onYearChange={handleYearChange}
      />

      {/* Alerte modifications non enregistrées */}
      <UnsavedChangesAlert 
        hasUnsavedChanges={hasUnsavedChanges}
        lastSaveTime={lastSaveTime}
      />

      {/* Section Attestation de Conformité Fiscale */}
      <FiscalAttestationSection
        creationDate={creationDate}
        validityEndDate={validityEndDate}
        setCreationDate={(date) => {
          setCreationDate(date);
          markAsChanged();
        }}
        setValidityEndDate={(date) => {
          setValidityEndDate(date);
          markAsChanged();
        }}
        showInAlert={showInAlert}
        onToggleAlert={() => {
          setShowInAlert(!showInAlert);
          markAsChanged();
        }}
        hiddenFromDashboard={hiddenFromDashboard}
        onToggleDashboardVisibility={(hidden) => {
          setHiddenFromDashboard(hidden);
          markAsChanged();
        }}
      />

      {/* Section des Impôts Directs */}
      <DirectTaxesSection 
        obligationStatuses={obligationStatuses}
        handleStatusChange={(obligation, field, value) => {
          handleStatusChange(obligation, field, value);
          markAsChanged();
        }}
      />

      {/* Section des Obligations Annuelles */}
      <AnnualObligationsSection
        clientId={selectedClient.id}
        selectedYear={fiscalYear}
        selectedClient={selectedClient}
        obligationStatuses={obligationStatuses}
        handleStatusChange={(obligation, field, value) => {
          handleStatusChange(obligation, field, value);
          markAsChanged();
        }}
        handleAttachmentChange={(obligation, attachmentType, filePath) => {
          handleAttachmentChange(obligation, attachmentType, filePath);
          markAsChanged();
        }}
        isDeclarationObligation={isDeclarationObligation}
      />

      {/* Bouton d'enregistrement */}
      <SaveButton 
        hasUnsavedChanges={hasUnsavedChanges}
        isSaving={isSaving}
        onSave={manualSave}
        lastSaveTime={lastSaveTime}
      />
    </div>
  );
};

export default ObligationsFiscales;
