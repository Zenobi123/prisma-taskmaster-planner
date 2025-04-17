
import { Client } from "@/types/client";
import { ClientFiscalData } from "./types";
import { toast } from "sonner";
import { saveFiscalData } from "./services/saveService";
import { verifyAndNotifyFiscalChanges } from "./services/verifyService";
import { updateCache, clearCache, getDebugInfo } from "./services/cacheService";
import { useFiscalAttestation } from "./hooks/useFiscalAttestation";
import { useObligationStatus } from "./hooks/useObligationStatus";
import { useFiscalData } from "./hooks/useFiscalData";
import { useState, useCallback, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Json } from "@/integrations/supabase/types";

export const useObligationsFiscales = (selectedClient: Client) => {
  const queryClient = useQueryClient();
  const [isSaving, setIsSaving] = useState(false);
  const [saveAttempts, setSaveAttempts] = useState(0);
  const [lastSaveTime, setLastSaveTime] = useState<number | null>(null);
  const [lastSaveSuccess, setLastSaveSuccess] = useState<boolean>(false);
  const [saveRetryCount, setSaveRetryCount] = useState(0);

  const {
    creationDate,
    setCreationDate,
    validityEndDate,
    showInAlert,
    handleToggleAlert
  } = useFiscalAttestation();

  const {
    obligationStatuses,
    setObligationStatuses,
    handleStatusChange
  } = useObligationStatus();

  const {
    isLoading,
    dataLoaded,
    hiddenFromDashboard,
    handleToggleDashboardVisibility,
    loadFiscalData
  } = useFiscalData(selectedClient);

  useEffect(() => {
    if (lastSaveTime && Date.now() - lastSaveTime > 60000) {
      console.log("Plus de 60 secondes depuis le dernier enregistrement, forçage du rechargement des données");
      loadFiscalData(true);
    }
  }, [lastSaveTime, loadFiscalData]);

  useEffect(() => {
    if (lastSaveSuccess && lastSaveTime) {
      const invalidationTimeout = setTimeout(() => {
        console.log("Invalidation automatique des requêtes après enregistrement réussi");
        queryClient.invalidateQueries({ queryKey: ["expiring-fiscal-attestations"] });
        queryClient.invalidateQueries({ queryKey: ["clients-unpaid-patente"] });
        queryClient.invalidateQueries({ queryKey: ["clients-unpaid-igs"] });
      }, 2000);
      
      return () => clearTimeout(invalidationTimeout);
    }
  }, [lastSaveSuccess, lastSaveTime, queryClient]);

  const handleSave = useCallback(async () => {
    if (!selectedClient?.id) {
      toast.error("Impossible d'enregistrer les données: client non sélectionné");
      return;
    }

    setIsSaving(true);
    setSaveAttempts(prev => prev + 1);
    setSaveRetryCount(0);

    try {
      console.log("Début de l'enregistrement des données fiscales...");
      console.log("État du cache avant enregistrement:", getDebugInfo());
      
      const fiscalData: ClientFiscalData = {
        attestation: {
          creationDate,
          validityEndDate,
          showInAlert
        },
        obligations: obligationStatuses,
        hiddenFromDashboard
      };

      console.log("Enregistrement des données fiscales:", JSON.stringify(fiscalData, null, 2));
      
      const saveSuccess = await saveFiscalData(selectedClient.id, fiscalData);
      
      if (saveSuccess) {
        updateCache(selectedClient.id, fiscalData);
        
        if (typeof window !== 'undefined' && window.__invalidateFiscalCaches) {
          console.log("Invalidation des caches fiscaux après enregistrement");
          window.__invalidateFiscalCaches();
        }
        
        // Utiliser notre vérification améliorée
        const verified = await verifyAndNotifyFiscalChanges(selectedClient.id, fiscalData);
        
        if (verified) {
          console.log("Enregistrement vérifié avec succès");
          setLastSaveTime(Date.now());
          setLastSaveSuccess(true);
          
          queryClient.invalidateQueries({ queryKey: ["expiring-fiscal-attestations"] });
          queryClient.invalidateQueries({ queryKey: ["clients-unpaid-patente"] });
          queryClient.invalidateQueries({ queryKey: ["clients-unpaid-igs"] });
        } else {
          console.warn("La vérification de l'enregistrement a échoué - les données peuvent ne pas avoir été correctement enregistrées");
          toast.warning("Enregistrement terminé, mais veuillez vérifier et actualiser la page pour confirmer les changements.");
          setLastSaveSuccess(false);
          
          setTimeout(async () => {
            const secondVerification = await verifyAndNotifyFiscalChanges(selectedClient.id, fiscalData);
            if (secondVerification) {
              console.log("Seconde vérification réussie");
              setLastSaveSuccess(true);
              toast.success("Les modifications ont été correctement enregistrées après vérification.");
            } else {
              console.error("Échec de la seconde vérification - tentative de réenregistrement");
              if (saveRetryCount < 2) {
                setSaveRetryCount(prev => prev + 1);
                handleSave();
              } else {
                toast.error("Problème de persistance détecté. Veuillez actualiser la page et réessayer.");
              }
            }
          }, 3000);
        }
      } else {
        toast.error("Erreur lors de l'enregistrement. Veuillez réessayer.");
        setLastSaveSuccess(false);
      }
    } catch (error) {
      console.error("Erreur lors de l'enregistrement des données fiscales:", error);
      toast.error("Erreur lors de l'enregistrement des données fiscales. Veuillez actualiser la page et réessayer.");
      setLastSaveSuccess(false);
      
      clearCache(selectedClient.id);
      
      setTimeout(() => {
        loadFiscalData(true);
      }, 1000);
    } finally {
      setIsSaving(false);
    }
  }, [
    selectedClient?.id, 
    creationDate, 
    validityEndDate, 
    showInAlert, 
    obligationStatuses, 
    hiddenFromDashboard,
    loadFiscalData,
    queryClient,
    saveRetryCount
  ]);

  return {
    creationDate,
    setCreationDate,
    validityEndDate,
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
    lastSaveSuccess
  };
};
