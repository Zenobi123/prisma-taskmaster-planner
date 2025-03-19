
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { FacturationFilters } from "@/components/facturation/FacturationFilters";
import { FactureTable } from "@/components/facturation/FactureTable";
import { FactureDetailsDialog } from "@/components/facturation/FactureDetailsDialog";
import { NewFactureDialog } from "@/components/facturation/NewFactureDialog";
import { Facture } from "@/types/facture";
import { facturesMockData, formatMontant } from "@/data/factureData";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, 
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter, 
  AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useFactures } from "@/hooks/useFactures";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, 
  PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { generatePDF } from "@/utils/pdfUtils";

export const FacturesManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [periodFilter, setPeriodFilter] = useState("all");
  const [showDetails, setShowDetails] = useState(false);
  const [isNewFactureDialogOpen, setIsNewFactureDialogOpen] = useState(false);
  const [factureToDelete, setFactureToDelete] = useState<string | null>(null);
  const { toast } = useToast();
  
  const {
    factures,
    selectedFacture,
    isLoading,
    totalCount,
    filters,
    fetchFactures,
    createFacture,
    updateFacture,
    deleteFacture,
    fetchFactureById,
    setSelectedFacture,
    updateFilters
  } = useFactures({
    status: statusFilter !== "all" ? statusFilter : undefined,
    searchTerm,
    page: 1,
    limit: 10
  });

  // Calculer le nombre total de pages
  const totalPages = Math.ceil(totalCount / (filters.limit || 10));

  const handleViewDetails = async (facture: Facture) => {
    await fetchFactureById(facture.id);
    setShowDetails(true);
  };

  const handlePrintInvoice = (factureId: string) => {
    const facture = factures.find(f => f.id === factureId);
    if (facture) {
      generatePDF(facture);
      toast({
        title: "Impression lancée",
        description: `Impression de la facture ${factureId} en cours...`,
      });
    }
  };

  const handleDownloadInvoice = (factureId: string) => {
    const facture = factures.find(f => f.id === factureId);
    if (facture) {
      const pdfBlob = generatePDF(facture, true);
      toast({
        title: "Téléchargement en cours",
        description: `Téléchargement de la facture ${factureId}...`,
      });
    }
  };

  const handleCreateInvoice = async (formData: any) => {
    const success = await createFacture(formData);
    if (success) {
      setIsNewFactureDialogOpen(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (factureToDelete) {
      const success = await deleteFacture(factureToDelete);
      if (success) {
        setFactureToDelete(null);
      }
    }
  };

  const handleUpdateFacture = async (id: string, updates: Partial<Facture>) => {
    return await updateFacture(id, updates);
  };

  const handlePageChange = (page: number) => {
    updateFilters({ page });
  };

  const applyFilters = () => {
    updateFilters({
      status: statusFilter !== "all" ? statusFilter : undefined,
      searchTerm: searchTerm || undefined,
      page: 1 // Retour à la première page lors de l'application des filtres
    });
  };

  // Effet de latence pour éviter trop de requêtes pendant la saisie
  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
    // Applique les filtres après un délai
    setTimeout(() => {
      applyFilters();
    }, 300);
  };

  const handleStatusFilterChange = (status: string) => {
    setStatusFilter(status);
    updateFilters({
      status: status !== "all" ? status : undefined,
      page: 1
    });
  };

  return (
    <div className="space-y-6">
      <FacturationFilters
        searchTerm={searchTerm}
        setSearchTerm={handleSearchChange}
        statusFilter={statusFilter}
        setStatusFilter={handleStatusFilterChange}
        periodFilter={periodFilter}
        setPeriodFilter={setPeriodFilter}
      />

      <FactureTable
        factures={factures}
        formatMontant={formatMontant}
        onViewDetails={handleViewDetails}
        onPrintInvoice={handlePrintInvoice}
        onDownloadInvoice={handleDownloadInvoice}
        onDeleteFacture={setFactureToDelete}
        isLoading={isLoading}
      />

      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => filters.page && filters.page > 1 && handlePageChange(filters.page - 1)}
                className={filters.page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
            
            {Array.from({ length: totalPages }).map((_, i) => (
              <PaginationItem key={i}>
                <PaginationLink 
                  isActive={filters.page === i + 1}
                  onClick={() => handlePageChange(i + 1)}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            
            <PaginationItem>
              <PaginationNext 
                onClick={() => filters.page && filters.page < totalPages && handlePageChange(filters.page + 1)}
                className={filters.page === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      <FactureDetailsDialog
        showDetails={showDetails}
        setShowDetails={setShowDetails}
        selectedFacture={selectedFacture}
        formatMontant={formatMontant}
        onPrintInvoice={handlePrintInvoice}
        onDownloadInvoice={handleDownloadInvoice}
        onUpdateFacture={handleUpdateFacture}
      />

      <NewFactureDialog
        isOpen={isNewFactureDialogOpen}
        onOpenChange={setIsNewFactureDialogOpen}
        onCreateInvoice={handleCreateInvoice}
      />

      <AlertDialog open={factureToDelete !== null} onOpenChange={(open) => !open && setFactureToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr de vouloir supprimer cette facture ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. La facture sera définitivement supprimée du système.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-destructive text-destructive-foreground">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
