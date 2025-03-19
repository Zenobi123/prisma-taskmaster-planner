
import { useToast } from "@/components/ui/use-toast";
import { Facture } from "@/types/facture";
import { deleteFactureFromDB } from "@/services/factureService";

export const useFactureDelete = (factures: Facture[], setFactures: React.Dispatch<React.SetStateAction<Facture[]>>) => {
  const { toast } = useToast();

  /**
   * Supprime une facture
   * @param factureId ID de la facture à supprimer
   * @returns true si la suppression a réussi, false sinon
   */
  const handleDeleteInvoice = async (factureId: string): Promise<boolean> => {
    try {
      // Vérification que la facture existe dans l'état local
      const factureExists = factures.find(f => f.id === factureId);
      if (!factureExists) {
        console.error(`La facture ${factureId} n'existe pas dans l'état local`);
        toast({
          title: "Erreur",
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
        // Utiliser une fonction de mise à jour pour garantir qu'on travaille avec l'état le plus récent
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
      } catch (apiError) {
        console.error(`Erreur lors de la suppression de la facture ${factureId}:`, apiError);
        toast({
          title: "Erreur de suppression",
          description: "Une erreur est survenue lors de la suppression. Veuillez réessayer.",
          variant: "destructive"
        });
        return false;
      }
    } catch (error) {
      console.error(`Exception lors de la suppression de la facture ${factureId}:`, error);
      toast({
        title: "Erreur critique",
        description: "Une erreur critique est survenue pendant la suppression.",
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
      console.log("Tentative de suppression massive des factures");
      
      // Confirmer avec l'utilisateur avant de procéder
      const confirmDelete = window.confirm("Êtes-vous sûr de vouloir supprimer toutes les factures ? Cette action est irréversible.");
      if (!confirmDelete) {
        console.log("Suppression massive annulée par l'utilisateur");
        return false;
      }
      
      try {
        // Supprimer toutes les factures une par une pour plus de fiabilité
        const deletePromises = factures.map(facture => deleteFactureFromDB(facture.id));
        await Promise.all(deletePromises);
        
        // Si la suppression dans la DB est réussie, mettre à jour l'état local
        setFactures([]);
        
        console.log("Suppression massive réussie");
        
        toast({
          title: "Factures supprimées",
          description: "Toutes les factures ont été supprimées avec succès."
        });
        
        return true;
      } catch (apiError) {
        console.error("Erreur lors de la suppression massive:", apiError);
        toast({
          title: "Erreur de suppression",
          description: "Une erreur est survenue lors de la suppression massive. Certaines factures peuvent ne pas avoir été supprimées.",
          variant: "destructive"
        });
        return false;
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
