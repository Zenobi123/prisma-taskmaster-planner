import { addMonths, differenceInDays, parse, isValid } from "date-fns";
import { Client } from "@/types/client";
import { FiscalAlert, FiscalObligation, ProcessedClient } from "./types";

export const processClientFiscalData = (
  client: Client, 
  today: Date
): { alerts: FiscalAlert[], obligations: FiscalObligation[] } => {
  const alerts: FiscalAlert[] = [];
  const obligations: FiscalObligation[] = [];
  
  const clientName = client.type === 'physique' 
    ? client.nom || 'Client sans nom' 
    : client.raisonsociale || 'Entreprise sans nom';
  
  // If no fiscal data, return early
  if (!client.fiscal_data) {
    return { alerts, obligations };
  }
  
  // Process attestations
  processAttestations(client, today, clientName, alerts, obligations);
  
  // Process fiscal obligations
  processObligations(client, today, clientName, alerts, obligations);
  
  return { alerts, obligations };
};

const processAttestations = (
  client: Client, 
  today: Date, 
  clientName: string, 
  alerts: FiscalAlert[], 
  obligations: FiscalObligation[]
): void => {
  if (!client.fiscal_data?.attestation?.validityEndDate) {
    console.log(`Client ${client.id} (${clientName}) has no validityEndDate in attestation`);
    return;
  }
  
  try {
    const datePattern = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    const validityEndDate = client.fiscal_data.attestation.validityEndDate;
    
    if (datePattern.test(validityEndDate)) {
      const parsedDate = parse(validityEndDate, 'dd/MM/yyyy', new Date());
      
      if (isValid(parsedDate)) {
        const daysUntilExpiration = differenceInDays(parsedDate, today);
        
        console.log(`Client ${clientName} attestation: ${daysUntilExpiration} days until expiration`);
        
        // IMPORTANT: Nous traitons TOUTES les attestations, qu'elles soient expirées, 
        // sur le point d'expirer ou valides pour une longue période
        
        // Vérifier si l'attestation doit être affichée dans les alertes
        // Si showInAlert n'est pas défini, on le considère comme true par défaut
        const showInAlert = client.fiscal_data.attestation.showInAlert !== false;
        console.log(`Client ${clientName} showInAlert: ${showInAlert}`);
        
        if (showInAlert) {
          // Créer une description unique en fonction du statut d'expiration
          let description;
          if (daysUntilExpiration < 0) {
            description = `L'attestation du client ${clientName} est expirée depuis ${Math.abs(daysUntilExpiration)} jours.`;
          } else if (daysUntilExpiration === 0) {
            description = `L'attestation du client ${clientName} expire aujourd'hui.`;
          } else {
            description = `L'attestation du client ${clientName} expire dans ${daysUntilExpiration} jour${daysUntilExpiration > 1 ? 's' : ''}.`;
          }
            
          alerts.push({
            type: 'attestation',
            title: `Attestation de Conformité Fiscale - ${clientName}`,
            description: description,
            clientId: client.id  // Ajouter l'ID du client pour la navigation
          });
          
          console.log(`Added alert for client ${clientName}: ${description}`);
        } else {
          console.log(`Alert disabled for client ${clientName} attestation`);
        }
        
        // Toujours ajouter aux obligations, même si non affiché dans les alertes
        obligations.push({
          name: `Attestation de Conformité Fiscale - ${clientName}`,
          deadline: validityEndDate,
          daysRemaining: daysUntilExpiration,
          type: 'attestation',
          clientId: client.id  // Ajouter l'ID du client pour la navigation
        });
      } else {
        console.error(`Invalid date format for client ${clientName}: ${validityEndDate}`);
      }
    } else {
      console.error(`Date does not match pattern for client ${clientName}: ${validityEndDate}`);
    }
  } catch (error) {
    console.error("Error parsing attestation date:", error);
  }
};

const processObligations = (
  client: Client, 
  today: Date, 
  clientName: string, 
  alerts: FiscalAlert[], 
  obligations: FiscalObligation[]
): void => {
  if (!client.fiscal_data?.obligations) return;
  
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
    const obligationData = client.fiscal_data.obligations[obligation.key];
    
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
};

export const sortFiscalAlerts = (alerts: FiscalAlert[]): FiscalAlert[] => {
  return [...alerts].sort((a, b) => {
    if (a.description.includes('expirée') && !b.description.includes('expirée')) return -1;
    if (!a.description.includes('expirée') && b.description.includes('expirée')) return 1;
    return 0;
  });
};

export const sortFiscalObligations = (obligations: FiscalObligation[]): FiscalObligation[] => {
  return [...obligations].sort((a, b) => a.daysRemaining - b.daysRemaining);
};
