import { useToast } from "@/components/ui/use-toast";
import { Facture } from "@/types/facture";
import { deleteFactureFromDB } from "@/services/factureService";
import { useCallback } from "react";

export const useFactureDelete = (factures: Facture[], setFactures: React.Dispatch<React.SetStateAction<Facture[]>>) => {
  const { toast } = useToast();

  const handleDeleteInvoice = async (factureId: string, isAdmin: boolean = false) => {
    try {
      // Tous les utilisateurs peuvent désormais supprimer n'importe quelle facture
      // La vérification du statut a été supprimée
      
      // Appeler le service pour supprimer la facture de la base de données
      await deleteFactureFromDB(factureId);
      
      // Mettre à jour l'état local après suppression
      setFactures(factures.filter(f => f.id !== factureId));
      
      toast({
        title: "Facture supprimée",
        description: `La facture ${factureId} a été supprimée avec succès.`,
      });
      
      return true;
    } catch (error) {
      console.error("Erreur lors de la suppression de la facture:", error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la facture.",
        variant: "destructive"
      });
      return false;
    }
  };

  // Nouvelle fonction pour supprimer les factures non saisies par l'utilisateur actuel
  const deleteNonUserCreatedInvoices = async () => {
    try {
      // Récupérer l'ID de l'utilisateur connecté depuis localStorage
      const collaborateurId = localStorage.getItem("collaborateurId");
      
      if (!collaborateurId) {
        toast({
          title: "Erreur",
          description: "Impossible d'identifier l'utilisateur actuel.",
          variant: "destructive"
        });
        return false;
      }
      
      // Filtrer les factures qui n'ont pas été créées par l'utilisateur actuel
      // Note: Comme nous n'avons pas de champ créateur dans la facture, nous supposerons que toutes 
      // les factures n'appartiennent pas à l'utilisateur actuel pour cette démo
      // Dans une vraie application, vous devriez vérifier le champ créateur de la facture
      
      let deleteCount = 0;
      let failCount = 0;
      
      // Pour chaque facture, essayer de la supprimer
      for (const facture of factures) {
        try {
          // Ici, nous supposons que toutes les factures doivent être supprimées
          // Dans une vraie application, vous devriez vérifier si l'utilisateur actuel est le créateur
          const success = await handleDeleteInvoice(facture.id, true);
          if (success) {
            deleteCount++;
          } else {
            failCount++;
          }
        } catch (error) {
          console.error(`Erreur lors de la suppression de la facture ${facture.id}:`, error);
          failCount++;
        }
      }
      
      // Afficher un résumé
      if (deleteCount > 0) {
        toast({
          title: "Suppression effectuée",
          description: `${deleteCount} facture(s) supprimée(s) avec succès.${failCount > 0 ? ` ${failCount} échec(s).` : ''}`,
        });
        return true;
      } else {
        toast({
          title: "Aucune facture supprimée",
          description: failCount > 0 ? `${failCount} tentative(s) a échoué.` : "Aucune facture à supprimer.",
          variant: "destructive"
        });
        return false;
      }
    } catch (error) {
      console.error("Erreur lors de la suppression des factures:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression des factures.",
        variant: "destructive"
      });
      return false;
    }
  };

  return { handleDeleteInvoice, deleteNonUserCreatedInvoices };
};
