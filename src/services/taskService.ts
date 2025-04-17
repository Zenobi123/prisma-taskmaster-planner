
import { supabase } from "@/integrations/supabase/client";

export interface Task {
  id: string;
  title: string;
  client_id?: string; // Made optional
  collaborateur_id: string;
  status: "en_attente" | "en_cours" | "termine" | "en_retard";
  created_at: string;
  updated_at: string;
  start_date?: string;
  end_date?: string;
  start_time?: string;
  end_time?: string;
  // Relations
  collaborateurs?: {
    id: string;
    nom: string;
    prenom: string;
  };
  clients?: {
    id: string;
    nom: string;
    raisonsociale: string;
    type: string;
  };
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

  // Mise à jour des statuts sans filtrage par date
  const updatedTasks = await updateTaskStatusesBasedOnDates(data);
  
  // Mettre à jour le nombre de tâches en cours pour chaque collaborateur
  await updateCollaborateurTaskCounts(updatedTasks);
  
  return updatedTasks;
};

// Update collaborateur task counts based on current tasks
const updateCollaborateurTaskCounts = async (tasks: Task[]) => {
  try {
    // Group tasks by collaborateur and count active tasks
    const collaborateurTaskCounts = new Map<string, number>();
    
    tasks.forEach(task => {
      if (task.status === "en_cours" && task.collaborateur_id) {
        const count = collaborateurTaskCounts.get(task.collaborateur_id) || 0;
        collaborateurTaskCounts.set(task.collaborateur_id, count + 1);
      }
    });
    
    // Get all collaborateurs to update their tachesencours
    const { data: collaborateurs, error: fetchError } = await supabase
      .from("collaborateurs")
      .select("id, tachesencours");
      
    if (fetchError) {
      console.error("Erreur lors de la récupération des collaborateurs:", fetchError);
      return;
    }
    
    // Update each collaborateur's tachesencours count in the database
    for (const collaborateur of collaborateurs) {
      const taskCount = collaborateurTaskCounts.get(collaborateur.id) || 0;
      
      // Only update if the count has changed
      if (taskCount !== collaborateur.tachesencours) {
        const { error: updateError } = await supabase
          .from("collaborateurs")
          .update({ tachesencours: taskCount })
          .eq("id", collaborateur.id);
          
        if (updateError) {
          console.error(`Erreur lors de la mise à jour du nombre de tâches pour le collaborateur ${collaborateur.id}:`, updateError);
        }
      }
    }
    
    console.log("Nombre de tâches en cours des collaborateurs mis à jour avec succès");
  } catch (error) {
    console.error("Erreur lors de la mise à jour du nombre de tâches des collaborateurs:", error);
  }
};

// Function to determine initial status based on start date
export const determineInitialStatus = (startDate: string | null | undefined): Task["status"] => {
  if (!startDate) return "en_attente";
  
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set to beginning of day
  
  const taskStartDate = new Date(startDate);
  taskStartDate.setHours(0, 0, 0, 0); // Set to beginning of day
  
  // Si la date de début est dans le futur, on met en "en_attente" (au lieu de "planifiee")
  // car la base de données n'accepte pas "planifiee" comme valeur
  return taskStartDate > today ? "en_attente" : "en_cours";
};

// Function to check and update task statuses based on their dates
const updateTaskStatusesBasedOnDates = async (tasks: any[]): Promise<any[]> => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set to beginning of day
  
  const tasksToUpdate: { id: string, status: Task["status"] }[] = [];
  
  // Identify tasks that need status update
  tasks.forEach(task => {
    // Check for overdue tasks
    if (task.status !== "termine" && task.end_date) {
      const endDate = new Date(task.end_date);
      endDate.setHours(0, 0, 0, 0);
      
      if (endDate < today) {
        tasksToUpdate.push({
          id: task.id,
          status: "en_retard"
        });
        return; // Skip other checks for this task
      }
    }
    
    // Check for planned tasks that should now be in progress
    if (task.status === "en_attente" && task.start_date) {
      const startDate = new Date(task.start_date);
      startDate.setHours(0, 0, 0, 0);
      
      if (startDate <= today) {
        tasksToUpdate.push({
          id: task.id,
          status: "en_cours"
        });
      }
    }
  });
  
  // Update tasks if needed
  for (const task of tasksToUpdate) {
    try {
      await updateTaskStatus(task.id, task.status);
      // Update the status in the original array to return the updated data
      const index = tasks.findIndex(t => t.id === task.id);
      if (index !== -1) {
        tasks[index].status = task.status;
      }
    } catch (error) {
      console.error(`Failed to auto-update task ${task.id} status:`, error);
    }
  }
  
  return tasks;
};

export const createTask = async (task: Omit<Task, "id" | "created_at" | "updated_at">) => {
  console.log("Creating task with data:", task);
  
  try {
    // Determine initial status based on start date
    const initialStatus = determineInitialStatus(task.start_date);
    const taskWithStatus = {
      ...task,
      status: initialStatus
    };
    
    const { data, error } = await supabase
      .from("tasks")
      .insert([taskWithStatus])
      .select()
      .single();

    if (error) {
      console.error("Erreur lors de la création de la tâche:", error);
      throw error;
    }

    console.log("Task created successfully:", data);
    
    // Update the collaborateur's task count after creating a new task
    if (initialStatus === "en_cours") {
      await incrementCollaborateurTaskCount(task.collaborateur_id);
    }
    
    return data;
  } catch (err) {
    console.error("Exception lors de la création de la tâche:", err);
    throw err;
  }
};

export const updateTaskStatus = async (taskId: string, status: Task["status"]) => {
  console.log(`Updating task ${taskId} status to ${status}`);
  
  try {
    // Get the current task to compare statuses
    const { data: currentTask, error: fetchError } = await supabase
      .from("tasks")
      .select("status, collaborateur_id")
      .eq("id", taskId)
      .single();
      
    if (fetchError) {
      console.error("Erreur lors de la récupération de la tâche actuelle:", fetchError);
      throw fetchError;
    }
    
    // Update the task status
    const { data, error } = await supabase
      .from("tasks")
      .update({ status })
      .eq("id", taskId)
      .select()
      .single();

    if (error) {
      console.error("Erreur lors de la mise à jour du statut de la tâche:", error);
      throw error;
    }

    console.log("Task status updated successfully:", data);
    
    // Update the collaborateur's task count if the status changes between en_cours and something else
    if (currentTask.collaborateur_id) {
      if (currentTask.status !== "en_cours" && status === "en_cours") {
        // Task is now in progress, increment counter
        await incrementCollaborateurTaskCount(currentTask.collaborateur_id);
      } else if (currentTask.status === "en_cours" && status !== "en_cours") {
        // Task is no longer in progress, decrement counter
        await decrementCollaborateurTaskCount(currentTask.collaborateur_id);
      }
    }
    
    return data;
  } catch (err) {
    console.error("Exception lors de la mise à jour du statut de la tâche:", err);
    throw err;
  }
};

export const deleteTask = async (taskId: string) => {
  console.log(`Deleting task ${taskId}`);
  
  try {
    // Get the task to check status and collaborateur
    const { data: taskToDelete, error: fetchError } = await supabase
      .from("tasks")
      .select("status, collaborateur_id")
      .eq("id", taskId)
      .single();
      
    if (fetchError) {
      console.error("Erreur lors de la récupération de la tâche à supprimer:", fetchError);
      throw fetchError;
    }
    
    // Delete the task
    const { error } = await supabase
      .from("tasks")
      .delete()
      .eq("id", taskId);

    if (error) {
      console.error("Erreur lors de la suppression de la tâche:", error);
      throw error;
    }

    console.log("Task deleted successfully");
    
    // If the task was in progress, decrement the collaborateur's task count
    if (taskToDelete.status === "en_cours" && taskToDelete.collaborateur_id) {
      await decrementCollaborateurTaskCount(taskToDelete.collaborateur_id);
    }
    
    return true;
  } catch (err) {
    console.error("Exception lors de la suppression de la tâche:", err);
    throw err;
  }
};

// Helper function to increment a collaborateur's task count
const incrementCollaborateurTaskCount = async (collaborateurId: string) => {
  try {
    const { data, error } = await supabase
      .from("collaborateurs")
      .select("tachesencours")
      .eq("id", collaborateurId)
      .single();
      
    if (error) {
      console.error("Erreur lors de la récupération du nombre de tâches du collaborateur:", error);
      return;
    }
    
    const currentCount = data.tachesencours || 0;
    const newCount = currentCount + 1;
    
    const { error: updateError } = await supabase
      .from("collaborateurs")
      .update({ tachesencours: newCount })
      .eq("id", collaborateurId);
      
    if (updateError) {
      console.error("Erreur lors de l'incrémentation du nombre de tâches du collaborateur:", updateError);
    }
  } catch (err) {
    console.error("Exception lors de l'incrémentation du nombre de tâches du collaborateur:", err);
  }
};

// Helper function to decrement a collaborateur's task count
const decrementCollaborateurTaskCount = async (collaborateurId: string) => {
  try {
    const { data, error } = await supabase
      .from("collaborateurs")
      .select("tachesencours")
      .eq("id", collaborateurId)
      .single();
      
    if (error) {
      console.error("Erreur lors de la récupération du nombre de tâches du collaborateur:", error);
      return;
    }
    
    const currentCount = data.tachesencours || 0;
    const newCount = Math.max(0, currentCount - 1); // Ensure count doesn't go below 0
    
    const { error: updateError } = await supabase
      .from("collaborateurs")
      .update({ tachesencours: newCount })
      .eq("id", collaborateurId);
      
    if (updateError) {
      console.error("Erreur lors de la décrémentation du nombre de tâches du collaborateur:", updateError);
    }
  } catch (err) {
    console.error("Exception lors de la décrémentation du nombre de tâches du collaborateur:", err);
  }
};
