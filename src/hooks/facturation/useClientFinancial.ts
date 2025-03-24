
import { useClientFinancialSummary } from "./clientFinancial/useClientFinancialSummary";
import { useClientFinancialDetails } from "./clientFinancial/useClientFinancialDetails";
import { useClientFinancialActions } from "./clientFinancial/useClientFinancialActions";

export const useClientFinancial = () => {
  const { 
    clientsSummary, 
    isLoading: isSummaryLoading, 
    chartData,
    fetchClientsFinancialData
  } = useClientFinancialSummary();

  const {
    clientDetails,
    selectedClientId,
    setSelectedClientId,
    fetchClientDetails,
    isLoading: isDetailsLoading
  } = useClientFinancialDetails();

  // Set up a refresh callback for actions
  const refreshData = async () => {
    if (selectedClientId) {
      await fetchClientDetails(selectedClientId);
    }
    await fetchClientsFinancialData();
  };

  const {
    handleApplyCreditToInvoice,
    handleCreateReminder
  } = useClientFinancialActions(refreshData);

  // Combine loading states
  const isLoading = isSummaryLoading || isDetailsLoading;

  return {
    // Summary data
    clientsSummary,
    chartData,
    
    // Client details
    clientDetails,
    selectedClientId,
    setSelectedClientId,
    fetchClientDetails,
    
    // Loading state
    isLoading,
    
    // Actions
    handleApplyCreditToInvoice,
    handleCreateReminder
  };
};

export default useClientFinancial;
