
import { useState, useCallback } from "react";
import { FacturationHeader } from "@/components/facturation/FacturationHeader";
import { FacturationFilters } from "@/components/facturation/FacturationFilters";
import { FacturesTable } from "@/components/facturation/FacturesTable";
import { NewFactureDialog } from "@/components/facturation/NewFactureDialog";
import { useFactures } from "@/hooks/useFactures";
import { Facture } from "@/types/facture";

export const FacturesManagement = () => {
  // États locaux
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [isNewFactureDialogOpen, setIsNewFactureDialogOpen] = useState(false);

  // Hook pour les factures
  const { 
    factures, 
    totalCount,
    isLoading, 
    updateParams,
    handleCreateInvoice,
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

  return (
    <div>
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
          onPaiementClick={() => {}} // Cette fonctionnalité se trouve maintenant dans l'onglet Paiements
        />
      )}

      <NewFactureDialog
        isOpen={isNewFactureDialogOpen}
        onOpenChange={setIsNewFactureDialogOpen}
        onCreateInvoice={handleCreateInvoice}
      />
    </div>
  );
};
