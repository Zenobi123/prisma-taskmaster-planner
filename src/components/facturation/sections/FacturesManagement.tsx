
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { FacturationFilters } from "@/components/facturation/FacturationFilters";
import { FactureTable } from "@/components/facturation/FactureTable";
import { FactureDetailsDialog } from "@/components/facturation/FactureDetailsDialog";
import { NewFactureDialog } from "@/components/facturation/NewFactureDialog";
import { Facture } from "@/types/facture";
import { facturesMockData, filterFactures, formatMontant } from "@/data/factureData";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export const FacturesManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [periodFilter, setPeriodFilter] = useState("all");
  const [selectedFacture, setSelectedFacture] = useState<Facture | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [isNewFactureDialogOpen, setIsNewFactureDialogOpen] = useState(false);
  const { toast } = useToast();
  
  // Filtrer les factures selon les critères
  const filteredFactures = filterFactures(
    facturesMockData,
    searchTerm,
    statusFilter,
    periodFilter
  );

  const handleViewDetails = (facture: Facture) => {
    setSelectedFacture(facture);
    setShowDetails(true);
  };

  const handlePrintInvoice = (factureId: string) => {
    toast({
      title: "Impression lancée",
      description: `Impression de la facture ${factureId} en cours...`,
    });
    // Logique d'impression à implémenter
  };

  const handleDownloadInvoice = (factureId: string) => {
    toast({
      title: "Téléchargement en cours",
      description: `Téléchargement de la facture ${factureId}...`,
    });
    // Logique de téléchargement à implémenter
  };

  const handleCreateInvoice = (formData: any) => {
    console.log("Nouvelle facture:", formData);
    toast({
      title: "Facture créée",
      description: "La nouvelle facture a été créée avec succès.",
    });
    setIsNewFactureDialogOpen(false);
    // Logique de création de facture à implémenter
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Gestion des factures</h2>
        <Button 
          onClick={() => setIsNewFactureDialogOpen(true)}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Nouvelle facture
        </Button>
      </div>
      
      <FacturationFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        periodFilter={periodFilter}
        setPeriodFilter={setPeriodFilter}
      />

      <FactureTable
        factures={filteredFactures}
        formatMontant={formatMontant}
        onViewDetails={handleViewDetails}
        onPrintInvoice={handlePrintInvoice}
        onDownloadInvoice={handleDownloadInvoice}
      />

      <FactureDetailsDialog
        showDetails={showDetails}
        setShowDetails={setShowDetails}
        selectedFacture={selectedFacture}
        formatMontant={formatMontant}
        onPrintInvoice={handlePrintInvoice}
        onDownloadInvoice={handleDownloadInvoice}
      />

      <NewFactureDialog
        isOpen={isNewFactureDialogOpen}
        onOpenChange={setIsNewFactureDialogOpen}
        onCreateInvoice={handleCreateInvoice}
      />
    </div>
  );
};
