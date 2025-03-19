
import { useState, useCallback } from "react";
import { formatMontant } from "@/data/factureData";
import { FacturationHeader } from "@/components/facturation/FacturationHeader";
import { NewFactureDialog } from "@/components/facturation/NewFactureDialog";
import { useFacturationPermissions } from "@/hooks/useFacturationPermissions";
import { useFactures } from "@/hooks/useFactures";
import { useFacturationTabs } from "@/hooks/useFacturationTabs";
import { useFacturationFilters } from "@/hooks/useFacturationFilters";
import { useInvoiceActions } from "@/utils/invoiceActions";
import { Facture } from "@/types/facture";
import { FactureDetailsManager } from "@/components/facturation/FactureDetailsManager";
import { useToast } from "@/components/ui/use-toast";
import { FacturationTabs } from "@/components/facturation/FacturationTabs";

const Facturation = () => {
  const [isNewFactureDialogOpen, setIsNewFactureDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { toast } = useToast();
  
  // Hooks for data and functionality
  const { hasPermission, isLoading: permissionsLoading, collaborateur } = useFacturationPermissions();
  const { 
    factures, 
    isLoading, 
    handleUpdateStatus, 
    handleDeleteInvoice, 
    handleCreateInvoice, 
    handlePaiementPartiel, 
    fetchFactures,
    deleteAllInvoices
  } = useFactures();
  const { activeTab, setActiveTab } = useFacturationTabs();
  const { searchTerm, setSearchTerm, statusFilter, setStatusFilter, periodFilter, setPeriodFilter, filteredFactures } = useFacturationFilters(factures);
  const { handlePrintInvoice, handleDownloadInvoice } = useInvoiceActions();

  // Vérifie si l'utilisateur est administrateur
  const isAdmin = collaborateur?.permissions?.some(p => p.niveau === 'administration' && p.module === 'facturation') || false;

  // Function to refresh the data
  const handleRefresh = useCallback(() => {
    fetchFactures();
    toast({
      title: "Rechargement",
      description: "Liste des factures mise à jour."
    });
  }, [fetchFactures, toast]);

  // Define all functions BEFORE using them
  const handleEditInvoice = (facture: Facture) => {
    factureDetailsManager.setSelectedFacture(facture);
    setIsEditDialogOpen(true);
    factureDetailsManager.setShowDetails(false);
  };

  const handleDeleteInvoiceRequest = (factureId: string) => {
    console.log(`Requesting deletion of facture ${factureId}`);
    handleDeleteInvoice(factureId);
  };

  // Create handlers for various actions
  const handleViewDetails = (facture: Facture) => {
    factureDetailsManager.handleViewDetails(facture);
  };

  // Create facture details manager for viewing details and actions
  const factureDetailsManager = FactureDetailsManager({
    onPrintInvoice: handlePrintInvoice,
    onDownloadInvoice: handleDownloadInvoice,
    onUpdateStatus: handleUpdateStatus,
    onEditInvoice: handleEditInvoice,
    onDeleteInvoice: handleDeleteInvoiceRequest,
    formatMontant,
    isAdmin
  });

  // Loading state
  if (isLoading || permissionsLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Chargement des factures...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <FacturationHeader 
        onNewFactureClick={() => setIsNewFactureDialogOpen(true)}
      />

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
        onDeleteAllInvoices={deleteAllInvoices}
        onPaiementPartiel={handlePaiementPartiel}
        isAdmin={isAdmin}
      />

      {factureDetailsManager.detailsDialog}

      <NewFactureDialog 
        isOpen={isNewFactureDialogOpen}
        onOpenChange={setIsNewFactureDialogOpen}
        onCreateInvoice={handleCreateInvoice}
      />
    </div>
  );
};

export default Facturation;
