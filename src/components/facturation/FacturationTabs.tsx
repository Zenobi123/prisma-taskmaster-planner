
import { FileText, Wallet, Users } from "lucide-react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { FacturesTab } from "./tabs/FacturesTab";
import { GestionPaiements } from "./sections/GestionPaiements";
import { SituationClients } from "./sections/SituationClients";
import { Facture } from "@/types/facture";

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
  onUpdateStatus: (factureId: string, newStatus: 'payée' | 'en_attente' | 'envoyée') => void;
  onEditInvoice: (facture: Facture) => void;
  onDeleteInvoice: (factureId: string) => void;
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
}: FacturationTabsProps) => {
  return (
    <>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex border-b mb-6 overflow-x-auto">
          <div 
            onClick={() => setActiveTab("factures")} 
            className={`flex gap-2 items-center py-3 px-4 cursor-pointer transition-all duration-300 ${
              activeTab === "factures" 
                ? "text-primary border-b-2 border-primary font-medium bg-primary/5" 
                : "text-neutral-600 hover:text-primary"
            }`}
          >
            <FileText className="w-4 h-4" />
            <span className="hidden sm:inline">Gestion des factures</span>
            <span className="sm:hidden">Factures</span>
          </div>
          <div 
            onClick={() => setActiveTab("paiements")} 
            className={`flex gap-2 items-center py-3 px-4 cursor-pointer transition-all duration-300 ${
              activeTab === "paiements" 
                ? "text-primary border-b-2 border-primary font-medium bg-primary/5" 
                : "text-neutral-600 hover:text-primary"
            }`}
          >
            <Wallet className="w-4 h-4" />
            <span className="hidden sm:inline">Gestion des paiements</span>
            <span className="sm:hidden">Paiements</span>
          </div>
          <div 
            onClick={() => setActiveTab("clients")} 
            className={`flex gap-2 items-center py-3 px-4 cursor-pointer transition-all duration-300 ${
              activeTab === "clients" 
                ? "text-primary border-b-2 border-primary font-medium bg-primary/5" 
                : "text-neutral-600 hover:text-primary"
            }`}
          >
            <Users className="w-4 h-4" />
            <span className="hidden sm:inline">Situation Clients</span>
            <span className="sm:hidden">Clients</span>
          </div>
        </div>
        
        <TabsContent value="factures">
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
          />
        </TabsContent>
        
        <TabsContent value="paiements" className="animate-fade-in">
          <GestionPaiements 
            factures={factures} 
            onUpdateStatus={onUpdateStatus}
            formatMontant={formatMontant}
          />
        </TabsContent>
        
        <TabsContent value="clients" className="animate-fade-in">
          <SituationClients />
        </TabsContent>
      </Tabs>
    </>
  );
};
