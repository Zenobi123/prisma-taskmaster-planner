
import { useToast } from "@/components/ui/use-toast";
import { Facture } from "@/types/facture";
import { deleteFactureFromDB } from "@/services/facture/factureDelete";
import { useState } from "react";

export const useFactureDelete = (factures: Facture[], setFactures: React.Dispatch<React.SetStateAction<Facture[]>>) => {
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);

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

    // Éviter les suppressions simultanées
    if (isDeleting) {
      console.log("Une opération de suppression est déjà en cours");
      return false;
    }

    try {
      // Indiquer que la suppression est en cours
      setIsDeleting(true);
      console.log(`Suppression de la facture ${factureId} en cours...`);
      
      // Tentative de suppression en base de données
      await deleteFactureFromDB(factureId);
      
      // Mise à jour de l'état local immédiatement après la suppression réussie
      setFactures(prevFactures => prevFactures.filter(f => f.id !== factureId));
      
      // Notification de succès
      toast({
        title: "Facture supprimée",
        description: `La facture a été supprimée avec succès.`
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
    } finally {
      // Toujours réinitialiser l'état de suppression
      setIsDeleting(false);
    }
  };

  return { handleDeleteInvoice, isDeleting };
};
