import { useQuery } from "@tanstack/react-query";
import { getClientsStats } from "@/services/clientStatsService";
import { getClientsSubjectToObligation } from "@/services/subjectClientsService";
import { ClientStatsSection } from "./stats/ClientStatsSection";
import { FiscalStatsSection } from "./stats/FiscalStatsSection";
import { ActivityStatsSection } from "./stats/ActivityStatsSection";
import { FanrH2StatsCard } from "./stats/FanrH2StatsCard";

export default function QuickStats() {
  const { data: clientStats, isLoading: isClientStatsLoading } = useQuery({
    queryKey: ["client-stats"],
    queryFn: getClientsStats,
    refetchInterval: 30000,
  });

  const { data: subjectClients, isLoading: isSubjectClientsLoading } = useQuery({
    queryKey: ["subject-clients"],
    queryFn: getClientsSubjectToObligation,
    refetchInterval: 30000,
  });

  const handleUnpaidPatenteClick = () => {
    // Logic to handle unpaid patente click
  };

  const handleUnfiledDarpClick = () => {
    // Logic to handle unfiled DARP click
  };

  const handleUnpaidIgsClick = () => {
    // Logic to handle unpaid IGS click
  };

  return (
    <div className="space-y-6">
      {/* Client Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <ClientStatsSection
          clientStats={clientStats}
          subjectClients={subjectClients}
          isClientStatsLoading={isClientStatsLoading}
          isSubjectClientsLoading={isSubjectClientsLoading}
          onUnpaidPatenteClick={handleUnpaidPatenteClick}
        />
        <FanrH2StatsCard />
      </div>

      {/* Fiscal Stats Section */}
      <FiscalStatsSection
        clientStats={clientStats}
        subjectClients={subjectClients}
        isClientStatsLoading={isClientStatsLoading}
        isSubjectClientsLoading={isSubjectClientsLoading}
        onUnfiledDarpClick={handleUnfiledDarpClick}
        onUnpaidIgsClick={handleUnpaidIgsClick}
      />

      {/* Activity Stats Section */}
      <ActivityStatsSection />
    </div>
  );
}
