
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
      // Utiliser une valeur par défaut si creationDate n'est pas défini
      const creationDate = client.fiscal_data.attestation.creationDate || 'Non spécifiée';
      
      try {
        // Parse date in format DD/MM/YYYY
        const parsedDate = parse(validityEndDate, 'dd/MM/yyyy', new Date());
        
        if (isValid(parsedDate)) {
          const daysUntilExpiration = differenceInDays(parsedDate, today);
          
          // Include ALL attestations regardless of expiry (no day limit)
          clientsWithExpiringDocs.push({
            id: client.id,
            name: clientName,
            document: 'Attestation de Conformité Fiscale',
            expiryDate: validityEndDate,
            creationDate: creationDate,
            daysRemaining: daysUntilExpiration,
            type: 'fiscal'
          });
          
          // Only show notifications for expired attestations or ones expiring in 5 days
          if (daysUntilExpiration <= 5 || daysUntilExpiration < 0) {
            showExpirationNotification(clientName, daysUntilExpiration, client.id);
          }
        } else {
          console.log(`Client ${client.id} - Invalid date format: ${validityEndDate}`);
        }
      } catch (error) {
        console.error(`Error processing client ${client.id}:`, error);
      }
    }
  });
  
  // Log the number of clients with expiring documents
  console.log(`Found ${clientsWithExpiringDocs.length} clients with fiscal attestations`);
  
  return clientsWithExpiringDocs;
};

/**
 * Show toast notifications for expired or soon-to-expire attestations
 */
export const showExpirationNotification = (clientName: string, daysUntilExpiration: number, clientId?: string): void => {
  const message = daysUntilExpiration < 0
    ? `L'attestation de conformité fiscale de ${clientName} est expirée depuis ${Math.abs(daysUntilExpiration)} jours`
    : `L'attestation de conformité fiscale de ${clientName} expire dans ${daysUntilExpiration} jours`;
    
  // Create a toast with an action to navigate to client's fiscal obligations page
  if (clientId) {
    toast.warning(message, {
      action: {
        label: "Voir détails",
        onClick: () => {
          window.location.href = `/gestion?client=${clientId}&tab=obligations-fiscales`;
        }
      },
      duration: 10000 // Extended duration to give time to click
    });
  } else {
    toast.warning(message);
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
