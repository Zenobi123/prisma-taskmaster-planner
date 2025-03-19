
import { Facture } from "@/types/facture";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GestionPaiements } from "@/components/facturation/sections/GestionPaiements";
import { SituationClients } from "@/components/facturation/sections/SituationClients";

interface FacturationTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  factures: Facture[];
  formatMontant: (montant: number) => string;
  onUpdateStatus: (factureId: string, newStatus: 'payée' | 'en_attente' | 'envoyée' | 'partiellement_payée') => void;
  onDeleteInvoice: (factureId: string) => Promise<boolean> | void;
  onPaiementPartiel: (factureId: string, paiement: any, prestationsIds: string[]) => Promise<Facture | null>;
  isAdmin?: boolean;
}

export const FacturationTabs = ({
  activeTab,
  setActiveTab,
  factures,
  formatMontant,
  onUpdateStatus,
  onDeleteInvoice,
  onPaiementPartiel,
  isAdmin = false,
}: FacturationTabsProps) => {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6 animate-fade-in">
      <TabsList className="grid grid-cols-2 mb-8">
        <TabsTrigger 
          value="paiements" 
          className="text-sm data-[state=active]:bg-primary data-[state=active]:text-white"
        >
          Paiements
        </TabsTrigger>
        <TabsTrigger 
          value="clients" 
          className="text-sm data-[state=active]:bg-primary data-[state=active]:text-white"
        >
          Situation clients
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="paiements">
        <GestionPaiements 
          factures={factures.filter(f => f.status !== 'payée')}
          formatMontant={formatMontant}
          onUpdateStatus={onUpdateStatus}
          onPaiementPartiel={onPaiementPartiel}
        />
      </TabsContent>
      
      <TabsContent value="clients">
        <SituationClients 
          factures={factures} 
          formatMontant={formatMontant}
        />
      </TabsContent>
    </Tabs>
  );
};
