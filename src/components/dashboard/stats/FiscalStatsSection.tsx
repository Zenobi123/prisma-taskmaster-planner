
import { LargeStatsCard } from "./LargeStatsCard";

interface FiscalStatsSectionProps {
  clientStats: any;
  subjectClients: any;
  isClientStatsLoading: boolean;
  isSubjectClientsLoading: boolean;
  onUnfiledDarpClick: () => void;
  onUnpaidIgsClick: () => void;
}

export const FiscalStatsSection = ({
  clientStats,
  subjectClients,
  isClientStatsLoading,
  isSubjectClientsLoading,
  onUnfiledDarpClick,
  onUnpaidIgsClick
}: FiscalStatsSectionProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <LargeStatsCard
        title="DARP non déposées"
        value={isClientStatsLoading ? "--" : (clientStats?.unfiledDarpClients || 0)}
        description={isSubjectClientsLoading ? "-- clients assujettis" : `${subjectClients?.darp || 0} clients assujettis`}
        isLoading={isClientStatsLoading}
        badge={!isClientStatsLoading && (clientStats?.unfiledDarpClients || 0) > 0 ? {
          text: "À régulariser",
          variant: "outline",
          className: "bg-red-100 text-red-800 border-red-300"
        } : undefined}
        onClick={onUnfiledDarpClick}
      />

      <LargeStatsCard
        title="IGS impayés"
        value={isClientStatsLoading ? "--" : (clientStats?.unpaidIgsClients || 0)}
        description={isSubjectClientsLoading ? "-- clients assujettis" : `${subjectClients?.igs || 0} clients assujettis`}
        isLoading={isClientStatsLoading}
        badge={!isClientStatsLoading && (clientStats?.unpaidIgsClients || 0) > 0 ? {
          text: "À régulariser",
          variant: "outline",
          className: "bg-red-100 text-red-800 border-red-300"
        } : undefined}
        onClick={onUnpaidIgsClick}
      />
    </div>
  );
};
