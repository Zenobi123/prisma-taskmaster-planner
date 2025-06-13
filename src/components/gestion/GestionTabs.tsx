
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GestionDossier } from "./tabs/GestionDossier";
import { GestionComptable } from "./tabs/GestionComptable";
import { GestionFiscale } from "./tabs/GestionFiscale";
import { ObligationsFiscales } from "./tabs/ObligationsFiscales";
import { ClotureExercice } from "./tabs/ClotureExercice";
import { ContratPrestations } from "./tabs/ContratPrestations";
import { GestionEntreprise } from "./tabs/GestionEntreprise";
import { useQuery } from "@tanstack/react-query";
import { getClients } from "@/services/clientService";

interface GestionTabsProps {
  selectedClient: string;
}

export const GestionTabs = ({ selectedClient }: GestionTabsProps) => {
  const { data: clients = [] } = useQuery({
    queryKey: ["clients"],
    queryFn: () => getClients(false),
  });

  const client = clients.find(c => c.id === selectedClient);

  if (!client) {
    return <div>Client non trouvé</div>;
  }

  return (
    <Tabs defaultValue="dossier" className="w-full">
      <TabsList className="grid w-full grid-cols-4 lg:grid-cols-7">
        <TabsTrigger value="dossier">Dossier</TabsTrigger>
        <TabsTrigger value="comptable">Comptable</TabsTrigger>
        <TabsTrigger value="fiscale">Fiscale</TabsTrigger>
        <TabsTrigger value="obligations">Obligations</TabsTrigger>
        <TabsTrigger value="cloture">Clôture</TabsTrigger>
        <TabsTrigger value="contrat">Contrat</TabsTrigger>
        <TabsTrigger value="entreprise">Entreprise</TabsTrigger>
      </TabsList>

      <TabsContent value="dossier" className="mt-6">
        <GestionDossier selectedClient={selectedClient} />
      </TabsContent>

      <TabsContent value="comptable" className="mt-6">
        <GestionComptable />
      </TabsContent>

      <TabsContent value="fiscale" className="mt-6">
        <GestionFiscale onTabChange={() => {}} />
      </TabsContent>

      <TabsContent value="obligations" className="mt-6">
        <ObligationsFiscales selectedClient={client} />
      </TabsContent>

      <TabsContent value="cloture" className="mt-6">
        <ClotureExercice selectedSubTab="" handleSubTabSelect={() => {}} />
      </TabsContent>

      <TabsContent value="contrat" className="mt-6">
        <ContratPrestations client={client} />
      </TabsContent>

      <TabsContent value="entreprise" className="mt-6">
        <GestionEntreprise onTabChange={() => {}} selectedClient={client} />
      </TabsContent>
    </Tabs>
  );
};
