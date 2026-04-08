
import { supabase } from "@/integrations/supabase/client";
import { Collaborateur } from "@/types/collaborateur";

export const getCollaborateurs = async (): Promise<Collaborateur[]> => {
  try {
    const { data, error } = await supabase
      .from('collaborateurs')
      .select('*')
      .eq('statut', 'actif')
      .order('nom', { ascending: true });

    if (error) {
      throw error;
    }

    return (data || []) as unknown as Collaborateur[];
  } catch (error) {
    throw error;
  }
};

export const getCollaborateur = async (id: string): Promise<Collaborateur | null> => {
  try {
    const { data, error } = await supabase
      .from('collaborateurs')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw error;
    }

    return data as unknown as Collaborateur;
  } catch (error) {
    throw error;
  }
};

export const createCollaborateur = async (collaborateurData: Omit<Collaborateur, 'id' | 'created_at'>): Promise<Collaborateur> => {
  try {
    const { data, error } = await supabase
      .from('collaborateurs')
      .insert([collaborateurData as any])
      .select()
      .single();

    if (error) throw error;
    return data as unknown as Collaborateur;
  } catch (error) {
    throw error;
  }
};

export const addCollaborateur = createCollaborateur; // Alias for backward compatibility

export const updateCollaborateur = async (id: string, updates: Partial<Collaborateur>): Promise<Collaborateur> => {
  try {
    const { data, error } = await supabase
      .from('collaborateurs')
      .update(updates as any)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as unknown as Collaborateur;
  } catch (error) {
    throw error;
  }
};

export const deleteCollaborateur = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('collaborateurs')
      .update({ statut: 'inactif' })
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    throw error;
  }
};
