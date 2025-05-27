
import React from "react";
import { Client } from "@/types/client";
import { useObligationsFiscales } from "@/hooks/fiscal/useObligationsFiscales";
import { FiscalAttestationSection } from "./fiscal/FiscalAttestationSection";
import { DirectTaxesSection } from "./fiscal/DirectTaxesSection";
import { AnnualObligationsSection } from "./fiscal/AnnualObligationsSection";
import { MonthlyObligationsSection } from "./fiscal/MonthlyObligationsSection";
import { FiscalYearSelector } from "./fiscal/FiscalYearSelector";
import { FiscalSaveButton } from "./fiscal/FiscalSaveButton";
import { FiscalTestComponent } from "./fiscal/FiscalTestComponent";
import { AlertTriangle } from "lucide-react";

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
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement des données fiscales...</p>
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
        <FiscalYearSelector 
          selectedYear={selectedYear}
          onYearChange={setSelectedYear}
        />
      </div>

      {/* Alerte modifications non enregistrées */}
      {hasUnsavedChanges && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-md flex items-center space-x-2">
          <AlertTriangle className="h-5 w-5" />
          <span>Vous avez des modifications non enregistrées. Utilisez le bouton d'enregistrement ci-dessous pour les sauvegarder.</span>
        </div>
      )}

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
        obligationStatuses={obligationStatuses}
        handleStatusChange={handleStatusChange}
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

      {/* Composant de test intégré */}
      <FiscalTestComponent selectedClient={selectedClient} />

      {/* Bouton d'enregistrement */}
      <FiscalSaveButton
        hasUnsavedChanges={hasUnsavedChanges}
        isSaving={isSaving}
        onSave={handleSave}
      />
    </div>
  );
};

export default ObligationsFiscales;
