
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useFactures } from "@/hooks/useFactures";
import { Facture } from "@/types/facture";
import { FacturesTable } from "@/components/facturation/FacturesTable";
import { FacturationHeader } from "@/components/facturation/FacturationHeader";
import { FacturationFilters } from "@/components/facturation/FacturationFilters";
import { NewFactureDialog } from "@/components/facturation/NewFactureDialog";
import { PaiementDialog } from "@/components/facturation/PaiementDialog";

// Ce composant gère l'affichage et la manipulation des factures
// - Créer de nouvelles factures
// - Afficher la liste des factures avec filtres et recherche
// - Enregistrer des paiements
// - Supprimer des factures
export const FacturesManagement = () => {
  const { toast } = useToast();
  
  // États pour la gestion des dialogs
  const [isNewFactureOpen, setIsNewFactureOpen] = useState(false);
  const [isPaiementOpen, setIsPaiementOpen] = useState(false);
  const [selectedFacture, setSelectedFacture] = useState<Facture | null>(null);

  // État et fonctions pour les filtres et la recherche
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    status: "",
    clientId: "",
    dateDebut: "",
    dateFin: ""
  });

  // Hook personnalisé pour récupérer les factures avec filtres
  const { 
    factures, 
    totalCount, 
    isLoading, 
    refetch,
    handleDeleteInvoice,
    handlePaiementPartiel
  } = useFactures({
    page: currentPage,
    pageSize: 10,
    status: filters.status || undefined,
    clientId: filters.clientId || undefined,
    dateDebut: filters.dateDebut || undefined,
    dateFin: filters.dateFin || undefined,
    q: searchTerm || undefined
  });

  // Gestionnaire pour ouvrir le dialog de paiement
  const handlePaiementClick = (facture: Facture) => {
    setSelectedFacture(facture);
    setIsPaiementOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* En-tête avec recherche et boutons d'action */}
      <FacturationHeader
        onNewFactureClick={() => setIsNewFactureOpen(true)}
        onRefreshClick={() => refetch()}
        onSearchChange={setSearchTerm}
      />
      
      {/* Filtres pour les factures */}
      <FacturationFilters
        filters={filters}
        onFilterChange={(newFilters) => {
          setFilters(newFilters);
          setCurrentPage(1); // Retour à la première page lors du filtrage
        }}
      />
      
      {/* Tableau des factures */}
      {isLoading ? (
        <div className="flex justify-center my-12">
          <p className="text-muted-foreground">Chargement des factures...</p>
        </div>
      ) : (
        <FacturesTable
          factures={factures || []}
          totalCount={totalCount || 0}
          currentPage={currentPage}
          pageSize={10}
          onPageChange={setCurrentPage}
          onDeleteInvoice={handleDeleteInvoice}
          onPaiementClick={handlePaiementClick}
        />
      )}
      
      {/* Dialog de création de nouvelle facture */}
      <NewFactureDialog
        isOpen={isNewFactureOpen}
        onOpenChange={setIsNewFactureOpen}
        onCreated={() => {
          refetch();
          setIsNewFactureOpen(false);
        }}
      />
      
      {/* Dialog d'enregistrement de paiement */}
      <PaiementDialog
        facture={selectedFacture}
        isOpen={isPaiementOpen}
        onOpenChange={setIsPaiementOpen}
        onPaiement={handlePaiementPartiel}
      />
    </div>
  );
};
