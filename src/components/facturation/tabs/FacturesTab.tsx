
import { Facture } from "@/types/facture";
import { FacturationFilters } from "@/components/facturation/FacturationFilters";
import { FactureTable } from "@/components/facturation/FactureTable";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { DeleteAllFacturesDialog } from "@/components/facturation/DeleteAllFacturesDialog";

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
  onUpdateStatus: (factureId: string, newStatus: 'payée' | 'en_attente' | 'envoyée' | 'partiellement_payée') => void;
  onEditInvoice: (facture: Facture) => void;
  onDeleteInvoice: (factureId: string) => void;
  onDeleteAllInvoices: () => Promise<boolean>;
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
  onDeleteAllInvoices,
  isAdmin = false,
}: FacturesTabProps) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleBulkDelete = async () => {
    await onDeleteAllInvoices();
    setIsDeleteDialogOpen(false);
  };

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-4">
        <FacturationFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          periodFilter={periodFilter}
          setPeriodFilter={setPeriodFilter}
        />
        
        {filteredFactures.length > 0 && (
          <Button 
            variant="destructive" 
            size="sm"
            onClick={() => setIsDeleteDialogOpen(true)}
            className="flex items-center gap-1"
          >
            <Trash2 size={16} />
            <span>Supprimer toutes ({filteredFactures.length})</span>
          </Button>
        )}
      </div>

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

      <DeleteAllFacturesDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleBulkDelete}
        count={filteredFactures.length}
      />
    </div>
  );
};
