
import Sidebar from "@/components/dashboard/Sidebar";
import NewTaskDialog from "@/components/dashboard/NewTaskDialog";
import QuickStats from "@/components/dashboard/QuickStats";
import RecentTasks from "@/components/dashboard/RecentTasks";
import { Toaster } from "@/components/ui/toaster";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { useEffect, useState } from "react";
import { AlertTriangle, CalendarClock } from "lucide-react";
import { addMonths, differenceInDays, parse, isValid } from "date-fns";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getClients } from "@/services/clientService";
import { Client } from "@/types/client";

const Index = () => {
  const [fiscalAlerts, setFiscalAlerts] = useState<Array<{
    type: string;
    title: string;
    description: string;
    clientName?: string;
  }>>([]);

  const [upcomingObligations, setUpcomingObligations] = useState<Array<{
    name: string;
    deadline: string;
    daysRemaining: number;
    type: string;
    clientName?: string;
  }>>([]);

  const [clients, setClients] = useState<Client[]>([]);

  // Fetch clients on component mount
  useEffect(() => {
    const fetchClientsData = async () => {
      try {
        const clientsData = await getClients();
        setClients(clientsData);
      } catch (error) {
        console.error("Error fetching clients:", error);
      }
    };
    
    fetchClientsData();
  }, []);

  // Check for fiscal compliance alerts when clients are loaded
  useEffect(() => {
    if (clients.length > 0) {
      checkFiscalCompliance();
    }
  }, [clients]);

  // Function to check fiscal compliance and generate alerts
  const checkFiscalCompliance = () => {
    const alerts = [];
    const obligations = [];
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
          
          {upcomingObligations.length > 0 && (
            <Card className="mb-6">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <CalendarClock className="h-5 w-5 mr-2 text-amber-500" />
                  Échéances fiscales à venir
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Obligation</TableHead>
                      <TableHead>Client</TableHead>
                      <TableHead>Date limite</TableHead>
                      <TableHead>Jours restants</TableHead>
                      <TableHead>Type</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {upcomingObligations.map((obligation, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{obligation.name}</TableCell>
                        <TableCell>{obligation.clientName}</TableCell>
                        <TableCell>{obligation.deadline}</TableCell>
                        <TableCell>
                          <span className={
                            obligation.daysRemaining <= 2 
                              ? "text-red-600 font-semibold" 
                              : obligation.daysRemaining <= 5 
                                ? "text-amber-600 font-semibold" 
                                : "text-blue-600"
                          }>
                            {obligation.daysRemaining} jour{obligation.daysRemaining > 1 ? 's' : ''}
                          </span>
                        </TableCell>
                        <TableCell>
                          {obligation.type === 'attestation' ? 'Expiration' : 
                           obligation.type === 'dépôt' ? 'Déclaration' : 'Paiement'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
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
