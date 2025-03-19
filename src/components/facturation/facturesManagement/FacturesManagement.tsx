
import { useState } from "react";
import { FacturesTable } from "./FacturesTable";
import { FacturesPagination } from "./FacturesPagination";
import { useFactures } from "@/hooks/useFactures";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, 
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter, 
  AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { FactureFilterProvider } from "./FactureFilterContext";
import { FactureDetailsDialog } from "@/components/facturation/FactureDetailsDialog";
import { NewFactureDialog } from "@/components/facturation/NewFactureDialog";
import { Facture } from "@/types/facture";
import { formatMontant } from "@/data/factureData";
import { generatePDF } from "@/utils/pdfUtils";
import { FacturationFilters } from "@/components/facturation/FacturationFilters";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export const FacturesManagement = () => {
  const [showDetails, setShowDetails] = useState(false);
  const [isNewFactureDialogOpen, setIsNewFactureDialogOpen] = useState(false);
  const [factureToDelete, setFactureToDelete] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [periodFilter, setPeriodFilter] = useState("all");
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

  const handleCreateInvoice = async (formData: any): Promise<boolean> => {
    try {
      const success = await createFacture(formData);
      if (success) {
        // Notification de succès gérée dans useFactureOperations
        return true;
      }
      return false;
    } catch (error) {
      console.error("Erreur lors de la création de la facture:", error);
      toast({
        title: "Erreur",
        description: "Impossible de créer la facture",
        variant: "destructive"
      });
      return false;
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

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
    setTimeout(() => {
      updateFilters({
        status: statusFilter !== "all" ? statusFilter : undefined,
        searchTerm: term || undefined,
        page: 1
      });
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
    <FactureFilterProvider value={{
      searchTerm,
      setSearchTerm: handleSearchChange,
      statusFilter,
      setStatusFilter: handleStatusFilterChange,
      periodFilter,
      setPeriodFilter,
    }}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <FacturationFilters
            searchTerm={searchTerm}
            setSearchTerm={handleSearchChange}
            statusFilter={statusFilter}
            setStatusFilter={handleStatusFilterChange}
            periodFilter={periodFilter}
            setPeriodFilter={setPeriodFilter}
          />
          <Button 
            onClick={() => setIsNewFactureDialogOpen(true)}
            data-new-facture-trigger
            className="flex items-center gap-1"
          >
            <Plus className="h-4 w-4" />
            Nouvelle facture
          </Button>
        </div>

        <FacturesTable
          factures={factures}
          formatMontant={formatMontant}
          onViewDetails={handleViewDetails}
          onPrintInvoice={handlePrintInvoice}
          onDownloadInvoice={handleDownloadInvoice}
          onDeleteFacture={setFactureToDelete}
          isLoading={isLoading}
        />

        {totalCount > (filters.limit || 10) && (
          <FacturesPagination 
            totalCount={totalCount} 
            filters={filters} 
            onPageChange={(page) => updateFilters({ page })} 
          />
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
    </FactureFilterProvider>
  );
};
