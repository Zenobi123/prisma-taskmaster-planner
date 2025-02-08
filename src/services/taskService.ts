
import { supabase } from "@/integrations/supabase/client";

export interface Task {
  id: string;
  title: string;
  client_id: string;
  collaborateur_id: string;
  status: "en_attente" | "en_cours" | "termine";
  created_at: string;
  updated_at: string;
}

export const getTasks = async () => {
  try {
    const { data, error } = await supabase
      .from("tasks")
      .select(`
        *,
        clients (
          id,
          nom,
          raisonsociale,
          type
        ),
        collaborateurs (
          id,
          nom,
          prenom
        )
      `)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Erreur lors de la récupération des tâches:", error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Erreur lors de la récupération des tâches:", error);
    throw error;
  }
};

export const createTask = async (task: Omit<Task, "id" | "created_at" | "updated_at">) => {
  try {
    const { data, error } = await supabase
      .from("tasks")
      .insert([task])
      .select()
      .single();

    if (error) {
      console.error("Erreur lors de la création de la tâche:", error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Erreur lors de la création de la tâche:", error);
    throw error;
  }
};
