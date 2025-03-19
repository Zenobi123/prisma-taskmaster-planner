
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useFactures } from "@/hooks/useFactures";
import { Facture } from "@/types/facture";
import { FacturesTable } from "@/components/facturation/FacturesTable";
import { FacturationHeader } from "@/components/facturation/FacturationHeader";
import { FacturationFilters } from "@/components/facturation/FacturationFilters";
import { NewFactureDialog } from "@/components/facturation/NewFactureDialog";
import { PaiementDialog } from "@/components/facturation/PaiementDialog";
import { deleteFacture } from "@/services/facture/factureDelete";
import { enregistrerPaiement } from "@/services/facture/factureUpdate";

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
  const { data, isLoading, refetch } = useFactures({
    page: currentPage,
    pageSize: 10,
    status: filters.status || undefined,
    clientId: filters.clientId || undefined,
    dateDebut: filters.dateDebut || undefined,
    dateFin: filters.dateFin || undefined,
    q: searchTerm || undefined
  });

  // Gestionnaire pour supprimer une facture
  const handleDeleteFacture = async (id: string) => {
    try {
      await deleteFacture(id);
      toast({
        title: "Facture supprimée",
        description: "La facture a été supprimée avec succès.",
      });
      refetch();
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer cette facture.",
      });
    }
  };

  // Gestionnaire pour ouvrir le dialog de paiement
  const handlePaiementClick = (facture: Facture) => {
    setSelectedFacture(facture);
    setIsPaiementOpen(true);
  };

  // Gestionnaire pour enregistrer un paiement
  const handlePaiementSubmit = async (factureId: string, paiement: any) => {
    try {
      const updatedFacture = await enregistrerPaiement(factureId, paiement);
      toast({
        title: "Paiement enregistré",
        description: `Paiement de ${paiement.montant.toLocaleString()} FCFA enregistré avec succès.`,
      });
      refetch();
      return updatedFacture;
    } catch (error) {
      console.error("Erreur lors de l'enregistrement du paiement:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'enregistrer ce paiement.",
      });
      throw error;
    }
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
          factures={data?.data || []}
          totalCount={data?.count || 0}
          currentPage={currentPage}
          pageSize={10}
          onPageChange={setCurrentPage}
          onDeleteInvoice={handleDeleteFacture}
          onPaiementClick={handlePaiementClick}
        />
      )}
      
      {/* Dialog de création de nouvelle facture */}
      <NewFactureDialog
        isOpen={isNewFactureOpen}
        onOpenChange={setIsNewFactureOpen}
        onSuccess={() => {
          refetch();
          setIsNewFactureOpen(false);
        }}
      />
      
      {/* Dialog d'enregistrement de paiement */}
      <PaiementDialog
        facture={selectedFacture}
        isOpen={isPaiementOpen}
        onOpenChange={setIsPaiementOpen}
        onPaiement={handlePaiementSubmit}
      />
    </div>
  );
};
