
import { StatsCard } from "./StatsCard";
import { useClientFinancialStats } from "./hooks/useClientFinancialStats";

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
  const { unpaidInvoicesCount, totalOutstandingAmount, isLoading: isFinancialStatsLoading } = useClientFinancialStats();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

      <StatsCard
        title="Factures impayées"
        value={isFinancialStatsLoading ? "--" : unpaidInvoicesCount}
        description="Clients en gestion"
        isLoading={isFinancialStatsLoading}
        badge={!isFinancialStatsLoading && unpaidInvoicesCount > 0 ? {
          text: "À suivre",
          variant: "outline",
          className: "bg-orange-100 text-orange-800 border-orange-300"
        } : undefined}
      />

      <StatsCard
        title="Créances clients"
        value={isFinancialStatsLoading ? "--" : `${Math.round(totalOutstandingAmount).toLocaleString()} F`}
        description="Montant total"
        isLoading={isFinancialStatsLoading}
        badge={!isFinancialStatsLoading && totalOutstandingAmount > 0 ? {
          text: "À recouvrer",
          variant: "outline", 
          className: "bg-blue-100 text-blue-800 border-blue-300"
        } : undefined}
      />
    </div>
  );
};
