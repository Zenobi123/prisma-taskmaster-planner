
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, CreditCard, Users } from "lucide-react";
import { FacturesManagement } from "./sections/FacturesManagement";
import { PaiementsManagement } from "./sections/PaiementsManagement";
import { ClientsSituation } from "./sections/ClientsSituation";

export const FacturationTabs = () => {
  return (
    <Tabs defaultValue="factures" className="w-full">
      <TabsList className="grid grid-cols-3 mb-8">
        <TabsTrigger value="factures" className="flex items-center gap-2">
          <FileText className="h-4 w-4" />
          <span>Gestion des factures</span>
        </TabsTrigger>
        <TabsTrigger value="paiements" className="flex items-center gap-2">
          <CreditCard className="h-4 w-4" />
          <span>Gestion des paiements</span>
        </TabsTrigger>
        <TabsTrigger value="clients" className="flex items-center gap-2">
          <Users className="h-4 w-4" />
          <span>Situation clients</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="factures">
        <FacturesManagement />
      </TabsContent>

      <TabsContent value="paiements">
        <PaiementsManagement />
      </TabsContent>

      <TabsContent value="clients">
        <ClientsSituation />
      </TabsContent>
    </Tabs>
  );
};
