
import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getClients } from '@/services/clientService';
import { Client } from '@/types/client';
import { saveFiscalData } from '@/hooks/fiscal/services/saveService';
import { verifyAndNotifyFiscalChanges } from '@/hooks/fiscal/services/verifyService';
import { toast } from 'sonner';

export const useBulkFiscalUpdate = () => {
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

    toast.info(`Début de la mise à jour pour ${eligibleClients.length} clients...`);
    
    setUpdatingClients({
      total: eligibleClients.length,
      processed: 0,
      successful: 0,
      failed: 0
    });

    for (const client of eligibleClients) {
      try {
        const fiscalData = {
          ...client.fiscal_data,
          updatedAt: new Date().toISOString(),
          lastBulkUpdate: new Date().toISOString()
        };

        const saveSuccess = await saveFiscalData(client.id, fiscalData);
        
        if (saveSuccess) {
          const verified = await verifyAndNotifyFiscalChanges(client.id, fiscalData);
          
          setUpdatingClients(prev => ({
            ...prev,
            processed: prev.processed + 1,
            successful: verified ? prev.successful + 1 : prev.successful,
            failed: verified ? prev.failed : prev.failed + 1
          }));
        } else {
          setUpdatingClients(prev => ({
            ...prev,
            processed: prev.processed + 1,
            failed: prev.failed + 1
          }));
        }
      } catch (error) {
        console.error(`Erreur pour le client ${client.id}:`, error);
        setUpdatingClients(prev => ({
          ...prev,
          processed: prev.processed + 1,
          failed: prev.failed + 1
        }));
      }

      // Petit délai entre chaque client pour éviter de surcharger le serveur
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    const { successful, failed } = updatingClients;
    
    if (failed === 0) {
      toast.success(`Mise à jour terminée avec succès pour tous les clients !`);
    } else {
      toast.warning(`Mise à jour terminée : ${successful} succès, ${failed} échecs`);
    }
  }, [clients, updatingClients]);

  return {
    updateClientsfiscalData,
    updatingClients,
    isLoading,
    clients
  };
};
