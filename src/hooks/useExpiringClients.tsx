
import { useState, useEffect } from "react";
import { getClients } from "@/services/clientService";
import { Client } from "@/types/client";
import { differenceInDays, parse, isValid } from "date-fns";
import { toast } from "sonner";

export interface ExpiringClient {
  id: string;
  name: string;
  document: string;
  expiryDate: string;
  daysRemaining: number;
}

export const useExpiringClients = () => {
  const [expiringClients, setExpiringClients] = useState<ExpiringClient[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClientsWithExpiringDocuments();
  }, []);

  const fetchClientsWithExpiringDocuments = async () => {
    try {
      setLoading(true);
      console.log("Fetching clients with expiring documents...");
      const clients = await getClients();
      console.log(`Retrieved ${clients.length} clients, looking for those with fiscal_data`);
      
      let clientsWithFiscalData = 0;
      let clientsWithAttestations = 0;
      
      const clientsWithExpiringDocs: ExpiringClient[] = [];
      const today = new Date();
      
      // Traitement des clients avec des attestations expirées ou bientôt expirées
      clients.forEach((client: Client) => {
        const clientName = client.type === 'physique' 
          ? client.nom || 'Client sans nom' 
          : client.raisonsociale || 'Entreprise sans nom';
          
        // Vérifier si le client a des données fiscales
        if (client.fiscal_data) {
          clientsWithFiscalData++;
          console.log(`Client ${client.id} (${clientName}) has fiscal_data`);
          
          // Vérifier si le client a une attestation
          if (client.fiscal_data.attestation && client.fiscal_data.attestation.validityEndDate) {
            clientsWithAttestations++;
            const validityEndDate = client.fiscal_data.attestation.validityEndDate;
            console.log(`Client ${client.id} has attestation with end date: ${validityEndDate}`);
            
            try {
              // Format de date attendu: JJ/MM/AAAA
              const parsedDate = parse(validityEndDate, 'dd/MM/yyyy', new Date());
              
              if (isValid(parsedDate)) {
                const daysUntilExpiration = differenceInDays(parsedDate, today);
                console.log(`Client ${client.id} - Days until expiration: ${daysUntilExpiration}`);
                
                // Inclure TOUTES les attestations expirées sans limite de temps
                // ET celles qui expirent dans les 30 prochains jours
                if (daysUntilExpiration <= 30) {
                  clientsWithExpiringDocs.push({
                    id: client.id,
                    name: clientName,
                    document: 'Attestation de Conformité Fiscale',
                    expiryDate: validityEndDate,
                    daysRemaining: daysUntilExpiration
                  });
                  
                  console.log(`Added client ${clientName} to expiring docs list with ${daysUntilExpiration} days remaining`);
                  
                  // Afficher une notification pour les attestations expirées ou qui expirent bientôt
                  if (daysUntilExpiration < 0) {
                    toast.warning(`L'attestation fiscale de ${clientName} est expirée`);
                  } else if (daysUntilExpiration <= 7) {
                    toast.warning(`L'attestation fiscale de ${clientName} expire dans ${daysUntilExpiration} jours`);
                  }
                }
              } else {
                console.log(`Client ${client.id} - Invalid date format: ${validityEndDate}`);
              }
            } catch (error) {
              console.error(`Error processing client ${client.id}:`, error);
            }
          } else {
            console.log(`Client ${client.id} has fiscal_data but no attestation or end date`);
          }
        } else {
          console.log(`Client ${client.id} (${clientName}) has no fiscal_data`);
        }
      });
      
      console.log(`Summary: ${clients.length} clients, ${clientsWithFiscalData} with fiscal data, ${clientsWithAttestations} with attestations`);
      console.log(`Found ${clientsWithExpiringDocs.length} clients with expiring documents`);
      
      // Trier d'abord les documents expirés, puis par jours restants
      clientsWithExpiringDocs.sort((a, b) => {
        // Si l'un est expiré et l'autre non, l'expiré vient en premier
        if (a.daysRemaining < 0 && b.daysRemaining >= 0) return -1;
        if (a.daysRemaining >= 0 && b.daysRemaining < 0) return 1;
        // Pour les documents expirés, montrer d'abord les plus anciens (plus négatif)
        if (a.daysRemaining < 0 && b.daysRemaining < 0) return a.daysRemaining - b.daysRemaining;
        // Sinon, trier par jours restants
        return a.daysRemaining - b.daysRemaining;
      });
      
      console.log("Sorted expiring clients:", clientsWithExpiringDocs);
      setExpiringClients(clientsWithExpiringDocs);
    } catch (error) {
      console.error("Error fetching clients with expiring documents:", error);
      toast.error("Erreur lors de la récupération des documents clients");
    } finally {
      setLoading(false);
    }
  };

  return { expiringClients, loading };
};
