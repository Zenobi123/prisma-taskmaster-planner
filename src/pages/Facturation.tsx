
import { useState, useCallback } from "react";
import { formatMontant } from "@/data/factureData";
import { FacturationHeader } from "@/components/facturation/FacturationHeader";
import { NewFactureDialog } from "@/components/facturation/NewFactureDialog";
import { useFacturationPermissions } from "@/hooks/useFacturationPermissions";
import { useFactures } from "@/hooks/useFactures";
import { useToast } from "@/components/ui/use-toast";
import { FacturationTabs } from "@/components/facturation/FacturationTabs";
import { useInvoiceActions } from "@/utils/invoiceActions";

const Facturation = () => {
  const [isNewFactureDialogOpen, setIsNewFactureDialogOpen] = useState(false);
  const { toast } = useToast();
  
  // Hooks pour les données et fonctionnalités
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

  // Vérifie si l'utilisateur est administrateur
  const isAdmin = collaborateur?.permissions?.some(p => p.niveau === 'administration' && p.module === 'facturation') || false;

  // Fonction pour rafraîchir les données
  const handleRefresh = useCallback(() => {
    fetchFactures();
    toast({
      title: "Rechargement",
      description: "Liste des factures mise à jour."
    });
  }, [fetchFactures, toast]);

  // État de chargement
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
        searchTerm=""
        setSearchTerm={() => {}}
      />

      <FacturationTabs 
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
