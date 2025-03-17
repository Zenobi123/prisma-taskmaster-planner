
import { Task } from "@/services/taskService";
import { Event } from "@/types/event";

/**
 * Transforms task data from the API into event objects for the Planning view
 */
export const transformTasksToEvents = (tasks: any[]): Event[] => {
  return tasks.map((task: any) => {
    const startTime = task.start_time || "00:00";
    const endTime = task.end_time || "00:00";
    const timeString = `${startTime} - ${endTime}`;

    const clientName = task.clients 
      ? (task.clients.type === "physique" ? task.clients.nom : task.clients.raisonsociale) 
      : "Sans client";

    const collaborateurName = task.collaborateurs
      ? `${task.collaborateurs.prenom} ${task.collaborateurs.nom}`
      : "Non assigné";

    const eventType: "mission" | "reunion" = task.title.toLowerCase().includes("réunion") 
      ? "reunion" 
      : "mission";

    return {
      id: task.id,
      title: task.title,
      client: clientName,
      collaborateur: collaborateurName,
      time: timeString,
      type: eventType,
    };
  });
};

/**
 * Extracts unique dates from tasks for calendar highlighting
 */
export const extractDatesWithEvents = (tasks: any[]): Date[] => {
  const uniqueDates = tasks
    .filter((task: any) => task.start_date)
    .map((task: any) => {
      const date = new Date(task.start_date);
      return new Date(date.getFullYear(), date.getMonth(), date.getDate());
    });

  // Remove duplicates
  const uniqueDateSet = Array.from(
    new Set(uniqueDates.map(date => date.toISOString().split('T')[0]))
  ).map(dateStr => new Date(dateStr));

  return uniqueDateSet;
};

/**
 * Filters events by selected date and collaborateur
 */
export const filterEvents = (events: Event[], options: {
  collaborateurFilter: string, 
  date: Date | undefined,
  tasks: any[]
}): Event[] => {
  const { collaborateurFilter, date, tasks } = options;
  
  return events.filter((event) => {
    const isSameCollaborateur = collaborateurFilter === "all" || event.collaborateur === collaborateurFilter;
    
    const taskData = tasks?.find((task: any) => task.id === event.id);
    const taskDate = taskData?.start_date ? new Date(taskData.start_date) : null;
    
    let isSameDate = false;
    if (date && taskDate) {
      isSameDate = 
        date.getDate() === taskDate.getDate() && 
        date.getMonth() === taskDate.getMonth() && 
        date.getFullYear() === taskDate.getFullYear();
    }
    
    return isSameCollaborateur && isSameDate;
  });
};
