
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
import { FactureDetailsManager } from "@/components/facturation/FactureDetailsManager";

const Facturation = () => {
  const [isNewFactureDialogOpen, setIsNewFactureDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [factureToDelete, setFactureToDelete] = useState<string | null>(null);
  
  const { hasPermission, isLoading: permissionsLoading, collaborateur } = useFacturationPermissions();
  const { factures, isLoading, handleUpdateStatus, handleDeleteInvoice, handleCreateInvoice, handlePaiementPartiel } = useFactures();
  const { activeTab, setActiveTab } = useFacturationTabs();
  const { searchTerm, setSearchTerm, statusFilter, setStatusFilter, periodFilter, setPeriodFilter, filteredFactures } = useFacturationFilters(factures);
  const { handlePrintInvoice, handleDownloadInvoice } = useInvoiceActions();

  // Vérifie si l'utilisateur est administrateur
  const isAdmin = collaborateur?.permissions?.some(p => p.niveau === 'administration' && p.module === 'facturation') || false;

  // Define all functions BEFORE using them
  const handleEditInvoice = (facture: Facture) => {
    factureDetailsManager.setSelectedFacture(facture);
    setIsEditDialogOpen(true);
    factureDetailsManager.setShowDetails(false);
  };

  const handleDeleteInvoiceRequest = (factureId: string) => {
    setFactureToDelete(factureId);
    setIsDeleteConfirmOpen(true);
  };

  const factureDetailsManager = FactureDetailsManager({
    formatMontant,
    onPrintInvoice: handlePrintInvoice,
    onDownloadInvoice: handleDownloadInvoice,
    onUpdateStatus: handleUpdateStatus,
    onEditInvoice: handleEditInvoice,
    onDeleteInvoice: handleDeleteInvoiceRequest,
    isAdmin: isAdmin, // S'assurer que le statut d'admin est passé ici
  });

  if (permissionsLoading || isLoading) {
    return (
      <div className="container mx-auto p-6 flex justify-center items-center h-[50vh]">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  const confirmDeleteInvoice = async () => {
    if (!factureToDelete) return;
    
    // Passer explicitement le statut d'admin lors de la suppression
    const success = await handleDeleteInvoice(factureToDelete, isAdmin);
    
    if (success) {
      setIsDeleteConfirmOpen(false);
      factureDetailsManager.setShowDetails(false);
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
        onViewDetails={factureDetailsManager.handleViewDetails}
        onPrintInvoice={handlePrintInvoice}
        onDownloadInvoice={handleDownloadInvoice}
        onUpdateStatus={handleUpdateStatus}
        onEditInvoice={handleEditInvoice}
        onDeleteInvoice={handleDeleteInvoiceRequest}
        onPaiementPartiel={handlePaiementPartiel}
        isAdmin={isAdmin} // S'assurer que le statut d'admin est passé ici
      />

      {factureDetailsManager.detailsDialog}

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
