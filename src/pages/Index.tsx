
import Sidebar from "@/components/dashboard/Sidebar";
import NewTaskDialog from "@/components/dashboard/NewTaskDialog";
import QuickStats from "@/components/dashboard/QuickStats";
import RecentTasks from "@/components/dashboard/RecentTasks";
import { Toaster } from "@/components/ui/toaster";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { useEffect, useState } from "react";
import { AlertTriangle } from "lucide-react";
import { addMonths, differenceInDays, parse, isValid } from "date-fns";

const Index = () => {
  const [fiscalAlerts, setFiscalAlerts] = useState<Array<{
    type: string;
    title: string;
    description: string;
  }>>([]);

  // Check for fiscal compliance alerts on component mount
  useEffect(() => {
    checkFiscalCompliance();
  }, []);

  // Function to check fiscal compliance and generate alerts
  const checkFiscalCompliance = () => {
    const alerts = [];
    const today = new Date();
    
    // Check attestation expiration (if we have a saved date)
    const savedCreationDate = localStorage.getItem('fiscalAttestationCreationDate');
    if (savedCreationDate) {
      try {
        // Regular expression to match DD/MM/YY format
        const datePattern = /^(\d{2})\/(\d{2})\/(\d{2})$/;
        
        if (datePattern.test(savedCreationDate)) {
          const parsedDate = parse(savedCreationDate, 'dd/MM/yy', new Date());
          if (isValid(parsedDate)) {
            const expirationDate = addMonths(parsedDate, 3);
            const daysUntilExpiration = differenceInDays(expirationDate, today);
            
            if (daysUntilExpiration <= 5 && daysUntilExpiration >= 0) {
              alerts.push({
                type: 'attestation',
                title: 'Alerte Attestation de Conformité Fiscale',
                description: `Votre attestation expire dans ${daysUntilExpiration} jour${daysUntilExpiration > 1 ? 's' : ''}. Veuillez la renouveler.`
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
    
    // Define annual obligations deadlines
    const obligations = [
      { 
        type: 'patente',
        name: 'Patente',
        deadline: new Date(currentYear, 1, 28), // February 28
        isPaid: localStorage.getItem('fiscalPatentePaye') === 'true',
        isAssujetti: localStorage.getItem('fiscalPatenteAssujetti') !== 'false',
        actionType: 'paiement'
      },
      { 
        type: 'bail',
        name: 'Bail',
        deadline: new Date(currentYear, 1, 28), // February 28
        isPaid: localStorage.getItem('fiscalBailPaye') === 'true',
        isAssujetti: localStorage.getItem('fiscalBailAssujetti') !== 'false',
        actionType: 'paiement'
      },
      { 
        type: 'taxeFonciere',
        name: 'Taxe foncière',
        deadline: new Date(currentYear, 1, 28), // February 28
        isPaid: localStorage.getItem('fiscalTaxeFoncierePaye') === 'true',
        isAssujetti: localStorage.getItem('fiscalTaxeFonciereAssujetti') !== 'false',
        actionType: 'paiement'
      },
      { 
        type: 'dsf',
        name: 'Déclaration Statistique et Fiscale (DSF)',
        deadline: new Date(currentYear, 3, 15), // April 15
        isPaid: localStorage.getItem('fiscalDsfDepose') === 'true',
        isAssujetti: localStorage.getItem('fiscalDsfAssujetti') !== 'false',
        actionType: 'dépôt'
      },
      { 
        type: 'darp',
        name: 'Déclaration Annuelle des Revenus des Particuliers (DARP)',
        deadline: new Date(currentYear, 5, 30), // June 30
        isPaid: localStorage.getItem('fiscalDarpDepose') === 'true',
        isAssujetti: localStorage.getItem('fiscalDarpAssujetti') !== 'false',
        actionType: 'dépôt'
      },
    ];
    
    // Check each obligation
    obligations.forEach(obligation => {
      if (obligation.isAssujetti && !obligation.isPaid) {
        const daysUntilDeadline = differenceInDays(obligation.deadline, today);
        
        if (daysUntilDeadline <= 15 && daysUntilDeadline >= 0) {
          alerts.push({
            type: obligation.type,
            title: `Échéance ${obligation.name}`,
            description: `Date limite de ${obligation.actionType}: ${daysUntilDeadline} jour${daysUntilDeadline > 1 ? 's' : ''} restant${daysUntilDeadline > 1 ? 's' : ''}.`
          });
        }
      }
    });
    
    setFiscalAlerts(alerts);
  };

  return (
    <div className="min-h-screen flex">
      <Sidebar />

      <main className="flex-1 bg-neutral-100">
        <header className="bg-white border-b border-neutral-200 px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-neutral-800">
                Tableau de bord
              </h1>
              <p className="text-neutral-600 mt-1">
                Bienvenue sur votre espace de gestion
              </p>
            </div>
            <NewTaskDialog />
          </div>
        </header>

        <div className="p-8">
          {fiscalAlerts.length > 0 && (
            <div className="mb-6 space-y-2">
              {fiscalAlerts.map((alert, index) => (
                <Alert key={index} variant="destructive" className="border-red-300 bg-red-50">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <AlertTitle className="text-red-800">{alert.title}</AlertTitle>
                  <AlertDescription className="text-red-700">
                    {alert.description}
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          )}
          <QuickStats />
          <RecentTasks />
        </div>
      </main>
      <Toaster />
    </div>
  );
};

export default Index;
