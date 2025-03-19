
import { useState, useCallback } from "react";
import { FacturationHeader } from "@/components/facturation/FacturationHeader";
import { FacturationFilters } from "@/components/facturation/FacturationFilters";
import { FacturesTable } from "@/components/facturation/FacturesTable";
import { NewFactureDialog } from "@/components/facturation/NewFactureDialog";
import { PaiementDialog } from "@/components/facturation/PaiementDialog";
import { useFactures } from "@/hooks/useFactures";
import { useFacturationPermissions } from "@/hooks/useFacturationPermissions";
import { Facture } from "@/types/facture";

const Facturation = () => {
  // États
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [isNewFactureDialogOpen, setIsNewFactureDialogOpen] = useState(false);
  const [selectedFacture, setSelectedFacture] = useState<Facture | null>(null);
  const [isPaiementDialogOpen, setIsPaiementDialogOpen] = useState(false);

  // Hooks pour les permissions et les factures
  const { hasPermission, isLoading: permissionsLoading } = useFacturationPermissions();
  const { 
    factures, 
    totalCount,
    isLoading, 
    updateParams,
    handleCreateInvoice,
    handleUpdateStatus,
    handlePaiementPartiel,
    handleDeleteInvoice,
    fetchFactures
  } = useFactures({ page: currentPage, pageSize });

  // Gestionnaires d'événements
  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
    // Implémenter la recherche ici
  }, []);

  const handleStatusChange = useCallback((status: string | undefined) => {
    updateParams({ status });
    setCurrentPage(1);
  }, [updateParams]);

  const handleClientChange = useCallback((clientId: string | undefined) => {
    updateParams({ clientId });
    setCurrentPage(1);
  }, [updateParams]);

  const handleDateChange = useCallback((dateDebut: string | undefined, dateFin: string | undefined) => {
    updateParams({ dateDebut, dateFin });
    setCurrentPage(1);
  }, [updateParams]);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    updateParams({ page });
  }, [updateParams]);

  const handleRefresh = useCallback(() => {
    fetchFactures();
  }, [fetchFactures]);

  const handlePaiementClick = useCallback((facture: Facture) => {
    setSelectedFacture(facture);
    setIsPaiementDialogOpen(true);
  }, []);

  // État de chargement
  if (permissionsLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <FacturationHeader
        onNewFactureClick={() => setIsNewFactureDialogOpen(true)}
        onRefreshClick={handleRefresh}
        onSearchChange={handleSearchChange}
      />

      <FacturationFilters
        onStatusChange={handleStatusChange}
        onClientChange={handleClientChange}
        onDateChange={handleDateChange}
      />

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Chargement des factures...</p>
        </div>
      ) : (
        <FacturesTable
          factures={factures}
          totalCount={totalCount}
          currentPage={currentPage}
          pageSize={pageSize}
          onPageChange={handlePageChange}
          onDeleteInvoice={handleDeleteInvoice}
          onPaiementClick={handlePaiementClick}
        />
      )}

      <NewFactureDialog
        isOpen={isNewFactureDialogOpen}
        onOpenChange={setIsNewFactureDialogOpen}
        onCreateInvoice={handleCreateInvoice}
      />

      <PaiementDialog
        facture={selectedFacture}
        isOpen={isPaiementDialogOpen}
        onOpenChange={setIsPaiementDialogOpen}
        onPaiement={handlePaiementPartiel}
      />
    </div>
  );
};

export default Facturation;
