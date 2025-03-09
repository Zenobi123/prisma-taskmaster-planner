import { useQuery } from "@tanstack/react-query";
import { getTasks } from "@/services/taskService";
import { useEffect, useState } from "react";
import { getExpiringDocuments } from "@/services/fiscalDocumentService";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const RecentTasks = () => {
  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ["tasks"],
    queryFn: getTasks,
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "en_cours":
        return <span className="badge badge-green">En cours</span>;
      case "termine":
        return <span className="badge badge-blue">Terminé</span>;
      case "planifiee":
        return <span className="badge badge-purple">Planifiée</span>;
      default:
        return <span className="badge badge-gray">En attente</span>;
    }
  };

  const [expiringDocuments, setExpiringDocuments] = useState<Array<{clientName: string, document: any, clientId: string}>>([]);
  const [isLoadingDocuments, setIsLoadingDocuments] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExpiringDocuments = async () => {
      setIsLoadingDocuments(true);
      try {
        const documents = await getExpiringDocuments();
        setExpiringDocuments(documents);
      } catch (error) {
        console.error("Erreur lors de la récupération des documents expirants:", error);
      } finally {
        setIsLoadingDocuments(false);
      }
    };
    
    fetchExpiringDocuments();
  }, []);

  const navigateToClientFiscal = (clientId: string) => {
    navigate(`/gestion?client=${clientId}&tab=fiscale&subtab=administration`);
  };

  const isDocumentExpired = (validUntil: Date) => {
    return new Date() > validUntil;
  };

  if (isLoading) {
    return (
      <div className="card mt-8">
        <h2 className="text-xl font-semibold text-neutral-800 mb-6">
          Tâches récentes
        </h2>
        <div className="animate-pulse">
          <div className="h-12 bg-neutral-100 rounded-md mb-2"></div>
          <div className="h-12 bg-neutral-100 rounded-md mb-2"></div>
          <div className="h-12 bg-neutral-100 rounded-md"></div>
        </div>
      </div>
    );
  }

  console.log("Recent tasks data:", tasks);

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Tâches récentes</h2>
          <Button variant="ghost" size="sm" className="text-xs" onClick={() => navigate('/gestion?tab=taches')}>
            Voir toutes
          </Button>
        </div>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Tâche</th>
                <th>Client</th>
                <th>Assigné à</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              {tasks.length > 0 ? (
                tasks.map((task: any) => (
                  <tr key={task.id}>
                    <td>{task.title}</td>
                    <td>
                      {task.clients && task.clients.type === "physique"
                        ? task.clients.nom
                        : task.clients?.raisonsociale || "Client inconnu"}
                    </td>
                    <td>
                      {task.collaborateurs ? `${task.collaborateurs.prenom} ${task.collaborateurs.nom}` : "Non assigné"}
                    </td>
                    <td>{getStatusBadge(task.status)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="text-center py-4 text-gray-500">
                    Aucune tâche n'a été créée.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Documents fiscaux à surveiller</h2>
          <Button variant="ghost" size="sm" className="text-xs" onClick={() => navigate('/gestion?tab=fiscale')}>
            Voir tous
          </Button>
        </div>
        
        <div className="space-y-2">
          {isLoadingDocuments ? (
            <div className="flex justify-center p-4">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : expiringDocuments.length > 0 ? (
            expiringDocuments.map((item) => (
              <div 
                key={item.document.id} 
                className="p-3 border rounded-md hover:bg-muted/50 cursor-pointer transition-colors"
                onClick={() => navigateToClientFiscal(item.clientId)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-sm">{item.document.name}</h3>
                    <p className="text-xs text-muted-foreground mt-1">Client: {item.clientName}</p>
                  </div>
                  <Badge variant={isDocumentExpired(item.document.validUntil) ? "destructive" : "outline"}>
                    {isDocumentExpired(item.document.validUntil) ? "Expiré" : "À renouveler"}
                  </Badge>
                </div>
                <p className="text-xs mt-2">
                  {isDocumentExpired(item.document.validUntil) 
                    ? `Expiré le ${item.document.validUntil.toLocaleDateString()}`
                    : `Expire le ${item.document.validUntil.toLocaleDateString()}`
                  }
                </p>
              </div>
            ))
          ) : (
            <div className="p-4 text-center text-sm text-muted-foreground">
              Aucun document fiscal n'arrive à expiration prochainement.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecentTasks;
