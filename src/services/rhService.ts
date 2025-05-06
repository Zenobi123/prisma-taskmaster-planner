
import { supabase } from "@/integrations/supabase/client";

export interface Employe {
  id: string;
  client_id: string;
  nom: string;
  prenom: string;
  email?: string;
  telephone?: string;
  adresse?: string;
  date_naissance?: string;
  genre?: 'Homme' | 'Femme';
  poste: string;
  departement?: string;
  date_embauche: string;
  type_contrat?: 'CDI' | 'CDD' | 'Stage' | 'Prestation';
  salaire_base: number;
  numero_cnps?: string;
  banque?: string;
  numero_compte?: string;
  statut: 'Actif' | 'Congé' | 'Arrêt maladie' | 'Inactif';
  created_at?: string;
  updated_at?: string;
}

export interface ContratEmploye {
  id: string;
  employe_id: string;
  type: 'CDI' | 'CDD' | 'Stage' | 'Prestation';
  date_debut: string;
  date_fin?: string;
  fichier_url?: string;
  statut: 'Actif' | 'Terminé' | 'Résilié';
  details?: any;
  created_at?: string;
  updated_at?: string;
}

export interface Conge {
  id: string;
  employe_id: string;
  type: 'Congés payés' | 'Maladie' | 'Maternité' | 'Formation' | 'Sans solde' | 'Autre';
  date_debut: string;
  date_fin: string;
  duree_jours: number;
  motif?: string;
  statut: 'En attente' | 'Approuvé' | 'Refusé' | 'Annulé';
  created_at?: string;
  updated_at?: string;
}

// EMPLOYÉS
export const getEmployes = async (clientId: string): Promise<Employe[]> => {
  const { data, error } = await supabase
    .from('employes')
    .select('*')
    .eq('client_id', clientId)
    .order('nom');

  if (error) {
    console.error("Erreur lors de la récupération des employés:", error);
    throw error;
  }
  
  return data || [];
};

export const addEmploye = async (employe: Omit<Employe, 'id' | 'created_at' | 'updated_at'>): Promise<Employe> => {
  const { data, error } = await supabase
    .from('employes')
    .insert([employe])
    .select()
    .single();

  if (error) {
    console.error("Erreur lors de l'ajout de l'employé:", error);
    throw error;
  }
  
  return data;
};

export const updateEmploye = async (id: string, updates: Partial<Employe>): Promise<Employe> => {
  const { data, error } = await supabase
    .from('employes')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error("Erreur lors de la mise à jour de l'employé:", error);
    throw error;
  }
  
  return data;
};

export const deleteEmploye = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('employes')
    .delete()
    .eq('id', id);

  if (error) {
    console.error("Erreur lors de la suppression de l'employé:", error);
    throw error;
  }
};

// CONTRATS
export const getContratsEmploye = async (employeId: string): Promise<ContratEmploye[]> => {
  const { data, error } = await supabase
    .from('contrats_employes')
    .select('*')
    .eq('employe_id', employeId)
    .order('date_debut', { ascending: false });

  if (error) {
    console.error("Erreur lors de la récupération des contrats:", error);
    throw error;
  }
  
  return data || [];
};

export const addContratEmploye = async (contrat: Omit<ContratEmploye, 'id' | 'created_at' | 'updated_at'>): Promise<ContratEmploye> => {
  const { data, error } = await supabase
    .from('contrats_employes')
    .insert([contrat])
    .select()
    .single();

  if (error) {
    console.error("Erreur lors de l'ajout du contrat:", error);
    throw error;
  }
  
  return data;
};

export const updateContratEmploye = async (id: string, updates: Partial<ContratEmploye>): Promise<ContratEmploye> => {
  const { data, error } = await supabase
    .from('contrats_employes')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error("Erreur lors de la mise à jour du contrat:", error);
    throw error;
  }
  
  return data;
};

// CONGÉS
export const getConges = async (employeId: string): Promise<Conge[]> => {
  const { data, error } = await supabase
    .from('conges')
    .select('*')
    .eq('employe_id', employeId)
    .order('date_debut', { ascending: false });

  if (error) {
    console.error("Erreur lors de la récupération des congés:", error);
    throw error;
  }
  
  return data || [];
};

export const addConge = async (conge: Omit<Conge, 'id' | 'created_at' | 'updated_at'>): Promise<Conge> => {
  const { data, error } = await supabase
    .from('conges')
    .insert([conge])
    .select()
    .single();

  if (error) {
    console.error("Erreur lors de l'ajout du congé:", error);
    throw error;
  }
  
  return data;
};

export const updateConge = async (id: string, updates: Partial<Conge>): Promise<Conge> => {
  const { data, error } = await supabase
    .from('conges')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error("Erreur lors de la mise à jour du congé:", error);
    throw error;
  }
  
  return data;
};
