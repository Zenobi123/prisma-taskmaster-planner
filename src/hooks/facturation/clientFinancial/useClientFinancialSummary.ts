
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { ClientFinancialSummary } from "@/types/clientFinancial";
import { supabase } from "@/integrations/supabase/client";
import { isOverdue } from "@/services/factureServices/factureStatusService";

export const useClientFinancialSummary = () => {
  const { toast } = useToast();
  const [clientsSummary, setClientsSummary] = useState<ClientFinancialSummary[]>([]);
  const [chartData, setChartData] = useState<{ name: string; total: number }[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  useEffect(() => {
    fetchClientsFinancialData();
  }, []);

  return {
    clientsSummary,
    isLoading,
    chartData,
    fetchClientsFinancialData
  };
};
