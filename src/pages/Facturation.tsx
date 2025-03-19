
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
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const Facturation = () => {
  const [isNewFactureDialogOpen, setIsNewFactureDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [factureToDelete, setFactureToDelete] = useState<string | null>(null);
  const [isBulkDelete, setIsBulkDelete] = useState(false);
  const { toast } = useToast();
  
  const { hasPermission, isLoading: permissionsLoading, collaborateur } = useFacturationPermissions();
  const { factures, isLoading, handleUpdateStatus, handleDeleteInvoice, handleCreateInvoice, handlePaiementPartiel, deleteNonUserCreatedInvoices } = useFactures();
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
    setIsBulkDelete(false);
    setIsDeleteConfirmOpen(true);
  };
  
  const handleBulkDeleteRequest = () => {
    if (!isAdmin) {
      toast({
        title: "Accès refusé",
        description: "Seul l'administrateur peut supprimer en masse les factures.",
        variant: "destructive"
      });
      return;
    }
    
    setIsBulkDelete(true);
    setIsDeleteConfirmOpen(true);
  };

  const factureDetailsManager = FactureDetailsManager({
    formatMontant,
    onPrintInvoice: handlePrintInvoice,
    onDownloadInvoice: handleDownloadInvoice,
    onUpdateStatus: handleUpdateStatus,
    onEditInvoice: handleEditInvoice,
    onDeleteInvoice: handleDeleteInvoiceRequest,
    isAdmin: isAdmin,
  });

  if (permissionsLoading || isLoading) {
    return (
      <div className="container mx-auto p-6 flex justify-center items-center h-[50vh]">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  const confirmDeleteInvoice = async () => {
    if (isBulkDelete) {
      await deleteNonUserCreatedInvoices();
      setIsDeleteConfirmOpen(false);
    } else if (factureToDelete) {
      const success = await handleDeleteInvoice(factureToDelete, isAdmin);
      
      if (success) {
        setIsDeleteConfirmOpen(false);
        factureDetailsManager.setShowDetails(false);
      }
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-6 animate-fade-in">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
        <FacturationHeader onNewFactureClick={() => setIsNewFactureDialogOpen(true)} />
        
        {isAdmin && (
          <Button 
            variant="destructive" 
            size="sm" 
            className="mt-4 md:mt-0 flex items-center gap-2"
            onClick={handleBulkDeleteRequest}
          >
            <Trash2 className="h-4 w-4" />
            Supprimer toutes les factures
          </Button>
        )}
      </div>
      
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
        isAdmin={isAdmin}
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
        title={isBulkDelete ? "Supprimer toutes les factures" : "Confirmer la suppression"}
        description={isBulkDelete 
          ? "Êtes-vous sûr de vouloir supprimer toutes les factures ? Cette action est irréversible." 
          : "Êtes-vous sûr de vouloir supprimer cette facture ? Cette action est irréversible."}
      />
    </div>
  );
};

export default Facturation;
