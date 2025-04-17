
import { useState, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getClients } from '@/services/clientService';
import { Client } from '@/types/client';
import { saveFiscalData } from '@/hooks/fiscal/services/saveService';
import { verifyAndNotifyFiscalChanges } from '@/hooks/fiscal/services/verifyService';
import { toast } from 'sonner';
import { clearAllCaches } from '@/hooks/fiscal/services/cacheService';

export const useBulkFiscalUpdate = () => {
  const queryClient = useQueryClient();
  const [updatingClients, setUpdatingClients] = useState<{
    total: number;
    processed: number;
    successful: number;
    failed: number;
  }>({
    total: 0,
    processed: 0,
    successful: 0,
    failed: 0
  });

  const [isUpdating, setIsUpdating] = useState(false);

  const { data: clients = [], isLoading } = useQuery({
    queryKey: ['clients'],
    queryFn: getClients,
  });

  const updateClientsfiscalData = useCallback(async () => {
    const eligibleClients = clients.filter(client => client.gestionexternalisee);
    
    if (eligibleClients.length === 0) {
      toast.error("Aucun client éligible trouvé pour la mise à jour fiscale");
      return;
    }

    setIsUpdating(true);
    toast.info(`Début de la mise à jour pour ${eligibleClients.length} clients...`);
    
    // Effacer tous les caches avant de commencer la mise à jour en masse
    clearAllCaches();
    
    setUpdatingClients({
      total: eligibleClients.length,
      processed: 0,
      successful: 0,
      failed: 0
    });

    let successCount = 0;
    let failCount = 0;

    for (const client of eligibleClients) {
      try {
        const fiscalData = {
          ...client.fiscal_data,
          updatedAt: new Date().toISOString(),
          lastBulkUpdate: new Date().toISOString()
        };

        // Augmenter le nombre de tentatives pour les opérations importantes
        const maxRetries = 3;
        let saveSuccess = false;
        let retryCount = 0;
        
        while (!saveSuccess && retryCount < maxRetries) {
          saveSuccess = await saveFiscalData(client.id, fiscalData, retryCount);
          if (!saveSuccess) {
            console.log(`Tentative ${retryCount + 1} échouée pour le client ${client.id}, nouvelle tentative...`);
            await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1)));
            retryCount++;
          }
        }
        
        if (saveSuccess) {
          // Vérification avec retries
          let verified = false;
          retryCount = 0;
          
          while (!verified && retryCount < maxRetries) {
            verified = await verifyAndNotifyFiscalChanges(client.id, fiscalData);
            if (!verified) {
              console.log(`Vérification ${retryCount + 1} échouée pour le client ${client.id}, nouvelle tentative...`);
              await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1)));
              retryCount++;
            }
          }
          
          if (verified) {
            successCount++;
            setUpdatingClients(prev => ({
              ...prev,
              processed: prev.processed + 1,
              successful: successCount
            }));
          } else {
            failCount++;
            setUpdatingClients(prev => ({
              ...prev,
              processed: prev.processed + 1,
              failed: failCount
            }));
            toast.error(`Échec de la vérification pour le client ${client.id} après ${maxRetries} tentatives`);
          }
        } else {
          failCount++;
          setUpdatingClients(prev => ({
            ...prev,
            processed: prev.processed + 1,
            failed: failCount
          }));
          toast.error(`Échec de l'enregistrement pour le client ${client.id} après ${maxRetries} tentatives`);
        }
      } catch (error) {
        console.error(`Erreur critique pour le client ${client.id}:`, error);
        failCount++;
        setUpdatingClients(prev => ({
          ...prev,
          processed: prev.processed + 1,
          failed: failCount
        }));
      }

      // Petit délai entre chaque client pour éviter de surcharger le serveur
      await new Promise(resolve => setTimeout(resolve, 800));
    }

    // Invalidation forcée des caches après l'opération complète
    queryClient.invalidateQueries({ queryKey: ["clients"] });
    queryClient.invalidateQueries({ queryKey: ["expiring-fiscal-attestations"] });
    queryClient.invalidateQueries({ queryKey: ["clients-unpaid-patente"] });
    queryClient.invalidateQueries({ queryKey: ["clients-unpaid-igs"] });
    
    if (typeof window !== 'undefined' && window.__invalidateFiscalCaches) {
      window.__invalidateFiscalCaches();
    }

    setIsUpdating(false);
    
    if (failCount === 0) {
      toast.success(`Mise à jour terminée avec succès pour tous les ${successCount} clients !`, {
        duration: 6000
      });
    } else if (successCount > 0) {
      toast.warning(`Mise à jour terminée : ${successCount} succès, ${failCount} échecs`, {
        duration: 6000
      });
    } else {
      toast.error(`Échec de la mise à jour pour tous les clients. Veuillez réessayer.`, {
        duration: 6000
      });
    }
    
  }, [clients, queryClient]);

  return {
    updateClientsfiscalData,
    updatingClients,
    isLoading,
    isUpdating,
    clients
  };
};
