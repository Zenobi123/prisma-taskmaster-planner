
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Loader2 } from "lucide-react";
import { Client } from "@/types/client";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

interface ClientsListProps {
  clients: Client[];
  selectedClients: string[];
  onClientSelectionChange: (clientIds: string[]) => void;
  onPreview: () => void;
}

export const ClientsList = ({ 
  clients = [], 
  selectedClients = [], 
  onClientSelectionChange, 
  onPreview 
}: ClientsListProps) => {
  const handleClientToggle = (clientId: string, checked: boolean) => {
    if (checked) {
      onClientSelectionChange([...selectedClients, clientId]);
    } else {
      onClientSelectionChange(selectedClients.filter(id => id !== clientId));
    }
  };

  const handleSelectAll = () => {
    if (selectedClients.length === clients.length) {
      onClientSelectionChange([]);
    } else {
      onClientSelectionChange(clients.map(client => client.id));
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Clients sélectionnés
          </div>
          <Badge variant="secondary">
            {selectedClients.length} / {clients.length} client{clients.length > 1 ? 's' : ''}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {clients.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Aucun client ne correspond aux critères sélectionnés</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSelectAll}
              >
                {selectedClients.length === clients.length ? "Tout désélectionner" : "Tout sélectionner"}
              </Button>
              
              {selectedClients.length > 0 && (
                <Button onClick={onPreview}>
                  Aperçu ({selectedClients.length})
                </Button>
              )}
            </div>
            
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {clients.map((client) => (
                <div
                  key={client.id}
                  className="flex items-start gap-3 p-3 border rounded-lg bg-card"
                >
                  <Checkbox
                    checked={selectedClients.includes(client.id)}
                    onCheckedChange={(checked) => handleClientToggle(client.id, !!checked)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="font-medium">
                      {client.type === "morale" ? client.raisonsociale : client.nom}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {client.niu} • {client.centrerattachement}
                    </div>
                    <div className="flex gap-1 mt-2">
                      <Badge variant="outline" className="text-xs">
                        {client.type === "morale" ? "PM" : "PP"}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {client.regimefiscal}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
