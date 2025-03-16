
import { useState, useEffect } from "react";
import { addMonths, differenceInDays, parse, isValid } from "date-fns";
import { Client } from "@/types/client";

interface FiscalAlert {
  type: string;
  title: string;
  description: string;
  clientName?: string;
}

interface Obligation {
  name: string;
  deadline: string;
  daysRemaining: number;
  type: string;
  clientName?: string;
}

export const useFiscalCompliance = (clients: Client[]) => {
  const [fiscalAlerts, setFiscalAlerts] = useState<FiscalAlert[]>([]);
  const [upcomingObligations, setUpcomingObligations] = useState<Obligation[]>([]);

  // Check for fiscal compliance alerts when clients are loaded
  useEffect(() => {
    if (clients.length > 0) {
      checkFiscalCompliance();
    }
  }, [clients]);

  // Function to check fiscal compliance and generate alerts
  const checkFiscalCompliance = () => {
    const alerts: FiscalAlert[] = [];
    const obligations: Obligation[] = [];
    const today = new Date();
    
    // For each client, check their attestation and obligations
    clients.forEach(client => {
      // Get client name based on type
      const clientName = client.type === "physique" 
        ? client.nom 
        : client.raisonsociale;
      
      if (!clientName) return; // Skip if no client name
      
      // Check attestation expiration (using client ID as part of key)
      const savedCreationDate = localStorage.getItem(`fiscalAttestationCreationDate_${client.id}`);
      if (savedCreationDate) {
        try {
          // Regular expression to match DD/MM/YYYY format
          const datePattern = /^(\d{2})\/(\d{2})\/(\d{4})$/;
          
          if (datePattern.test(savedCreationDate)) {
            const parsedDate = parse(savedCreationDate, 'dd/MM/yyyy', new Date());
            if (isValid(parsedDate)) {
              const expirationDate = addMonths(parsedDate, 3);
              const daysUntilExpiration = differenceInDays(expirationDate, today);
              
              // Alert for attestation within 5 days of expiration
              if (daysUntilExpiration <= 5 && daysUntilExpiration >= 0) {
                alerts.push({
                  type: 'attestation',
                  title: 'Alerte Attestation de Conformité Fiscale',
                  description: `L'attestation de ${clientName} expire dans ${daysUntilExpiration} jour${daysUntilExpiration > 1 ? 's' : ''}. Veuillez la renouveler.`,
                  clientName
                });
                
                obligations.push({
                  name: 'Attestation de Conformité Fiscale',
                  deadline: expirationDate.toLocaleDateString('fr-FR'),
                  daysRemaining: daysUntilExpiration,
                  type: 'attestation',
                  clientName
                });
              }
            }
          }
        } catch (error) {
          console.error("Error parsing attestation date:", error);
        }
      }
      
      // Get current year for annual obligations
      const currentYear = today.getFullYear();
      
      // Define annual obligations deadlines with client association
      const taxObligations = [
        { 
          type: 'patente',
          name: 'Patente',
          deadline: new Date(currentYear, 1, 28), // February 28
          isPaid: localStorage.getItem(`fiscalPatentePaye_${client.id}`) === 'true',
          isAssujetti: localStorage.getItem(`fiscalPatenteAssujetti_${client.id}`) !== 'false',
          actionType: 'paiement',
          clientName
        },
        { 
          type: 'bail',
          name: 'Bail',
          deadline: new Date(currentYear, 1, 28), // February 28
          isPaid: localStorage.getItem(`fiscalBailPaye_${client.id}`) === 'true',
          isAssujetti: localStorage.getItem(`fiscalBailAssujetti_${client.id}`) !== 'false',
          actionType: 'paiement',
          clientName
        },
        { 
          type: 'taxeFonciere',
          name: 'Taxe foncière',
          deadline: new Date(currentYear, 1, 28), // February 28
          isPaid: localStorage.getItem(`fiscalTaxeFoncierePaye_${client.id}`) === 'true',
          isAssujetti: localStorage.getItem(`fiscalTaxeFonciereAssujetti_${client.id}`) !== 'false',
          actionType: 'paiement',
          clientName
        },
        { 
          type: 'dsf',
          name: 'Déclaration Statistique et Fiscale (DSF)',
          deadline: new Date(currentYear, 3, 15), // April 15
          isPaid: localStorage.getItem(`fiscalDsfDepose_${client.id}`) === 'true',
          isAssujetti: localStorage.getItem(`fiscalDsfAssujetti_${client.id}`) !== 'false',
          actionType: 'dépôt',
          clientName
        },
        { 
          type: 'darp',
          name: 'Déclaration Annuelle des Revenus des Particuliers (DARP)',
          deadline: new Date(currentYear, 5, 30), // June 30
          isPaid: localStorage.getItem(`fiscalDarpDepose_${client.id}`) === 'true',
          isAssujetti: localStorage.getItem(`fiscalDarpAssujetti_${client.id}`) !== 'false',
          actionType: 'dépôt',
          clientName
        },
      ];
      
      // Check each obligation
      taxObligations.forEach(obligation => {
        if (obligation.isAssujetti && !obligation.isPaid) {
          const daysUntilDeadline = differenceInDays(obligation.deadline, today);
          
          // Alert for tax obligations within 10 days of deadline
          if (daysUntilDeadline <= 10 && daysUntilDeadline >= 0) {
            alerts.push({
              type: obligation.type,
              title: `Échéance ${obligation.name}`,
              description: `Date limite de ${obligation.actionType} pour ${clientName}: ${daysUntilDeadline} jour${daysUntilDeadline > 1 ? 's' : ''} restant${daysUntilDeadline > 1 ? 's' : ''}.`,
              clientName
            });
            
            obligations.push({
              name: obligation.name,
              deadline: obligation.deadline.toLocaleDateString('fr-FR'),
              daysRemaining: daysUntilDeadline,
              type: obligation.actionType,
              clientName
            });
          }
        }
      });
    });
    
    setFiscalAlerts(alerts);
    setUpcomingObligations(obligations);
  };

  return { fiscalAlerts, upcomingObligations };
};
