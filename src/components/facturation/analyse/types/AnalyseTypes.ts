
export type PeriodFilter = "month" | "quarter" | "year";

export interface AnalyseGlobaleProps {
  period: PeriodFilter;
  clientFilter: string | null;
  statusFilter: string | null;
}

export interface SummaryStats {
  totalFactures: number;
  totalPaiements: number;
  totalImpots: number;
  totalHonoraires: number;
  impotsPendant: number;
  honorairesPendant: number;
  tauxRecouvrement: number;
  facturesParStatut: {
    payées: number;
    partiellementPayées: number;
    nonPayées: number;
    enRetard: number;
  };
  totalFacturesEmises: number;
}

export interface ChartDataItem {
  name: string;
  value: number;
}

export interface MonthlyChartItem {
  name: string;
  facturé: number;
  encaissé: number;
}

// Context interfaces for BillingStatsContext
export interface BillingStatsContextData {
  stats: SummaryStats;
  chartData: ChartDataItem[];
  monthlyData: MonthlyChartItem[];
  isLoading: boolean;
  filters: {
    period: PeriodFilter;
    clientFilter: string | null;
    statusFilter: string | null;
  };
  setFilters: (filters: {
    period?: PeriodFilter;
    clientFilter?: string | null;
    statusFilter?: string | null;
  }) => void;
  refreshData: () => void;
}
