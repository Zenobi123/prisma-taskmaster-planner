
import { useMemo } from "react";

export const useTaskStats = (tasks: any[], isLoading: boolean) => {
  return useMemo(() => {
    if (isLoading || !tasks) {
      return {
        activeTasks: 0,
        overdueTasks: 0,
        completedMissions: 0
      };
    }

    // Count tasks that are currently active (en_cours)
    const activeTasks = tasks.filter((task: any) => task.status === "en_cours").length;

    // Count overdue tasks - use end_date instead of deadline
    const now = new Date();
    now.setHours(0, 0, 0, 0); // Set to beginning of day for accurate comparison
    
    const overdueTasks = tasks.filter((task: any) => {
      if (task.status === "termine" || !task.end_date) return false;
      const endDate = new Date(task.end_date);
      endDate.setHours(0, 0, 0, 0); // Set to beginning of day
      return endDate < now;
    }).length;

    // Count completed missions this month
    const currentMonth = new Date().getMonth();
    const completedMissions = tasks.filter((task: any) => {
      if (task.status !== "termine" || !task.end_date) return false;
      const endDate = new Date(task.end_date);
      return endDate.getMonth() === currentMonth;
    }).length;

    console.log("Task stats calculation:", {
      totalTasks: tasks.length,
      activeTasks,
      overdueTasks,
      completedMissions,
      now: now.toISOString().split('T')[0]
    });

    return {
      activeTasks,
      overdueTasks,
      completedMissions
    };
  }, [tasks, isLoading]);
};
