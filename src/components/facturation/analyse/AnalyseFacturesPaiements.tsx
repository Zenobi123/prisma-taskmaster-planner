
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, PieChart } from "lucide-react";
import AnalyseParFacture from "./AnalyseParFacture";
import AnalyseGlobale from "./AnalyseGlobale";
import AnalyseFilters from "./AnalyseFilters";
import { BillingStatsProvider } from "./context/BillingStatsContext";

const AnalyseFacturesPaiements = () => {
  const [currentTab, setCurrentTab] = useState("par-facture");

  return (
    <Card className="shadow-md border-gray-200 overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-4 bg-gray-50 border-b">
        <CardTitle className="text-xl flex items-center gap-2 text-gray-800">
          <BarChart className="h-5 w-5 text-[#84A98C]" /> 
          Analyse des factures et paiements
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-4">
        <BillingStatsProvider>
          <AnalyseFilters />
          
          <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full mt-4">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="par-facture" className="flex items-center gap-2">
                <BarChart className="h-4 w-4" />
                Analyse par facture
              </TabsTrigger>
              <TabsTrigger value="globale" className="flex items-center gap-2">
                <PieChart className="h-4 w-4" />
                Analyse globale
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="par-facture" className="animate-fade-in">
              <AnalyseParFacture />
            </TabsContent>
            
            <TabsContent value="globale" className="animate-fade-in">
              <AnalyseGlobale />
            </TabsContent>
          </Tabs>
        </BillingStatsProvider>
      </CardContent>
    </Card>
  );
};

export default AnalyseFacturesPaiements;
