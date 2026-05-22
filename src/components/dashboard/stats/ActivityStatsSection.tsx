
import { StatsCard } from "./StatsCard";
import type { ClientStats } from "@/services/clientStatsService";
import type { SubjectClientsCount } from "@/services/subjectClientsService";

interface ActivityStatsSectionProps {
  clientStats: ClientStats | null;
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
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
      <StatsCard
        title="Clients gérés"
        value={isClientStatsLoading ? "--" : (clientStats?.managedClients || 0)}
        description="Clients actifs"
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
