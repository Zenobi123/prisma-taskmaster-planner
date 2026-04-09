
import { useState, useCallback, useEffect, useRef } from "react";
import { Client } from "@/types/client";
import { ObligationStatuses } from "./types";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { clearCache } from "./services/fiscalDataCache";

interface UseUnifiedFiscalSaveProps {
  selectedClient: Client;
  fiscalYear: string;
  creationDate: string;
  validityEndDate: string;
  showInAlert: boolean;
  hiddenFromDashboard: boolean;
  obligationStatuses: ObligationStatuses;
  fiscalSituationCompliant?: boolean;
  registrationDate?: string;
  autoSave?: boolean;
  autoSaveDelay?: number;
}

export const useUnifiedFiscalSave = ({
  selectedClient,
  fiscalYear,
  creationDate,
  validityEndDate,
  showInAlert,
  hiddenFromDashboard,
  obligationStatuses,
  fiscalSituationCompliant = true,
  registrationDate = "",
  autoSave = false,
  autoSaveDelay = 3000
}: UseUnifiedFiscalSaveProps) => {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [lastSaveTime, setLastSaveTime] = useState<Date | null>(null);
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isSavingRef = useRef(false);

  const markAsChanged = useCallback(() => {
    setHasUnsavedChanges(true);
  }, []);

  const resetChanges = useCallback(() => {
    setHasUnsavedChanges(false);
  }, []);

  const saveData = useCallback(async () => {
    if (!selectedClient?.id) return false;
    // Guard against concurrent saves (race condition)
    if (isSavingRef.current) return false;
    isSavingRef.current = true;

    setIsSaving(true);
    try {
      // Get current fiscal data
      const { data: currentClient, error: fetchError } = await supabase
        .from('clients')
        .select('fiscal_data')
        .eq('id', selectedClient.id)
        .single();

      if (fetchError) {
        throw fetchError;
      }

      const currentFiscalData = currentClient?.fiscal_data;
      const baseData = (currentFiscalData && typeof currentFiscalData === 'object' && !Array.isArray(currentFiscalData)) ? currentFiscalData : {};

      // Convert ObligationStatuses to a plain object that's JSON serializable
      const serializedObligations = JSON.parse(JSON.stringify(obligationStatuses));

      // Update fiscal data
      const updatedFiscalData = {
        ...baseData,
        attestation: {
          creationDate,
          validityEndDate,
          showInAlert,
          fiscalSituationCompliant
        },
        registrationAttestation: {
          registrationDate
        },
        obligations: {
          ...(baseData.obligations && typeof baseData.obligations === 'object' ? baseData.obligations : {}),
          [fiscalYear]: serializedObligations
        },
        hiddenFromDashboard,
        selectedYear: fiscalYear
      };

      // Save to database
      const { error: updateError } = await supabase
        .from('clients')
        .update({ fiscal_data: updatedFiscalData })
        .eq('id', selectedClient.id);

      if (updateError) {
        throw updateError;
      }

      // Invalider le cache fiscal pour forcer le rechargement des donnees fraiches
      clearCache(selectedClient.id);

      setLastSaveTime(new Date());
      setHasUnsavedChanges(false);
      return true;
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder les données fiscales",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsSaving(false);
      isSavingRef.current = false;
    }
  }, [
    selectedClient?.id,
    fiscalYear,
    creationDate,
    validityEndDate,
    showInAlert,
    fiscalSituationCompliant,
    registrationDate,
    hiddenFromDashboard,
    obligationStatuses,
    toast
  ]);

  // Auto-save effect
  useEffect(() => {
    if (autoSave && hasUnsavedChanges) {
      autoSaveTimeoutRef.current = setTimeout(() => {
        saveData();
      }, autoSaveDelay);
    }

    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, [autoSave, autoSaveDelay, hasUnsavedChanges, saveData]);

  // Protection contre la perte de donnees : avertir l'utilisateur s'il quitte la page
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasUnsavedChanges]);

  const manualSave = useCallback(async () => {
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }
    return await saveData();
  }, [saveData]);

  // Cleanup function
  const cleanup = useCallback(() => {
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }
  }, []);

  return {
    isSaving,
    hasUnsavedChanges,
    lastSaveTime,
    markAsChanged,
    manualSave,
    cleanup,
    setHasUnsavedChanges
  };
};
