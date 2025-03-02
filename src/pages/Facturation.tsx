
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { FacturationHeader } from "@/components/facturation/FacturationHeader";
import { FacturationFilters } from "@/components/facturation/FacturationFilters";
import { FactureTable } from "@/components/facturation/FactureTable";
import { FactureDetailsDialog } from "@/components/facturation/FactureDetailsDialog";
import { NewFactureDialog } from "@/components/facturation/NewFactureDialog";
import { useFacturationPermissions } from "@/hooks/useFacturationPermissions";
import { Facture } from "@/types/facture";
import { facturesMockData, filterFactures, formatMontant } from "@/data/factureData";

const Facturation = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [periodFilter, setPeriodFilter] = useState("all");
  const [selectedFacture, setSelectedFacture] = useState<Facture | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [isNewFactureDialogOpen, setIsNewFactureDialogOpen] = useState(false);
  const { toast } = useToast();
  
  // Vérification des permissions
  const { hasPermission } = useFacturationPermissions();

  // Si pas de permissions, ne pas afficher la page
  if (!hasPermission) {
    return null;
  }

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
    <div className="container mx-auto p-6">
      <FacturationHeader onNewFactureClick={() => setIsNewFactureDialogOpen(true)} />
      
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

export default Facturation;
