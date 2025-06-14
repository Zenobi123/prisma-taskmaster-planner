
import { supabase } from "@/integrations/supabase/client";
import { Client } from "@/types/client";

export const getClients = async (includeDeleted: boolean = false): Promise<Client[]> => {
  try {
    let query = supabase
      .from('clients')
      .select('*')
      .order('created_at', { ascending: false });

    if (!includeDeleted) {
      query = query.eq('statut', 'actif');
    }

    const { data, error } = await query;

    if (error) {
      console.error('Erreur lors de la récupération des clients:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Erreur dans getClients:', error);
    throw error;
  }
};

export const createClient = async (clientData: Omit<Client, 'id' | 'created_at'>): Promise<Client> => {
  try {
    const { data, error } = await supabase
      .from('clients')
      .insert([clientData])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Erreur lors de la création du client:', error);
    throw error;
  }
};

export const updateClient = async (id: string, updates: Partial<Client>): Promise<Client> => {
  try {
    const { data, error } = await supabase
      .from('clients')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Erreur lors de la mise à jour du client:', error);
    throw error;
  }
};

export const deleteClient = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('clients')
      .update({ statut: 'supprimé', deleted_at: new Date().toISOString() })
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error('Erreur lors de la suppression du client:', error);
    throw error;
  }
};
