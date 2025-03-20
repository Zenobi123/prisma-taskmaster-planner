
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Users, Search } from "lucide-react";
import { ClientTable } from "./situation/ClientTable";
import { SituationChart } from "./situation/SituationChart";
import { StatusLegend } from "./situation/StatusLegend";
import { useSituationClients } from "./situation/useSituationClients";

const SituationClients = () => {
  const {
    searchTerm,
    setSearchTerm,
    sortColumn,
    sortDirection,
    handleSort,
    filteredClients,
    formatMontant,
    chartData,
    statusItems
  } = useSituationClients();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl flex items-center gap-2">
              <Users className="h-5 w-5" /> 
              Situation financière des clients
            </CardTitle>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Rechercher un client..."
                className="pl-8 w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent>
            <ClientTable 
              clients={filteredClients}
              sortColumn={sortColumn}
              sortDirection={sortDirection}
              handleSort={handleSort}
              formatMontant={formatMontant}
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Répartition des paiements</CardTitle>
          </CardHeader>
          <CardContent>
            <SituationChart data={chartData} />
            <StatusLegend items={statusItems} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SituationClients;
