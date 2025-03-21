
import { useState, useEffect } from "react";
import { Facture } from "@/types/facture";
import { Client } from "@/types/client";
import { supabase } from "@/integrations/supabase/client";
import { 
  getFactures, 
  formatClientsForSelector
} from "@/services/factureService";

export const useFacturesList = (toast: any) => {
  const [factures, setFactures] = useState<Facture[]>([]);
  const [allClients, setAllClients] = useState<Client[]>([]);
  
  // Fetch factures and clients from Supabase on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const facturesData = await getFactures();
        setFactures(facturesData);
        
        // We need to fetch clients separately for the selector
        const { data: clientsData, error: clientsError } = await supabase
          .from("clients")
          .select("*");
          
        if (clientsError) {
          console.error("Error fetching clients:", clientsError);
          toast({
            variant: "destructive",
            title: "Erreur",
            description: "Impossible de récupérer les clients.",
          });
          return;
        }
        
        const formattedClients = formatClientsForSelector(clientsData);
        setAllClients(formattedClients);
      } catch (error) {
        console.error("Error in fetchData:", error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Une erreur s'est produite lors de la récupération des données.",
        });
      }
    };
    
    fetchData();
  }, [toast]); // Re-fetch when toast changes (should be stable, so effectively once on mount)
  
  return { factures, setFactures, allClients };
};
