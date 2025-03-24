
import { useMemo } from "react";
import { isOverdue } from "@/services/factureServices/factureStatusService";
import { ClientFinancialSummary } from "@/types/clientFinancial";

interface ClientData {
  [clientId: string]: {
    factures: any[];
    paiements: any[];
    facturesMontant: number;
    paiementsMontant: number;
  };
}

export const useClientStatusCalculator = (
  clients: any[],
  invoices: any[],
  payments: any[]
) => {
  const statusGroups = useMemo(() => {
    return {
      "À jour": 0,
      "Partiellement payé": 0,
      "En retard": 0
    };
  }, []);

  const clientsData = useMemo(() => {
    const data: ClientData = {};
    
    clients.forEach((client) => {
      data[client.id] = {
        factures: [],
        paiements: [],
        facturesMontant: 0,
        paiementsMontant: 0
      };
    });

    invoices.forEach((facture) => {
      if (data[facture.client_id]) {
        data[facture.client_id].factures.push(facture);
        data[facture.client_id].facturesMontant += parseFloat(String(facture.montant));
      }
    });

    payments.forEach((paiement) => {
      const factureClientId = invoices.find((f) => f.id === paiement.facture_id)?.client_id;
      
      if (factureClientId && data[factureClientId]) {
        data[factureClientId].paiements.push(paiement);
        data[factureClientId].paiementsMontant += parseFloat(String(paiement.montant));
      }
    });

    return data;
  }, [clients, invoices, payments]);

  const clientsSummary = useMemo(() => {
    return clients.map((client) => {
      const clientData = clientsData[client.id] || { 
        facturesMontant: 0, 
        paiementsMontant: 0, 
        factures: [] 
      };
      
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
    }).filter(client => client.facturesMontant > 0) as ClientFinancialSummary[];
  }, [clients, clientsData, statusGroups]);

  const chartData = useMemo(() => {
    return Object.entries(statusGroups).map(([name, total]) => ({
      name,
      total
    }));
  }, [statusGroups]);

  return {
    clientsSummary,
    chartData
  };
};
