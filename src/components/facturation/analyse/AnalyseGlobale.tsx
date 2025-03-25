
import { useBillingStats } from "./context/BillingStatsContext";
import { AnalyseGlobaleSkeleton } from "./components/AnalyseGlobaleSkeleton";
import { StatsSummaryCards } from "./components/StatsSummaryCards";
import { StatusDistributionChart } from "./components/StatusDistributionChart";
import { MonthlyTrendsChart } from "./components/MonthlyTrendsChart";
import { TaxDistributionCards } from "./components/TaxDistributionCards";

const AnalyseGlobale = () => {
  const { stats, isLoading, chartData, monthlyData } = useBillingStats();

  if (isLoading) {
    return <AnalyseGlobaleSkeleton />;
  }

  return (
    <div>
      <StatsSummaryCards stats={stats} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <StatusDistributionChart chartData={chartData} />
        <MonthlyTrendsChart monthlyData={monthlyData} />
      </div>
      
      <TaxDistributionCards stats={stats} />
    </div>
  );
};

export default AnalyseGlobale;
