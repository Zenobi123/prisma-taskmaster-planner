
import { supabase } from "@/integrations/supabase/client";
import { Collaborateur, CollaborateurPermissions } from "@/types/collaborateur";

const parsePermissions = (permissions: any): CollaborateurPermissions[] => {
  if (!permissions) return [];
  try {
    if (Array.isArray(permissions)) {
      return permissions.map(p => ({
        module: p.module,
        niveau: p.niveau
      }));
    }
    if (typeof permissions === 'string') {
      const parsed = JSON.parse(permissions);
      return Array.isArray(parsed) ? parsed.map(p => ({
        module: p.module,
        niveau: p.niveau
      })) : [];
    }
    return [];
  } catch (error) {
    console.error("Erreur lors du parsing des permissions:", error);
    return [];
  }
};

export const getCollaborateurs = async () => {
  try {
    console.log("Fetching all collaborateurs...");
    const { data, error } = await supabase
      .from("collaborateurs")
      .select("*")
      .order('nom');

    if (error) {
      console.error("Erreur lors de la récupération des collaborateurs:", error);
      throw error;
    }

    console.log("Collaborateurs data received:", data);
    return data.map(collaborateur => ({
      ...collaborateur,
      permissions: parsePermissions(collaborateur.permissions),
      tachesencours: collaborateur.tachesencours || 0
    })) as Collaborateur[];
  } catch (error) {
    console.error("Erreur lors de la récupération des collaborateurs:", error);
    throw error;
  }
};

export const getCollaborateur = async (id: string) => {
  try {
    console.log("Fetching collaborateur with ID:", id);
    let query = supabase
      .from("collaborateurs")
      .select("*");

    if (id.includes('@')) {
      // Si l'ID est un email
      query = query.eq('email', id.toLowerCase());
    } else {
      // Si l'ID est un UUID
      query = query.eq('user_id', id);
    }

    const { data, error } = await query.single();

    if (error) {
      console.error("Erreur lors de la récupération du collaborateur:", error);
      throw error;
    }

    if (!data) {
      console.log("Collaborateur non trouvé pour l'ID:", id);
      throw new Error("Collaborateur non trouvé");
    }

    console.log("Collaborateur data received:", data);
    return {
      ...data,
      permissions: parsePermissions(data.permissions),
      tachesencours: data.tachesencours || 0
    } as Collaborateur;
  } catch (error) {
    console.error("Erreur lors de la récupération du collaborateur:", error);
    throw error;
  }
};

export const addCollaborateur = async (collaborateur: Omit<Collaborateur, 'id' | 'created_at' | 'tachesencours'>) => {
  try {
    const dataToInsert = {
      ...collaborateur,
      permissions: JSON.stringify(collaborateur.permissions || []),
      tachesencours: 0
    };

    console.log("Données à insérer:", dataToInsert);

    const { data, error } = await supabase
      .from("collaborateurs")
      .insert([dataToInsert])
      .select()
      .single();

    if (error) {
      console.error("Erreur lors de l'ajout du collaborateur:", error);
      throw error;
    }

    return {
      ...data,
      permissions: parsePermissions(data.permissions),
      tachesencours: 0
    } as Collaborateur;
  } catch (error) {
    console.error("Erreur lors de l'ajout du collaborateur:", error);
    throw error;
  }
};

export const updateCollaborateur = async (id: string, collaborateur: Partial<Omit<Collaborateur, 'id' | 'created_at'>>) => {
  try {
    const dataToUpdate = {
      ...collaborateur,
      permissions: collaborateur.permissions ? JSON.stringify(collaborateur.permissions) : undefined
    };
    
    const { data, error } = await supabase
      .from("collaborateurs")
      .update(dataToUpdate)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Erreur lors de la mise à jour du collaborateur:", error);
      throw error;
    }

    return {
      ...data,
      permissions: parsePermissions(data.permissions),
      tachesencours: data.tachesencours || 0
    } as Collaborateur;
  } catch (error) {
    console.error("Erreur lors de la mise à jour du collaborateur:", error);
    throw error;
  }
};

export const deleteCollaborateur = async (id: string) => {
  try {
    const { error } = await supabase
      .from("collaborateurs")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Erreur lors de la suppression du collaborateur:", error);
      throw error;
    }
  } catch (error) {
    console.error("Erreur lors de la suppression du collaborateur:", error);
    throw error;
  }
};

