
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Loader2, Building2, User } from "lucide-react";
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
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-green-600" />
            Clients sélectionnés
          </div>
          <Badge variant="secondary" className="bg-green-100 text-green-700">
            {clients.length} client{clients.length > 1 ? 's' : ''}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center space-y-3">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-500" />
              <p className="text-gray-500">Chargement des clients...</p>
            </div>
          </div>
        ) : !hasActiveCriteria ? (
          <div className="text-center py-12 text-gray-500">
            <Users className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <h3 className="font-medium text-gray-700 mb-2">Aucun filtre appliqué</h3>
            <p className="text-sm">Sélectionnez des critères pour filtrer les clients</p>
          </div>
        ) : clients.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Users className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <h3 className="font-medium text-gray-700 mb-2">Aucun résultat</h3>
            <p className="text-sm">Aucun client ne correspond aux critères sélectionnés</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {clients.map((client) => (
              <div
                key={client.id}
                className="p-4 border border-gray-200 rounded-lg bg-white hover:shadow-md transition-all duration-200 hover:border-blue-300"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="p-2 rounded-lg bg-gray-50">
                      {client.type === "morale" ? (
                        <Building2 className="w-5 h-5 text-blue-600" />
                      ) : (
                        <User className="w-5 h-5 text-green-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">
                        {client.type === "morale" ? client.raisonsociale : client.nom}
                      </h4>
                      <div className="text-sm text-gray-500 mt-1">
                        {client.niu} • {client.centrerattachement}
                      </div>
                      <div className="flex gap-2 mt-2">
                        <Badge variant="outline" className="text-xs border-blue-200 text-blue-700">
                          {client.type === "morale" ? "PM" : "PP"}
                        </Badge>
                        <Badge variant="outline" className="text-xs border-purple-200 text-purple-700">
                          {client.regimefiscal}
                        </Badge>
                        {client.secteuractivite && (
                          <Badge variant="outline" className="text-xs border-gray-200 text-gray-600">
                            {client.secteuractivite}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
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
