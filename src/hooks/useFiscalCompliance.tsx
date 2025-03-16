
import { useState, useEffect } from "react";
import { addMonths, differenceInDays, parse, isValid } from "date-fns";
import { toast } from "sonner";

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
    // Log pour le débogage
    console.log("useFiscalCompliance hook initializing");
  }, []);

  const checkFiscalCompliance = () => {
    const alerts: FiscalAlert[] = [];
    const obligations: FiscalObligation[] = [];
    const today = new Date();
    
    // Vérifier si data existe dans le localStorage pour déboguer
    console.log("Checking fiscal compliance data");
    console.log("localStorage items:", Object.keys(localStorage));
    
    const savedCreationDate = localStorage.getItem('fiscalAttestationCreationDate');
    console.log("Saved creation date:", savedCreationDate);
    
    if (savedCreationDate) {
      try {
        const datePattern = /^(\d{2})\/(\d{2})\/(\d{4})$/;
        
        if (datePattern.test(savedCreationDate)) {
          const parsedDate = parse(savedCreationDate, 'dd/MM/yyyy', new Date());
          console.log("Parsed date:", parsedDate);
          
          if (isValid(parsedDate)) {
            const expirationDate = addMonths(parsedDate, 3);
            const daysUntilExpiration = differenceInDays(expirationDate, today);
            console.log("Days until expiration:", daysUntilExpiration);
            
            // Ajouter toujours pour tester, quelle que soit la date
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
      } catch (error) {
        console.error("Error parsing attestation date:", error);
      }
    } else {
      // Créer des données de test si aucune donnée n'existe
      console.log("No attestation data found, adding test data");
      
      // Créer une alerte de test
      alerts.push({
        type: 'attestation_test',
        title: 'Alerte Fiscale (exemple)',
        description: 'Exemple d\'alerte fiscale pour démonstration.'
      });
      
      // Créer des obligations de test
      const testDeadline = new Date();
      testDeadline.setDate(testDeadline.getDate() + 5);
      
      obligations.push({
        name: 'Patente (exemple)',
        deadline: testDeadline.toLocaleDateString('fr-FR'),
        daysRemaining: 5,
        type: 'paiement'
      });
      
      const testDeadline2 = new Date();
      testDeadline2.setDate(testDeadline2.getDate() + 2);
      
      obligations.push({
        name: 'DSF (exemple)',
        deadline: testDeadline2.toLocaleDateString('fr-FR'),
        daysRemaining: 2,
        type: 'dépôt'
      });
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
    ];
    
    taxObligations.forEach(obligation => {
      if (!obligation.isPaid) {
        const daysUntilDeadline = differenceInDays(obligation.deadline, today);
        
        // Ajouter pour le test, peu importe la date
        alerts.push({
          type: obligation.type,
          title: `Échéance ${obligation.name}`,
          description: `Date limite de ${obligation.actionType}: ${Math.abs(daysUntilDeadline)} jour${Math.abs(daysUntilDeadline) > 1 ? 's' : ''}.`
        });
        
        obligations.push({
          name: obligation.name,
          deadline: obligation.deadline.toLocaleDateString('fr-FR'),
          daysRemaining: Math.max(0, daysUntilDeadline),
          type: obligation.actionType
        });
      }
    });
    
    console.log("Generated alerts:", alerts);
    console.log("Generated obligations:", obligations);
    
    setFiscalAlerts(alerts);
    setUpcomingObligations(obligations);
  };

  return {
    fiscalAlerts,
    upcomingObligations
  };
};
