
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
        const fiscalData = client.fiscal_data;
        
        if (fiscalData && fiscalData.attestation && fiscalData.attestation.validityEndDate) {
          try {
            const datePattern = /^(\d{2})\/(\d{2})\/(\d{4})$/;
            const validityEndDate = fiscalData.attestation.validityEndDate;
            
            console.log(`Client ${client.id} has attestation with end date: ${validityEndDate}`);
            
            if (datePattern.test(validityEndDate)) {
              const parsedDate = parse(validityEndDate, 'dd/MM/yyyy', new Date());
              
              if (isValid(parsedDate)) {
                const daysUntilExpiration = differenceInDays(parsedDate, today);
                
                console.log(`Client ${client.id}, days until expiration: ${daysUntilExpiration}`);
                
                // Inclure toutes les attestations expirées ainsi que celles qui vont expirer bientôt
                // Pas de limite maximum - pour voir tous les documents expirés
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
                  
                  console.log(`Added client ${clientName} to expiring docs list`);
                }
              } else {
                console.log(`Client ${client.id} date format is invalid: ${validityEndDate}`);
              }
            } else {
              console.log(`Client ${client.id} date doesn't match required pattern: ${validityEndDate}`);
            }
          } catch (error) {
            console.error(`Error processing client ${client.id}:`, error);
          }
        } else {
          console.log(`Client ${client.id} has no attestation data or validity end date`);
        }
      });
      
      console.log(`Found ${clientsWithExpiringDocs.length} clients with expiring documents`);
      
      // Trier d'abord par les documents expirés, puis par les jours restants
      clientsWithExpiringDocs.sort((a, b) => {
        // Si l'un est expiré et l'autre non, l'expiré vient en premier
        if (a.daysRemaining <= 0 && b.daysRemaining > 0) return -1;
        if (a.daysRemaining > 0 && b.daysRemaining <= 0) return 1;
        // Sinon, trier par jours restants
        return a.daysRemaining - b.daysRemaining;
      });
      
      setExpiringClients(clientsWithExpiringDocs);
    } catch (error) {
      console.error("Error fetching clients with expiring documents:", error);
    }
  };

  return { expiringClients };
};
