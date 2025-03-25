
import { useState } from "react";
import { useClientFinancialSummary } from "./clientFinancial/useClientFinancialSummary";
import { useClientFinancialDetails } from "./clientFinancial/useClientFinancialDetails";
import { useClientFinancialActions } from "./clientFinancial/useClientFinancialActions";

export const useClientFinancial = () => {
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isApplyCreditDialogOpen, setIsApplyCreditDialogOpen] = useState(false);
  const [isReminderDialogOpen, setIsReminderDialogOpen] = useState(false);
  
  // Use the summary hook for client financial summary data
  const { 
    clientsSummary, 
    isLoading, 
    chartData,
    fetchClientsFinancialData
  } = useClientFinancialSummary();
  
  // Use the details hook for specific client data
  const {
    clientDetails,
    selectedClientId,
    setSelectedClientId,
    fetchClientDetails,
    isLoading: isDetailsLoading
  } = useClientFinancialDetails();
  
  // Use the actions hook for operations on client financial data
  const {
    handleApplyCreditToInvoice,
    handleCreateReminder
  } = useClientFinancialActions();

  const handleViewDetails = async (clientId: string) => {
    setSelectedClientId(clientId);
    await fetchClientDetails(clientId);
    setIsDetailsDialogOpen(true);
  };

  const handleOpenApplyCreditDialog = (invoiceId: string) => {
    setSelectedInvoiceId(invoiceId);
    setIsApplyCreditDialogOpen(true);
  };

  const handleOpenReminderDialog = (invoiceId: string) => {
    setSelectedInvoiceId(invoiceId);
    setIsReminderDialogOpen(true);
  };

  const handleApplyCredit = async (creditId: string) => {
    if (!selectedInvoiceId || !clientDetails) return;
    
    const creditPayment = clientDetails.paiements.find(p => p.id === creditId);
    if (!creditPayment) return;
    
    await handleApplyCreditToInvoice(selectedInvoiceId, creditId, creditPayment.montant);
    setIsApplyCreditDialogOpen(false);
    setSelectedInvoiceId(null);
  };

  const handleCreatePaymentReminder = async (method: 'email' | 'sms' | 'both') => {
    if (!selectedInvoiceId) return;
    
    await handleCreateReminder(selectedInvoiceId, method);
    setIsReminderDialogOpen(false);
    setSelectedInvoiceId(null);
  };

  const availableCredits = clientDetails?.paiements.filter(p => p.est_credit && !p.facture_id) || [];

  return {
    // State
    clientsSummary,
    clientDetails,
    selectedClientId,
    selectedInvoiceId,
    isLoading,
    isDetailsLoading,
    chartData,
    isDetailsDialogOpen,
    isApplyCreditDialogOpen,
    isReminderDialogOpen,
    availableCredits,
    
    // Setters
    setSelectedClientId,
    setIsDetailsDialogOpen,
    setIsApplyCreditDialogOpen,
    setIsReminderDialogOpen,
    
    // Handlers
    handleViewDetails,
    handleOpenApplyCreditDialog,
    handleOpenReminderDialog,
    handleApplyCredit,
    handleCreatePaymentReminder,
    fetchClientDetails,
    fetchClientsFinancialData
  };
};
