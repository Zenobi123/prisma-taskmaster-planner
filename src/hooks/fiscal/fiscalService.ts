
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
    
    const alerts: FiscalAlert[] = [];
    const obligations: FiscalObligation[] = [];
    const today = new Date();
    
    // Process each client to find expiring attestations
    clients.forEach((client: Client) => {
      const { alerts: clientAlerts, obligations: clientObligations } = 
        processClientFiscalData(client, today);
      
      alerts.push(...clientAlerts);
      obligations.push(...clientObligations);
    });
    
    console.log("Generated alerts:", alerts.length);
    console.log("Generated obligations:", obligations.length);
    
    // Sort alerts with expired attestations first
    const sortedAlerts = sortFiscalAlerts(alerts);
    
    // Sort obligations by urgency (days remaining)
    const sortedObligations = sortFiscalObligations(obligations);
    
    console.log("Sorted alerts:", sortedAlerts);
    console.log("Sorted obligations:", sortedObligations);
    
    return {
      fiscalAlerts: sortedAlerts,
      upcomingObligations: sortedObligations
    };
  } catch (error) {
    console.error("Error checking fiscal compliance:", error);
    throw error;
  }
};
