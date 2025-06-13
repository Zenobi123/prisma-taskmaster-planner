
import { useQuery } from "@tanstack/react-query";
import { getDeletedClients } from "@/services/clientService";
import { Client } from "@/types/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, Trash2, Calendar } from "lucide-react";
import { useClientMutations } from "@/pages/clients/hooks/useClientMutations";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

interface ClientTrashProps {
  onClose: () => void;
}

export function ClientTrash({ onClose }: ClientTrashProps) {
  const { data: deletedClients = [], isLoading, refetch } = useQuery({
    queryKey: ["deleted-clients"],
    queryFn: getDeletedClients,
    refetchOnWindowFocus: false,
  });

  const { restoreMutation, permanentDeleteMutation } = useClientMutations();

  const handleRestore = async (client: Client) => {
    if (window.confirm("Êtes-vous sûr de vouloir restaurer ce client ?")) {
      try {
        await restoreMutation.mutateAsync(client.id);
      } catch (error) {
        console.error("Erreur lors de la restauration:", error);
      }
    }
  };

  const handlePermanentDelete = async (client: Client) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer définitivement ce client ? Cette action est irréversible.")) {
      try {
        await permanentDeleteMutation.mutateAsync(client.id);
      } catch (error) {
        console.error("Erreur lors de la suppression définitive:", error);
      }
    }
  };

  const getDeletedDate = (client: any) => {
    if (client.deleted_at) {
      try {
        return formatDistanceToNow(new Date(client.deleted_at), { 
          addSuffix: true, 
          locale: fr 
        });
      } catch (error) {
        return "Date inconnue";
      }
    }
    return "Date inconnue";
  };

  if (isLoading) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Corbeille - Clients supprimés</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Trash2 className="h-5 w-5" />
          Corbeille - Clients supprimés ({deletedClients.length})
        </CardTitle>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => refetch()}
            disabled={isLoading}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualiser
          </Button>
          <Button variant="outline" size="sm" onClick={onClose}>
            Fermer
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {deletedClients.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Trash2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Aucun client dans la corbeille</p>
          </div>
        ) : (
          <div className="space-y-4">
            {deletedClients.map((client) => (
              <div
                key={client.id}
                className="border rounded-lg p-4 bg-muted/10 hover:bg-muted/20 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <Badge 
                        variant="outline"
                        className={
                          client.type === "physique"
                            ? "bg-[#D3E4FD] border-[#D3E4FD] text-blue-700"
                            : "bg-[#FEC6A1] border-[#FEC6A1] text-orange-700"
                        }
                      >
                        {client.type === "physique" ? "Physique" : "Morale"}
                      </Badge>
                      <h3 className="font-medium truncate">
                        {client.type === "physique" ? client.nom : client.raisonsociale}
                      </h3>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>NIU: {client.niu}</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Supprimé {getDeletedDate(client)}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRestore(client)}
                      disabled={restoreMutation.isPending}
                      className="text-green-600 hover:text-green-700 hover:bg-green-50"
                    >
                      <RefreshCw className="h-4 w-4 mr-1" />
                      Restaurer
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePermanentDelete(client)}
                      disabled={permanentDeleteMutation.isPending}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Supprimer définitivement
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
