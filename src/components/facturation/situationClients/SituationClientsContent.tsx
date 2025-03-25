
import ClientsList from "./ClientsList";
import ClientsChart from "./ClientsChart";
import { ClientFinancialSummary } from "@/types/clientFinancial";

interface SituationClientsContentProps {
  clientsSummary: ClientFinancialSummary[];
  isLoading: boolean;
  chartData: Array<{ name: string; total: number }>;
  onViewDetails: (clientId: string) => void;
}

const SituationClientsContent = ({
  clientsSummary,
  isLoading,
  chartData,
  onViewDetails
}: SituationClientsContentProps) => {
  return (
    <div className="flex flex-col gap-6">
      <ClientsList 
        clientsSummary={clientsSummary} 
        isLoading={isLoading} 
        onViewDetails={onViewDetails} 
      />
      
      <ClientsChart chartData={chartData} />
    </div>
  );
};

export default SituationClientsContent;
