
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GestionDossier } from "./tabs/GestionDossier";
import { GestionComptable } from "./tabs/GestionComptable";
import { GestionFiscale } from "./tabs/GestionFiscale";
import { ObligationsFiscales } from "./tabs/ObligationsFiscales";
import { ClotureExercice } from "./tabs/ClotureExercice";
import { ContratPrestations } from "./tabs/ContratPrestations";
import { GestionEntreprise } from "./tabs/GestionEntreprise";

interface GestionTabsProps {
  selectedClient: string;
}

export const GestionTabs = ({ selectedClient }: GestionTabsProps) => {
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
        <GestionDossier />
      </TabsContent>

      <TabsContent value="comptable" className="mt-6">
        <GestionComptable />
      </TabsContent>

      <TabsContent value="fiscale" className="mt-6">
        <GestionFiscale />
      </TabsContent>

      <TabsContent value="obligations" className="mt-6">
        <ObligationsFiscales clientId={selectedClient} />
      </TabsContent>

      <TabsContent value="cloture" className="mt-6">
        <ClotureExercice />
      </TabsContent>

      <TabsContent value="contrat" className="mt-6">
        <ContratPrestations />
      </TabsContent>

      <TabsContent value="entreprise" className="mt-6">
        <GestionEntreprise />
      </TabsContent>
    </Tabs>
  );
};
