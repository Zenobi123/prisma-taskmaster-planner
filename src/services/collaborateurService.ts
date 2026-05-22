
import { supabase } from "@/integrations/supabase/client";
import type { TablesInsert, TablesUpdate } from "@/integrations/supabase/types";
import { Collaborateur } from "@/types/collaborateur";

export const getCollaborateurs = async (): Promise<Collaborateur[]> => {
  const { data, error } = await supabase
    .from('collaborateurs')
    .select('*')
    .eq('statut', 'actif')
    .order('nom', { ascending: true });

  if (error) {
    throw error;
  }

  return (data || []) as unknown as Collaborateur[];
};

export const getCollaborateur = async (id: string): Promise<Collaborateur | null> => {
  const { data, error } = await supabase
    .from('collaborateurs')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    throw error;
  }

  return data as unknown as Collaborateur;
};

export const createCollaborateur = async (collaborateurData: Omit<Collaborateur, 'id' | 'created_at'>): Promise<Collaborateur> => {
  const { data, error } = await supabase
    .from('collaborateurs')
    .insert([collaborateurData as unknown as TablesInsert<"collaborateurs">])
    .select()
    .single();

  if (error) throw error;
  return data as unknown as Collaborateur;
};

export const addCollaborateur = createCollaborateur; // Alias for backward compatibility

export const updateCollaborateur = async (id: string, updates: Partial<Collaborateur>): Promise<Collaborateur> => {
  const { data, error } = await supabase
    .from('collaborateurs')
    .update(updates as unknown as TablesUpdate<"collaborateurs">)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as unknown as Collaborateur;
};

export const deleteCollaborateur = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('collaborateurs')
    .update({ statut: 'inactif' })
    .eq('id', id);

  if (error) throw error;
};
