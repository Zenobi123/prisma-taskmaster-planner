
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
    
    setUpdatingClients({
      total: eligibleClients.length,
      processed: 0,
      successful: 0,
      failed: 0
    });

    const updatePromises = eligibleClients.map(async (client) => {
      try {
        // Logique de mise à jour fiscale (à personnaliser selon vos besoins)
        const fiscalData = {
          ...client.fiscal_data,
          // Ajoutez ici la logique de modification des données fiscales
          hiddenFromDashboard: false, // Exemple
        };

        const saveSuccess = await saveFiscalData(client.id, fiscalData);
        
        if (saveSuccess) {
          const verified = await verifyAndNotifyFiscalChanges(client.id, fiscalData);
          
          setUpdatingClients(prev => ({
            ...prev,
            processed: prev.processed + 1,
            successful: verified ? prev.successful + 1 : prev.successful
          }));

          return verified;
        }
        
        return false;
      } catch (error) {
        console.error(`Erreur pour le client ${client.id}:`, error);
        
        setUpdatingClients(prev => ({
          ...prev,
          processed: prev.processed + 1,
          failed: prev.failed + 1
        }));
        
        return false;
      }
    });

    const results = await Promise.all(updatePromises);
    
    const successCount = results.filter(Boolean).length;
    const failedCount = results.filter(x => !x).length;

    toast.info(`Mise à jour fiscale terminée: ${successCount} succès, ${failedCount} échecs`, {
      duration: 5000
    });

    return {
      total: eligibleClients.length,
      successful: successCount,
      failed: failedCount
    };
  }, [clients]);

  return {
    updateClientsfiscalData,
    updatingClients,
    isLoading,
    clients
  };
};
