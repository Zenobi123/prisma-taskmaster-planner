import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { ClientFinancialSummary, ClientFinancialDetails } from "@/types/clientFinancial";
import { isOverdue } from "@/services/factureServices/factureStatusService";

export const useClientFinancial = () => {
  const { toast } = useToast();
  const [clientsSummary, setClientsSummary] = useState<ClientFinancialSummary[]>([]);
  const [chartData, setChartData] = useState<{ name: string; total: number }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [clientDetails, setClientDetails] = useState<ClientFinancialDetails | null>(null);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);

  const fetchClientsFinancialData = async () => {
    try {
      setIsLoading(true);
      console.log("Récupération des données financières des clients...");
      
      const { data: clients, error: clientsError } = await supabase
        .from('clients')
        .select('*');
        
      if (clientsError) {
        throw new Error(clientsError.message);
      }
      
      const statusGroups: Record<string, number> = {
        "À jour": 0,
        "Partiellement payé": 0,
        "En retard": 0
      };

      const { data: factures, error: facturesError } = await supabase
        .from('factures')
        .select('*')
        .eq('status', 'envoyée');

      if (facturesError) {
        throw new Error(facturesError.message);
      }
      
      const { data: paiements, error: paiementsError } = await supabase
        .from('paiements')
        .select('*');
        
      if (paiementsError) {
        throw new Error(paiementsError.message);
      }

      const clientsData: Record<string, {
        factures: any[];
        paiements: any[];
        facturesMontant: number;
        paiementsMontant: number;
      }> = {};

      clients.forEach((client) => {
        clientsData[client.id] = {
          factures: [],
          paiements: [],
          facturesMontant: 0,
          paiementsMontant: 0
        };
      });

      factures.forEach((facture) => {
        if (clientsData[facture.client_id]) {
          clientsData[facture.client_id].factures.push(facture);
          clientsData[facture.client_id].facturesMontant += parseFloat(String(facture.montant));
        }
      });

      paiements.forEach((paiement) => {
        const factureClientId = factures.find((f) => f.id === paiement.facture_id)?.client_id;
        
        if (factureClientId && clientsData[factureClientId]) {
          clientsData[factureClientId].paiements.push(paiement);
          clientsData[factureClientId].paiementsMontant += parseFloat(String(paiement.montant));
        }
      });

      const summaryData: ClientFinancialSummary[] = clients.map((client) => {
        const clientData = clientsData[client.id] || { facturesMontant: 0, paiementsMontant: 0, factures: [] };
        
        if (clientData.factures.length === 0) {
          return {
            id: client.id,
            nom: client.type === 'physique' ? client.nom : client.raisonsociale,
            facturesMontant: 0,
            paiementsMontant: 0,
            solde: 0,
            status: "àjour" as const
          };
        }
        
        const solde = clientData.paiementsMontant - clientData.facturesMontant;
        let status: "àjour" | "partiel" | "retard" = "àjour";
        
        if (solde < 0) {
          const unpaidInvoices = clientData.factures.filter(
            (f) => isOverdue(f.echeance, f.montant_paye || 0, f.montant)
          );
          
          if (unpaidInvoices.length > 0) {
            status = "retard";
            statusGroups["En retard"]++;
          } else if (clientData.paiementsMontant > 0) {
            status = "partiel";
            statusGroups["Partiellement payé"]++;
          } else {
            status = "retard";
            statusGroups["En retard"]++;
          }
        } else {
          statusGroups["À jour"]++;
        }
        
        return {
          id: client.id,
          nom: client.type === 'physique' ? client.nom : client.raisonsociale,
          facturesMontant: clientData.facturesMontant,
          paiementsMontant: clientData.paiementsMontant,
          solde,
          status
        };
      }).filter(client => client.facturesMontant > 0);

      const chartData = Object.entries(statusGroups).map(([name, total]) => ({
        name,
        total
      }));

      console.log("Données des clients récupérées avec succès", {
        clients: summaryData.length,
        chartData
      });
      
      setClientsSummary(summaryData);
      setChartData(chartData);
    } catch (error) {
      console.error("Erreur lors de la récupération des données financières des clients:", error);
      toast({
        title: "Erreur",
        description: "Impossible de récupérer les données financières des clients",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchClientDetails = async (clientId: string) => {
    try {
      setIsLoading(true);
      console.log("Récupération des détails financiers du client:", clientId);
      
      const { data: factures, error: facturesError } = await supabase
        .from('factures')
        .select('*')
        .eq('client_id', clientId)
        .eq('status', 'envoyée');
        
      if (facturesError) {
        throw new Error(facturesError.message);
      }
      
      const factureIds = factures.map(f => f.id);
      
      const { data: paiements, error: paiementsError } = await supabase
        .from('paiements')
        .select('*')
        .in('facture_id', factureIds.length > 0 ? factureIds : ['none']);
        
      if (paiementsError) {
        throw new Error(paiementsError.message);
      }
      
      const { data: credits, error: creditsError } = await supabase
        .from('paiements')
        .select('*')
        .eq('client_id', clientId)
        .eq('est_credit', true);
        
      if (creditsError) {
        throw new Error(creditsError.message);
      }
      
      const allPaiements = [...paiements, ...(credits || [])];
      
      const facturesWithRemaining = factures.map(facture => {
        const facturePayments = paiements.filter(p => p.facture_id === facture.id);
        const totalPaye = facturePayments.reduce((sum, p) => sum + parseFloat(String(p.montant)), 0);
        const montantRestant = parseFloat(String(facture.montant)) - totalPaye;
        
        const isPastDue = isOverdue(facture.echeance, totalPaye, parseFloat(String(facture.montant)));
        const statusPaiement = isPastDue && totalPaye < parseFloat(String(facture.montant)) 
          ? "en_retard" 
          : facture.status_paiement;
        
        return {
          ...facture,
          montant_paye: totalPaye,
          montant_restant: montantRestant,
          status_paiement: statusPaiement
        };
      });
      
      const soldeDisponible = credits?.reduce((sum, credit) => {
        if (!credit.facture_id) {
          return sum + parseFloat(String(credit.montant));
        }
        return sum;
      }, 0) || 0;
      
      const details: ClientFinancialDetails = {
        factures: facturesWithRemaining,
        paiements: allPaiements,
        solde_disponible: soldeDisponible
      };
      
      console.log("Détails financiers récupérés avec succès", details);
      setClientDetails(details);
    } catch (error) {
      console.error("Erreur lors de la récupération des détails financiers du client:", error);
      toast({
        title: "Erreur",
        description: "Impossible de récupérer les détails financiers du client",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyCreditToInvoice = async (invoiceId: string, creditId: string, amount: number) => {
    try {
      console.log("Application d'un crédit à une facture:", { invoiceId, creditId, amount });
      
      const { error } = await supabase
        .functions
        .invoke('apply-credit', {
          body: { 
            invoiceId,
            creditId,
            amount
          }
        });
      
      if (error) {
        throw new Error(error.message);
      }
      
      toast({
        title: "Succès",
        description: "Le crédit a été appliqué à la facture",
      });
      
      if (selectedClientId) {
        await fetchClientDetails(selectedClientId);
      }
      await fetchClientsFinancialData();
      
      return true;
    } catch (error) {
      console.error("Erreur lors de l'application du crédit:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'appliquer le crédit à la facture",
        variant: "destructive",
      });
      return false;
    }
  };

  const handleCreateReminder = async (invoiceId: string, method: 'email' | 'sms' | 'both') => {
    try {
      console.log("Création d'un rappel de paiement:", { invoiceId, method });
      
      const { error } = await supabase
        .functions
        .invoke('send-payment-reminders', {
          body: { 
            invoiceId,
            method
          }
        });
      
      if (error) {
        throw new Error(error.message);
      }
      
      toast({
        title: "Succès",
        description: "Le rappel de paiement a été envoyé",
      });
      
      return true;
    } catch (error) {
      console.error("Erreur lors de la création du rappel:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer le rappel de paiement",
        variant: "destructive",
      });
      return false;
    }
  };

  useEffect(() => {
    fetchClientsFinancialData();
  }, []);

  return {
    clientsSummary,
    isLoading,
    chartData,
    clientDetails,
    selectedClientId,
    setSelectedClientId,
    fetchClientDetails,
    handleApplyCreditToInvoice,
    handleCreateReminder
  };
};

export default useClientFinancial;
