
import React from "react";
import { Client } from "@/types/client";
import { useObligationsFiscales } from "@/hooks/fiscal/useObligationsFiscales";
import { FiscalAttestationSection } from "./fiscal/FiscalAttestationSection";
import { DirectTaxesSection } from "./fiscal/DirectTaxesSection";
import { AnnualObligationsSection } from "./fiscal/AnnualObligationsSection";
import { MonthlyObligationsSection } from "./fiscal/MonthlyObligationsSection";
import { YearSelector } from "./fiscal/YearSelector";
import { SaveButton } from "./fiscal/SaveButton";
import { UnsavedChangesAlert } from "./fiscal/UnsavedChangesAlert";

interface ObligationsFiscalesProps {
  selectedClient: Client;
}

export const ObligationsFiscales: React.FC<ObligationsFiscalesProps> = ({ selectedClient }) => {
  const {
    creationDate,
    validityEndDate,
    showInAlert,
    obligationStatuses,
    setCreationDate,
    setValidityEndDate,
    handleStatusChange,
    handleAttachmentUpdate,
    handleSave,
    isLoading,
    dataLoaded,
    isSaving,
    handleToggleAlert,
    hiddenFromDashboard,
    handleToggleDashboardVisibility,
    hasUnsavedChanges,
    selectedYear,
    setSelectedYear,
    isDeclarationObligation,
    isTaxObligation,
  } = useObligationsFiscales(selectedClient);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
          <div className="space-y-4">
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-48 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!dataLoaded) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <p className="text-gray-500">Erreur lors du chargement des données fiscales</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header et sélecteur d'année */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Obligations fiscales</h1>
          <p className="text-sm text-gray-500">Suivi des obligations fiscales de l'entreprise</p>
        </div>
        <YearSelector
          selectedYear={selectedYear}
          onYearChange={setSelectedYear}
        />
      </div>

      {/* Alerte modifications non enregistrées */}
      <UnsavedChangesAlert hasUnsavedChanges={hasUnsavedChanges} />

      {/* Section Attestation de Conformité Fiscale */}
      <FiscalAttestationSection
        creationDate={creationDate}
        validityEndDate={validityEndDate}
        setCreationDate={setCreationDate}
        setValidityEndDate={setValidityEndDate}
        showInAlert={showInAlert}
        onToggleAlert={handleToggleAlert}
        hiddenFromDashboard={hiddenFromDashboard}
        onToggleDashboardVisibility={handleToggleDashboardVisibility}
      />

      {/* Section des Impôts Directs */}
      <DirectTaxesSection 
        clientId={selectedClient.id}
        selectedYear={selectedYear}
        obligationStatuses={obligationStatuses}
        handleStatusChange={handleStatusChange}
        handleAttachmentChange={handleAttachmentUpdate}
        isTaxObligation={isTaxObligation}
      />

      {/* Section des Obligations Annuelles */}
      <AnnualObligationsSection
        clientId={selectedClient.id}
        selectedYear={selectedYear}
        obligationStatuses={obligationStatuses}
        handleStatusChange={handleStatusChange}
        handleAttachmentChange={handleAttachmentUpdate}
        isDeclarationObligation={isDeclarationObligation}
      />

      {/* Section des Obligations Mensuelles */}
      <MonthlyObligationsSection
        clientId={selectedClient.id}
        selectedYear={selectedYear}
        obligationStatuses={obligationStatuses}
        handleStatusChange={handleStatusChange}
        handleAttachmentChange={handleAttachmentUpdate}
        isDeclarationObligation={isDeclarationObligation}
      />

      {/* Bouton d'enregistrement */}
      <SaveButton
        hasUnsavedChanges={hasUnsavedChanges}
        isSaving={isSaving}
        onSave={handleSave}
      />
    </div>
  );
};

export default ObligationsFiscales;
