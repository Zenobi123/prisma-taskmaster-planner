
import { Facture } from "@/types/facture";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FacturesTab } from "@/components/facturation/tabs/FacturesTab";
import { GestionPaiements } from "@/components/facturation/sections/GestionPaiements";
import { SituationClients } from "@/components/facturation/sections/SituationClients";

interface FacturationTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  factures: Facture[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  periodFilter: string;
  setPeriodFilter: (period: string) => void;
  filteredFactures: Facture[];
  formatMontant: (montant: number) => string;
  onViewDetails: (facture: Facture) => void;
  onPrintInvoice: (factureId: string) => void;
  onDownloadInvoice: (factureId: string) => void;
  onUpdateStatus: (factureId: string, newStatus: 'payée' | 'en_attente' | 'envoyée' | 'partiellement_payée') => void;
  onEditInvoice: (facture: Facture) => void;
  onDeleteInvoice: (factureId: string) => void;
  onPaiementPartiel: (factureId: string, paiement: any, prestationsIds: string[]) => Promise<Facture | null>;
  isAdmin?: boolean;
}

export const FacturationTabs = ({
  activeTab,
  setActiveTab,
  factures,
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  periodFilter,
  setPeriodFilter,
  filteredFactures,
  formatMontant,
  onViewDetails,
  onPrintInvoice,
  onDownloadInvoice,
  onUpdateStatus,
  onEditInvoice,
  onDeleteInvoice,
  onPaiementPartiel,
  isAdmin = false,
}: FacturationTabsProps) => {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6 animate-fade-in">
      <TabsList className="grid grid-cols-3 mb-8">
        <TabsTrigger 
          value="factures" 
          className="text-sm data-[state=active]:bg-primary data-[state=active]:text-white"
        >
          Factures
        </TabsTrigger>
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
      
      <TabsContent value="factures">
        {filteredFactures.length > 0 ? (
          <FacturesTab
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            periodFilter={periodFilter}
            setPeriodFilter={setPeriodFilter}
            filteredFactures={filteredFactures}
            formatMontant={formatMontant}
            onViewDetails={onViewDetails}
            onPrintInvoice={onPrintInvoice}
            onDownloadInvoice={onDownloadInvoice}
            onUpdateStatus={onUpdateStatus}
            onEditInvoice={onEditInvoice}
            onDeleteInvoice={onDeleteInvoice}
            isAdmin={isAdmin}
          />
        ) : (
          <div className="py-12 text-center text-muted-foreground">
            Aucune facture disponible
          </div>
        )}
      </TabsContent>
      
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
