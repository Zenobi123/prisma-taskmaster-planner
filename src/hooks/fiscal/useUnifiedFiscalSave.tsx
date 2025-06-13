
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { Client } from '@/types/client';
import { ObligationStatuses } from './types';
import { prepareFiscalDataForSave } from './services/fiscalDataPreparer';
import { saveFiscalDataToDatabase } from './services/fiscalDataSaver';
import { invalidateClientsCache } from '@/services/clientService';

interface UseUnifiedFiscalSaveProps {
  selectedClient: Client;
  fiscalYear: string;
  creationDate: string;
  validityEndDate: string;
  showInAlert: boolean;
  hiddenFromDashboard: boolean;
  obligationStatuses: ObligationStatuses;
  onSaveSuccess?: () => void;
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
  onSaveSuccess,
  autoSave = false,
  autoSaveDelay = 2000
}: UseUnifiedFiscalSaveProps) => {
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [lastSaveTime, setLastSaveTime] = useState<Date | null>(null);
  const [autoSaveTimeout, setAutoSaveTimeout] = useState<NodeJS.Timeout | null>(null);

  const executeSave = useCallback(async (): Promise<boolean> => {
    if (!selectedClient?.id) {
      toast.error("Impossible de sauvegarder : client non sélectionné");
      return false;
    }

    try {
      setIsSaving(true);
      console.log(`=== DÉBUT SAUVEGARDE UNIFIÉE ===`);
      console.log("Client ID:", selectedClient.id);
      console.log("Année fiscale:", fiscalYear);

      // Préparer les données pour la sauvegarde
      const fiscalDataToSave = prepareFiscalDataForSave({
        selectedClient,
        fiscalYear,
        creationDate,
        validityEndDate,
        showInAlert,
        hiddenFromDashboard,
        obligationStatuses
      });

      console.log("Données préparées:", fiscalDataToSave);

      // Sauvegarder dans la base de données
      const success = await saveFiscalDataToDatabase(selectedClient.id, fiscalDataToSave);

      if (success) {
        console.log("=== SAUVEGARDE RÉUSSIE ===");
        invalidateClientsCache();
        setHasUnsavedChanges(false);
        setLastSaveTime(new Date());
        onSaveSuccess?.();
        toast.success("Données fiscales sauvegardées avec succès");
        return true;
      } else {
        toast.error("Erreur lors de la sauvegarde");
        return false;
      }
    } catch (error) {
      console.error("Exception lors de la sauvegarde:", error);
      toast.error("Erreur inattendue lors de la sauvegarde");
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [
    selectedClient,
    fiscalYear,
    creationDate,
    validityEndDate,
    showInAlert,
    hiddenFromDashboard,
    obligationStatuses,
    onSaveSuccess
  ]);

  const triggerAutoSave = useCallback(() => {
    if (!autoSave) return;
    
    // Annuler le timeout précédent s'il existe
    if (autoSaveTimeout) {
      clearTimeout(autoSaveTimeout);
    }

    // Créer un nouveau timeout
    const newTimeout = setTimeout(() => {
      console.log("Déclenchement de la sauvegarde automatique");
      executeSave();
    }, autoSaveDelay);

    setAutoSaveTimeout(newTimeout);
  }, [autoSave, autoSaveDelay, executeSave, autoSaveTimeout]);

  const markAsChanged = useCallback(() => {
    setHasUnsavedChanges(true);
    triggerAutoSave();
  }, [triggerAutoSave]);

  const manualSave = useCallback(async () => {
    // Annuler l'auto-save en cours s'il y en a un
    if (autoSaveTimeout) {
      clearTimeout(autoSaveTimeout);
      setAutoSaveTimeout(null);
    }
    
    return await executeSave();
  }, [executeSave, autoSaveTimeout]);

  // Cleanup du timeout à la destruction du hook
  const cleanup = useCallback(() => {
    if (autoSaveTimeout) {
      clearTimeout(autoSaveTimeout);
    }
  }, [autoSaveTimeout]);

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
