import React, { useState, useEffect } from "react";
import { Client } from "@/types/client";
import { addDays, format, parse, isValid } from "date-fns";
import { FiscalAttestationSection } from "./fiscal/FiscalAttestationSection";
import { DirectTaxesSection } from "./fiscal/DirectTaxesSection";
import { DeclarationsSection } from "./fiscal/DeclarationsSection";
import { ObligationType } from "@/hooks/fiscal/types";
import { toast } from "sonner";
import { Json } from "@/integrations/supabase/types";
import { supabase } from "@/integrations/supabase/client";
import { useDefaultObligationRules } from "@/hooks/fiscal/useDefaultObligationRules";
import { useFiscalDataLoader } from "@/hooks/fiscal/useFiscalDataLoader";
import { FiscalYearSelector } from "./fiscal/FiscalYearSelector";
import { UnsavedChangesAlert } from "./fiscal/UnsavedChangesAlert";
import { SaveButton } from "./fiscal/SaveButton";
import { invalidateClientsCache } from "@/services/clientService";

interface ObligationsFiscalesProps {
  selectedClient: Client;
}

export const ObligationsFiscales: React.FC<ObligationsFiscalesProps> = ({ selectedClient }) => {
  const [fiscalYear, setFiscalYear] = useState<string>("2025");
  const [creationDate, setCreationDate] = useState<string>("2025-07-01");
  const [validityEndDate, setValidityEndDate] = useState<string>("");
  const [showInAlert, setShowInAlert] = useState<boolean>(true);
  const [hiddenFromDashboard, setHiddenFromDashboard] = useState<boolean>(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  
  const { 
    obligationStatuses, 
    setObligationStatuses, 
    getDefaultObligationStatuses 
  } = useDefaultObligationRules(selectedClient);

  // Load fiscal data
  useFiscalDataLoader({
    selectedClient,
    fiscalYear,
    setCreationDate,
    setValidityEndDate,
    setShowInAlert,
    setHiddenFromDashboard,
    setFiscalYear,
    setObligationStatuses,
    getDefaultObligationStatuses
  });

  // Reset unsaved changes when client changes
  useEffect(() => {
    setHasUnsavedChanges(false);
  }, [selectedClient?.id]);

  // Calculer la date de fin de validité lorsque la date de création change
  useEffect(() => {
    if (!creationDate) return;
    
    try {
      // Conversion de la chaîne de date en objet Date
      let creationDateObj: Date;
      
      // Si la date est au format YYYY-MM-DD
      if (creationDate.includes('-')) {
        creationDateObj = new Date(creationDate);
      } else {
        // Si la date est au format DD/MM/YYYY
        creationDateObj = parse(creationDate, 'dd/MM/yyyy', new Date());
      }
      
      // Vérification que la date est valide
      if (isValid(creationDateObj)) {
        // Ajout de 90 jours pour la date de fin de validité
        const endDateObj = addDays(creationDateObj, 90);
        
        // Formatage de la date en chaîne au format YYYY-MM-DD
        const formattedEndDate = format(endDateObj, "yyyy-MM-dd");
        
        setValidityEndDate(formattedEndDate);
        setHasUnsavedChanges(true);
      }
    } catch (error) {
      console.error("Erreur lors du calcul de la date de fin de validité:", error);
    }
  }, [creationDate]);

  // Marquer comme ayant des modifications non enregistrées lorsque les valeurs changent
  useEffect(() => {
    setHasUnsavedChanges(true);
  }, [showInAlert, hiddenFromDashboard, obligationStatuses]);

  // Fonction pour convertir les données en format Json compatible
  const convertToJsonCompatible = (data: any): Json => {
    const convertValue = (value: any): Json => {
      if (value === null || value === undefined) {
        return null;
      }
      if (typeof value === 'boolean' || typeof value === 'string' || typeof value === 'number') {
        return value;
      }
      if (Array.isArray(value)) {
        return value.map(convertValue) as Json[];
      }
      if (typeof value === 'object') {
        const result: { [key: string]: Json } = {};
        Object.keys(value).forEach(key => {
          result[key] = convertValue(value[key]);
        });
        return result;
      }
      return String(value);
    };
    
    return convertValue(data);
  };

  // Fonction pour sauvegarder les modifications de manière persistante
  const saveChanges = async () => {
    if (!selectedClient?.id) {
      toast.error("Impossible de sauvegarder : client non sélectionné");
      return;
    }

    try {
      setIsSaving(true);
      
      // Préparer les données à sauvegarder
      const fiscalDataToSave = {
        clientId: selectedClient.id,
        year: fiscalYear,
        attestation: {
          creationDate,
          validityEndDate,
          showInAlert
        },
        obligations: {
          [fiscalYear]: obligationStatuses
        },
        hiddenFromDashboard,
        selectedYear: fiscalYear,
        updatedAt: new Date().toISOString()
      };

      // Convertir en format Json compatible
      const jsonCompatibleData = convertToJsonCompatible(fiscalDataToSave);

      // Sauvegarder dans Supabase
      const { error } = await supabase
        .from("clients")
        .update({
          fiscal_data: jsonCompatibleData
        })
        .eq("id", selectedClient.id);

      if (error) {
        console.error("Erreur lors de la sauvegarde:", error);
        toast.error("Erreur lors de la sauvegarde des données fiscales");
        return;
      }

      // Invalider le cache des clients pour forcer le rechargement
      invalidateClientsCache();

      setHasUnsavedChanges(false);
      toast.success("Données fiscales sauvegardées avec succès");
      
    } catch (error) {
      console.error("Exception lors de la sauvegarde:", error);
      toast.error("Erreur inattendue lors de la sauvegarde");
    } finally {
      setIsSaving(false);
    }
  };

  const handleFiscalYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFiscalYear(e.target.value);
    setHasUnsavedChanges(true);
  };

  // Gestion des changements d'état d'assujettissement et de paiement
  const handleStatusChange = (taxType: ObligationType, field: string, value: boolean) => {
    setObligationStatuses(prev => {
      if (field === "assujetti" && !value) {
        // Si on désactive l'assujettissement, on désactive aussi le paiement/dépôt
        const updatedObligation = { ...prev[taxType] };
        if ('payee' in updatedObligation) {
          (updatedObligation as any).payee = false;
        }
        if ('depose' in updatedObligation) {
          (updatedObligation as any).depose = false;
        }
        return {
          ...prev,
          [taxType]: { ...updatedObligation, assujetti: value }
        };
      }

      return {
        ...prev,
        [taxType]: { ...prev[taxType], [field]: value }
      };
    });
    setHasUnsavedChanges(true);
  };

  return (
    <div className="space-y-6">
      {/* Header et sélecteur d'année */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Obligations fiscales</h1>
          <p className="text-sm text-gray-500">Suivi des obligations fiscales de l'entreprise</p>
        </div>
        <FiscalYearSelector 
          fiscalYear={fiscalYear}
          onYearChange={handleFiscalYearChange}
        />
      </div>

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
