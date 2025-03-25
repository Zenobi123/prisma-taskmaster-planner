
import { useClientFinancial } from "@/hooks/facturation/useClientFinancial";
import SituationClientsContent from "./SituationClientsContent";
import SituationClientsDialogs from "./dialogs/SituationClientsDialogs";

const SituationClients = () => {
  const { 
    clientsSummary, 
    clientDetails, 
    chartData,
    isLoading, 
    isDetailsDialogOpen,
    isApplyCreditDialogOpen,
    isReminderDialogOpen,
    selectedInvoiceId,
    availableCredits,
    setIsDetailsDialogOpen,
    setIsApplyCreditDialogOpen,
    setIsReminderDialogOpen,
    handleViewDetails,
    handleOpenApplyCreditDialog,
    handleOpenReminderDialog,
    handleApplyCredit,
    handleCreatePaymentReminder
  } = useClientFinancial();

  return (
    <div className="flex flex-col">
      <SituationClientsContent 
        clientsSummary={clientsSummary}
        isLoading={isLoading}
        chartData={chartData}
        onViewDetails={handleViewDetails}
      />

      <SituationClientsDialogs 
        clientDetails={clientDetails}
        isDetailsDialogOpen={isDetailsDialogOpen}
        isApplyCreditDialogOpen={isApplyCreditDialogOpen}
        isReminderDialogOpen={isReminderDialogOpen}
        selectedInvoiceId={selectedInvoiceId}
        availableCredits={availableCredits}
        onDetailsOpenChange={setIsDetailsDialogOpen}
        onApplyCreditOpenChange={setIsApplyCreditDialogOpen}
        onReminderOpenChange={setIsReminderDialogOpen}
        onOpenApplyCreditDialog={handleOpenApplyCreditDialog}
        onOpenReminderDialog={handleOpenReminderDialog}
        onApplyCredit={handleApplyCredit}
        onSendReminder={handleCreatePaymentReminder}
      />
    </div>
  );
};

export default SituationClients;
