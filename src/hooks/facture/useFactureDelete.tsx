
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

    try {
      // Tentative de suppression en base de données
      console.log(`Suppression de la facture ${factureId} en cours...`);
      await deleteFactureFromDB(factureId);
      
      // Mise à jour de l'état local
      setFactures(factures.filter(f => f.id !== factureId));
      
      // Notification de succès
      toast({
        title: "Facture supprimée",
        description: `La facture ${factureId} a été supprimée avec succès.`
      });
      
      return true;
    } catch (error) {
      // Gestion d'erreur
      console.error("Erreur lors de la suppression de la facture:", error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer cette facture. Veuillez réessayer.",
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
    try {
      // Suppression de toutes les factures une par une
      for (const facture of factures) {
        await deleteFactureFromDB(facture.id);
      }
      
      // Mise à jour de l'état local
      setFactures([]);
      
      // Notification de succès
      toast({
        title: "Toutes les factures supprimées",
        description: "Toutes les factures ont été supprimées avec succès."
      });
      
      return true;
    } catch (error) {
      // Gestion d'erreur
      console.error("Erreur lors de la suppression massive des factures:", error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer toutes les factures. Veuillez réessayer.",
        variant: "destructive"
      });
      return false;
    }
  };

  return { handleDeleteInvoice, deleteAllInvoices };
};
