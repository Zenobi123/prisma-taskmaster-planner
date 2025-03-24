
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PieChart, FileText } from "lucide-react";
import { DetailFactureProps } from "./types/DetailFactureTypes";
import { useFactureDetail } from "./hooks/useFactureDetail";
import { FactureHeader } from "./components/FactureHeader";
import { FactureSummaryCards } from "./components/FactureSummaryCards";
import { PaymentProgressBar } from "./components/PaymentProgressBar";
import { RepartitionTabContent } from "./components/RepartitionTabContent";
import { DetailsTabContent } from "./components/DetailsTabContent";
import { FactureDetailSkeleton } from "./components/FactureDetailSkeleton";

const DetailFacture = ({ factureId }: DetailFactureProps) => {
  const { factureDetail, isLoading, totals } = useFactureDetail(factureId);
  const [currentTab, setCurrentTab] = useState("repartition");

  if (isLoading) {
    return <FactureDetailSkeleton />;
  }

  if (!factureDetail || !totals) {
    return <div>Détails de la facture non disponibles</div>;
  }

  return (
    <div>
      <FactureHeader 
        id={factureDetail.id}
        client={factureDetail.client}
        date={factureDetail.date}
        status_paiement={factureDetail.status_paiement}
      />
      
      <FactureSummaryCards 
        montantTotal={factureDetail.montant}
        montantPaye={factureDetail.montant_paye}
        montantRestant={totals.montantRestant}
      />
      
      <PaymentProgressBar pourcentagePaye={totals.pourcentagePaye} />
      
      <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="repartition" className="flex items-center gap-2">
            <PieChart className="h-4 w-4" />
            Répartition
          </TabsTrigger>
          <TabsTrigger value="details" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Détails
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="repartition">
          <RepartitionTabContent 
            totalImpots={totals.totalImpots}
            totalHonoraires={totals.totalHonoraires}
            totalMontant={factureDetail.montant}
            prestations={factureDetail.prestations}
          />
        </TabsContent>
        
        <TabsContent value="details">
          <DetailsTabContent prestations={factureDetail.prestations} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DetailFacture;
