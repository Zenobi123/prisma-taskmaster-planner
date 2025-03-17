
import { getClients } from "@/services/clientService";
import { Client } from "@/types/client";
import { FiscalAlert, FiscalObligation } from "./types";
import { processClientFiscalData, sortFiscalAlerts, sortFiscalObligations } from "./utils";

export const fetchFiscalComplianceData = async (): Promise<{
  fiscalAlerts: FiscalAlert[];
  upcomingObligations: FiscalObligation[];
}> => {
  try {
    console.log("Fetching fiscal compliance data...");
    const clients = await getClients();
    console.log("Clients fetched:", clients.length);
    
    // Debug: Count how many clients have fiscal_data
    const clientsWithFiscalData = clients.filter(c => !!c.fiscal_data);
    console.log(`Found ${clientsWithFiscalData.length} clients with fiscal data:`, 
      clientsWithFiscalData.map(c => `${c.nom || c.raisonsociale} (${c.id})`));
    
    const alerts: FiscalAlert[] = [];
    const obligations: FiscalObligation[] = [];
    const today = new Date();
    
    // Process each client to find expiring attestations
    clients.forEach((client: Client) => {
      if (client.fiscal_data) {
        console.log(`Processing client ${client.id} (${client.nom || client.raisonsociale}) with fiscal data:`, 
          client.fiscal_data.attestation ? 
            `Attestation valid until: ${client.fiscal_data.attestation.validityEndDate}, showInAlert: ${client.fiscal_data.attestation.showInAlert !== false}` : 
            'No attestation data');
        
        const { alerts: clientAlerts, obligations: clientObligations } = 
          processClientFiscalData(client, today);
        
        console.log(`Generated ${clientAlerts.length} alerts for client ${client.id || client.nom || client.raisonsociale}:`, 
          clientAlerts.map(a => a.description));
        
        alerts.push(...clientAlerts);
        obligations.push(...clientObligations);
      }
    });
    
    console.log("Total generated alerts:", alerts.length);
    console.log("Total generated obligations:", obligations.length);
    
    // Sort alerts with expired attestations first
    const sortedAlerts = sortFiscalAlerts(alerts);
    
    // Sort obligations by urgency (days remaining)
    const sortedObligations = sortFiscalObligations(obligations);
    
    // Debugging: Print all alerts to see what we're returning
    if (sortedAlerts.length > 0) {
      console.log("Returning these alerts:", sortedAlerts.map(a => ({
        title: a.title,
        description: a.description,
        type: a.type,
        clientId: a.clientId
      })));
    } else {
      console.log("No alerts to return");
    }
    
    return {
      fiscalAlerts: sortedAlerts,
      upcomingObligations: sortedObligations
    };
  } catch (error) {
    console.error("Error checking fiscal compliance:", error);
    throw error;
  }
};
