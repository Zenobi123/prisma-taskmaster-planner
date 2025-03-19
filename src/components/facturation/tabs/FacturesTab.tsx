
import { Facture } from "@/types/facture";
import { FacturationFilters } from "@/components/facturation/FacturationFilters";
import { FactureTable } from "@/components/facturation/FactureTable";

interface FacturesTabProps {
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
  isAdmin?: boolean;
}

export const FacturesTab = ({
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
  isAdmin = false,
}: FacturesTabProps) => {
  return (
    <div className="animate-fade-in">
      <FacturationFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        periodFilter={periodFilter}
        setPeriodFilter={setPeriodFilter}
      />

      <FactureTable
        factures={filteredFactures}
        formatMontant={formatMontant}
        onViewDetails={onViewDetails}
        onPrintInvoice={onPrintInvoice}
        onDownloadInvoice={onDownloadInvoice}
        onUpdateStatus={onUpdateStatus}
        onEditInvoice={onEditInvoice}
        onDeleteInvoice={onDeleteInvoice}
        isAdmin={isAdmin}
      />
    </div>
  );
};
