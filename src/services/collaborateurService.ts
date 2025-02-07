
import { supabase } from "@/integrations/supabase/client";
import { Collaborateur, CollaborateurRole } from "@/types/collaborateur";

export const getCollaborateurs = async () => {
  try {
    const { data, error } = await supabase
      .from("collaborateurs")
      .select("*");

    if (error) {
      console.error("Erreur lors de la récupération des collaborateurs:", error);
      throw error;
    }

    return data as Collaborateur[];
  } catch (error) {
    console.error("Erreur lors de la récupération des collaborateurs:", error);
    throw error;
  }
};

export const addCollaborateur = async (collaborateur: {
  nom: string;
  prenom: string;
  email: string;
  poste: CollaborateurRole;
  telephone: string;
  niveauetude: string;
  dateentree: string;
  datenaissance: string;
  ville: string;
  quartier: string;
}) => {
  try {
    const { data, error } = await supabase
      .from("collaborateurs")
      .insert([{ 
        ...collaborateur,
        statut: "actif",
        tachesencours: 0,
        permissions: []
      }])
      .select()
      .single();

    if (error) {
      console.error("Erreur lors de l'ajout du collaborateur:", error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Erreur lors de l'ajout du collaborateur:", error);
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
