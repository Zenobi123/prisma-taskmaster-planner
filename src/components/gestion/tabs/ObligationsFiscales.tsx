
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Client } from "@/types/client";
import DatePickerSelector from "./fiscal/DatePickerSelector";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { addDays, format, parse, isValid } from "date-fns";
import { fr } from "date-fns/locale";
import { FiscalAttestationSection } from "./fiscal/FiscalAttestationSection";
import { AlertTriangle, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { DirectTaxesSection } from "./fiscal/DirectTaxesSection";
import { DeclarationsSection } from "./fiscal/DeclarationsSection";
import { useObligationsFiscales } from "@/hooks/fiscal/useObligationsFiscales";

interface ObligationsFiscalesProps {
  selectedClient: Client;
}

export const ObligationsFiscales: React.FC<ObligationsFiscalesProps> = ({ selectedClient }) => {
  // Use unified obligations hook
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

  const handleFiscalYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedYear(e.target.value);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center min-h-[200px]">
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
        <div className="flex items-center space-x-2">
          <Label htmlFor="fiscal-year" className="text-sm">Année fiscale:</Label>
          <select 
            id="fiscal-year"
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
            value={selectedYear}
            onChange={handleFiscalYearChange}
          >
            <option value="2025">2025</option>
            <option value="2024">2024</option>
            <option value="2023">2023</option>
          </select>
        </div>
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
        handleAttachmentUpdate={handleAttachmentUpdate}
        clientId={selectedClient.id}
        selectedYear={selectedYear}
      />

      {/* Section des Déclarations */}
      <DeclarationsSection 
        fiscalYear={selectedYear}
        hasUnsavedChanges={hasUnsavedChanges}
        setHasUnsavedChanges={() => {}} // Handled by unified hook
        obligationStatuses={obligationStatuses}
        handleStatusChange={handleStatusChange}
        handleAttachmentUpdate={handleAttachmentUpdate}
        clientId={selectedClient.id}
      />

      {/* Bouton d'enregistrement */}
      <div className="flex justify-end">
        <button 
          className={`px-4 py-2 rounded-md font-medium ${hasUnsavedChanges 
            ? 'bg-primary text-white hover:bg-primary-hover' 
            : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
          disabled={!hasUnsavedChanges || isSaving}
          onClick={handleSave}
        >
          {isSaving ? 'Enregistrement...' : 'Enregistrer les modifications'}
        </button>
      </div>
    </div>
  );
};

export default ObligationsFiscales;
