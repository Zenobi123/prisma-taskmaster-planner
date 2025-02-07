
import { supabase } from "@/integrations/supabase/client";
import { Collaborateur, CollaborateurRole } from "@/types/collaborateur";

export const getCollaborateurs = async () => {
  const { data, error } = await supabase
    .from("collaborateurs")
    .select("*");

  if (error) {
    console.error("Erreur lors de la récupération des collaborateurs:", error);
    throw error;
  }

  return data as Collaborateur[];
};

export const addCollaborateur = async (collaborateur: {
  nom: string;
  prenom: string;
  email: string;
  poste: CollaborateurRole;
  telephone: string;
  niveauEtude: string;
  dateEntree: string;
  dateNaissance: string;
  ville: string;
  quartier: string;
}) => {
  const { data, error } = await supabase
    .from("collaborateurs")
    .insert([{ 
      ...collaborateur,
      statut: "actif",
      tachesEnCours: 0,
      permissions: []
    }])
    .select()
    .single();

  if (error) {
    console.error("Erreur lors de l'ajout du collaborateur:", error);
    throw error;
  }

  return data;
};

export const deleteCollaborateur = async (id: string) => {
  const { error } = await supabase
    .from("collaborateurs")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Erreur lors de la suppression du collaborateur:", error);
    throw error;
  }
};
