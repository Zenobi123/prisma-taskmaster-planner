
import { Badge } from "@/components/ui/badge";
import { Loader2, Building2, User } from "lucide-react";
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
    <div>
      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <div className="text-center space-y-3">
            <Loader2 className="w-6 h-6 animate-spin mx-auto text-[#84A98C]" />
            <p className="text-gray-500">Chargement des clients...</p>
          </div>
        </div>
      ) : !hasActiveCriteria ? (
        <div className="text-center py-8 text-gray-500">
          <p className="text-sm">Sélectionnez des critères pour filtrer les clients</p>
        </div>
      ) : clients.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p className="text-sm">Aucun client ne correspond aux critères sélectionnés</p>
        </div>
      ) : (
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {clients.map((client) => (
            <div
              key={client.id}
              className="p-3 border border-gray-200 rounded-md bg-white hover:shadow-sm transition-all duration-200 hover:border-[#84A98C]"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2 flex-1">
                  <div className="p-1 rounded bg-gray-100">
                    {client.type === "morale" ? (
                      <Building2 className="w-4 h-4 text-[#84A98C]" />
                    ) : (
                      <User className="w-4 h-4 text-[#84A98C]" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 text-sm truncate">
                      {client.type === "morale" ? client.raisonsociale : client.nom}
                    </h4>
                    <div className="text-xs text-gray-500 mt-1">
                      {client.niu} • {client.centrerattachement}
                    </div>
                    <div className="flex gap-1 mt-1 flex-wrap">
                      <Badge variant="outline" className="text-xs border-[#84A98C] text-[#84A98C]">
                        {client.type === "morale" ? "PM" : "PP"}
                      </Badge>
                      <Badge variant="outline" className="text-xs border-gray-300 text-gray-600">
                        {client.regimefiscal}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ClientsList;
