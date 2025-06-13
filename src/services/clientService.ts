import { supabase } from "@/integrations/supabase/client";
import { Client } from "@/types/client";
import { mapClientRowToClient } from "./client/clientDataMapper";
import { getClientsFromCache, setClientsCache, invalidateClientsCache } from "./client/clientCacheService";
import { addClient, archiveClient, deleteClient, updateClient } from "./client/clientCRUDService";

export const getClients = async () => {
  console.log("Récupération des clients...");
  
  // Check if we have a valid cache
  const cachedClients = getClientsFromCache();
  if (cachedClients) {
    return cachedClients;
  }
  
  // Otherwise fetch from the database
  const { data: clients, error } = await supabase
    .from("clients")
    .select("*")
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Erreur lors de la récupération des clients:", error);
    throw error;
  }

  console.log("Clients récupérés:", clients?.length || 0);

  if (clients) {
    const formattedClients = clients.map(mapClientRowToClient);
    
    // Update cache
    setClientsCache(formattedClients);
    
    return formattedClients;
  }

  return [];
};

// Re-export all CRUD operations and cache management
export { 
  addClient, 
  archiveClient, 
  deleteClient, 
  updateClient,
  invalidateClientsCache 
};
