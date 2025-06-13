
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Building, User } from "lucide-react";
import { Client } from "@/types/client";

interface ClientsListProps {
  clients: Client[];
  isLoading: boolean;
  selectedCriteria: any;
}

export function ClientsList({ clients, isLoading, selectedCriteria }: ClientsListProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Clients Sélectionnés
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
              <p className="text-gray-500">Chargement des clients...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Clients Sélectionnés
          </div>
          <Badge variant="outline">
            {clients.length} client{clients.length > 1 ? 's' : ''}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {clients.length === 0 ? (
          <div className="text-center py-8">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 mb-2">Aucun client ne correspond aux critères sélectionnés</p>
            <p className="text-sm text-gray-400">
              Modifiez les critères pour voir les clients disponibles
            </p>
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {clients.map((client) => (
              <div key={client.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  {client.type === 'morale' ? (
                    <Building className="w-5 h-5 text-blue-500" />
                  ) : (
                    <User className="w-5 h-5 text-green-500" />
                  )}
                  <div>
                    <p className="font-medium">
                      {client.type === 'morale' ? client.raisonsociale : client.nom}
                    </p>
                    <p className="text-sm text-gray-500">
                      {client.secteuractivite} • {client.centrerattachement}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Badge variant={client.type === 'morale' ? 'default' : 'secondary'}>
                    {client.type === 'morale' ? 'Morale' : 'Physique'}
                  </Badge>
                  <Badge variant="outline">
                    {client.regimefiscal}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
