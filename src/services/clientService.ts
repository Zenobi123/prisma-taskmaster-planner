
import { supabase } from "@/integrations/supabase/client";
import { Client } from "@/types/client";
import { mapClientRowToClient } from "./client/clientDataMapper";
import { getClientsFromCache, setClientsCache, invalidateClientsCache } from "./client/clientCacheService";
import { addClient, archiveClient, deleteClient, updateClient, restoreClient, permanentDeleteClient } from "./client/clientCRUDService";

export const getClients = async (includeDeleted: boolean = false) => {
  console.log("Récupération des clients...");
  
  // Check if we have a valid cache (only for active clients)
  if (!includeDeleted) {
    const cachedClients = getClientsFromCache();
    if (cachedClients) {
      return cachedClients;
    }
  }
  
  // Build query based on includeDeleted flag
  let query = supabase
    .from("clients")
    .select("*")
    .order('created_at', { ascending: false });

  if (!includeDeleted) {
    query = query.is('deleted_at', null);
  }

  const { data: clients, error } = await query;

  if (error) {
    console.error("Erreur lors de la récupération des clients:", error);
    throw error;
  }

  console.log("Clients récupérés:", clients?.length || 0);

  if (clients) {
    const formattedClients = clients.map(mapClientRowToClient);
    
    // Update cache only for active clients
    if (!includeDeleted) {
      setClientsCache(formattedClients);
    }
    
    return formattedClients;
  }

  return [];
};

export const getDeletedClients = async () => {
  console.log("Récupération des clients supprimés...");
  
  const { data: clients, error } = await supabase
    .from("clients")
    .select("*")
    .eq('statut', 'supprime')
    .not('deleted_at', 'is', null)
    .order('deleted_at', { ascending: false });

  if (error) {
    console.error("Erreur lors de la récupération des clients supprimés:", error);
    throw error;
  }

  console.log("Clients supprimés récupérés:", clients?.length || 0);

  if (clients) {
    return clients.map(mapClientRowToClient);
  }

  return [];
};

// Re-export all CRUD operations and cache management
export { 
  addClient, 
  archiveClient, 
  deleteClient, 
  updateClient,
  restoreClient,
  permanentDeleteClient,
  invalidateClientsCache 
};
