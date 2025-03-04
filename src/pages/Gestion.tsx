import React from "react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getClients } from "@/services/clientService";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
  }, []);

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
              <GestionFiscale onTabChange={handleTabChange} />
            </TabsContent>

            <TabsContent value="obligations-fiscales">
              <Card>
                <CardHeader>
                  <CardTitle>Obligations fiscales</CardTitle>
                  <CardDescription>Suivi et respect des échéances fiscales</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Contenu détaillé pour les obligations fiscales à venir...
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="optimisation-fiscale">
              <Card>
                <CardHeader>
                  <CardTitle>Optimisation fiscale</CardTitle>
                  <CardDescription>Stratégies d'optimisation fiscale</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Contenu détaillé pour l'optimisation fiscale à venir...
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="administration-fiscale">
              <Card>
                <CardHeader>
                  <CardTitle>Administration fiscale</CardTitle>
                  <CardDescription>Relations avec l'administration fiscale</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Contenu détaillé pour les relations avec l'administration fiscale à venir...
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="cloture-exercice">
              <Card>
                <CardHeader>
                  <CardTitle>Clôture d'exercice</CardTitle>
                  <CardDescription>Préparation et traitement de la clôture fiscale annuelle</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Contenu détaillé pour la clôture d'exercice à venir...
                  </p>
                </CardContent>
              </Card>
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
