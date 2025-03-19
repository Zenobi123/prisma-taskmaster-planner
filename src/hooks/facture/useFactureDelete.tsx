
import { useToast } from "@/components/ui/use-toast";
import { Facture } from "@/types/facture";
import { deleteFactureFromDB } from "@/services/factureService";

export const useFactureDelete = (factures: Facture[], setFactures: React.Dispatch<React.SetStateAction<Facture[]>>) => {
  const { toast } = useToast();

  const handleDeleteInvoice = async (factureId: string, isAdmin: boolean = false) => {
    try {
      // Si l'utilisateur est admin, il peut supprimer n'importe quelle facture
      if (!isAdmin) {
        // Seul l'admin peut supprimer les factures déjà envoyées ou payées
        const factureToDelete = factures.find(f => f.id === factureId);
        if (factureToDelete && factureToDelete.status !== 'en_attente') {
          toast({
            title: "Accès refusé",
            description: "Seul l'administrateur peut supprimer les factures déjà envoyées ou payées.",
            variant: "destructive"
          });
          return false;
        }
      }
      
      await deleteFactureFromDB(factureId);
      
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

  return { handleDeleteInvoice };
};
