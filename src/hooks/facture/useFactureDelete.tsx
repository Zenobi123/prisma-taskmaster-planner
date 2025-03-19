import { useToast } from "@/components/ui/use-toast";
import { Facture } from "@/types/facture";
import { deleteFactureFromDB } from "@/services/factureService";
import { supabase } from "@/integrations/supabase/client";

export const useFactureDelete = (factures: Facture[], setFactures: React.Dispatch<React.SetStateAction<Facture[]>>) => {
  const { toast } = useToast();

  /**
   * Supprime une facture
   * @param factureId ID de la facture à supprimer
   * @param isAdmin Indique si l'utilisateur est administrateur
   * @returns true si la suppression a réussi, false sinon
   */
  const handleDeleteInvoice = async (factureId: string, isAdmin: boolean = false): Promise<boolean> => {
    try {
      // Vérification supplémentaire pour confirmer que la facture existe
      const factureExists = factures.find(f => f.id === factureId);
      if (!factureExists) {
        toast({
          title: "Erreur",
          description: "La facture n'existe pas ou a déjà été supprimée.",
          variant: "destructive"
        });
        return false;
      }

      // Appel à l'API pour supprimer la facture du backend
      const { error } = await deleteFactureFromDB(factureId);
      
      if (error) {
        console.error("Erreur lors de la suppression de la facture:", error);
        toast({
          title: "Erreur de suppression",
          description: "Une erreur est survenue lors de la suppression. La facture n'a pas été supprimée de la base de données.",
          variant: "destructive"
        });
        return false;
      }
      
      // Si la suppression dans la DB est réussie, mettre à jour l'état local
      setFactures(prevFactures => prevFactures.filter(f => f.id !== factureId));
      
      toast({
        title: "Facture supprimée",
        description: `La facture ${factureId} a été supprimée avec succès.`
      });
      
      return true;
    } catch (error) {
      console.error("Exception lors de la suppression:", error);
      toast({
        title: "Erreur critique",
        description: "Une erreur critique est survenue pendant la suppression.",
        variant: "destructive"
      });
      return false;
    }
  };

  /**
   * Supprime toutes les factures non créées par l'utilisateur (admin uniquement)
   * @returns true si la suppression a réussi, false sinon
   */
  const deleteNonUserCreatedInvoices = async (): Promise<boolean> => {
    try {
      // Cette opération supprime toutes les factures (à adapter selon vos besoins)
      const { error } = await supabase.from('factures').delete().not('id', 'is', null);
      
      if (error) {
        console.error("Erreur lors de la suppression massive:", error);
        toast({
          title: "Erreur de suppression",
          description: "Une erreur est survenue lors de la suppression massive. Certaines factures peuvent ne pas avoir été supprimées.",
          variant: "destructive"
        });
        return false;
      }
      
      // Si la suppression dans la DB est réussie, mettre à jour l'état local
      setFactures([]);
      
      toast({
        title: "Factures supprimées",
        description: "Toutes les factures ont été supprimées avec succès."
      });
      
      return true;
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

  return { handleDeleteInvoice, deleteNonUserCreatedInvoices };
};
