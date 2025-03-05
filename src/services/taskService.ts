
import { supabase } from "@/integrations/supabase/client";

export interface Task {
  id: string;
  title: string;
  client_id: string;
  collaborateur_id: string;
  status: "en_attente" | "en_cours" | "termine";
  created_at: string;
  updated_at: string;
  start_date?: string;
  end_date?: string;
}

export const getTasks = async () => {
  const { data, error } = await supabase
    .from("tasks")
    .select(`
      *,
      clients!tasks_client_id_fkey (
        id,
        nom,
        raisonsociale,
        type
      ),
      collaborateurs!tasks_collaborateur_id_fkey (
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
};

export const createTask = async (task: Omit<Task, "id" | "created_at" | "updated_at">) => {
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
};
