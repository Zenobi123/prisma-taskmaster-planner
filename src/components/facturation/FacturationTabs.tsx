
import { Facture } from "@/types/facture";
import { FactureDetailsManager } from "./FactureDetailsManager";
import { FacturesTab } from "./tabs/FacturesTab";
import { useFacturationFilters } from "@/hooks/useFacturationFilters";
import { useInvoiceActions } from "@/utils/invoiceActions";

interface FacturationTabsProps {
  factures: Facture[];
  formatMontant: (montant: number) => string;
  onUpdateStatus: (factureId: string, newStatus: 'payée' | 'en_attente' | 'envoyée' | 'partiellement_payée') => void;
  onDeleteInvoice: (factureId: string) => Promise<boolean> | void;
  onPaiementPartiel: (factureId: string, paiement: any, prestationsIds: string[]) => Promise<Facture | null>;
  isAdmin?: boolean;
}

export const FacturationTabs = ({
  factures,
  formatMontant,
  onUpdateStatus,
  onDeleteInvoice,
  onPaiementPartiel,
  isAdmin = false,
}: FacturationTabsProps) => {
  // Utiliser les filtres pour afficher les factures
  const {
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    periodFilter,
    setPeriodFilter,
    filteredFactures
  } = useFacturationFilters(factures);

  // Actions pour imprimer et télécharger les factures
  const { handlePrintInvoice, handleDownloadInvoice } = useInvoiceActions();

  // Gestion des détails de facture
  const {
    handleViewDetails,
    detailsDialog,
    selectedFacture,
    setSelectedFacture
  } = FactureDetailsManager({
    onPrintInvoice: handlePrintInvoice,
    onDownloadInvoice: handleDownloadInvoice,
    onUpdateStatus,
    onEditInvoice: (facture) => setSelectedFacture(facture),
    onDeleteInvoice,
    formatMontant,
    isAdmin
  });

  return (
    <div className="mt-6 animate-fade-in">
      <FacturesTab
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        periodFilter={periodFilter}
        setPeriodFilter={setPeriodFilter}
        filteredFactures={filteredFactures}
        formatMontant={formatMontant}
        onViewDetails={handleViewDetails}
        onPrintInvoice={handlePrintInvoice}
        onDownloadInvoice={handleDownloadInvoice}
        onUpdateStatus={onUpdateStatus}
        onEditInvoice={(facture) => setSelectedFacture(facture)}
        onDeleteInvoice={onDeleteInvoice}
        isAdmin={isAdmin}
      />
      {detailsDialog}
    </div>
  );
};
