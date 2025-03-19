
import { useToast } from "@/components/ui/use-toast";
import { Facture } from "@/types/facture";
import { deleteFactureFromDB } from "@/services/facture/factureDelete";

export const useFactureDelete = (factures: Facture[], setFactures: React.Dispatch<React.SetStateAction<Facture[]>>) => {
  const { toast } = useToast();

  /**
   * Supprime une facture
   * @param factureId ID de la facture à supprimer
   * @returns true si la suppression a réussi, false sinon
   */
  const handleDeleteInvoice = async (factureId: string): Promise<boolean> => {
    // Vérification initiale
    if (!factureId) {
      console.error("Tentative de suppression d'une facture sans ID");
      toast({
        title: "Erreur",
        description: "Impossible de supprimer cette facture: identifiant manquant.",
        variant: "destructive"
      });
      return false;
    }

    // Vérification que la facture existe dans l'état local
    const factureExists = factures.find(f => f.id === factureId);
    if (!factureExists) {
      console.error(`La facture ${factureId} n'existe pas dans l'état local`);
      toast({
        title: "Facture introuvable",
        description: "La facture n'existe pas ou a déjà été supprimée.",
        variant: "destructive"
      });
      return false;
    }

    console.log(`Tentative de suppression de la facture: ${factureId}`);
    
    try {
      // Appel à l'API pour supprimer la facture
      await deleteFactureFromDB(factureId);
      
      // Si la suppression dans la DB est réussie, mettre à jour l'état local immédiatement
      setFactures(prevFactures => {
        console.log(`Mise à jour de l'état local après suppression de ${factureId}`);
        const updatedFactures = prevFactures.filter(f => f.id !== factureId);
        console.log(`Nombre de factures après suppression: ${updatedFactures.length}`);
        return updatedFactures;
      });
      
      console.log(`Facture ${factureId} supprimée avec succès`);
      
      toast({
        title: "Facture supprimée",
        description: `La facture ${factureId} a été supprimée avec succès.`
      });
      
      return true;
    } catch (error) {
      // Distinction des types d'erreurs pour une meilleure information utilisateur
      const errorMessage = error instanceof Error ? error.message : "Erreur inconnue";
      const isNotFoundError = errorMessage.includes("not found");
      
      console.error(`Erreur lors de la suppression de la facture ${factureId}:`, error);
      
      if (isNotFoundError) {
        toast({
          title: "Facture introuvable",
          description: "La facture n'existe pas dans la base de données.",
          variant: "destructive"
        });
        
        // Si la facture n'existe pas dans la DB mais est présente dans l'état local,
        // on la supprime de l'état local pour maintenir la cohérence
        setFactures(prevFactures => prevFactures.filter(f => f.id !== factureId));
        return false;
      }
      
      toast({
        title: "Échec de la suppression",
        description: "Une erreur est survenue lors de la suppression. Veuillez réessayer.",
        variant: "destructive"
      });
      
      return false;
    }
  };

  /**
   * Supprime toutes les factures
   * @returns true si la suppression a réussi, false sinon
   */
  const deleteAllInvoices = async (): Promise<boolean> => {
    if (factures.length === 0) {
      console.log("Aucune facture à supprimer");
      toast({
        title: "Information",
        description: "Aucune facture à supprimer."
      });
      return true;
    }
    
    console.log(`Tentative de suppression massive de ${factures.length} factures`);
    
    // Confirmer avec l'utilisateur avant de procéder
    const confirmDelete = window.confirm(`Êtes-vous sûr de vouloir supprimer toutes les factures (${factures.length})? Cette action est irréversible.`);
    if (!confirmDelete) {
      console.log("Suppression massive annulée par l'utilisateur");
      return false;
    }
    
    try {
      // Supprimer toutes les factures une par une
      const results = await Promise.allSettled(
        factures.map(facture => deleteFactureFromDB(facture.id))
      );
      
      // Compter les succès et les échecs
      const successes = results.filter(r => r.status === 'fulfilled').length;
      const failures = results.filter(r => r.status === 'rejected').length;
      
      console.log(`Suppression massive: ${successes} succès, ${failures} échecs`);
      
      // Mettre à jour l'état local en supprimant uniquement les factures qui ont été supprimées avec succès
      if (failures > 0) {
        // Identification des IDs des factures qui n'ont pas pu être supprimées
        const failedIds = results
          .map((result, index) => result.status === 'rejected' ? factures[index].id : null)
          .filter(id => id !== null);
        
        setFactures(prevFactures => prevFactures.filter(f => failedIds.includes(f.id)));
        
        toast({
          title: "Suppression partielle",
          description: `${successes} factures supprimées, ${failures} échecs.`,
          variant: "destructive"
        });
        
        return false;
      } else {
        // Toutes les factures ont été supprimées avec succès
        setFactures([]);
        
        toast({
          title: "Factures supprimées",
          description: `${successes} factures ont été supprimées avec succès.`
        });
        
        return true;
      }
    } catch (error) {
      console.error("Exception lors de la suppression massive:", error);
      
      toast({
        title: "Erreur critique",
        description: "Une erreur critique est survenue pendant la suppression massive.",
        variant: "destructive"
      });
      
      return false;
    }
  };

  return { handleDeleteInvoice, deleteAllInvoices };
};
