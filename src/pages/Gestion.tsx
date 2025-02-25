
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getClients } from "@/services/clientService";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GestionHeader } from "@/components/gestion/GestionHeader";
import { ClientSelector } from "@/components/gestion/ClientSelector";
import { SelectedClientCard } from "@/components/gestion/SelectedClientCard";
import { GestionEntreprise } from "@/components/gestion/tabs/GestionEntreprise";
import { GestionFiscale } from "@/components/gestion/tabs/GestionFiscale";
import { GestionComptable } from "@/components/gestion/tabs/GestionComptable";
import { GestionDossier } from "@/components/gestion/tabs/GestionDossier";
import { ContratPrestations } from "@/components/gestion/tabs/ContratPrestations";

export default function Gestion() {
  const [activeTab, setActiveTab] = useState("entreprise");
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);

  // Optimisation avec react-query pour le caching et la mise en cache automatique
  const { data: clients = [], isLoading } = useQuery({
    queryKey: ["clients"],
    queryFn: getClients,
    staleTime: 5 * 60 * 1000, // Cache valide pendant 5 minutes
    cacheTime: 30 * 60 * 1000, // Garde en cache pendant 30 minutes
  });

  // Filtrage optimisé avec useMemo
  const clientsEnGestion = React.useMemo(() => 
    clients.filter(client => client.gestionexternalisee),
    [clients]
  );

  // Recherche optimisée du client sélectionné
  const selectedClient = React.useMemo(() => 
    clientsEnGestion.find(client => client.id === selectedClientId),
    [clientsEnGestion, selectedClientId]
  );

  // Gestion du changement d'onglet optimisée
  const handleTabChange = React.useCallback((value: string) => {
    setActiveTab(value);
  }, []);

  // Gestion de la sélection du client optimisée
  const handleClientSelect = React.useCallback((clientId: string) => {
    setSelectedClientId(clientId);
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

          <Tabs 
            defaultValue="entreprise" 
            value={activeTab} 
            onValueChange={handleTabChange} 
            className="space-y-4"
          >
            <TabsList className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-transparent">
              <TabsTrigger 
                value="entreprise"
                className="data-[state=active]:bg-[#84A98C] data-[state=active]:text-white hover:bg-[#F2FCE2] transition-all"
              >
                Gestion d'entreprise
              </TabsTrigger>
              <TabsTrigger 
                value="fiscal"
                className="data-[state=active]:bg-[#84A98C] data-[state=active]:text-white hover:bg-[#F2FCE2] transition-all"
              >
                Gestion fiscale
              </TabsTrigger>
              <TabsTrigger 
                value="comptable"
                className="data-[state=active]:bg-[#84A98C] data-[state=active]:text-white hover:bg-[#F2FCE2] transition-all"
              >
                Gestion comptable
              </TabsTrigger>
              <TabsTrigger 
                value="dossier"
                className="data-[state=active]:bg-[#84A98C] data-[state=active]:text-white hover:bg-[#F2FCE2] transition-all"
              >
                Gestion documentaire
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="entreprise">
              <GestionEntreprise onTabChange={handleTabChange} />
            </TabsContent>

            <TabsContent value="contrat-prestations">
              <ContratPrestations client={selectedClient} />
            </TabsContent>

            <TabsContent value="fiscal">
              <GestionFiscale />
            </TabsContent>

            <TabsContent value="comptable">
              <GestionComptable />
            </TabsContent>

            <TabsContent value="dossier">
              <GestionDossier />
            </TabsContent>
          </Tabs>
        </>
      ) : (
        <Card className="border-[#A8C1AE] bg-gradient-to-r from-[#F2FCE2] to-white">
          <CardHeader>
            <CardTitle className="text-[#1A1F2C]">Sélectionnez un client</CardTitle>
            <CardDescription className="text-[#8E9196]">
              Veuillez sélectionner un client pour gérer son dossier
            </CardDescription>
          </CardHeader>
        </Card>
      )}
    </div>
  );
}

