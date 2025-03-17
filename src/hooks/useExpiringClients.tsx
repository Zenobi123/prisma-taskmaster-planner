
import { useState, useEffect } from "react";
import { getClients } from "@/services/clientService";
import { Client } from "@/types/client";
import { differenceInDays, parse, isValid } from "date-fns";

export interface ExpiringClient {
  id: string;
  name: string;
  document: string;
  expiryDate: string;
  daysRemaining: number;
}

export const useExpiringClients = () => {
  const [expiringClients, setExpiringClients] = useState<ExpiringClient[]>([]);

  useEffect(() => {
    fetchClientsWithExpiringDocuments();
  }, []);

  const fetchClientsWithExpiringDocuments = async () => {
    try {
      console.log("Fetching clients with expiring documents...");
      const clients = await getClients();
      console.log(`Retrieved ${clients.length} clients`);
      
      const clientsWithExpiringDocs: ExpiringClient[] = [];
      const today = new Date();
      
      clients.forEach((client: Client) => {
        // Vérifier si le client a des données fiscales et une attestation
        if (client.fiscal_data && client.fiscal_data.attestation && client.fiscal_data.attestation.validityEndDate) {
          const validityEndDate = client.fiscal_data.attestation.validityEndDate;
          console.log(`Client ${client.id} (${client.nom || client.raisonsociale || 'Sans nom'}) has attestation with end date: ${validityEndDate}`);
          
          try {
            // Format de date attendu: JJ/MM/AAAA
            const parsedDate = parse(validityEndDate, 'dd/MM/yyyy', new Date());
            
            if (isValid(parsedDate)) {
              const daysUntilExpiration = differenceInDays(parsedDate, today);
              console.log(`Client ${client.id} - Days until expiration: ${daysUntilExpiration}`);
              
              // Inclure TOUTES les attestations expirées (daysUntilExpiration < 0) 
              // ET celles qui expirent dans les 30 prochains jours
              if (daysUntilExpiration <= 30) {
                const clientName = client.type === 'physique' 
                  ? client.nom || 'Client sans nom' 
                  : client.raisonsociale || 'Entreprise sans nom';
                  
                clientsWithExpiringDocs.push({
                  id: client.id,
                  name: clientName,
                  document: 'Attestation de Conformité Fiscale',
                  expiryDate: validityEndDate,
                  daysRemaining: daysUntilExpiration
                });
                
                console.log(`Added client ${clientName} to expiring docs list with ${daysUntilExpiration} days remaining`);
              }
            } else {
              console.log(`Client ${client.id} - Invalid date format: ${validityEndDate}`);
            }
          } catch (error) {
            console.error(`Error processing client ${client.id}:`, error);
          }
        } else {
          console.log(`Client ${client.id} has no attestation data`);
        }
      });
      
      console.log(`Found ${clientsWithExpiringDocs.length} clients with expiring documents`);
      
      // Trier d'abord les documents expirés, puis par jours restants
      clientsWithExpiringDocs.sort((a, b) => {
        // Si l'un est expiré et l'autre non, l'expiré vient en premier
        if (a.daysRemaining < 0 && b.daysRemaining >= 0) return -1;
        if (a.daysRemaining >= 0 && b.daysRemaining < 0) return 1;
        // Sinon, trier par jours restants
        return a.daysRemaining - b.daysRemaining;
      });
      
      console.log("Sorted expiring clients:", clientsWithExpiringDocs);
      setExpiringClients(clientsWithExpiringDocs);
    } catch (error) {
      console.error("Error fetching clients with expiring documents:", error);
    }
  };

  return { expiringClients };
};
