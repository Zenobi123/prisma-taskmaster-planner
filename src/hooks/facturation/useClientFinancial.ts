
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { 
  getClientsFinancialSummary, 
  getClientFinancialDetails,
  applyCreditToInvoice,
  createPaymentReminder
} from "@/services/clientFinancialService";
import { ClientFinancialSummary, ClientFinancialDetails } from "@/types/clientFinancial";

export const useClientFinancial = () => {
  const { toast } = useToast();
  const [clientsSummary, setClientsSummary] = useState<ClientFinancialSummary[]>([]);
  const [clientDetails, setClientDetails] = useState<ClientFinancialDetails | null>(null);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [chartData, setChartData] = useState<{ name: string; total: number }[]>([]);

  // Fetch all clients financial summary
  const fetchClientsSummary = async () => {
    setIsLoading(true);
    try {
      const data = await getClientsFinancialSummary();
      setClientsSummary(data);

      // Calculate chart data
      const statusCounts = {
        'àjour': 0,
        'partiel': 0,
        'retard': 0
      };

      data.forEach(client => {
        if (client.status in statusCounts) {
          statusCounts[client.status as keyof typeof statusCounts]++;
        }
      });

      setChartData([
        { name: "À jour", total: statusCounts['àjour'] },
        { name: "Partiellement payé", total: statusCounts['partiel'] },
        { name: "En retard", total: statusCounts['retard'] }
      ]);
    } catch (error) {
      console.error("Error fetching clients summary:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de récupérer les données financières des clients.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch details for a specific client
  const fetchClientDetails = async (clientId: string) => {
    setIsLoading(true);
    try {
      const data = await getClientFinancialDetails(clientId);
      setClientDetails(data);
      setSelectedClientId(clientId);
    } catch (error) {
      console.error("Error fetching client details:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de récupérer les détails financiers du client.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Apply a credit payment to an invoice
  const handleApplyCreditToInvoice = async (factureId: string, paiementId: string, montant: number) => {
    if (!selectedClientId) return;
    
    setIsLoading(true);
    try {
      const success = await applyCreditToInvoice(selectedClientId, factureId, paiementId, montant);
      
      if (success) {
        toast({
          title: "Avance appliquée",
          description: "L'avance a été appliquée à la facture avec succès.",
        });
        
        // Refresh client details
        await fetchClientDetails(selectedClientId);
        // Refresh summary to update totals
        await fetchClientsSummary();
      }
    } catch (error) {
      console.error("Error applying credit to invoice:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'appliquer l'avance à la facture."
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Create a payment reminder
  const handleCreateReminder = async (factureId: string, method: 'email' | 'sms' | 'both') => {
    if (!selectedClientId) return;
    
    setIsLoading(true);
    try {
      const success = await createPaymentReminder(selectedClientId, factureId, method);
      
      if (success) {
        toast({
          title: "Rappel programmé",
          description: `Le rappel de paiement a été programmé via ${method === 'both' ? 'email et SMS' : method}.`,
        });
      }
    } catch (error) {
      console.error("Error creating payment reminder:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de programmer le rappel de paiement."
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Load initial data
  useEffect(() => {
    fetchClientsSummary();
  }, []);

  // Clear client details when no client is selected
  useEffect(() => {
    if (!selectedClientId) {
      setClientDetails(null);
    }
  }, [selectedClientId]);

  return {
    clientsSummary,
    clientDetails,
    selectedClientId,
    setSelectedClientId,
    isLoading,
    chartData,
    fetchClientsSummary,
    fetchClientDetails,
    handleApplyCreditToInvoice,
    handleCreateReminder
  };
};
