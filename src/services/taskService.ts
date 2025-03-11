
import { supabase } from "@/integrations/supabase/client";

export interface Task {
  id: string;
  title: string;
  client_id: string;
  collaborateur_id: string;
  status: "planifiee" | "en_attente" | "en_cours" | "termine" | "en_retard";
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

  // Check for tasks that should change status based on dates
  const updatedTasks = await updateTaskStatusesBasedOnDates(data);
  return updatedTasks;
};

// Function to determine if a task should have "planifiee" status
export const determineInitialStatus = (startDate: string | null | undefined): Task["status"] => {
  if (!startDate) return "en_attente";
  
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set to beginning of day
  
  const taskStartDate = new Date(startDate);
  taskStartDate.setHours(0, 0, 0, 0); // Set to beginning of day
  
  return taskStartDate > today ? "planifiee" : "en_cours";
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
    if (task.status === "planifiee" && task.start_date) {
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
    return data;
  } catch (err) {
    console.error("Exception lors de la création de la tâche:", err);
    throw err;
  }
};

export const updateTaskStatus = async (taskId: string, status: Task["status"]) => {
  console.log(`Updating task ${taskId} status to ${status}`);
  
  try {
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
    return data;
  } catch (err) {
    console.error("Exception lors de la mise à jour du statut de la tâche:", err);
    throw err;
  }
};

export const deleteTask = async (taskId: string) => {
  console.log(`Deleting task ${taskId}`);
  
  try {
    const { error } = await supabase
      .from("tasks")
      .delete()
      .eq("id", taskId);

    if (error) {
      console.error("Erreur lors de la suppression de la tâche:", error);
      throw error;
    }

    console.log("Task deleted successfully");
    return true;
  } catch (err) {
    console.error("Exception lors de la suppression de la tâche:", err);
    throw err;
  }
};
