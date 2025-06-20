
import { StatsCard } from "./StatsCard";

interface ActivityStatsSectionProps {
  clientStats: any;
  overdueTasks: number;
  activeTasks: number;
  isClientStatsLoading: boolean;
  isTasksLoading: boolean;
}

export const ActivityStatsSection = ({
  clientStats,
  overdueTasks,
  activeTasks,
  isClientStatsLoading,
  isTasksLoading
}: ActivityStatsSectionProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <StatsCard
        title="Clients inscrits en FANR H2"
        value={isClientStatsLoading ? "--" : (clientStats?.fanrH2Clients || 0)}
        description="Total"
        isLoading={isClientStatsLoading}
      />

      <StatsCard
        title="Missions en cours"
        value={isTasksLoading ? "--" : overdueTasks}
        description={isTasksLoading ? "-- Tâches actives" : `${activeTasks} Tâches actives`}
        isLoading={isTasksLoading}
        isOverdue={!isTasksLoading && overdueTasks > 0}
        badge={!isTasksLoading && overdueTasks > 0 ? {
          text: "En retard",
          variant: "destructive",
          className: "animate-pulse"
        } : undefined}
      />
    </div>
  );
};
