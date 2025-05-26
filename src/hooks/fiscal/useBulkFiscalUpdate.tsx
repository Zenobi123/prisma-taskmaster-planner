
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Client } from "@/types/client";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export const useBulkFiscalUpdate = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updatingClients, setUpdatingClients] = useState({
    total: 0,
    processed: 0,
    successful: 0,
    failed: 0
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Mise à jour des données fiscales en masse
  const updateFiscalDataMutation = useMutation({
    mutationFn: async (clients: Client[]) => {
      setIsLoading(true);
      setIsUpdating(true);
      setUpdatingClients({
        total: clients.length,
        processed: 0,
        successful: 0,
        failed: 0
      });
      
      console.log("Mise à jour des données fiscales pour", clients.length, "clients");
      
      try {
        // Traitement par lots de 5 clients maximum pour éviter les timeout et réduire la charge
        const batchSize = 5;
        const batches = [];
        
        for (let i = 0; i < clients.length; i += batchSize) {
          const batch = clients.slice(i, i + batchSize);
          batches.push(batch);
        }
        
        let successCount = 0;
        let errorCount = 0;
        
        // Traiter chaque lot séquentiellement avec un petit délai entre chaque lot
        for (const batch of batches) {
          const promises = batch.map(async (client) => {
            try {
              // Vérifier si le client a des données fiscales à mettre à jour
              if (!client.fiscal_data) {
                return { success: false, id: client.id, error: "Pas de données fiscales" };
              }
              
              const { error } = await supabase
                .from("clients")
                .update({ fiscal_data: client.fiscal_data })
                .eq("id", client.id);
                
              if (error) throw error;
              
              // Mise à jour du compteur de clients traités
              setUpdatingClients(prev => ({
                ...prev,
                processed: prev.processed + 1,
                successful: prev.successful + 1
              }));
              
              return { success: true, id: client.id };
            } catch (error) {
              console.error(`Erreur lors de la mise à jour du client ${client.id}:`, error);
              
              // Mise à jour du compteur de clients avec erreur
              setUpdatingClients(prev => ({
                ...prev,
                processed: prev.processed + 1,
                failed: prev.failed + 1
              }));
              
              return { success: false, id: client.id, error };
            }
          });
          
          const results = await Promise.all(promises);
          
          // Compter les résultats
          successCount += results.filter(r => r.success).length;
          errorCount += results.filter(r => !r.success).length;
          
          // Ajouter un petit délai entre les lots pour éviter de surcharger le navigateur
          if (batches.length > 1) {
            await new Promise(resolve => setTimeout(resolve, 300));
          }
        }
        
        return { successCount, errorCount };
      } finally {
        setIsLoading(false);
        setIsUpdating(false);
      }
    },
    onSuccess: (result) => {
      console.log("Résultat de la mise à jour:", result);
      
      // Invalidation contrôlée et séquentielle des requêtes pour éviter trop de refetch simultanés
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ["clients"] });
      }, 300);
      
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ["expiring-fiscal-attestations"] });
        queryClient.invalidateQueries({ queryKey: ["clients-unfiled-dsf"] });
      }, 600);
      
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ["clients-unpaid-patente"] });
        queryClient.invalidateQueries({ queryKey: ["clients-unpaid-igs"] });
      }, 900);
      
      // Invalidation des requêtes moins urgentes en dernier
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ["clients-unfiled-dsf-summary"] });
        queryClient.invalidateQueries({ queryKey: ["clients-unfiled-dsf-section"] });
        queryClient.invalidateQueries({ queryKey: ["client-stats"] });
      }, 1200);
      
      // Afficher un message de succès
      toast({
        title: "Mise à jour effectuée",
        description: `${result.successCount} clients mis à jour avec succès. ${result.errorCount} erreurs.`,
        variant: result.errorCount > 0 ? "destructive" : "default",
      });
    },
    onError: (error) => {
      console.error("Erreur lors de la mise à jour des données fiscales:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour des données fiscales.",
        variant: "destructive",
      });
    }
  });

  // Fonction pour déclencher la mise à jour
  const updateClientsfiscalData = (clients: Client[] = []) => {
    // Si aucun client n'est fourni, utiliser un tableau vide
    updateFiscalDataMutation.mutate(clients);
  };

  return {
    isLoading,
    isUpdating,
    updatingClients,
    updateFiscalDataMutation,
    updateClientsfiscalData
  };
};
