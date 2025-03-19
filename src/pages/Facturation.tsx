
import { useState } from "react";
import { formatMontant } from "@/data/factureData";
import { FacturationHeader } from "@/components/facturation/FacturationHeader";
import { NewFactureDialog } from "@/components/facturation/NewFactureDialog";
import { DeleteFactureDialog } from "@/components/facturation/DeleteFactureDialog";
import { FacturationTabs } from "@/components/facturation/FacturationTabs";
import { useFacturationPermissions } from "@/hooks/useFacturationPermissions";
import { useFactures } from "@/hooks/useFactures";
import { useFacturationTabs } from "@/hooks/useFacturationTabs";
import { useFacturationFilters } from "@/hooks/useFacturationFilters";
import { useInvoiceActions } from "@/utils/invoiceActions";
import { Facture } from "@/types/facture";

const Facturation = () => {
  const [isNewFactureDialogOpen, setIsNewFactureDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [factureToDelete, setFactureToDelete] = useState<string | null>(null);
  const [selectedFacture, setSelectedFacture] = useState<Facture | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  
  const { hasPermission, isLoading: permissionsLoading } = useFacturationPermissions();
  const { factures, isLoading, handleUpdateStatus, handleDeleteInvoice, handleCreateInvoice } = useFactures();
  const { activeTab, setActiveTab } = useFacturationTabs();
  const { searchTerm, setSearchTerm, statusFilter, setStatusFilter, periodFilter, setPeriodFilter, filteredFactures } = useFacturationFilters(factures);
  const { handlePrintInvoice, handleDownloadInvoice } = useInvoiceActions();

  if (permissionsLoading || isLoading) {
    return (
      <div className="container mx-auto p-6 flex justify-center items-center h-[50vh]">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  const handleViewDetails = (facture: Facture) => {
    setSelectedFacture(facture);
    setShowDetails(true);
  };

  const handleEditInvoice = (facture: Facture) => {
    setSelectedFacture(facture);
    setIsEditDialogOpen(true);
    setShowDetails(false);
  };

  const handleDeleteInvoiceRequest = (factureId: string) => {
    // Find the facture to check its status
    const factureToDelete = factures.find(f => f.id === factureId);
    
    if (factureToDelete && factureToDelete.status !== 'en_attente') {
      return;
    }
    
    setFactureToDelete(factureId);
    setIsDeleteConfirmOpen(true);
  };

  const confirmDeleteInvoice = async () => {
    if (!factureToDelete) return;
    
    const success = await handleDeleteInvoice(factureToDelete);
    
    if (success) {
      setIsDeleteConfirmOpen(false);
      setShowDetails(false);
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-6 animate-fade-in">
      <FacturationHeader onNewFactureClick={() => setIsNewFactureDialogOpen(true)} />
      
      <FacturationTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        factures={factures}
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
        onUpdateStatus={handleUpdateStatus}
        onEditInvoice={handleEditInvoice}
        onDeleteInvoice={handleDeleteInvoiceRequest}
      />

      <FactureDetailsDialog
        showDetails={showDetails}
        setShowDetails={setShowDetails}
        selectedFacture={selectedFacture}
        formatMontant={formatMontant}
        onPrintInvoice={handlePrintInvoice}
        onDownloadInvoice={handleDownloadInvoice}
        onUpdateStatus={handleUpdateStatus}
        onEditInvoice={handleEditInvoice}
        onDeleteInvoice={handleDeleteInvoiceRequest}
      />

      <NewFactureDialog
        isOpen={isNewFactureDialogOpen}
        onOpenChange={setIsNewFactureDialogOpen}
        onCreateInvoice={handleCreateInvoice}
      />

      <DeleteFactureDialog
        isOpen={isDeleteConfirmOpen}
        onOpenChange={setIsDeleteConfirmOpen}
        onConfirm={confirmDeleteInvoice}
      />
    </div>
  );
};

export default Facturation;
