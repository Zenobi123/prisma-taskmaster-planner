
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
      const clients = await getClients();
      const clientsWithExpiringDocs: ExpiringClient[] = [];

      const today = new Date();
      
      clients.forEach((client: Client) => {
        const fiscalData = client.fiscal_data as any;
        
        if (fiscalData && fiscalData.attestation && fiscalData.attestation.validityEndDate) {
          try {
            const datePattern = /^(\d{2})\/(\d{2})\/(\d{4})$/;
            const validityEndDate = fiscalData.attestation.validityEndDate;
            
            if (datePattern.test(validityEndDate)) {
              const parsedDate = parse(validityEndDate, 'dd/MM/yyyy', new Date());
              
              if (isValid(parsedDate)) {
                const daysUntilExpiration = differenceInDays(parsedDate, today);
                
                // Inclure les documents qui expirent dans 5 jours ou qui sont déjà expirés
                if (daysUntilExpiration <= 5) {
                  clientsWithExpiringDocs.push({
                    id: client.id,
                    name: client.type === 'physique' ? client.nom || 'Client sans nom' : client.raisonsociale || 'Entreprise sans nom',
                    document: 'Attestation de Conformité Fiscale',
                    expiryDate: validityEndDate,
                    daysRemaining: daysUntilExpiration
                  });
                }
              }
            }
          } catch (error) {
            console.error("Error parsing client expiry date:", error);
          }
        }
      });
      
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
