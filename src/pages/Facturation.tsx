
import { useState, useCallback } from "react";
import { formatMontant } from "@/data/factureData";
import { FacturationHeader } from "@/components/facturation/FacturationHeader";
import { NewFactureDialog } from "@/components/facturation/NewFactureDialog";
import { useFacturationPermissions } from "@/hooks/useFacturationPermissions";
import { useFactures } from "@/hooks/useFactures";
import { useFacturationTabs } from "@/hooks/useFacturationTabs";
import { useInvoiceActions } from "@/utils/invoiceActions";
import { Facture } from "@/types/facture";
import { useToast } from "@/components/ui/use-toast";
import { FacturationTabs } from "@/components/facturation/FacturationTabs";

const Facturation = () => {
  const [isNewFactureDialogOpen, setIsNewFactureDialogOpen] = useState(false);
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
    fetchFactures
  } = useFactures();
  const { activeTab, setActiveTab } = useFacturationTabs();
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
        formatMontant={formatMontant}
        onUpdateStatus={handleUpdateStatus}
        onDeleteInvoice={handleDeleteInvoice}
        onPaiementPartiel={handlePaiementPartiel}
        isAdmin={isAdmin}
      />

      <NewFactureDialog 
        isOpen={isNewFactureDialogOpen}
        onOpenChange={setIsNewFactureDialogOpen}
        onCreateInvoice={handleCreateInvoice}
      />
    </div>
  );
};

export default Facturation;
