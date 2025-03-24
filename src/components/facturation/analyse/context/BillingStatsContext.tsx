
import React, { createContext, useContext, useState, useCallback } from "react";
import { 
  BillingStatsContextData, 
  PeriodFilter, 
  SummaryStats, 
  ChartDataItem,
  MonthlyChartItem 
} from "../types/AnalyseTypes";
import { useAnalyseGlobale } from "../hooks/useAnalyseGlobale";

// Create context with a default empty value
const BillingStatsContext = createContext<BillingStatsContextData | undefined>(undefined);

// Default summary stats
const defaultStats: SummaryStats = {
  totalFactures: 0,
  totalPaiements: 0,
  totalImpots: 0,
  totalHonoraires: 0,
  impotsPendant: 0,
  honorairesPendant: 0,
  tauxRecouvrement: 0,
  facturesParStatut: {
    payées: 0,
    partiellementPayées: 0,
    nonPayées: 0,
    enRetard: 0
  },
  totalFacturesEmises: 0
};

export interface BillingStatsProviderProps {
  children: React.ReactNode;
}

export const BillingStatsProvider: React.FC<BillingStatsProviderProps> = ({ children }) => {
  // State for filters
  const [filters, setFiltersState] = useState({
    period: "month" as PeriodFilter,
    clientFilter: null as string | null,
    statusFilter: null as string | null
  });

  // Custom hook to fetch data based on filters
  const { stats, isLoading, chartData, monthlyData } = useAnalyseGlobale(
    filters.period,
    filters.clientFilter,
    filters.statusFilter
  );

  // Update filters
  const setFilters = useCallback((newFilters: {
    period?: PeriodFilter;
    clientFilter?: string | null;
    statusFilter?: string | null;
  }) => {
    setFiltersState(prev => ({
      ...prev,
      ...newFilters
    }));
  }, []);

  // Refresh data function
  const refreshData = useCallback(() => {
    // This will trigger a re-fetch in the useAnalyseGlobale hook
    setFiltersState(prev => ({ ...prev }));
  }, []);

  // Create the context value
  const contextValue: BillingStatsContextData = {
    stats: stats || defaultStats,
    chartData,
    monthlyData,
    isLoading,
    filters,
    setFilters,
    refreshData
  };

  return (
    <BillingStatsContext.Provider value={contextValue}>
      {children}
    </BillingStatsContext.Provider>
  );
};

// Custom hook to use the billing stats context
export const useBillingStats = (): BillingStatsContextData => {
  const context = useContext(BillingStatsContext);
  if (context === undefined) {
    throw new Error("useBillingStats must be used within a BillingStatsProvider");
  }
  return context;
};
