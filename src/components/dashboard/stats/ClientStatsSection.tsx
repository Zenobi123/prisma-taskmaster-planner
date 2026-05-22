
import { StatsCard } from "./StatsCard";
import type { ClientStats } from "@/services/clientStatsService";
import type { SubjectClientsCount } from "@/services/subjectClientsService";

interface ClientStatsSectionProps {
  clientStats: ClientStats | null;
  subjectClients: SubjectClientsCount | null;
  isClientStatsLoading: boolean;
  isSubjectClientsLoading: boolean;
  onUnpaidPatenteClick: () => void;
}

export const ClientStatsSection = ({
  clientStats,
  subjectClients,
  isClientStatsLoading,
  isSubjectClientsLoading,
  onUnpaidPatenteClick
}: ClientStatsSectionProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
      <StatsCard
        title="Clients en gestion"
        value={isClientStatsLoading ? "--" : (clientStats?.managedClients || 0)}
        description="Total"
        isLoading={isClientStatsLoading}
      />

      <StatsCard
        title="DSF non déposées"
        value={isClientStatsLoading ? "--" : (clientStats?.unfiledDsfClients || 0)}
        description={isSubjectClientsLoading ? "-- clients assujettis" : `${subjectClients?.dsf || 0} clients assujettis`}
        isLoading={isClientStatsLoading}
      />

      <StatsCard
        title="Patentes impayées"
        value={isClientStatsLoading ? "--" : (clientStats?.unpaidPatenteClients || 0)}
        description={isSubjectClientsLoading ? "-- clients assujettis" : `${subjectClients?.patente || 0} clients assujettis`}
        isLoading={isClientStatsLoading}
        badge={!isClientStatsLoading && (clientStats?.unpaidPatenteClients || 0) > 0 ? {
          text: "À régulariser",
          variant: "outline",
          className: "bg-red-100 text-red-800 border-red-300"
        } : undefined}
        onClick={onUnpaidPatenteClick}
      />
    </div>
  );
};
