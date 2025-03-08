
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
import { FiscalDocument } from "@/components/gestion/tabs/fiscale/AddDocumentDialog";

const Index = () => {
  const [expiringDocuments, setExpiringDocuments] = useState<Array<{clientName: string, document: FiscalDocument}>>([]);
  
  const { data: clients = [] } = useQuery({
    queryKey: ["clients"],
    queryFn: getClients,
    staleTime: 5 * 60 * 1000,
  });

  // Fonction pour vérifier les documents qui expirent bientôt
  useEffect(() => {
    const clientsWithDocuments: Array<{clientName: string, document: FiscalDocument}> = [];
    
    clients.forEach(client => {
      // Vérifier si le client a des documents fiscaux
      if (client.fiscalDocuments) {
        client.fiscalDocuments.forEach((doc: FiscalDocument) => {
          if (doc.validUntil) {
            const daysRemaining = Math.ceil((new Date(doc.validUntil).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
            
            // Ajouter les documents qui expirent dans moins de 5 jours
            if (daysRemaining <= 5 && daysRemaining > 0) {
              clientsWithDocuments.push({
                clientName: client.type === 'physique' ? client.nom : client.raisonsociale,
                document: doc
              });
            }
          }
        });
      }
    });
    
    setExpiringDocuments(clientsWithDocuments);
  }, [clients]);

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
          {expiringDocuments.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Bell className="h-5 w-5 text-destructive" />
                  Actions requises
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {expiringDocuments.map((item, index) => (
                  <div 
                    key={index}
                    className="p-3 bg-muted/40 rounded-md flex items-start gap-3"
                  >
                    <FileText size={20} className="text-destructive mt-0.5" />
                    <div>
                      <div className="font-medium">
                        {item.document.name} en expiration
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Client: {item.clientName}
                      </p>
                      <div className="flex items-center mt-1 text-destructive text-xs">
                        <Bell size={14} className="mr-1" />
                        Expire le {new Date(item.document.validUntil as Date).toLocaleDateString()}
                      </div>
                      <div className="mt-2">
                        <Link 
                          to="/gestion" 
                          className="text-sm text-primary hover:underline"
                        >
                          Aller à la gestion
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
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
