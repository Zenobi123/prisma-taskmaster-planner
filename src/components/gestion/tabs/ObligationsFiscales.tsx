
import React from "react";
import { Client } from "@/types/client";
import { FiscalAttestationSection } from "./fiscal/FiscalAttestationSection";
import { DirectTaxesSection } from "./fiscal/DirectTaxesSection";
import { DeclarationsSection } from "./fiscal/DeclarationsSection";
import { UnsavedChangesAlert } from "./fiscal/UnsavedChangesAlert";
import { SaveButton } from "./fiscal/SaveButton";
import { ObligationsFiscalesHeader } from "./fiscal/ObligationsFiscalesHeader";
import { useObligationsFiscalesState } from "@/hooks/fiscal/useObligationsFiscalesState";
import { useValidityDateCalculation } from "@/hooks/fiscal/useValidityDateCalculation";
import { useFiscalDataSave } from "@/hooks/fiscal/useFiscalDataSave";
import { useObligationStatusHandlers } from "@/hooks/fiscal/useObligationStatusHandlers";

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
    hasUnsavedChanges,
    setHasUnsavedChanges,
    isSaving,
    setIsSaving,
    obligationStatuses,
    setObligationStatuses
  } = useObligationsFiscalesState({ selectedClient });

  // Calculate validity end date when creation date changes
  useValidityDateCalculation({
    creationDate,
    setValidityEndDate,
    setHasUnsavedChanges
  });

  // Save functionality
  const { saveChanges } = useFiscalDataSave({
    selectedClient,
    fiscalYear,
    creationDate,
    validityEndDate,
    showInAlert,
    hiddenFromDashboard,
    obligationStatuses,
    setIsSaving,
    setHasUnsavedChanges
  });

  // Status change handlers
  const { handleFiscalYearChange, handleStatusChange } = useObligationStatusHandlers({
    setObligationStatuses,
    setHasUnsavedChanges
  });

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFiscalYear(e.target.value);
    handleFiscalYearChange(e);
  };

  return (
    <div className="space-y-6">
      {/* Header et sélecteur d'année */}
      <ObligationsFiscalesHeader 
        fiscalYear={fiscalYear}
        onYearChange={handleYearChange}
      />

      {/* Alerte modifications non enregistrées */}
      <UnsavedChangesAlert hasUnsavedChanges={hasUnsavedChanges} />

      {/* Section Attestation de Conformité Fiscale */}
      <FiscalAttestationSection
        creationDate={creationDate}
        validityEndDate={validityEndDate}
        setCreationDate={(date) => {
          setCreationDate(date);
          setHasUnsavedChanges(true);
        }}
        setValidityEndDate={(date) => {
          setValidityEndDate(date);
          setHasUnsavedChanges(true);
        }}
        showInAlert={showInAlert}
        onToggleAlert={() => {
          setShowInAlert(!showInAlert);
          setHasUnsavedChanges(true);
        }}
        hiddenFromDashboard={hiddenFromDashboard}
        onToggleDashboardVisibility={(hidden) => {
          setHiddenFromDashboard(hidden);
          setHasUnsavedChanges(true);
        }}
      />

      {/* Section des Impôts Directs */}
      <DirectTaxesSection 
        obligationStatuses={obligationStatuses}
        handleStatusChange={handleStatusChange}
      />

      {/* Section des Déclarations */}
      <DeclarationsSection 
        fiscalYear={fiscalYear}
        hasUnsavedChanges={hasUnsavedChanges}
        setHasUnsavedChanges={setHasUnsavedChanges}
      />

      {/* Bouton d'enregistrement */}
      <SaveButton 
        hasUnsavedChanges={hasUnsavedChanges}
        isSaving={isSaving}
        onSave={saveChanges}
      />
    </div>
  );
};

export default ObligationsFiscales;
