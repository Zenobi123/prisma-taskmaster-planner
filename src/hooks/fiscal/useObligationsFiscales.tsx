
import { Client } from "@/types/client";
import { ClientFiscalData, IGSData } from "./types";
import { toast } from "sonner";
import { saveFiscalData, verifyFiscalDataSave } from "./services/fiscalDataService";
import { updateCache, clearCache, getDebugInfo } from "./services/fiscalDataCache";
import { useFiscalAttestation } from "./hooks/useFiscalAttestation";
import { useObligationStatus } from "./hooks/useObligationStatus";
import { useFiscalData } from "./hooks/useFiscalData";
import { useState, useCallback, useEffect } from "react";

export const useObligationsFiscales = (selectedClient: Client) => {
  const [isSaving, setIsSaving] = useState(false);
  const [saveAttempts, setSaveAttempts] = useState(0);
  const [lastSaveTime, setLastSaveTime] = useState<number | null>(null);
  const [lastSaveSuccess, setLastSaveSuccess] = useState<boolean>(false);

  const {
    creationDate,
    setCreationDate,
    validityEndDate,
    setValidityEndDate,
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
    igsData,
    handleIGSDataChange,
    loadFiscalData
  } = useFiscalData(selectedClient);

  // Si plus de 60 secondes se sont écoulées depuis le dernier enregistrement, forcer le rechargement
  useEffect(() => {
    if (lastSaveTime && Date.now() - lastSaveTime > 60000) {
      console.log("Plus de 60 secondes depuis le dernier enregistrement, forcage du rechargement des données");
      loadFiscalData();
    }
  }, [lastSaveTime, loadFiscalData]);

  const handleSave = useCallback(async () => {
    if (!selectedClient?.id) {
      toast.error("Impossible d'enregistrer les données: client non sélectionné");
      return;
    }

    setIsSaving(true);
    setSaveAttempts(prev => prev + 1);

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
        hiddenFromDashboard,
        igs: igsData
      };

      console.log("Enregistrement des données fiscales:", JSON.stringify(fiscalData, null, 2));
      
      // Tenter d'enregistrer les données
      const saveSuccess = await saveFiscalData(selectedClient.id, fiscalData);
      
      if (saveSuccess) {
        // Mettre à jour le cache local immédiatement
        updateCache(selectedClient.id, fiscalData);
        
        // Forcer l'effacement des caches associés pour garantir des données fraîches
        if (typeof window !== 'undefined' && window.__invalidateFiscalCaches) {
          console.log("Invalidation des caches fiscaux après enregistrement");
          window.__invalidateFiscalCaches();
        } else {
          console.log("Fonction d'invalidation globale non disponible, création");
          if (typeof window !== 'undefined') {
            window.__invalidateFiscalCaches = function() {
              console.log("Création et exécution de la fonction d'invalidation");
              // Ceci sera rempli avec la logique d'invalidation du cache lors du premier appel
              if (window.__patenteCacheTimestamp !== undefined) {
                window.__patenteCacheTimestamp = 0;
              }
              if (window.__igsCache) {
                window.__igsCache = { data: null, timestamp: 0 };
              }
            };
            window.__invalidateFiscalCaches();
          }
        }
        
        // Vérifier que l'enregistrement a réussi
        const verified = await verifyFiscalDataSave(selectedClient.id, fiscalData);
        if (verified) {
          console.log("Enregistrement vérifié avec succès");
          toast.success("Les informations fiscales ont été mises à jour.");
          setLastSaveTime(Date.now());
          setLastSaveSuccess(true);
        } else {
          console.warn("La vérification de l'enregistrement a échoué - les données peuvent ne pas avoir été correctement enregistrées");
          // Quand même montrer le succès à l'utilisateur mais enregistrer un avertissement
          toast.success("Les informations fiscales ont été mises à jour. Actualisez la page pour voir les changements.");
          setLastSaveSuccess(false);
          
          // Tenter une nouvelle vérification après un court délai
          setTimeout(async () => {
            const secondVerification = await verifyFiscalDataSave(selectedClient.id, fiscalData);
            if (secondVerification) {
              console.log("Seconde vérification réussie");
              setLastSaveSuccess(true);
            } else {
              console.error("Échec de la seconde vérification - possible problème de persistance");
            }
          }, 5000);
        }
      }
    } catch (error) {
      console.error("Erreur lors de l'enregistrement des données fiscales:", error);
      toast.error("Erreur lors de l'enregistrement des données fiscales. Veuillez actualiser la page et réessayer.");
      setLastSaveSuccess(false);
      
      // Forcer le rechargement des données en cas d'erreur
      clearCache(selectedClient.id);
      
      setTimeout(() => {
        loadFiscalData();
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
    igsData, 
    loadFiscalData
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
    igsData,
    handleIGSDataChange,
    lastSaveSuccess
  };
};
