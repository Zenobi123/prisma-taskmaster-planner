
import { useState } from "react";
import { useClientFinancial } from "@/hooks/facturation/useClientFinancial";
import { useClientFinancialActions } from "@/hooks/facturation/clientFinancial/useClientFinancialActions";
import ClientsList from "./situationClients/ClientsList";
import ClientsChart from "./situationClients/ClientsChart";
import ClientDetailsDialog from "./situationClients/ClientDetailsDialog";
import ApplyCreditDialog from "./situationClients/ApplyCreditDialog";
import ReminderDialog from "./situationClients/ReminderDialog";
import RapportEcheances from "./situationClients/RapportEcheances";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

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
    fetchClientDetails
  } = useClientFinancial();

  const { handleApplyCreditToInvoice, handleCreateReminder } = useClientFinancialActions();

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

      {/* Rapport d'Échéances fiscales */}
      <Card className="shadow-sm border border-orange-100">
        <CardHeader className="pb-2 border-b bg-orange-50 rounded-t-lg">
          <CardTitle className="flex items-center gap-2 text-sm font-semibold text-orange-800">
            <AlertTriangle className="w-4 h-4" />
            Rapport d'échéances fiscales
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-3">
          <RapportEcheances />
        </CardContent>
      </Card>

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
