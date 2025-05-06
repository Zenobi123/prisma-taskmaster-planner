
import { supabase } from "@/integrations/supabase/client";

export interface DocumentAdministratif {
  id: string;
  client_id: string;
  type: 'Administratif' | 'Juridique' | 'Fiscal' | 'Social' | 'Autre';
  nom: string;
  description?: string;
  date_creation: string;
  date_expiration?: string;
  fichier_url?: string;
  statut: string;
  created_at?: string;
  updated_at?: string;
}

export interface ProcedureAdministrative {
  id: string;
  client_id: string;
  titre: string;
  description?: string;
  etapes?: any[];
  responsable?: string;
  statut: string;
  priorite: string;
  date_debut: string;
  date_fin?: string;
  created_at?: string;
  updated_at?: string;
}

// DOCUMENTS ADMINISTRATIFS
export const getDocumentsAdministratifs = async (clientId: string): Promise<DocumentAdministratif[]> => {
  const { data, error } = await supabase
    .from('documents_administratifs')
    .select('*')
    .eq('client_id', clientId)
    .order('date_creation', { ascending: false });

  if (error) {
    console.error("Erreur lors de la récupération des documents:", error);
    throw error;
  }
  
  return data || [];
};

export const addDocumentAdministratif = async (document: Omit<DocumentAdministratif, 'id' | 'created_at' | 'updated_at'>): Promise<DocumentAdministratif> => {
  const { data, error } = await supabase
    .from('documents_administratifs')
    .insert([document])
    .select()
    .single();

  if (error) {
    console.error("Erreur lors de l'ajout du document:", error);
    throw error;
  }
  
  return data;
};

export const updateDocumentAdministratif = async (id: string, updates: Partial<DocumentAdministratif>): Promise<DocumentAdministratif> => {
  const { data, error } = await supabase
    .from('documents_administratifs')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error("Erreur lors de la mise à jour du document:", error);
    throw error;
  }
  
  return data;
};

export const deleteDocumentAdministratif = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('documents_administratifs')
    .delete()
    .eq('id', id);

  if (error) {
    console.error("Erreur lors de la suppression du document:", error);
    throw error;
  }
};

// PROCÉDURES ADMINISTRATIVES
export const getProceduresAdministratives = async (clientId: string): Promise<ProcedureAdministrative[]> => {
  const { data, error } = await supabase
    .from('procedures_administratives')
    .select('*')
    .eq('client_id', clientId)
    .order('date_debut', { ascending: false });

  if (error) {
    console.error("Erreur lors de la récupération des procédures:", error);
    throw error;
  }
  
  return data || [];
};

export const addProcedureAdministrative = async (procedure: Omit<ProcedureAdministrative, 'id' | 'created_at' | 'updated_at'>): Promise<ProcedureAdministrative> => {
  const { data, error } = await supabase
    .from('procedures_administratives')
    .insert([procedure])
    .select()
    .single();

  if (error) {
    console.error("Erreur lors de l'ajout de la procédure:", error);
    throw error;
  }
  
  return data;
};

export const updateProcedureAdministrative = async (id: string, updates: Partial<ProcedureAdministrative>): Promise<ProcedureAdministrative> => {
  const { data, error } = await supabase
    .from('procedures_administratives')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error("Erreur lors de la mise à jour de la procédure:", error);
    throw error;
  }
  
  return data;
};

export const deleteProcedureAdministrative = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('procedures_administratives')
    .delete()
    .eq('id', id);

  if (error) {
    console.error("Erreur lors de la suppression de la procédure:", error);
    throw error;
  }
};
