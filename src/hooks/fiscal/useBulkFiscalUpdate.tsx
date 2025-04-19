
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Client } from "@/types/client";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export const useBulkFiscalUpdate = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Mise à jour des données fiscales en masse
  const updateFiscalDataMutation = useMutation({
    mutationFn: async (clients: Client[]) => {
      setIsLoading(true);
      console.log("Mise à jour des données fiscales pour", clients.length, "clients");
      
      try {
        // Traitement par lots de 10 clients maximum pour éviter les timeout
        const batchSize = 10;
        const batches = [];
        
        for (let i = 0; i < clients.length; i += batchSize) {
          const batch = clients.slice(i, i + batchSize);
          batches.push(batch);
        }
        
        let successCount = 0;
        let errorCount = 0;
        
        // Traiter chaque lot séquentiellement
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
              
              return { success: true, id: client.id };
            } catch (error) {
              console.error(`Erreur lors de la mise à jour du client ${client.id}:`, error);
              return { success: false, id: client.id, error };
            }
          });
          
          const results = await Promise.all(promises);
          
          // Compter les résultats
          successCount += results.filter(r => r.success).length;
          errorCount += results.filter(r => !r.success).length;
        }
        
        return { successCount, errorCount };
      } finally {
        setIsLoading(false);
      }
    },
    onSuccess: (result) => {
      console.log("Résultat de la mise à jour:", result);
      
      // Rafraîchir les données des clients
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      queryClient.invalidateQueries({ queryKey: ["expiring-fiscal-attestations"] });
      
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

  return {
    isLoading,
    updateFiscalDataMutation
  };
};
