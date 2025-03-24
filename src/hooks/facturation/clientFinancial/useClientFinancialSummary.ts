
import { useFinancialDataFetcher } from "./summary/useFinancialDataFetcher";

export const useClientFinancialSummary = () => {
  const {
    clientsSummary,
    chartData,
    isLoading,
    fetchClientsFinancialData
  } = useFinancialDataFetcher();

  return {
    clientsSummary,
    isLoading,
    chartData,
    fetchClientsFinancialData
  };
};
