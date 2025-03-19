
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ClientSearchFilters } from "./situationClients/ClientSearchFilters";
import { ClientStatsCards } from "./situationClients/ClientStatsCards";
import { RecoveryRateCard } from "./situationClients/RecoveryRateCard";
import { ClientsTable } from "./situationClients/ClientsTable";
import { clientsData, formatMontant, getStatutClient, calculateTotals } from "./situationClients/utils";

export const SituationClients = () => {
  // Calculate totals from the clients data
  const { totalEncours, totalSolde, tauxRecouvrement } = calculateTotals(clientsData);

  return (
    <div className="space-y-6">
      <ClientSearchFilters />
      
      <ClientStatsCards 
        clientsData={clientsData} 
        formatMontant={formatMontant} 
        totalSolde={totalSolde} 
      />
      
      <RecoveryRateCard 
        tauxRecouvrement={tauxRecouvrement} 
        totalEncours={totalEncours} 
        totalSolde={totalSolde} 
        formatMontant={formatMontant} 
      />

      <Tabs defaultValue="tous" className="w-full">
        <TabsList>
          <TabsTrigger value="tous">Tous les clients</TabsTrigger>
          <TabsTrigger value="jour">À jour</TabsTrigger>
          <TabsTrigger value="retard">En retard</TabsTrigger>
          <TabsTrigger value="impayes">Impayés</TabsTrigger>
        </TabsList>
        
        <TabsContent value="tous" className="mt-4">
          <ClientsTable 
            clients={clientsData} 
            formatMontant={formatMontant} 
            getStatutClient={getStatutClient} 
          />
        </TabsContent>
        
        <TabsContent value="jour" className="mt-4">
          <ClientsTable 
            clients={clientsData.filter(client => client.statut === "à jour")} 
            formatMontant={formatMontant} 
            getStatutClient={getStatutClient} 
          />
        </TabsContent>
        
        <TabsContent value="retard" className="mt-4">
          <ClientsTable 
            clients={clientsData.filter(client => client.statut === "en_retard")} 
            formatMontant={formatMontant} 
            getStatutClient={getStatutClient} 
          />
        </TabsContent>
        
        <TabsContent value="impayes" className="mt-4">
          <ClientsTable 
            clients={clientsData.filter(client => client.statut === "impayé")} 
            formatMontant={formatMontant} 
            getStatutClient={getStatutClient} 
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
