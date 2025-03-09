
import Sidebar from "@/components/dashboard/Sidebar";
import NewTaskDialog from "@/components/dashboard/NewTaskDialog";
import QuickStats from "@/components/dashboard/QuickStats";
import RecentTasks from "@/components/dashboard/RecentTasks";
import { Toaster } from "@/components/ui/toaster";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Bell, FileText } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getClients } from "@/services/clientService";
import { useState, useEffect } from "react";
import { FiscalDocument } from "@/components/gestion/tabs/fiscale/types";
import { getExpiringDocuments } from "@/services/fiscalDocumentService";

const Index = () => {
  const [expiringDocuments, setExpiringDocuments] = useState<Array<{clientName: string, document: FiscalDocument, clientId: string}>>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const { data: clients = [] } = useQuery({
    queryKey: ["clients"],
    queryFn: getClients,
    staleTime: 5 * 60 * 1000,
  });

  // Fonction pour récupérer les documents qui expirent bientôt
  useEffect(() => {
    const fetchExpiringDocuments = async () => {
      setIsLoading(true);
      try {
        const data = await getExpiringDocuments();
        setExpiringDocuments(data);
      } catch (error) {
        console.error("Erreur lors de la récupération des documents expirants:", error);
        
        // Fallback au comportement précédent en cas d'erreur
        const clientsWithDocuments: Array<{clientName: string, document: FiscalDocument, clientId: string}> = [];
        
        clients.forEach(client => {
          if (client.fiscalDocuments) {
            client.fiscalDocuments.forEach((doc: FiscalDocument) => {
              if (doc.validUntil) {
                const daysRemaining = Math.ceil((new Date(doc.validUntil).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
                
                // Ajouter les documents qui expirent dans moins de 5 jours ou qui sont expirés
                if ((daysRemaining <= 5 && daysRemaining > -30)) {
                  clientsWithDocuments.push({
                    clientId: client.id,
                    clientName: client.type === 'physique' ? client.nom : client.raisonsociale,
                    document: doc
                  });
                }
              }
            });
          }
        });
        
        setExpiringDocuments(clientsWithDocuments);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchExpiringDocuments();
  }, [clients]);

  // Filtrer les documents pour le tableau de bord
  const criticalDocuments = expiringDocuments.filter(item => {
    if (item.document.validUntil) {
      const daysRemaining = Math.ceil((new Date(item.document.validUntil).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
      return daysRemaining <= 5 && daysRemaining > -30; // Documents qui expirent dans 5 jours ou qui sont expirés depuis moins de 30 jours
    }
    return false;
  });

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

        <div className="p-8 space-y-6">
          {criticalDocuments.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Bell className="h-5 w-5 text-destructive" />
                  Actions requises - Documents fiscaux
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {isLoading ? (
                  <div className="p-4 text-center text-muted-foreground">
                    Chargement des documents...
                  </div>
                ) : (
                  criticalDocuments.map((item, index) => {
                    if (!item.document.validUntil) return null;
                    
                    const daysRemaining = Math.ceil((new Date(item.document.validUntil).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
                    const isExpired = daysRemaining <= 0;
                    
                    return (
                      <div 
                        key={index}
                        className="p-3 bg-muted/40 rounded-md flex items-start gap-3"
                      >
                        <FileText size={20} className="text-destructive mt-0.5" />
                        <div>
                          <div className="font-medium">
                            {item.document.name} {isExpired ? "expiré" : "en expiration"}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Client: {item.clientName}
                          </p>
                          <div className="flex items-center mt-1 text-destructive text-xs">
                            <Bell size={14} className="mr-1" />
                            {isExpired 
                              ? `Expiré depuis ${Math.abs(daysRemaining)} jour${Math.abs(daysRemaining) > 1 ? 's' : ''}`
                              : `Expire dans ${daysRemaining} jour${daysRemaining > 1 ? 's' : ''}`}
                            ({new Date(item.document.validUntil).toLocaleDateString()})
                          </div>
                          <div className="mt-2">
                            <Link 
                              to={`/gestion?client=${item.clientId}&tab=fiscale&subtab=administration-fiscale`}
                              className="text-sm text-primary hover:underline"
                            >
                              Gérer ce document
                            </Link>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
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
