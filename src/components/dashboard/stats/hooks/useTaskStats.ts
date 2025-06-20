
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

    // Count overdue tasks
    const now = new Date();
    const overdueTasks = tasks.filter((task: any) => {
      if (task.status !== "en_cours" || !task.deadline) return false;
      const deadline = new Date(task.deadline);
      return deadline < now;
    }).length;

    // Count completed missions this month
    const currentMonth = new Date().getMonth();
    const completedMissions = tasks.filter((task: any) => {
      if (task.status !== "termine" || !task.end_date) return false;
      const endDate = new Date(task.end_date);
      return endDate.getMonth() === currentMonth;
    }).length;

    return {
      activeTasks,
      overdueTasks,
      completedMissions
    };
  }, [tasks, isLoading]);
};
