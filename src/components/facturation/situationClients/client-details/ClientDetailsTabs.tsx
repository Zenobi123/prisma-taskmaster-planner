
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useClientDetails } from "./ClientDetailsContext";
import InformationTab from "./tabs/InformationTab";
import InvoicesTab from "./tabs/InvoicesTab";
import PaymentsTab from "./tabs/PaymentsTab";

const ClientDetailsTabs = () => {
  const { clientDetails } = useClientDetails();
  
  if (!clientDetails) {
    return null;
  }

  return (
    <div className="w-full">
      <Tabs defaultValue="informations" className="w-full">
        <div className="border-b border-gray-200">
          <TabsList className="flex space-x-4">
            <TabsTrigger value="informations"
              className="rounded-md px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
            >
              Informations
            </TabsTrigger>
            <TabsTrigger value="factures"
              className="rounded-md px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
            >
              Factures{" "}
              <Badge variant="secondary" className="ml-2">
                {clientDetails.factures.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="paiements"
              className="rounded-md px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
            >
              Paiements{" "}
              <Badge variant="secondary" className="ml-2">
                {clientDetails.paiements.length}
              </Badge>
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="informations" className="mt-2">
          <InformationTab />
        </TabsContent>
        
        <TabsContent value="factures" className="mt-2">
          <InvoicesTab />
        </TabsContent>
        
        <TabsContent value="paiements" className="mt-2">
          <PaymentsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ClientDetailsTabs;
