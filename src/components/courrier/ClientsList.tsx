
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Loader2 } from "lucide-react";
import { Client } from "@/types/client";
import { Criteria } from "./CriteriaSelection";

interface ClientsListProps {
  clients: Client[];
  selectedClientIds: string[];
  onSelectionChange: (ids: string[]) => void;
  isLoading: boolean;
  selectedCriteria: Criteria;
}

const ClientsList = ({ 
  clients, 
  selectedClientIds, 
  onSelectionChange, 
  isLoading, 
  selectedCriteria 
}: ClientsListProps) => {
  const hasActiveCriteria = Object.values(selectedCriteria).some(value => value && value !== "actif");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Clients sélectionnés
          </div>
          <Badge variant="secondary">
            {clients.length} client{clients.length > 1 ? 's' : ''}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
        ) : !hasActiveCriteria ? (
          <div className="text-center py-8 text-muted-foreground">
            <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Sélectionnez des critères pour filtrer les clients</p>
          </div>
        ) : clients.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Aucun client ne correspond aux critères sélectionnés</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {clients.map((client) => (
              <div
                key={client.id}
                className="p-3 border rounded-lg bg-card"
              >
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
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ClientsList;
