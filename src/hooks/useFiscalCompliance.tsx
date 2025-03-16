
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
      const clients = await getClients();
      const alerts: FiscalAlert[] = [];
      const obligations: FiscalObligation[] = [];
      const today = new Date();
      
      // Parcourir tous les clients pour trouver les attestations expirantes
      clients.forEach((client: Client) => {
        const fiscalData = client.fiscal_data as any;
        
        if (fiscalData) {
          // Vérifier les attestations de conformité fiscale
          if (fiscalData.attestation && fiscalData.attestation.validityEndDate) {
            try {
              const datePattern = /^(\d{2})\/(\d{2})\/(\d{4})$/;
              const validityEndDate = fiscalData.attestation.validityEndDate;
              
              if (datePattern.test(validityEndDate)) {
                const parsedDate = parse(validityEndDate, 'dd/MM/yyyy', new Date());
                
                if (isValid(parsedDate)) {
                  const daysUntilExpiration = differenceInDays(parsedDate, today);
                  
                  // Ajouter des alertes pour les attestations expirant dans 5 jours ou moins
                  if (daysUntilExpiration <= 5) {
                    const clientName = client.type === 'physique' 
                      ? client.nom || 'Client sans nom' 
                      : client.raisonsociale || 'Entreprise sans nom';
                    
                    alerts.push({
                      type: 'attestation',
                      title: `Attestation Fiscale - ${clientName}`,
                      description: daysUntilExpiration <= 0 
                        ? `L'attestation du client ${clientName} est expirée.` 
                        : `L'attestation du client ${clientName} expire dans ${daysUntilExpiration} jour${daysUntilExpiration > 1 ? 's' : ''}.`
                    });
                    
                    obligations.push({
                      name: `Attestation de Conformité Fiscale - ${clientName}`,
                      deadline: validityEndDate,
                      daysRemaining: daysUntilExpiration,
                      type: 'attestation'
                    });
                  }
                }
              }
            } catch (error) {
              console.error("Error parsing attestation date:", error);
            }
          }
          
          // Vérifier les obligations fiscales
          if (fiscalData.obligations) {
            const clientName = client.type === 'physique' 
              ? client.nom || 'Client sans nom' 
              : client.raisonsociale || 'Entreprise sans nom';
              
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
        }
      });
      
      // Trier les alertes et obligations par urgence
      alerts.sort((a, b) => {
        // Mettre les attestations expirées en premier
        if (a.description.includes('expirée') && !b.description.includes('expirée')) return -1;
        if (!a.description.includes('expirée') && b.description.includes('expirée')) return 1;
        return 0;
      });
      
      obligations.sort((a, b) => a.daysRemaining - b.daysRemaining);
      
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
