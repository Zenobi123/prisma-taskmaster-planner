
import { useState, useEffect } from "react";
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
    checkFiscalCompliance();
  }, []);

  const checkFiscalCompliance = () => {
    const alerts: FiscalAlert[] = [];
    const obligations: FiscalObligation[] = [];
    const today = new Date();
    
    const savedCreationDate = localStorage.getItem('fiscalAttestationCreationDate');
    if (savedCreationDate) {
      try {
        const datePattern = /^(\d{2})\/(\d{2})\/(\d{4})$/;
        
        if (datePattern.test(savedCreationDate)) {
          const parsedDate = parse(savedCreationDate, 'dd/MM/yyyy', new Date());
          if (isValid(parsedDate)) {
            const expirationDate = addMonths(parsedDate, 3);
            const daysUntilExpiration = differenceInDays(expirationDate, today);
            
            if (daysUntilExpiration <= 5 && daysUntilExpiration >= 0) {
              alerts.push({
                type: 'attestation',
                title: 'Alerte Attestation de Conformité Fiscale',
                description: `Votre attestation expire dans ${daysUntilExpiration} jour${daysUntilExpiration > 1 ? 's' : ''}. Veuillez la renouveler.`
              });
              
              obligations.push({
                name: 'Attestation de Conformité Fiscale',
                deadline: expirationDate.toLocaleDateString('fr-FR'),
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
    
    const currentYear = today.getFullYear();
    
    const taxObligations = [
      { 
        type: 'patente',
        name: 'Patente',
        deadline: new Date(currentYear, 1, 28),
        isPaid: localStorage.getItem('fiscalPatentePaye') === 'true',
        isAssujetti: localStorage.getItem('fiscalPatenteAssujetti') !== 'false',
        actionType: 'paiement'
      },
      { 
        type: 'bail',
        name: 'Bail',
        deadline: new Date(currentYear, 1, 28),
        isPaid: localStorage.getItem('fiscalBailPaye') === 'true',
        isAssujetti: localStorage.getItem('fiscalBailAssujetti') !== 'false',
        actionType: 'paiement'
      },
      { 
        type: 'taxeFonciere',
        name: 'Taxe foncière',
        deadline: new Date(currentYear, 1, 28),
        isPaid: localStorage.getItem('fiscalTaxeFoncierePaye') === 'true',
        isAssujetti: localStorage.getItem('fiscalTaxeFonciereAssujetti') !== 'false',
        actionType: 'paiement'
      },
      { 
        type: 'dsf',
        name: 'Déclaration Statistique et Fiscale (DSF)',
        deadline: new Date(currentYear, 3, 15),
        isPaid: localStorage.getItem('fiscalDsfDepose') === 'true',
        isAssujetti: localStorage.getItem('fiscalDsfAssujetti') !== 'false',
        actionType: 'dépôt'
      },
      { 
        type: 'darp',
        name: 'Déclaration Annuelle des Revenus des Particuliers (DARP)',
        deadline: new Date(currentYear, 5, 30),
        isPaid: localStorage.getItem('fiscalDarpDepose') === 'true',
        isAssujetti: localStorage.getItem('fiscalDarpAssujetti') !== 'false',
        actionType: 'dépôt'
      },
    ];
    
    taxObligations.forEach(obligation => {
      if (obligation.isAssujetti && !obligation.isPaid) {
        const daysUntilDeadline = differenceInDays(obligation.deadline, today);
        
        if (daysUntilDeadline <= 10 && daysUntilDeadline >= 0) {
          alerts.push({
            type: obligation.type,
            title: `Échéance ${obligation.name}`,
            description: `Date limite de ${obligation.actionType}: ${daysUntilDeadline} jour${daysUntilDeadline > 1 ? 's' : ''} restant${daysUntilDeadline > 1 ? 's' : ''}.`
          });
          
          obligations.push({
            name: obligation.name,
            deadline: obligation.deadline.toLocaleDateString('fr-FR'),
            daysRemaining: daysUntilDeadline,
            type: obligation.actionType
          });
        }
      }
    });
    
    setFiscalAlerts(alerts);
    setUpcomingObligations(obligations);
  };

  return {
    fiscalAlerts,
    upcomingObligations
  };
};
