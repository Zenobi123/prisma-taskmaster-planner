
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

  const { data: clients = [] } = useQuery({
    queryKey: ["clients"],
    queryFn: getClients,
  });

  const clientsEnGestion = clients.filter(client => client.gestionexternalisee);
  const selectedClient = clientsEnGestion.find(client => client.id === selectedClientId);

  return (
    <div className="p-8 bg-[#F6F6F7]">
      <GestionHeader nombreClientsEnGestion={clientsEnGestion.length} />
      
      <ClientSelector 
        clients={clientsEnGestion}
        selectedClientId={selectedClientId}
        onClientSelect={setSelectedClientId}
      />

      {selectedClient ? (
        <>
          <SelectedClientCard client={selectedClient} />

          <Tabs 
            defaultValue="entreprise" 
            value={activeTab} 
            onValueChange={setActiveTab} 
            className="space-y-4"
          >
            <TabsList className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-transparent">
              <TabsTrigger 
                value="entreprise"
                className="data-[state=active]:bg-[#9b87f5] data-[state=active]:text-white hover:bg-[#F1F0FB] transition-all"
              >
                Gestion d'entreprise
              </TabsTrigger>
              <TabsTrigger 
                value="fiscal"
                className="data-[state=active]:bg-[#9b87f5] data-[state=active]:text-white hover:bg-[#F1F0FB] transition-all"
              >
                Gestion fiscale
              </TabsTrigger>
              <TabsTrigger 
                value="comptable"
                className="data-[state=active]:bg-[#9b87f5] data-[state=active]:text-white hover:bg-[#F1F0FB] transition-all"
              >
                Gestion comptable
              </TabsTrigger>
              <TabsTrigger 
                value="dossier"
                className="data-[state=active]:bg-[#9b87f5] data-[state=active]:text-white hover:bg-[#F1F0FB] transition-all"
              >
                Gestion documentaire
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="entreprise">
              <GestionEntreprise onTabChange={setActiveTab} />
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
        <Card className="border-[#E5DEFF] bg-gradient-to-r from-[#F1F0FB] to-white">
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
