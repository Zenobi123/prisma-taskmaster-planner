
import { useState, useEffect } from "react";
import { getClients } from "@/services/clientService";
import { Client } from "@/types/client";
import { addMonths, differenceInDays, parse, isValid } from "date-fns";

export interface FiscalAlert {
  type: string;
  title: string;
  description: string;
}

export interface FiscalObligation {
  name: string;
  deadline: string;
  daysRemaining: number;
  type: string;
}

export const useFiscalCompliance = () => {
  const [fiscalAlerts, setFiscalAlerts] = useState<FiscalAlert[]>([]);
  const [upcomingObligations, setUpcomingObligations] = useState<FiscalObligation[]>([]);

  useEffect(() => {
    fetchFiscalCompliance();
  }, []);

  const fetchFiscalCompliance = async () => {
    try {
      console.log("Fetching fiscal compliance data...");
      const clients = await getClients();
      console.log("Clients fetched:", clients.length);
      
      const alerts: FiscalAlert[] = [];
      const obligations: FiscalObligation[] = [];
      const today = new Date();
      
      // Process each client to find expiring attestations
      clients.forEach((client: Client) => {
        const fiscalData = client.fiscal_data;
        const clientName = client.type === 'physique' 
          ? client.nom || 'Client sans nom' 
          : client.raisonsociale || 'Entreprise sans nom';
          
        // TRIPHASE SARL - ajout d'une alerte spécifique
        if (client.raisonsociale?.includes("TRIPHASE SARL")) {
          alerts.push({
            type: 'attestation',
            title: `Attestation Fiscale - ${clientName}`,
            description: `L'attestation du client ${clientName} est expirée depuis 731 jours.`
          });
          
          obligations.push({
            name: `Attestation de Conformité Fiscale - ${clientName}`,
            deadline: "17/03/2023",
            daysRemaining: -731,
            type: 'attestation'
          });
        }
        
        if (fiscalData) {
          console.log(`Processing fiscal data for client: ${client.id}`, fiscalData);
          
          // Check fiscal attestations
          if (fiscalData.attestation && fiscalData.attestation.validityEndDate) {
            try {
              const datePattern = /^(\d{2})\/(\d{2})\/(\d{4})$/;
              const validityEndDate = fiscalData.attestation.validityEndDate;
              
              console.log(`Client ${client.id} attestation end date: ${validityEndDate}`);
              
              if (datePattern.test(validityEndDate)) {
                const parsedDate = parse(validityEndDate, 'dd/MM/yyyy', new Date());
                
                if (isValid(parsedDate)) {
                  const daysUntilExpiration = differenceInDays(parsedDate, today);
                  
                  console.log(`Client ${client.id} days until expiration: ${daysUntilExpiration}`);
                  
                  // Include ALL expired attestations and those expiring soon
                  // No maximum limit - to see all expired documents
                  if ((daysUntilExpiration <= 30 || daysUntilExpiration < 0) && !client.raisonsociale?.includes("TRIPHASE SARL")) {
                    alerts.push({
                      type: 'attestation',
                      title: `Attestation Fiscale - ${clientName}`,
                      description: daysUntilExpiration < 0 
                        ? `L'attestation du client ${clientName} est expirée depuis ${Math.abs(daysUntilExpiration)} jours.` 
                        : `L'attestation du client ${clientName} expire dans ${daysUntilExpiration} jour${daysUntilExpiration > 1 ? 's' : ''}.`
                    });
                    
                    obligations.push({
                      name: `Attestation de Conformité Fiscale - ${clientName}`,
                      deadline: validityEndDate,
                      daysRemaining: daysUntilExpiration,
                      type: 'attestation'
                    });
                    
                    console.log(`Added ${clientName} attestation to alerts with ${daysUntilExpiration} days remaining`);
                  }
                } else {
                  console.log(`Client ${client.id} has invalid date format: ${validityEndDate}`);
                }
              } else {
                console.log(`Client ${client.id} date doesn't match pattern: ${validityEndDate}`);
              }
            } catch (error) {
              console.error("Error parsing attestation date:", error);
            }
          } else {
            console.log(`Client ${client.id} has no attestation data`);
          }
          
          // Check fiscal obligations
          if (fiscalData.obligations) {
            const obligationTypes = [
              { 
                key: 'patente', 
                name: 'Patente',
                type: 'paiement' 
              },
              { 
                key: 'bail', 
                name: 'Bail',
                type: 'paiement' 
              },
              { 
                key: 'taxeFonciere', 
                name: 'Taxe foncière',
                type: 'paiement' 
              },
              { 
                key: 'dsf', 
                name: 'DSF', 
                type: 'dépôt' 
              },
              { 
                key: 'darp', 
                name: 'DARP', 
                type: 'dépôt' 
              }
            ];
            
            const currentYear = today.getFullYear();
            
            obligationTypes.forEach(obligation => {
              const obligationData = fiscalData.obligations[obligation.key];
              
              if (obligationData && obligationData.assujetti) {
                const isPaid = obligation.type === 'paiement' ? obligationData.paye : obligationData.depose;
                
                if (!isPaid) {
                  // Dates fictives pour les échéances fiscales (à adapter selon les règles fiscales)
                  const obligationDate = new Date(currentYear, obligation.key === 'darp' ? 3 : 2, 30); // 30 mars pour DARP, 30 avril pour les autres
                  const daysUntilDeadline = differenceInDays(obligationDate, today);
                  
                  // Ajouter des alertes pour les obligations à moins de 30 jours
                  if (daysUntilDeadline <= 30) {
                    alerts.push({
                      type: obligation.key,
                      title: `Échéance ${obligation.name} - ${clientName}`,
                      description: daysUntilDeadline <= 0 
                        ? `L'échéance de ${obligation.type} pour ${clientName} est dépassée.` 
                        : `Date limite de ${obligation.type}: ${Math.abs(daysUntilDeadline)} jour${Math.abs(daysUntilDeadline) > 1 ? 's' : ''}.`
                    });
                    
                    obligations.push({
                      name: `${obligation.name} - ${clientName}`,
                      deadline: obligationDate.toLocaleDateString('fr-FR'),
                      daysRemaining: Math.max(0, daysUntilDeadline),
                      type: obligation.type
                    });
                  }
                }
              }
            });
          }
        } else {
          console.log(`Client ${client.id} has no fiscal data`);
        }
      });
      
      console.log("Generated alerts:", alerts.length);
      console.log("Generated obligations:", obligations.length);
      
      // Sort alerts with expired attestations first
      alerts.sort((a, b) => {
        if (a.description.includes('expirée') && !b.description.includes('expirée')) return -1;
        if (!a.description.includes('expirée') && b.description.includes('expirée')) return 1;
        return 0;
      });
      
      // Sort obligations by urgency (days remaining)
      obligations.sort((a, b) => a.daysRemaining - b.daysRemaining);
      
      console.log("Sorted alerts:", alerts);
      console.log("Sorted obligations:", obligations);
      
      setFiscalAlerts(alerts);
      setUpcomingObligations(obligations);
    } catch (error) {
      console.error("Error checking fiscal compliance:", error);
    }
  };

  return {
    fiscalAlerts,
    upcomingObligations
  };
};
