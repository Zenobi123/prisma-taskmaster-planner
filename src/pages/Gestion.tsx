
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { PageLayout } from "@/components/layout/PageLayout";
import { GestionHeader } from "@/components/gestion/GestionHeader";
import { ClientSelector } from "@/components/gestion/ClientSelector";
import { SelectedClientCard } from "@/components/gestion/SelectedClientCard";
import { GestionTabs } from "@/components/gestion/GestionTabs";
import { NoClientSelected } from "@/components/gestion/NoClientSelected";
import { getClients } from "@/services/clientService";
import { Client } from "@/types/client";

export default function Gestion() {
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  const { data: clients = [], isLoading } = useQuery({
    queryKey: ["clients"],
    queryFn: () => getClients(false),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const handleClientSelect = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    setSelectedClient(client || null);
  };

  if (isLoading) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Chargement...</div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <GestionHeader nombreClientsEnGestion={clients.length} />
      
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <ClientSelector
              clients={clients}
              selectedClient={selectedClient}
              onClientSelect={handleClientSelect}
            />
          </div>
          
          <div className="lg:col-span-2">
            {selectedClient ? (
              <SelectedClientCard client={selectedClient} />
            ) : (
              <NoClientSelected />
            )}
          </div>
        </div>

        {selectedClient && (
          <GestionTabs clientId={selectedClient.id} />
        )}
      </div>
    </PageLayout>
  );
}
