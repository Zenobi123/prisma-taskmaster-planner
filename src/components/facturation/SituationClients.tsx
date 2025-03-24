
import { useState } from "react";
import { useClientFinancial } from "@/hooks/facturation/useClientFinancial";
import ClientsList from "./situationClients/ClientsList";
import ClientsChart from "./situationClients/ClientsChart";
import ClientDetailsDialog from "./situationClients/ClientDetailsDialog";
import ApplyCreditDialog from "./situationClients/ApplyCreditDialog";
import ReminderDialog from "./situationClients/ReminderDialog";

const SituationClients = () => {
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isApplyCreditDialogOpen, setIsApplyCreditDialogOpen] = useState(false);
  const [isReminderDialogOpen, setIsReminderDialogOpen] = useState(false);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(null);
  
  const { 
    clientsSummary, 
    clientDetails, 
    selectedClientId, 
    setSelectedClientId,
    isLoading, 
    chartData, 
    fetchClientDetails,
    handleApplyCreditToInvoice,
    handleCreateReminder
  } = useClientFinancial();

  const handleViewDetails = async (clientId: string) => {
    setSelectedClientId(clientId);
    await fetchClientDetails(clientId);
    setIsDetailsDialogOpen(true);
  };

  const handleOpenApplyCreditDialog = (invoiceId: string) => {
    setSelectedInvoiceId(invoiceId);
    setIsApplyCreditDialogOpen(true);
  };

  const handleApplyCredit = async (creditId: string) => {
    if (!selectedInvoiceId || !clientDetails) return;
    
    const creditPayment = clientDetails.paiements.find(p => p.id === creditId);
    if (!creditPayment) return;
    
    await handleApplyCreditToInvoice(selectedInvoiceId, creditId, creditPayment.montant);
    setIsApplyCreditDialogOpen(false);
    setSelectedInvoiceId(null);
  };

  const handleOpenReminderDialog = (invoiceId: string) => {
    setSelectedInvoiceId(invoiceId);
    setIsReminderDialogOpen(true);
  };

  const handleCreatePaymentReminder = async (method: 'email' | 'sms' | 'both') => {
    if (!selectedInvoiceId) return;
    
    await handleCreateReminder(selectedInvoiceId, method);
    setIsReminderDialogOpen(false);
    setSelectedInvoiceId(null);
  };

  const availableCredits = clientDetails?.paiements.filter(p => p.est_credit && !p.facture_id) || [];

  return (
    <div className="flex flex-col gap-6">
      <ClientsList 
        clientsSummary={clientsSummary} 
        isLoading={isLoading} 
        onViewDetails={handleViewDetails} 
      />
      
      <ClientsChart chartData={chartData} />

      <ClientDetailsDialog 
        clientDetails={clientDetails}
        isOpen={isDetailsDialogOpen}
        onOpenChange={setIsDetailsDialogOpen}
        onOpenApplyCreditDialog={handleOpenApplyCreditDialog}
        onOpenReminderDialog={handleOpenReminderDialog}
      />

      <ApplyCreditDialog 
        isOpen={isApplyCreditDialogOpen}
        onOpenChange={setIsApplyCreditDialogOpen}
        availableCredits={availableCredits}
        selectedInvoiceId={selectedInvoiceId}
        onApplyCredit={handleApplyCredit}
      />

      <ReminderDialog 
        isOpen={isReminderDialogOpen}
        onOpenChange={setIsReminderDialogOpen}
        selectedInvoiceId={selectedInvoiceId}
        onSendReminder={handleCreatePaymentReminder}
      />
    </div>
  );
};

export default SituationClients;
