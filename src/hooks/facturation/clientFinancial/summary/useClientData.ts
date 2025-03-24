
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useClientData = () => {
  const { toast } = useToast();
  const [clients, setClients] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchClients = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { data: clientsData, error: clientsError } = await supabase
        .from('clients')
        .select('*')
        .eq('statut', 'actif');
        
      if (clientsError) {
        throw new Error(clientsError.message);
      }
      
      setClients(clientsData || []);
    } catch (err) {
      console.error("Error fetching clients:", err);
      setError(err instanceof Error ? err : new Error('Failed to fetch clients'));
      toast({
        title: "Erreur",
        description: "Impossible de récupérer les données des clients",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  return {
    clients,
    isLoading,
    error,
    fetchClients
  };
};
