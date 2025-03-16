import Sidebar from "@/components/dashboard/Sidebar";
import NewTaskDialog from "@/components/dashboard/NewTaskDialog";
import QuickStats from "@/components/dashboard/QuickStats";
import RecentTasks from "@/components/dashboard/RecentTasks";
import { Toaster } from "@/components/ui/toaster";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { useEffect, useState } from "react";
import { AlertTriangle, CalendarClock, Users } from "lucide-react";
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
  }>>([]);

  const [upcomingObligations, setUpcomingObligations] = useState<Array<{
    name: string;
    deadline: string;
    daysRemaining: number;
    type: string;
  }>>([]);

  const [expiringClients, setExpiringClients] = useState<Array<{
    id: string;
    name: string;
    document: string;
    expiryDate: string;
    daysRemaining: number;
  }>>([]);

  useEffect(() => {
    checkFiscalCompliance();
    fetchClientsWithExpiringDocuments();
  }, []);

  const fetchClientsWithExpiringDocuments = async () => {
    try {
      const clients = await getClients();
      const clientsWithExpiringDocs: Array<{
        id: string;
        name: string;
        document: string;
        expiryDate: string;
        daysRemaining: number;
      }> = [];

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
                
                if (daysUntilExpiration <= 15) {
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
      
      clientsWithExpiringDocs.sort((a, b) => a.daysRemaining - b.daysRemaining);
      setExpiringClients(clientsWithExpiringDocs);
    } catch (error) {
      console.error("Error fetching clients with expiring documents:", error);
    }
  };

  const checkFiscalCompliance = () => {
    const alerts = [];
    const obligations = [];
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
                      <TableHead>Date limite</TableHead>
                      <TableHead>Jours restants</TableHead>
                      <TableHead>Type</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {upcomingObligations.map((obligation, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{obligation.name}</TableCell>
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
          
          {expiringClients.length > 0 && (
            <Card className="mt-6 border-2 border-red-200">
              <CardHeader className="pb-2 bg-red-50">
                <CardTitle className="text-lg flex items-center">
                  <Users className="h-5 w-5 mr-2 text-red-500" />
                  Clients avec documents expirant bientôt
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Client</TableHead>
                      <TableHead>Document</TableHead>
                      <TableHead>Date d'expiration</TableHead>
                      <TableHead>Statut</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {expiringClients.map((client, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{client.name}</TableCell>
                        <TableCell>{client.document}</TableCell>
                        <TableCell>{client.expiryDate}</TableCell>
                        <TableCell>
                          {client.daysRemaining < 0 ? (
                            <span className="text-red-600 font-semibold">
                              Expiré depuis {Math.abs(client.daysRemaining)} jour{Math.abs(client.daysRemaining) > 1 ? 's' : ''}
                            </span>
                          ) : (
                            <span className={
                              client.daysRemaining <= 5 
                                ? "text-red-600 font-semibold" 
                                : "text-amber-600 font-semibold"
                            }>
                              Expire dans {client.daysRemaining} jour{client.daysRemaining > 1 ? 's' : ''}
                            </span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      <Toaster />
    </div>
  );
};

export default Index;
