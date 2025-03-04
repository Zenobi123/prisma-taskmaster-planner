
import React from "react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getClients } from "@/services/clientService";
import { GestionHeader } from "@/components/gestion/GestionHeader";
import { ClientSelector } from "@/components/gestion/ClientSelector";
import { SelectedClientCard } from "@/components/gestion/SelectedClientCard";
import { GestionTabs } from "@/components/gestion/GestionTabs";
import { NoClientSelected } from "@/components/gestion/NoClientSelected";

export default function Gestion() {
  const [activeTab, setActiveTab] = useState("entreprise");
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [selectedSubTab, setSelectedSubTab] = useState<string | null>(null);

  const { data: clients = [], isLoading } = useQuery({
    queryKey: ["clients"],
    queryFn: getClients,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });

  const clientsEnGestion = React.useMemo(() => 
    clients.filter(client => client.gestionexternalisee),
    [clients]
  );

  const selectedClient = React.useMemo(() => 
    clientsEnGestion.find(client => client.id === selectedClientId),
    [clientsEnGestion, selectedClientId]
  );

  const handleTabChange = React.useCallback((value: string) => {
    setActiveTab(value);
    setSelectedSubTab(null); // Reset sub-tab when main tab changes
  }, []);

  const handleClientSelect = React.useCallback((clientId: string) => {
    setSelectedClientId(clientId);
  }, []);

  const handleSubTabSelect = React.useCallback((subTab: string) => {
    setSelectedSubTab(subTab);
  }, []);

  if (isLoading) {
    return (
      <div className="p-8 bg-[#F6F6F7]">
        <div className="flex items-center justify-center min-h-[200px]">
          <p className="text-muted-foreground">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-[#F6F6F7]">
      <GestionHeader nombreClientsEnGestion={clientsEnGestion.length} />
      
      <ClientSelector 
        clients={clientsEnGestion}
        selectedClientId={selectedClientId}
        onClientSelect={handleClientSelect}
      />

      {selectedClient ? (
        <>
          <SelectedClientCard client={selectedClient} />
          <GestionTabs
            activeTab={activeTab}
            selectedClient={selectedClient}
            selectedSubTab={selectedSubTab}
            onTabChange={handleTabChange}
            onSubTabSelect={handleSubTabSelect}
          />
        </>
      ) : (
        <NoClientSelected />
      )}
    </div>
  );
}
