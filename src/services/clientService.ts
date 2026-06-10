
import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";
import { Client } from "@/types/client";

export const getClients = async (includeArchived: boolean = false): Promise<Client[]> => {
  let query = supabase
    .from('clients')
    .select('*')
    .order('created_at', { ascending: false });

  if (!includeArchived) {
    query = query.eq('statut', 'actif');
  } else {
    query = query.in('statut', ['actif', 'archive']);
  }

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  return (data || []) as unknown as Client[];
};

export const getDeletedClients = async (): Promise<Client[]> => {
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .eq('statut', 'supprime')
    .order('deleted_at', { ascending: false });

  if (error) {
    throw error;
  }

  return (data || []) as unknown as Client[];
};

export const createClient = async (clientData: Omit<Client, 'id' | 'created_at'>): Promise<Client> => {
  const { data, error } = await supabase
    .from('clients')
    .insert([{
      ...clientData,
      interactions: (clientData.interactions || []) as unknown as Json,
      fiscal_data: (clientData.fiscal_data ?? null) as Json,
      agences: (clientData.agences ?? null) as unknown as Json,
    }])
    .select()
    .single();

  if (error) throw error;
  return data as unknown as Client;
};

export const addClient = createClient; // Alias for backward compatibility

export const updateClient = async (id: string, updates: Partial<Client>): Promise<Client> => {
  const updateData = {
    ...updates,
    interactions: updates.interactions as unknown as Json,
    fiscal_data: (updates.fiscal_data ?? null) as Json,
    agences: (updates.agences ?? null) as unknown as Json,
  };
  
  const { data, error } = await supabase
    .from('clients')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as unknown as Client;
};

export const archiveClient = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('clients')
    .update({ statut: 'archive' })
    .eq('id', id);

  if (error) throw error;
};

export const deleteClient = async (id: string): Promise<void> => {
  // Check for incomplete tasks
  const { data: clientTasks, error: taskCheckError } = await supabase
    .from('tasks')
    .select('id, status')
    .eq('client_id', id);

  if (taskCheckError) throw taskCheckError;

  if (clientTasks && clientTasks.length > 0) {
    const incompleteTasks = clientTasks.filter(task => task.status !== 'termine');
    if (incompleteTasks.length > 0) {
      throw new Error("Le client a des tâches non terminées et ne peut pas être supprimé");
    }
  }

  const { error } = await supabase
    .from('clients')
    .update({ statut: 'supprime', deleted_at: new Date().toISOString() })
    .eq('id', id);

  if (error) throw error;
};

export const restoreClient = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('clients')
    .update({ statut: 'actif', deleted_at: null })
    .eq('id', id);

  if (error) throw error;
};

export const permanentDeleteClient = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('clients')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

// Re-export the actual cache invalidation from clientCacheService
export { invalidateClientsCache } from "./client/clientCacheService";
