import { differenceInDays, parse, isValid } from "date-fns";
import { Client } from "@/types/client";
import { ExpiringClient } from "./types";
import { toast } from "sonner";

/**
 * Process clients to find those with expiring attestations
 */
export const processExpiringClients = (clients: Client[]): ExpiringClient[] => {
  const clientsWithExpiringDocs: ExpiringClient[] = [];
  const today = new Date();
  
  console.log(`Processing ${clients.length} clients for expiring documents`);
  
  clients.forEach((client: Client) => {
    const clientName = client.type === 'physique' 
      ? client.nom || 'Client sans nom' 
      : client.raisonsociale || 'Entreprise sans nom';
      
    // Check if client has fiscal_data with attestation
    if (client.fiscal_data?.attestation?.validityEndDate) {
      const validityEndDate = client.fiscal_data.attestation.validityEndDate;
      const creationDate = client.fiscal_data.attestation.creationDate;
      
      try {
        // Parse date in format DD/MM/YYYY
        const parsedDate = parse(validityEndDate, 'dd/MM/yyyy', new Date());
        
        if (isValid(parsedDate)) {
          const daysUntilExpiration = differenceInDays(parsedDate, today);
          
          // Include expired attestations and those expiring within 30 days
          if (daysUntilExpiration <= 30) {
            clientsWithExpiringDocs.push({
              id: client.id,
              name: clientName,
              document: 'Attestation de Conformité Fiscale',
              expiryDate: validityEndDate,
              creationDate: creationDate || 'Non spécifiée',
              daysRemaining: daysUntilExpiration
            });
            
            // Show notifications for expired or soon-to-expire attestations
            showExpirationNotification(clientName, daysUntilExpiration);
          }
        } else {
          console.log(`Client ${client.id} - Invalid date format: ${validityEndDate}`);
        }
      } catch (error) {
        console.error(`Error processing client ${client.id}:`, error);
      }
    }
  });
  
  return clientsWithExpiringDocs;
};

/**
 * Show toast notifications for expired or soon-to-expire attestations
 */
export const showExpirationNotification = (clientName: string, daysUntilExpiration: number): void => {
  if (daysUntilExpiration < 0) {
    toast.warning(`L'attestation fiscale de ${clientName} est expirée depuis ${Math.abs(daysUntilExpiration)} jours`);
  } else if (daysUntilExpiration <= 5) {
    toast.warning(`L'attestation fiscale de ${clientName} expire dans ${daysUntilExpiration} jours`);
  }
};

/**
 * Sort expiring clients by urgency
 */
export const sortExpiringClients = (clients: ExpiringClient[]): ExpiringClient[] => {
  return [...clients].sort((a, b) => {
    // If one is expired and the other is not, the expired comes first
    if (a.daysRemaining < 0 && b.daysRemaining >= 0) return -1;
    if (a.daysRemaining >= 0 && b.daysRemaining < 0) return 1;
    // For expired documents, show the ones expired for longer first
    if (a.daysRemaining < 0 && b.daysRemaining < 0) return a.daysRemaining - b.daysRemaining;
    // Otherwise, sort by days remaining
    return a.daysRemaining - b.daysRemaining;
  });
};
